const Sequelize = require('sequelize');

const sequelize = new Sequelize('expenses', 'root', 'Rav!1999', {
    dialect: 'mysql',
    host: 'localhost'
})

module.exports = sequelize;