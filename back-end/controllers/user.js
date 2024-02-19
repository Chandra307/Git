const User = require('../models/user');

const bcrypt = require('bcryptjs');

const jwt = require('jsonwebtoken');

const Expense = require('../models/expense');
const FileUrl = require('../models/fileUrl');

function generateJWT(id, name) {
    return jwt.sign({ userId: id, name: name }, process.env.JWT_KEY_SECRET);
}

function isInputInvalid(value) {
    if (!value) {
        return true;
    } else {
        return false;
    }
}

exports.addUser = async (req, res, next) => {
    try {
        let { name, email, phone, password } = req.body;

        if (isInputInvalid(name) || isInputInvalid(email) || isInputInvalid(phone) || isInputInvalid(password)) {
            return res.status(400).json('Error: Make sure you fill all input fields!');
        }

        const saltrounds = 10;
        bcrypt.hash(password, saltrounds, async (err, hash) => {
            try {
                if (err) {
                    console.log(err, 'line 31 - userCtrl');
                }
                password = hash;
                const user = await new User({
                    name,
                    email,
                    phone,
                    password,
                    isPremiumUser: false,
                    totalExpenses: 0
                }).save();
                res.status(201).json(user);
            }
            catch (err) {
                console.log(err.code, 'line 41 - userCtrl');
                if (err['code'] === 11000) {
                    return res.status(403).json('A user with this emailId already exists.');
                }
                res.status(500).json(err);
            }
        })
    }
    catch (err) {
        res.status(500).json(err);
    }
}

exports.getUser = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        if (isInputInvalid(email) || isInputInvalid(password)) {
            return res.status(400).json('Please make sure you fill all the input fields!');
        }
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json(`User doesn't exist!`);
        }

        bcrypt.compare(password, user.password, (err, result) => {
            if (err) {
                console.log(err);
            }
            if (result) {
                return res.json({ success: true, message: 'User logged in succesfully!', token: generateJWT(user._id, user.name) });
            }
            else {
                res.status(401).json(`Incorrect password!`);
            }
        })
    }
    catch (err) {
        res.status(500).json(err);
    }
}

exports.showLeaderboard = async (req, res, next) => {
    try {
        const users = await User
            .find()
            .select(['name', 'totalExpenses'])
            .sort('-totalExpenses');

        res.json(users);
    }
    catch (err) {
        console.log(err);
        res.status(500).json('think again');
    }
}

exports.getDownloads = async (req, res, next) => {
    try {
        const files = await FileUrl.find({ user: req.user._id });
        res.json({ files, premium: req.user.isPremiumUser });
    }
    catch (err) {
        res.status(500).json(err);
    }
}

exports.getDailyReport = async (req, res, next) => {
    try {
        let { date } = req.query;
        if (isInputInvalid(date)) {
            return res.status(400).json('Please select a date!');
        }

        const expenses = await Expense
            .find({ date, userId: req.user._id })
            .select(['amount', 'description', 'category']);
        res.json({ expenses });
    }
    catch (err) {
        console.log(err);
        res.status(500).json(err);
    }
}

exports.getMonthlyReport = async (req, res, next) => {
    try {

        let { month } = req.query;
        if (isInputInvalid(month)) {
            return res.status(400).json('Please select a month!');
        }
        const start = new Date(month);
        const end = new Date(month);
        end.setMonth(start.getMonth() + 1);

        const expenses = await Expense
            .find({ userId: req.user._id, date: { $gte: start, $lt: end } })
            .sort('date');

        res.json({ expenses });
    }
    catch (err) {
        console.log(err, 'line 151 - userCtrl');
        res.status(500).json(err);
    }
}

exports.getWeeklyReport = async (req, res, next) => {
    try {
        let { start, end } = req.query;
        if (isInputInvalid(start) || isInputInvalid(end)) {
            return res.status(400).json('Please select date range!!');
        }

        start = new Date(start);
        end = new Date(end);
        const expenses = await Expense
            .find({ date: { $gte: start, $lte: end }, userId: req.user._id })
            .sort([['date', 'asc']]);
        res.json({ expenses });
    }
    catch (err) {
        console.log(err, 'weekly');
        res.status(500).json(err);
    }
}

exports.getAnnualReport = async (req, res, next) => {
    try {
        const { year } = req.query;
        const start = new Date(year);
        const end = new Date(year);
        end.setFullYear(start.getFullYear() + 1);

        const expenses = await Expense
            .aggregate()
            .match({ date: { $gte: start, $lt: end }, userId: req.user._id })
            .group({ _id: { $month: '$date' }, amount: { $sum: '$amount' } })
            .sort('_id');
        res.json({ expenses });
    }
    catch (err) {
        console.log(err, 'while filming');
        res.status(500).json(err);
    }
}