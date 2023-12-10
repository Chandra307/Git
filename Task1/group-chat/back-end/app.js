const { Server } = require('socket.io');
const { instrument } = require('@socket.io/admin-ui');
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();
const path = require('path');
let xport;
const User = require('./models/user');
const Chat = require('./models/chats');
const Group = require('./models/group');
const Participant = require('./models/participants');

const sequelize = require('./util/database');
const userRoutes = require('./routes/user');
const groupRoutes = require('./routes/group');

const app = express();
const server = require('http').createServer(app);

app.use(cors({
    origin: '*',
    methods: ["GET", "PUT", "POST", "DELETE"],
    credentials: true,
}));
app.use(express.json());

app.use('/user', userRoutes);
app.use('/group', groupRoutes);
app.use('/', (req, res, next) => {
    console.log(req.url);
    res.sendFile(path.join(__dirname, `public/${req.url}`));
})

User.belongsToMany(Group, { through: Participant });
Group.belongsToMany(User, { through: Participant });

Chat.belongsTo(Group);
Group.hasMany(Chat);

const io = new Server(server);
io.on('connection', socket => {
    socket.on('join-group', group => {
        // console.log(group, 'the user joins this group');
        socket.join(group);
    });
    socket.on('new-msg', (content) => {
        // console.log(content, content.groupId, 'these msgs were newer');
        socket.to(content.groupId).emit('sent-msgs', content);
    })
    socket.on('add-member', (user, group, groupId) => {
        // console.log(user, group, groupId);
        socket.to(user).emit('member-added', group, groupId);
    })
})

sequelize.sync()
    // sequelize.sync({ force: true })
    .then(_ => {
        server.listen(5000);
    })
    .catch(err => console.log(err, 'in sync'));
