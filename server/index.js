require('dotenv').config();

const express = require('express');
const app = express();
const path = require('path');

const {connectMongoDB} = require('./connection');                     //establish connection
connectMongoDB(process.env.MONGO_URL);

app.use(express.json());                                              //Middleware - plugins      
app.use(express.urlencoded({ extended: true }));

app.listen(process.env.PORT, () => {
    console.log(`Server is running on port ${process.env.PORT}`);
});