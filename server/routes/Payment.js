require('dotenv').config();
const express = require('express');
const router = express.Router();

const {createHmac} = require('crypto');
const Razorpay = require('razorpay');

const razorpay = new Razorpay({
    key_id : process.env.KEY_ID,
    key_secret : process.env.KEY_SECRET
});

router.get('/getRazorpayKey', (req,res) =>{
    return res.json({ key: process.env.KEY_ID });
});

router.post('/paymentInitiate', async(req,res) => {
    const {amount} = req.body;
    try 
    {
        const options = {
            amount: amount * 100,                              //Amount in paisa
            currency: 'INR',
            receipt: `receipt_${Date.now()}`,
        };
        const order = await razorpay.orders.create(options);
        return res.status(200).json({ orderId: order.id });
    } 
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.post('/paymentVerify', async(req,res) => {
    const {orderId, paymentId, signature} = req.body;
    const digest = createHmac('sha256', process.env.KEY_SECRET).update(orderId + '|' + paymentId).digest('hex');
    if (digest === signature) 
       return res.status(200).json({ message: 'Payment verified successfully' });
    else 
       return res.status(400).json({ message: 'Invalid signature' });
});

module.exports = router;