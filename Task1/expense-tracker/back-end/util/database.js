const Sequelize = require('sequelize');

const sequelize = new Sequelize('expense_tracker', 'root', 'Rav!1999', {
    dialect: 'mysql',
    host: 'localhost'
})

module.exports = sequelize;