const Expense = require('../models/expense');
const User = require('../models/user');

const sequelize = require('../util/database');

const { config } = require('dotenv');
config();

function isInputInvalid(value) {
    if (!value) {
        return true;
    } else {
        return false;
    }
}

exports.addExpense = async (req, res, next) => {
    const t = await sequelize.transaction();
    try {
        const { amount, description, category } = req.body;

        if (isInputInvalid(amount) || isInputInvalid(description) || isInputInvalid(category)) {
            return res.status(400).json('Please fill all input fields!');
        }

        const total = Number(req.user.totalExpenses) + Number(amount);

        const expense = await req.user.createExpense({ amount, description, category }, { transaction: t });
        const update = await req.user.update({ totalExpenses: total }, { transaction: t });
        console.log(update, 'wth');
        await t.commit();
        res.json(expense);
    }
    catch (err) {
        console.log(err, 'transaction');
        await t.rollback();
        res.status(400).json(err);
    }
}

exports.getExpenses = async (req, res, next) => {
    try {

        const expenses = await req.user.getExpenses();
        console.log('check for premiumUser', req.user.isPremiumUser, req.user.isPremiumUser === true);
        res.json({ expenses, premium: req.user.isPremiumUser });
    }
    catch (err) {
        res.status(404).json(err);
    }
}

exports.deleteExpense = async (req, res, next) => {
    const t = await sequelize.transaction();
    try {
        const expenseId = req.params.id;
        
        if (isInputInvalid(expenseId)) {
            return res.status(400).json('Something went wrong!');
        }
        
        // await Expense.destroy({where: {id: expenseId}});
        const expenses = await req.user.getExpenses({ where: { id: expenseId } });
        if (expenses.length) {
            await expenses[0].destroy({transaction: t});
            const updatedTotal = Number(req.user.totalExpenses) - Number(expenses[0].amount);
            await req.user.update({ totalExpenses: updatedTotal }, { transaction: t });
            await t.commit();
            return res.json('expense deleted');
        }

        res.status(404).json(`You can only delete your expenses!`);

    }
    catch (err) {
        console.log(err);
        await t.rollback();
        res.status(404).json(err);
    }
}

exports.showLeaderboard = async (req, res, next) => {
    try {
        // process.env.Karna = 'donor';
        console.log(process.env.JWT_KEY_SECRET, 'environment variables');
        const users = await User.findAll({

            attributes: ['name', 'totalExpenses'],
            order: [['totalExpenses', 'DESC']]
        })
        res.json(users);
    }
    catch (err) {
        console.log(err);
        res.json('think again');
    }
}
