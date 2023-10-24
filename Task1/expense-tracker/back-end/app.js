const fs = require('fs');
const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const morgan = require('morgan');

const app = express();
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

Expense.belongsTo(User, { constraints: true, onDelete: 'CASCADE' });
User.hasMany(Expense);

Order.belongsTo(User, { constraints: true, onDelete: 'CASCADE' });
User.hasMany(Order);

DownloadedFile.belongsTo(User, { constraints: true, onDelete: 'CASCADE' });
User.hasMany(DownloadedFile);

ForgotPasswordRequest.belongsTo(User, { constraints: true, onDelete: 'CASCADE' });
User.hasMany(ForgotPasswordRequest);

const accessLogStream = fs.createWriteStream(
    path.join(__dirname, 'access.log'),
    { flags: 'a' }
)

app.use(helmet());
app.use(compression());
app.use(morgan('combined', { stream: accessLogStream }));
app.use(cors());
app.use(bodyParser.json());

app.use('/user', userRoute);
app.use('/expense', expenseRoute);
app.use('/premium', premiumRoute);
app.use('/password', passwordRoute);

app.use((req, res, next) => {
    res.send('<h2>Sorry, Page not found!</h2>')
})

sequelize.sync()
    // sequelize.sync({force: true})
    .then(_ => {
        app.listen(3000);
    })
    .catch(err => console.log({ Error: err }));