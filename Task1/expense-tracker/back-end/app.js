const express = require('express');

const app = express();

const sequelize = require('./util/database');
const bodyParser = require('body-parser');
const cors = require('cors');

const User = require('./models/user');

const controller = require('./controllers/user');

app.use(cors());
app.use(bodyParser.json({extended: false}));

app.post('/user/signup', controller.addUser);
app.post('/user/login', controller.getUser);

sequelize.sync()
// sequelize.sync({force: true})
.then(_ => app.listen(3000))
.catch(err => console.log({Error: err}));