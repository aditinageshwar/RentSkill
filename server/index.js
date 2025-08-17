require('dotenv').config();

const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const socketIo = require('socket.io');

const cors = require('cors');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const cookieParser = require('cookie-parser');
const path = require('path');
//const multer = require('multer'); 
const cloudinary = require('./cloudinary.js');

const axios = require('axios');

const userRouter = require('./routes/User');                          //get router
const bookingRouter = require('./routes/Booking');
const paymentRouter = require('./routes/Payment');
const notificationRouter = require('./routes/Notification');

const {connectMongoDB} = require('./connection');                     //establish connection
connectMongoDB(process.env.MONGO_URL);

app.set('trust proxy', 1);

app.use(cors({
    origin: 'https://rentskill-2.onrender.com',                                   // Frontend URL
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());                                              //Middleware - plugins      
app.use(express.urlencoded({ extended: true }));
//app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use(cookieParser());

app.use(session({
    secret: 'aditi@24', 
    resave: false, 
    saveUninitialized: false, 
    store: MongoStore.create({
        mongoUrl: process.env.MONGO_URL,
        collection: 'sessions',
        ttl: 14 * 24 * 60 * 60, 
        stringify: false,
    }),
    cookie: { 
        secure: true,               
        httpOnly: true,             
        sameSite: 'None', 
    }
})); 

//const storage = multer.memoryStorage(); 
//const upload = multer({ storage: storage });

const io = socketIo(server,{
    cors: {
        origin: "https://rentskill-2.onrender.com", 
        methods: ["GET", "POST"],
        allowedHeaders: ["Content-Type", "Authorization"],
        credentials: true,
    },
});

const providerSocketMap = {};
io.on('connection', (socket) => {
    console.log('New User connected:', socket.id);

    socket.on('newSkill', (newSkill) => {
        io.emit('newSkill', newSkill); 
    });
    
    socket.on("registerProvider", (providerId) => {
        providerSocketMap[providerId] = socket.id;
    });

    socket.on('startChat', ({providerId, seekerId, seekerEmail, providerEmail, Skill, Price}) => {
        if (!providerSocketMap[providerId]) {
            console.log(`Provider with ID ${providerId} is not connected`);
            return;
        }
       const roomId = `chatroom*${providerId}*${seekerId}`; 
       socket.join(roomId);                                                    //room created where we are using * to separate providerId and seekerId
    
       const providerSocketId = providerSocketMap[providerId];
       io.to(providerSocketId).emit("joinChatRoom", { roomId, seekerId, seekerEmail, providerEmail, Skill, Price});      //tell provider to join

       socket.emit('chatRoomCreated', roomId);                                               //tell seeker to confirm
    });

    socket.on("declineChatRequest", (data) => {                                              //provider reject request
        io.to(data.seekerId).emit("providerResponse", data.message);
    });

    socket.on('joinRoom', async({roomId, seekerEmail, providerEmail, Skill, Price}) => {     //provider accept request and connection established

        const bookingResponse = await axios.post('https://rentskill-1.onrender.com/api/saveBooking', {
            seekerEmail,
            providerEmail,
            Skill,
            Price,
            date : new Date().toLocaleDateString('en-GB'),
        });

        const notificationResponse = await axios.post('https://rentskill-1.onrender.com/api/notification', {
            notifications: [
             { email: providerEmail, message: `Great job! You've earned ₹ ${Price} for your ${Skill} skill through chat.`},
             { email: seekerEmail, message: `You Paid ₹ ${Price} for the ${Skill} skill you received through chat.`},
            ]
        });

        socket.join(roomId);
    });

    socket.on('sendMessage', ({ roomId, message, senderId }) => {                     //message started
        socket.to(roomId).emit('receiveMessage', { message, senderId });
    });

    socket.on('sendFile', ({ roomId, fileName, fileData, senderId }) => {             //if message is file or image
        socket.to(roomId).emit('receiveFile', { fileName, fileData, senderId });
    });

    socket.on('UserLeft', ({roomId, message}) => {                                    //if any of two left
        socket.to(roomId).emit("UserResponse", message);  
    });

    socket.on('videoCallOffer', ({ offer, providerId, seekerId, providerEmail, seekerEmail, Skill, Price }) => {            //video call offer by seeker
        const providerSocketId = providerSocketMap[providerId];
        io.to(providerSocketId).emit('videoCallOffer', { offer, seekerId, providerEmail, seekerEmail, Skill, Price });  
    });

    socket.on('videoCallAnswer', async({ answer, seekerId, providerEmail, seekerEmail, Skill, Price }) => {               //provider answered videoCall
        io.to(seekerId).emit('videoCallAnswer', answer);
        const bookingResponse = await axios.post('https://rentskill-1.onrender.com/api/saveBooking', {
            seekerEmail,
            providerEmail,
            Skill,
            Price,
            date : new Date().toLocaleDateString('en-GB'),
        });

        const notificationResponse = await axios.post('https://rentskill-1.onrender.com/api/notification', {
            notifications: [
             { email: providerEmail, message: `Great job! You've earned ₹ ${Price} for your ${Skill} skill through video call.`},
             { email: seekerEmail, message: `You Paid ₹ ${Price} for the ${Skill} skill you received through video call.`},
            ]
        });
    });

    socket.on('iceCandidate', ({ candidate, targetId }) => {
        const targetSocketId = providerSocketMap[targetId] || targetId;
        io.to(targetSocketId).emit('iceCandidate', candidate);   
    });

    socket.on('endCall', ({targetId})=> {
        const targetSocketId = providerSocketMap[targetId] || targetId;
        io.to(targetSocketId).emit('endCall'); 
    });

    socket.on('disconnect', () => {
        console.log('User disconnected', socket.id);
    });
});

app.use('/api',userRouter);
app.use('/api', bookingRouter);
app.use('/api', paymentRouter);
app.use('/api', notificationRouter);

server.listen(process.env.PORT, () => {
    console.log(`Server is running on port ${process.env.PORT}`);
});