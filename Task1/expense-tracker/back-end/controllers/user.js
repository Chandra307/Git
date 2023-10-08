const User = require('../models/user');

const bcrypt = require('bcryptjs');

const jwt = require('jsonwebtoken');

function generateJWT(id,name){
    return jwt.sign({userId: id, name: name}, process.env.JWT_KEY_SECRET);
}

function isInputInvalid(value){
    if(!value){
        return true;
    }else {
        return false;
    }
}

exports.addUser = async (req, res, next) => {
    try{
        let {name, email, phone, password} = req.body;

        if(isInputInvalid(name) || isInputInvalid(email) || isInputInvalid(phone) || isInputInvalid(password)){
            return res.status(400).json('Error: Make sure you fill all input fields!');
        }

        const saltrounds = 10;
        bcrypt.hash(password, saltrounds, async (err, hash) => {
            try{
                console.log(err);
                password = hash;        
                const outcome = await User.create( {name, email, phone, password} );          
                res.status(201).json(outcome);
            }
            catch(err){
                console.log(err.name === 'SequelizeUniqueConstraintError');
                if(err.name === 'SequelizeUniqueConstraintError'){
                    console.log('eggjatly');
                    return res.status(403).json('Error: emailId already exists!');
                }
                res.status(500).json(err);
            }
        })
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

        bcrypt.compare(password, user.password, (err, result) => {
            if(err){
                throw new Error(err);
            }
            if(result){
                console.log('result = ', result);
                return res.json({success: true, message: 'User logged in succesfully!', token: generateJWT(user.id, user.name)});
            }
            else {
                console.log(result, password, user.password, 'boolean');
                res.status(401).json(`Incorrect password!`);
            }
        })
    }
    catch(err){
        res.status(500).json(err);
    }
}