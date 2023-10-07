const Expense = require('../models/expense');
const User = require('../models/user');
const sequelize = require('../util/database');

function isInputInvalid(value){
    if(!value){
        return true;
    }else {
        return false;
    }
}

exports.addExpense = async (req, res, next) => {
    try{
        const {amount, description, category} = req.body;
        console.log(amount, description, category, 'line 14')
        if(isInputInvalid(amount) || isInputInvalid(description) || isInputInvalid(category)){
            return res.status(400).json('Please fill all input fields!');
        }
        // const expense = await Expense.create({amount, description, category});
        console.log(req.user,'user');
        const expense = await req.user.createExpense({amount, description, category});
        res.json(expense);
    }
    catch(err){
        res.status(400).json(err);
    }
}

exports.getExpenses = async (req, res, next) => {
    try{
        // const expenses = await Expense.findAll();
        const expenses = await req.user.getExpenses();
        console.log('check for premiumUser', req.user.isPremiumUser, req.user.isPremiumUser===true);
        res.json({expenses, premium: req.user.isPremiumUser});
    }
    catch(err){
        res.status(404).json(err);
    }
}

exports.deleteExpense = async (req, res, next) => {
    try{
        const expenseId = req.params.id;
        
        if(isInputInvalid(expenseId)){
            return res.status(400).json('Something went wrong!');
        }

        // await Expense.destroy({where: {id: expenseId}});
        const expense = await req.user.getExpenses({where: {id: expenseId}});
        if(expense.length){
            await expense[0].destroy();
            return res.json('expense deleted');
        }
        
            res.status(404).json(`You can only delete your expenses!`);
        
    }
    catch(err){
        console.log(err);
        res.status(404).json(err);
    }
}

exports.showLeaderboard = async (req, res, next) => {
    try{
        // const [expenses, users] = await Promise.all( [ Expense.findAll({ attributes: ['userId', [sequelize.fn('sum', sequelize.col('amount')), 'totalExpenses']], group: ['userId']}), User.findAll({attributes: ['id', 'name']}) ] );
        const users = await User.findAll({
            attributes: ['id', 'name', [sequelize.fn('sum', sequelize.col('expenses.amount')), 'totalExpenses']],
            include: [
                {
                    model: Expense,
                    attributes: []
                }
            ],
            group: ['user.id'],
            order: [['totalExpenses','DESC']]
        })
        // const object = {};
        // const arr = [];

        // expenses.forEach(expense => {

        //     if(object[expense.userId]){
        //         object[expense.userId] +=  (expense.amount);
        //     }
        //     else {
        //         object[expense.userId] = (expense.amount);
        //     }
        // });
        // console.log(users, 'new learnings');
        res.json(users);
        // users.forEach(user => {

        //     if(object[user.id]){
        //         arr.push( {user: user.name, totalExpenses: object[user.id]});
        //     }
        //     else {
        //         arr.push( {user: user.name, totalExpenses: 0});
        //     }
        // })
        // console.log(arr, 'this is new too');
        // console.log(arr.sort((a,b) => b.totalExpenses - a.totalExpenses), 'sorted');
        // res.json(arr.sort((a,b) => b.totalExpenses - a.totalExpenses));
        // const users = await User.findAll();
        // const promises = users.map(async user => {
        //     try{                
        //         const userExpenses = await user.getExpenses();
        //         let totalExpenses = 0;
        //         userExpenses.forEach(e => totalExpenses += Number(e.amount));
        //         return {user: user.name, totalExpenses};
        //     }
        //     catch(err){
        //         throw new Error(err);
        //     }
        // })
        // const data = await Promise.all(promises);
        // console.log(data.sort(comparator), 'this is what we need');
        // res.json(data.sort(comparator));
    }
    catch(err){
        console.log(err);
        res.json('think again');
    }
}
