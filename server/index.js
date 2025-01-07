const mongoose = require("mongoose");
const express = require('express');
const app = express();
require('dotenv').config();
const PORT=process.env.PORT || 4000;

const path = require('path');
const bodyParser = require("body-parser");

app.use(express.json());                                     
app.use("/uploads", express.static("uploads"));

app.use(express.urlencoded({ extended: true }));

const userRoutes = require("./routes/User");
app.use('/api/v1',userRoutes);

const dbConnect=require('./connection');
dbConnect();

app.get('/',(req,res)=>{
    res.send("RentSkills");
})

app.listen(process.env.PORT, () => {
    console.log(`Server is running on port ${process.env.PORT}`);
});