const express = require('express');

const app = express();
const path = require('path');

const sequelize = require('./util/database');
const bodyParser = require('body-parser');
const cors = require('cors');

const User = require('./models/user');
const Expense = require('./models/expense');
const Order = require('./models/order');
const ForgotPasswordRequest = require('./models/password');

const userController = require('./controllers/user');
const expenseController = require('./controllers/expense');
const access = require('./middleware/authorize');
const orderController = require('./controllers/order');

const passwordRoute = require('./routes/password');
const { forgot } = require('./controllers/password');

app.use(cors());
app.use(bodyParser.json({extended: false}));

app.post('/user/signup', userController.addUser);
app.post('/user/login', userController.getUser);

app.post('/expense/addexpense', access.authenticate, expenseController.addExpense);
app.get('/expense/getexpenses', access.authenticate, expenseController.getExpenses);
app.delete('/expense/delete-expense/:id', access.authenticate, expenseController.deleteExpense);

app.get('/premium/purchase', access.authenticate, orderController.purchase);
app.post('/premium/updateStatus', access.authenticate, orderController.update);
app.get('/premium/leaderboard', expenseController.showLeaderboard);

app.use('/password', passwordRoute);

Expense.belongsTo(User, {constraints: true, onDelete: 'CASCADE'});
User.hasMany(Expense);

Order.belongsTo(User, {constraints: true, onDelete: 'CASCADE'});
User.hasMany(Order);

ForgotPasswordRequest.belongsTo(User, {constraints: true, onDelete: 'CASCADE'});
User.hasMany(ForgotPasswordRequest);

sequelize.sync()
// sequelize.sync({jforce: true})
.then(_ => {app.listen(3000);
})
.catch(err => console.log({Error: err}));