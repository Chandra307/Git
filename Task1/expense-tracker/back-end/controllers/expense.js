const Expense = require('../models/expense');

const UserServices = require('../services/userservices');

const S3Service = require('../services/S3service');

const sequelize = require('../util/database');

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
        await req.user.update({ totalExpenses: total }, { transaction: t });
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
        let {page, number} = req.query;
        
        currentPage = Number(page);
        number = Number(number);
        const total = await Expense.count({ where: { userId: req.user.id } });
        console.log('know the type', number, typeof(number), currentPage, typeof(total));
        const hasNextPage = (currentPage * number) < total;
        console.log(hasNextPage, '!?', currentPage * number, typeof (currentPage));
        const nextPage = Number(currentPage) + Number(hasNextPage);
        const pageData = {
            currentPage,
            lastPage: Math.ceil(total/number),
            hasNextPage,
            previousPage: currentPage - 1,
            nextPage
        }
        const promise1 = req.user.getExpenses({ offset: (currentPage - 1) * number, limit: number});
        const promise2 = req.user.getDownloadedFiles();
        const [expenses, files] = await Promise.all([promise1, promise2]);
        console.log('check for premiumUser', req.user.isPremiumUser, req.user.isPremiumUser === true);
        // if(currentPage == 1){
            res.json({ expenses, pageData });            
        // }
        // else {
            // res.json(expenses, pageData);
        // }
    }
    catch (err) {
        console.log(err, 'in get expenses');
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

        const expenses = await UserServices.getExpenses(req, { where: { id: expenseId } });
        if (expenses.length) {
            await expenses[0].destroy({ transaction: t });
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

exports.downloadExpense = async (req, res, next) => {
    try {
        const expenses = await UserServices.getExpenses(req);
        const data = JSON.stringify(expenses);
        const fileName = `Expenses/${req.user.id}/${new Date().toString()}.txt`;
        const fileUrl = await S3Service.uploadtoS3(data, fileName);
        console.log(fileUrl, 's3response');
        await UserServices.saveFileUrl(req, fileUrl.Location);
        res.json(fileUrl.Location);
    }
    catch (err) {
        console.log(err,'while upload');
        res.status(500).json(err);
    }
}