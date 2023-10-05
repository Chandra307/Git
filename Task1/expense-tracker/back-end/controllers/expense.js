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