const User = require('../models/user');
const Participant = require('../models/participants');
const Group = require('../models/group');
const Chat = require('../models/chats');

exports.knowParticipants = async (req, res, next) => {
    try {
        console.log(req.body);
        const { name, participants } = req.body;
        const promises = participants.map(part => User.findOne({ where: { name: part } }));
        // console.log(promises,'array');
        const users = await Promise.all(promises);
        console.log(users,'another one');
        const group = await Group.create({ name });
        const promises2 =  users.map(user => user.addGroup(group, { through: { name: user.name, group: group.name } }));
        promises2.push(group.addUser(req.user, { through: { name: req.user.name, group: group.name } }));
        const details = await Promise.all(promises2);
        res.status(201).json({ "message": 'Group successfully created', details });
    }
    catch (err) {
        console.log(err, 'in adding participants');
        res.status(500).json({ "message": "Something went wrong!", "Error": err });
    }
}

exports.getChats = async (req, res, next) => {
    try {
        console.log(req.query.id);
        const group = await Group.findOne({ where: { id: req.query.id } } );
        const chats = await group.getChats();
        res.status(200).json({ "message": 'Chats fetched', chats });
    }
    catch (err) {
        res.status(500).json({ "message": "Something went wrong!", "Error": err });
    }
}

exports.sendMsg = async (req, res, next) => {
    try {
        const { id } = req.query;
        const { message } = req.body;
        const group = await Group.findByPk(id);
        console.log(message, 'group found');
        const result = await group.createChat({ message, sender: req.user.name });
        res.status(201).json({ "message": "Message sent successfully", result });
    }
    catch (err) {
        res.status(500).json({ "message": "Something went wrong!", "Error": err });
    }
}