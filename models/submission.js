const Sequelize = require('sequelize');
const sequelize = require('../util/database');

const Submission = sequelize.define('submission',
{
    token: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    userName: {
        type: Sequelize.STRING,
        allowNull: false
    },
    languagePref: {
        type: Sequelize.STRING,
        allowNull: false
    },
    stdIn: {
        type: Sequelize.STRING,
        allowNull: false
    },  
    sourceCode: {
        type: Sequelize.STRING(100),
        allowNull: false
    },
    stdOut: {
        type: Sequelize.STRING,
        allowNull: false
    }
});

module.exports = Submission;