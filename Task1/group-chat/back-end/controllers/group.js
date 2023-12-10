const User = require('../models/user');
const Participant = require('../models/participants');
const Group = require('../models/group');
const Chat = require('../models/chats');
const ArchivedChat = require('../models/archivedChats');
const AWS = require('aws-sdk');
const fs = require('fs');
const { Op } = require('sequelize');
const { CronJob } = require('cron');


const uploadToS3 = (data, fileName) => {
    const bucketName = 'trackexpense';

    const S3 = new AWS.S3(
        {
            accessKeyId: process.env.IAM_USER_KEY,
            secretAccessKey: process.env.IAM_USER_SECRET
        }
    )
    var params = {
        Bucket: bucketName,
        Key: fileName,
        Body: data,
        ACL: 'public-read'
    }

    return new Promise((res, rej) => {
        S3.upload(params, (err, S3response) => {
            if (err) {
                rej(err);
            } else {
                res(S3response);
            }
        })
    })
}
const job = CronJob.from(
    {
        cronTime: '0 0 * * *',
        onTick: async function () {
            try {
                let date = new Date();
                let yesterday = new Date();
                yesterday.setDate(date.getDate() - 1);
                let prevChats = await Chat.findAll(
                    {
                        where: { createdAt: { [Op.between]: [yesterday, date] } },                                                
                    });
                prevChats = JSON.stringify(prevChats);
                await ArchivedChat.create(
                    {
                        chatsOf: yesterday.toLocaleDateString(),
                        chats: prevChats
                    }
                )
            } catch (err) {
                console.log(err, 'in cron job');
            }
        },
        onComplete: null,
        start: true,
        timeZone: 'system'
    }
);

exports.knowParticipants = async (req, res, next) => {
    try {
        console.log(req.body);
        const { name, participants } = req.body;
        let connections = [];
        const promises = participants.map(part => User.findOne({ where: { id: part } }));
        // console.log(promises,'array');
        const users = await Promise.all(promises);
        const group = await Group.create({ name, createdBy: req.user.name });
        const promises2 = users.map(user => {
            connections.push(user.connectionID);
            return group.addUser(user, { through: { name: user.name, group: group.name } });
        });
        promises2.push(group.addUser(req.user, { through: { name: req.user.name, group: group.name, isAdmin: true } }));
        const details = await Promise.all(promises2);
        res.status(201).json({ "message": 'Group successfully created', details, connections });
    }
    catch (err) {
        console.log(err, 'in adding participants');
        res.status(500).json({ "message": "Something went wrong!", "Error": err });
    }
}

exports.getChats = async (req, res, next) => {
    try {
        console.log(req.query.id);
        const group = await Group.findOne({ where: { id: req.query.id } });
        const user = await group.getUsers({ where: { id: req.user.id } });
        if (!user.length) {
            return res.status(401).json({ "message": "You aren't a participant of this group to view the messages!" })
        }
        const chats = await group.getChats();
        res.status(200).json({ "message": 'Chats fetched', chats, "group": group.name });
    }
    catch (err) {
        res.status(500).json({ "message": "Something went wrong!", "Error": err });
    }
}

exports.sendMsg = async (req, res, next) => {
    try {
        const { id } = req.query;
        let message = req.body.message;
        let format = 'text';
        // const pendingPromises = [];
        // let file = req.file;

        // const { message, formData } = req.body;
        console.log(req.files, 'file sent from frontend', req.body);
        const group = await Group.findByPk(id);
        console.log(group.name, 'group found');

        if (req.files) {
            console.log(typeof req.files);
            const pendingPromises = req.files.map(file => {

                return new Promise((res, rej) => {

                    fs.readFile(file.path, async (err, data) => {
                        if (err) {
                            console.log(err, 'in reading file');
                            rej(err);
                        }
                        else {
                            try {
                                const S3response = await uploadToS3(data, `Images/${req.user.id}/${file.filename}`);
                                res(group.createChat(
                                    {
                                        message: S3response.Location,
                                        sender: req.user.name,
                                        format: file.mimetype,
                                    }
                                ));
                            }
                            catch (err) {
                                console.log(err, 'in S3response');
                            }
                        }
                    });
                })
            })
            if (message) {
                pendingPromises.push(group.createChat(
                    { message, sender: req.user.name, format }
                ))
            }
            const chats = await Promise.all(pendingPromises);
            res.status(201).json(chats);
        }
    }
    catch (err) {
        console.log('Socket err: ' + err, 'app.js export');
        res.status(500).json({ "message": "Something went wrong!", "Error": err });
    }
}

exports.addParticipants = async (req, res, next) => {
    try {
        const { id } = req.query;
        const group = await Group.findByPk(id);
        const [user] = await group.getUsers({ where: { id: req.user.id } });
        console.log('are you an admin?', user.participant.isAdmin);
        if (!user.participant.isAdmin) {
            return res.status(401).json({ "message": "Only admins can add new participants to the group." });
        }
        const { participants } = req.body;
        const promises = participants.map(part => User.findOne({ where: { name: part } }));
        const users = await Promise.all(promises);
        const promises2 = users.map(user => group.addUser(user, { through: { name: user.name, group: group.name } }));
        const details = await Promise.all(promises2);
        res.status(201).json({ "message": 'Success', details });
    }
    catch (err) {
        res.status(500).json({ "message": "Something went wrong!", "Error": err });
    }
}

exports.addAdmin = async (req, res, next) => {
    try {

        const grpId = req.query.id;
        const group = await Group.findByPk(grpId);
        const [user] = await group.getUsers({ where: { id: req.user.id } });
        console.log('are you an admin?', user.participant.isAdmin, user.isAdmin);
        if (!user.participant.isAdmin) {
            return res.status(401).json({ "message": "You must be an admin to make others admin." });
        }
        const userId = req.params.id;
        const [participant] = await group.getUsers({ where: { id: userId } });
        const updatedParticipant = await group.addUser(participant, { through: { isAdmin: true } });
        res.status(200).json({ "message": 'Success', updatedParticipant });
    }
    catch (err) {
        console.log(err, 'when user update');
        res.status(500).json({ "message": "Something went wrong!", "Error": err });
    }
}

exports.removeParticipant = async (req, res, next) => {
    try {
        const grpId = req.query.id;
        const group = await Group.findByPk(grpId);
        const [user] = await group.getUsers({ where: { id: req.user.id } });
        console.log('are you an admin?', user.isAdmin, user.participant.isAdmin);
        if (!user.participant.isAdmin) {
            return res.status(401).json({ "message": "You're not an admin to remove someone from group." });
        }
        const userId = req.params.id;
        const [reqUser] = await group.getUsers({ where: { id: userId } });
        const result = await reqUser.participant.destroy();
        res.status(200).json({ "message": 'Participant removed from the group', result });
    }
    catch (err) {
        console.log(err, 'find the error');
        res.status(500).json({ "message": "Something went wrong!", "Error": err });
    }
}