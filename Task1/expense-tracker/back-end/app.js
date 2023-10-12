const express = require('express');
const app = express();

const bodyParser = require('body-parser');
const cors = require('cors');

require('dotenv').config();

const sequelize = require('./util/database');

const User = require('./models/user');
const Expense = require('./models/expense');
const Order = require('./models/order');
const ForgotPasswordRequest = require('./models/password');
const DownloadedFile = require('./models/files');

const userRoute = require('./routes/user');
const expenseRoute = require('./routes/expense');
const premiumRoute = require('./routes/premium');
const passwordRoute = require('./routes/password');

app.use(cors());
app.use(bodyParser.json());

app.use('/user', userRoute);
app.use('/expense', expenseRoute);
app.use('/premium', premiumRoute);
app.use('/password', passwordRoute);

Expense.belongsTo(User, {constraints: true, onDelete: 'CASCADE'});
User.hasMany(Expense);

Order.belongsTo(User, {constraints: true, onDelete: 'CASCADE'});
User.hasMany(Order);

ForgotPasswordRequest.belongsTo(User, {constraints: true, onDelete: 'CASCADE'});
User.hasMany(ForgotPasswordRequest);

DownloadedFile.belongsTo(User, { constraints: true, onDelete: 'CASCADE'});
User.hasMany(DownloadedFile);

sequelize.sync()
// sequelize.sync({force: true})
.then(_ => {app.listen(3000);
})
.catch(err => console.log({Error: err}));