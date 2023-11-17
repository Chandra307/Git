const User = require('../models/user');
const bcrypt = require('bcryptjs');

function isInputInvalid(string) {
    if (!string) {
        return true;
    }
    else {
        return false;
    }
}
exports.postUser = async (req, res, next) => {
    try {
        let { name, email, phone, password } = req.body;
        if (isInputInvalid(name) || isInputInvalid(phone) || isInputInvalid(email) || isInputInvalid(password)) {
            return res.status(400).json('Please fill all the input fields!');
        }
        else {
            bcrypt.hash(password, 10, async (err, hash) => {
                try {
                    if (err) {
                        console.log(err, 'while hashing');
                    }
                    password = hash;
                    console.log(password);
                    const newUser = await User.create({
                        name,
                        phone,
                        email,
                        password
                    });
                    res.status(201).json({ message: 'User creation  successfull', user: newUser });
                }
                catch (err) {
                    // console.log(err, '500: server error');
                    res.status(500).json({ message: 'A user with this e-mail already exists!', Error: err });
                }
            })
        }
    }
    catch (err) {
        console.log(err, 'in postUser');
        res.status(400).json(err);
    }
}