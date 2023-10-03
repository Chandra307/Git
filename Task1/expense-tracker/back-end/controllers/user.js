const User = require('../models/user');

function isInputInvalid(value){
    if(!value){
        return true;
    }else {
        return false;
    }
}

exports.addUser = async (req, res, next) => {
    try{
        const {name, email, phone, password} = req.body;
        if(isInputInvalid(name) || isInputInvalid(email) || isInputInvalid(phone) || isInputInvalid(password)){
            return res.status(400).json('Error: Make sure you fill all input fields!');
        }
        const outcome = await User.create({
            name,
            email,
            phone,
            password
        });

        res.status(201).json(outcome);
    }
    catch(err){
        res.status(403).json(err);
    }
}

exports.getUser = async (req, res, next) => {
    try{
        const {email, password} = req.body;

        if(isInputInvalid(email) || isInputInvalid(password)){
            return res.status(400).json('Please make sure you fill all the input fields!');
        }
        const user = await User.findOne({where: {email: email}});
        if(!user){
            return res.status(404).json(`User doesn't exist!`);
        }
        if(user && password != user.password){
            return res.status(401).json(`Incorrect password!`);
        }
        res.json({success: true, message: 'User logged in succesfully!'});
    }
    catch(err){
        res.status(404).json(err);
    }
}