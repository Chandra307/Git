const { mongoose, Schema } = require('mongoose');

const userSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    cart: {
        items: [
            {
                productId: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
                quantity: { type: Number, required: true }
            }
        ]
    }
});
userSchema.methods.addToCart = function(product) {
    const cartProductIndex = this.cart.items.findIndex(cp => {
        return cp.productId.toString() === product._id.toString();
    });
    let newQuantity = 1;
    const updatedCartItems = [...this.cart.items];
    if (cartProductIndex > -1) {
        newQuantity = this.cart.items[cartProductIndex].quantity + 1;
        updatedCartItems[cartProductIndex].quantity = newQuantity;
    }
    else {
        updatedCartItems.push({
            productId: product._id,
            quantity: newQuantity
        })
    }
    const updatedCart = { items: updatedCartItems };
    this.cart = updatedCart;
    return this.save();
};
// class User {
//     constructor(name, email, cart, id) {
//         this.name = name;
//         this.email = email;
//         this.cart = cart;
//         this._id = id;
//     }
//     save() {
//         return getDB().collection('users').insertOne(this);
//     }

//     addToCart(product) {
//         const cartProductIndex = this.cart.items.findIndex(cp => {
//             return cp.productId.toString() === product._id.toString();
//         });
//         let newQuantity = 1;
//         const updatedCartItems = [...this.cart.items];
//         if (cartProductIndex > -1) {
//             newQuantity = this.cart.items[cartProductIndex].quantity + 1;
//             updatedCartItems[cartProductIndex].quantity = newQuantity;
//         }
//         else {
//             updatedCartItems.push({
//                 productId: new ObjectId(product._id),
//                 quantity: newQuantity
//             })
//         }
//         const updatedCart = { items: updatedCartItems };
//         return getDB().collection('users')
//             .updateOne({ _id: new ObjectId(this._id) }, { $set: { cart: updatedCart } });
//     }

//     getCart() {
//         const productIds = this.cart.items.map(product => product.productId);
//         const db = getDB();
//         return db.collection('products')
//             .find({ _id: { $in: productIds } })
//             .toArray()
//             .then(products => {
//                 return products.map(p => {
//                     return {
//                         ...p,
//                         quantity: this.cart.items.find(i => {
//                             return i.productId.toString() === p._id.toString();
//                         }).quantity
//                     }
//                 })
//             })
//             .catch(err => console.log(err));
//     }

    userSchema.methods.deleteCartItem = function(prodId) {         
        const updatedCartItems = this.cart.items.filter(i => {
            return i.productId.toString() !== prodId.toString();
        });
        this.cart.items = updatedCartItems;
        return this.save();
    }

    userSchema.methods.clearCart = function() {
        this.cart.items = [];
        return this.save();
    }
//     addOrder() {
//         const db = getDB();
//         return this.getCart()
//             .then((products) => {
//                 const order = {
//                     items: products,
//                     user: {
//                         _id: new ObjectId(this._id),
//                         name: this.name
//                     }
//                 };
//                 return db.collection('orders').insertOne(order)
//             })
//             .then(() => {
//                 this.cart.items = [];
//                 return db.collection('users')
//                     .updateOne(
//                         { _id: new ObjectId(this._id) },
//                         { $set: { cart: { items: [] } } }
//                     )
//             })
//             .catch(err => console.log(err));
//     }

//     getOrders() {
//         const db = getDB();
//         return db.collection('orders')
//         .find({ 'user._id': new ObjectId(this._id) })
//         .toArray();
//     }

//     static findById(userId) {
//         return getDB().collection('users')
//             .find({ _id: new ObjectId(userId) })
//             .next();
//         // .then(user => {
//         //   console.log(user);
//         //   return user;   
//         // })
//         // .catch(err => console.log(err));
//     }
// }
// // const Sequelize = require('sequelize');

// // const sequelize = require('../util/database');

// // const User = sequelize.define('user', {
// //   id: {
// //     type: Sequelize.INTEGER,
// //     autoIncrement: true,
// //     allowNull: false,
// //     primaryKey: true
// //   },
// //   name: Sequelize.STRING,
// //   email: Sequelize.STRING
// // });

module.exports = mongoose.model('User', userSchema);
