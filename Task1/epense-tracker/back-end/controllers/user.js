const User = require('../models/user');

exports.addUser = async (req, res, next) => {
    try{
        const outcome = await User.create({
            name: req.body.name,
            email: req.body.email,
            phone: req.body.phone,
            password: req.body.password
        });

        res.json(outcome);
    }
    catch(err){
        res.status(403).json(err);
    }
}