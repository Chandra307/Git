const { ObjectId } = require('mongodb');
const { getDB } = require('../util/database');

class User {
  constructor(name, email, cart, id) {
    this.name = name;
    this.email = email;
    this.cart = cart;
    this._id = id;
  }
  save() {
    return getDB().collection('users').insertOne(this);
  }

  addToCart(product) {
    const updatedCartItems = [...this.cart.items];
    const cartProductIndex = this.cart.items.findIndex(cp => {
        return cp.productId.toString() === product._id.toString();
    });
    let newQuantity = 1;
    if (cartProductIndex > -1) {
        newQuantity = this.cart.items[cartProductIndex].quantity + 1;
        updatedCartItems[cartProductIndex].quantity = newQuantity;
    }
    else {
        updatedCartItems.push({ productId: new ObjectId(product._id), quantity: newQuantity })
    }
    const updatedCart = { items: updatedCartItems };
    return getDB().collection('users')
    .updateOne({ _id: new ObjectId(this._id) }, { $set: { cart: updatedCart }});
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
