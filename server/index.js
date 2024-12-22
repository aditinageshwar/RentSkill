require('dotenv').config();

const express = require('express');
const app = express();
const cors = require('cors');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const cookieParser = require('cookie-parser');

const userRouter = require('./routes/User');                          //get router

const {connectMongoDB} = require('./connection');                     //establish connection
connectMongoDB(process.env.MONGO_URL);

app.use(express.json());                                              //Middleware - plugins      
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors({
    origin: 'http://localhost:5173',                                   // Frontend URL
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(session({
    secret: 'aditi@24', 
    resave: false, 
    saveUninitialized: true, 
    store: MongoStore.create({
        mongoUrl: process.env.MONGO_URL,
        collection: 'sessions',
        ttl: 14 * 24 * 60 * 60, 
    }),
    cookie: { 
        secure: false,               
        httpOnly: true,             
        sameSite: 'Lax', 
    }
})); 

app.use('/api',userRouter);

app.listen(process.env.PORT, () => {
    console.log(`Server is running on port ${process.env.PORT}`);
});