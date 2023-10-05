const Razorpay = require('razorpay');
const Order = require('../models/order');
const dotenv = require('dotenv');
const User = require('../models/user');


exports.purchase = async (req, res, next) => {
    try {
        // console.log(process.env,'dotenv',process.env.RAZORPAY_KEY_ID);
        const rzt = new Razorpay({
            key_id: 'rzp_test_R5XhDB0Tu7MY2d',
            key_secret: 'eK0R7Q5IebLmtz3jXi8ZfZy0'
        });

        const amount = 2500;
        rzt.orders.create({ amount, currency: "INR" }, async (err, order) => {
            try {
                if (err) {
                    console.log(err);
                    throw new Error(err);
                }
                else {
                    console.log(order, 'know whats inside - line16 ordercontr');
                    await req.user.createOrder({ orderID: order.id, status: 'PENDING' });
                    res.json({ order, key_id: rzt.key_id });
                }
            } catch (err) {
                res.json(err);
            }
        })
    }

    catch (err) {
        res.status(500).json(err);
    }
}

exports.update = async (req, res, next) => {
    try {
        const { order_id } = req.body;
        console.log(req.body, 'straight from razorpay');
        let status;
        let bool;
        const order = await Order.findOne({ where: { orderID: order_id } });
        if (req.body.payment_id) {
            status = order.update({ paymentID: req.body.payment_id, status: 'SUCCESSFUL' });
            bool = req.user.update({ isPremiumUser: true });
        }
        else if (req.body.status) {
            status = order.update({ paymentID: 'nil', status: 'FAILED' });
            bool = req.user.update({ isPremiumUser: false });
        }
        await Promise.all([status, bool]);
        res.json('just anything');
    }
    catch (err) {
        res.json(err);
    }
}