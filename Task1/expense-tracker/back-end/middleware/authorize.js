const jwt = require('jsonwebtoken');
const User = require('../models/user');

exports.authenticate = async (req, res, next) => {
    try{
        const payload = jwt.verify(req.headers.authorization, process.env.JWT_KEY_SECRET);
        console.log(payload, 'verified');
        const user = await User.findOne({where: {id: payload.userId}});
        req.user = user;
        next();
    }
    catch(err){
        res.status(500).json(err);
    }
}