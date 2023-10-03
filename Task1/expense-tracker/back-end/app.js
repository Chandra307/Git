const express = require('express');

const app = express();

const sequelize = require('./util/database');
const bodyParser = require('body-parser');
const cors = require('cors');

// const User = require('./models/user');

const userController = require('./controllers/user');
const expenseController = require('./controllers/expense');

app.use(cors());
app.use(bodyParser.json({extended: false}));

app.post('/user/signup', userController.addUser);
app.post('/user/login', userController.getUser);

app.post('/expense/addexpense', expenseController.addExpense);
app.get('/expense/getexpenses', expenseController.getExpenses);
app.delete('/expense/delete-expense/:id', expenseController.deleteExpense);

sequelize.sync()
// sequelize.sync({force: true})
.then(_ => app.listen(3000))
.catch(err => console.log({Error: err}));