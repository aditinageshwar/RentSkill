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

const userRouter = require('./routes/User');                          //get router

const {connectMongoDB} = require('./connection');                     //establish connection
connectMongoDB(process.env.MONGO_URL);

app.use(express.json());                                              //Middleware - plugins      
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
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

const io = socketIo(server,{
    cors: {
        origin: "http://localhost:5173", 
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

    socket.on('startChat', ({providerId, seekerId}) => {
        if (!providerSocketMap[providerId]) {
            console.log(`Provider with ID ${providerId} is not connected`);
            return;
        }
       const roomId = `chat-room-${providerId}-${seekerId}`;
       socket.join(roomId);                                                             //room created
    
       const providerSocketId = providerSocketMap[providerId];
       io.to(providerSocketId).emit("joinChatRoom", { roomId, seekerId });

       socket.emit('chatRoomCreated', roomId);
    });

    socket.on('joinRoom', (roomId) => {
        socket.join(roomId);
    });

    socket.on('sendMessage', ({ roomId, message, senderId }) => {
        socket.to(roomId).emit('receiveMessage', { message, senderId });
    });

    socket.on('disconnect', () => {
        console.log('User disconnected', socket.id);
    });
});

app.use('/api',userRouter);

server.listen(process.env.PORT, () => {
    console.log(`Server is running on port ${process.env.PORT}`);
});