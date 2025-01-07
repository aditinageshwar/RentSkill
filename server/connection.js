const mongoose = require('mongoose');
require('dotenv').config();
const dbConnect=()=>{
    mongoose.connect(process.env.MONGO_URL,{
        useNewUrlParser:true,
        useUnifiedTopology:true
    })
    .then(() => console.log("MongoDB connected"))
    .catch((err) => {console.error("MongoDB connection error:", err)
});
}
module.exports = dbConnect;