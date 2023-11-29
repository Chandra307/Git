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

// const io = new Server(server);

// const userServer = io.of('/user');
// userServer.on('connection', (socket) => {
//     console.log('connected to user namespace with username ' + socket.username);
// });
// userServer.use((socket, next) => {
//     if (socket.handshake.auth.token) {
//         socket.username = getUserName(socket.handshake.auth.token);
//         next();
//     } else {
//         socket.username = 'ghanta';
//         next(new Error('Please send a token'));
//         // next();
//     }
// })
// function getUserName(token) {
//     return token;
// }
// instrument(io, { auth: false });

// io.on('connection', socket => {
//     socket.on('ping', n => console.log(n));
//     console.log('the session id is ',socket.id);
//     socket.on('send-message', (string, room, cb) => {
//         console.log('about to send back message ', room + '---', string);
//         // server.emit('roger', string);
//         if (!room) {
//             socket.broadcast.emit('roger', string);
//         }
//         else {
//             socket.to(room).emit('roger', string);
//         }
//         cb();
//     })
//     socket.on('join-room', (room, cb) => {
//         socket.join(room);
//         cb(`Joined ${room}`);
//     });
//     xport = (message) => {
//         console.log('would this work, app.js export');
//         socket.emit('receive-msg', message);
//     }            
//     console.log(xport, 'in io.on');
// });
const io = new Server(server);
io.on('connection', socket => {
    socket.on('join-group', group => {
        console.log(group, 'the user joins this group');
        socket.join(group);
    });
    socket.on('new-msg', (message, group, sender) => {
        console.log(message, group, 'these msgs were newer');
        socket.to(group).emit('sent-msgs', sender, message);
    })
})

sequelize.sync()
    // sequelize.sync({ force: true })
    .then(_ => {
        server.listen(5000);
    })
    .catch(err => console.log(err, 'in sync'));
