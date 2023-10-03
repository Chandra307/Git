const Expense = require('../models/expense');

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
        
        if(isInputInvalid(amount) || isInputInvalid(description) || isInputInvalid(category)){
            return res.status(400).json('Please fill all input fields!');
        }
        const expense = await Expense.create({amount, description, category});
        res.json(expense);
    }
    catch(err){
        res.status(400).json(err);
    }
}

exports.getExpenses = async (req, res, next) => {
    try{
        const expenses = await Expense.findAll();
        res.json(expenses);
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

        await Expense.destroy({where: {id: expenseId}});
        res.json('expense deleted');
    }
    catch(err){
        res.status(404).json(err);
    }
}