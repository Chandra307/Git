const { ObjectId } = require('mongodb');
const { getDB } = require('../util/database');

class User {
  constructor(name, email) {
    this.name = name;
    this.email = email;
  }
  create() {
    getDB().collection('users')
    .insertOne(this)
    .then(user => {
      console.log(user, 'user created');
      return user;
    })
    .catch(err => console.log(err));
  }
  static findById(userId) {
    return getDB().collection('users')
    .find({ _id: new ObjectId(userId) })
    .next();
    // .then(user => {
    //   console.log(user);
    //   return user;   
    // })
    // .catch(err => console.log(err));
  }
}
// const Sequelize = require('sequelize');

// const sequelize = require('../util/database');

// const User = sequelize.define('user', {
//   id: {
//     type: Sequelize.INTEGER,
//     autoIncrement: true,
//     allowNull: false,
//     primaryKey: true
//   },
//   name: Sequelize.STRING,
//   email: Sequelize.STRING
// });

module.exports = User;
