const jwt = require('jsonwebtoken');
const User = require('../models/user');

exports.authenticate = async (req, res, next) => {
    try{
        const payload = jwt.verify(req.headers.authorization, process.env.JWT_KEY_SECRET);

        const user = await User.findById(payload.userId);
        req.user = user;
        next();
    }
    catch(err){
        console.log(process.env.JWT_KEY_SECRET,err);
        res.status(401).json({err});
    }
}