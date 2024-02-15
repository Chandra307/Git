const { mongoose, Schema } = require('mongoose');

const orderSchema = new Schema(
  {
    products: [
      {
        product: { type: Object, required: true },
        quantity: { type: Number, required: true }
      }
    ],
    user: {
      userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
      name: { type: String, required: true }
    }
  }
)

// const Sequelize = require('sequelize');

// const sequelize = require('../util/database');

// const Order = sequelize.define('order', {
//   id: {
//     type: Sequelize.INTEGER,
//     autoIncrement: true,
//     allowNull: false,
//     primaryKey: true
//   }
// });

module.exports = mongoose.model('Order', orderSchema);
