const Sequelize = require('sequelize');

const sequelize = require('../util/database');

const DownloadedFile = sequelize.define('downloadedfile', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    fileUrl: Sequelize.STRING
})

module.exports = DownloadedFile;