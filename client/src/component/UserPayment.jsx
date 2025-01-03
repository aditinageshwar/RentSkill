import React, { useState, useEffect } from 'react';
import axiosInstance from "../Axios.js";

const UserPayment = ({amount, onPaymentSuccess, seekerEmail, seekerPhone, seekerName}) => {
    const [razorpayKey, setRazorpayKey] = useState(null);

    useEffect(() => {
        const fetchRazorpayKey = async () => {
            const response = await axiosInstance.get('/api/getRazorpayKey');
            setRazorpayKey(response.data.key);
        };
        fetchRazorpayKey();
    }, []);

    useEffect(() => {
        if (razorpayKey && amount) 
          initiatePayment();  
    }, [razorpayKey, amount]);

    const initiatePayment = async () => {
        const paymentData = { amount: amount };
        try {
            const response = await axiosInstance.post('/api/paymentInitiate', paymentData);
            const orderId = response.data.orderId;

            const options = {
                key: razorpayKey,
                amount: amount * 100,
                currency: 'INR',
                name: 'SkillHub',
                image: "/logo.png",
                description: 'Payment for RentSkill',
                order_id: orderId,

                handler: async function (response) {
                    const paymentData = {
                        orderId: orderId,
                        paymentId: response.razorpay_payment_id,
                        signature: response.razorpay_signature,
                    };
                    const verifyResponse = await axiosInstance.post('/api/paymentVerify', paymentData);
                    alert('Payment Verified: ' + verifyResponse.data.message);
                    if(onPaymentSuccess) onPaymentSuccess();  
                },

                prefill: {                                                          //seeker information (autofill with details of who are paying)
                    name: seekerName,              
                    email: seekerEmail,
                    contact: seekerPhone,
                },
                theme: {
                    color: '#9FC2DF',  
                },
                method: 
                {
                  card: true,
                  netbanking: true,
                  upi: true,
                  wallet: false,
                }
            };
            const razorpayInstance = new Razorpay(options);
            razorpayInstance.open();
        } 
        catch (error) {
            console.error('Error initiating payment:', error);
        }
    };
    return (
      <></>
    );
};

export default UserPayment;
