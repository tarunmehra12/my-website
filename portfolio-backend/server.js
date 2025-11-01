const express = require('express');
const Razorpay = require('razorpay');
const cors = require('cors');
const crypto = require('crypto');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET
});

app.get('/get-razorpay-key', (req, res) => {
    res.json({ key: process.env.RAZORPAY_KEY_ID, success: true });
});

app.post('/create-order', async (req, res) => {
    try {
        const { amount, currency } = req.body;
        const options = { amount: amount * 100, currency: currency, receipt: 'receipt_' + Date.now() };
        const order = await razorpay.orders.create(options);
        console.log('Order created:', order.id);
        res.json({ success: true, order: order, amount: order.amount, currency: order.currency, id: order.id });
    } catch (error) {
        res.status(500).json({ error: error.message, success: false });
    }
});

app.post('/verify-payment', (req, res) => {
    try {
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
        const sign = razorpay_order_id + '|' + razorpay_payment_id;
        const expectedSign = crypto.createHmac('sha256', process.env.RAZORPAY_KEY_SECRET).update(sign.toString()).digest('hex');
        if (razorpay_signature === expectedSign) {
            res.json({ success: true, message: 'Payment verified', payment_id: razorpay_payment_id });
        } else {
            res.status(400).json({ success: false, message: 'Invalid signature' });
        }
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

app.get('/health', (req, res) => {
    res.json({ status: 'OK', message: 'Server running' });
});

app.listen(PORT, () => {
    console.log('Server running on http://localhost:' + PORT);
    console.log('Razorpay Key:', process.env.RAZORPAY_KEY_ID);
});
