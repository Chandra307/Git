const { mongoose, Schema } = require('mongoose');

const productSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    imageUrl: {
        type: String,
        required: true
    }
})

// class Product {
//   constructor(title, price, description, imageUrl, id, userId) {
//     this.title = title;
//     this.price = price;
//     this.description = description;
//     this.imageUrl = imageUrl;
//     this._id = id ? new ObjectId(id) : null;
//     this.userId = userId;
//   }
//   save() {
//     const db = getDB();
//     let dbOp;
//     if (this._id) {
//       dbOp = db
//       .collection('products').updateOne({ _id: this._id }, { $set: this });
//     } else {
//       dbOp = db.collection('products').insertOne(this);
//     }
//     return dbOp
//     .then(result => console.log(result))
//     .catch(err => console.log(err));
//   }
//   static fetchAll() {
//     const db = getDB();
//     return db.collection('products')
//     .find()
//     .toArray()
//     .then(products => {
//       console.log(products);
//       return products;      
//     })
//     .catch(err => console.log(err));
//   }

//   static findById(prodId) {
//     const db = getDB();
//     return db.collection('products')
//     .find({ _id: new ObjectId(prodId) })
//     .next();    
//   }

//   static deleteById(prodId) {
//     const db = getDB();
//     return db.collection('products').deleteOne({ _id: new ObjectId(prodId) })
//     .then(_ => console.log('Deleted'))
//     .catch(err => console.log(err));
//   }
// }

// // const Sequelize = require('sequelize');

// // const sequelize = require('../util/database');

// // const Product = sequelize.define('product', {
// //   id: {
// //     type: Sequelize.INTEGER,
// //     autoIncrement: true,
// //     allowNull: false,
// //     primaryKey: true
// //   },
// //   title: Sequelize.STRING,
// //   price: {
// //     type: Sequelize.DOUBLE,
// //     allowNull: false
// //   },
// //   imageUrl: {
// //     type: Sequelize.STRING,
// //     allowNull: false
// //   },
// //   description: {
// //     type: Sequelize.STRING,
// //     allowNull: false
// //   }
// // });

module.exports = mongoose.model('Product', productSchema);
