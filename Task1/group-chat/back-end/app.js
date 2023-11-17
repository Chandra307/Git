const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();

const sequelize = require('./util/database');
const userRoute = require('./routes/user');

const app = express();
app.use(cors({
    origin: '*',
    methods: ["GET", "PUT", "POST", "DELETE"],
    credentials: true,
}));
app.use(express.json());
app.use(bodyParser.json({ extended: false}));
app.use('/user', userRoute);

sequelize.sync()
// sequelize.sync({ force: true })
.then(_ => app.listen(5000))
.catch(err => console.log(err, 'in sync'));