const connectDB = require('./config/db');
const userRoutes = require('./routes/userRoutes');
const chatRoutes = require('./routes/chatRoutes');
const messageRoutes = require('./routes/messageRoutes');
const {notFound,errorHandler}  = require('./middleware/errorMiddleware');
const fileUpload = require('express-fileupload');

const bodyParser = require('body-parser');
const express = require("express");
const app = express();
const dotenv = require("dotenv");
const helmet = require("helmet");
const morgan = require("morgan");
const multer = require("multer");
const path = require("path");
const cors = require('cors');



 
dotenv.config();

app.use(express.static(path.join(__dirname, 'public')));

//middleware
connectDB();
app.use(bodyParser.urlencoded({extended:false}));
app.use(cors());
app.use(express.json());
app.use(helmet());
app.use(morgan("common"));
app.use(fileUpload({
    useTempFiles : true
}));

 
  
 
 

app.get('/',(req,res)=>{
    res.send('Welcome to you API is running.....'); 
});


 
  


app.use('/api/user',userRoutes);
app.use('/api/chat',chatRoutes);
app.use('/api/message',messageRoutes);
 

 

app.use(notFound);
app.use(errorHandler);

 


 
const port = process.env.PORT || 8080
const server = app.listen(port, 
    console.log(`Server is running on POrt no --> ${port}`)
);

const io = require("socket.io")(server,{
    pingTimeout : 60000,
    cors : {
        origin : "http://localhost:3000",
    }
});


io.on("connection",(socket)=>{
    console.log("Connected to scket.io");

    socket.on('setup',(userData)=>{
        socket.join(userData._id);  // room for particular user
        
        socket.emit('connection');
    });


    socket.on("join chat",(room)=>{
        socket.join(room);
        console.log("User join the Room : "+room);
    });

    socket.on("typing",(room)=>socket.in(room).emit("typing"));
    socket.on("stop typing",(room)=>socket.in(room).emit("stop typing"));


    socket.on('new Message',(newMessageRecieved)=>{
       
        var chat = newMessageRecieved.chat;
        

        if(!chat.users) return console.log('chat.users not defined');

        chat.users.forEach(user=>{
            if(user._id == newMessageRecieved.sender._id) return ;

            socket.in(user._id).emit("message recieved",newMessageRecieved);
        });
    });


     socket.off("setup",()=>{
        console.log("USER DISCONNECTED");
        socket.leave(userData._id);
     })
});
 

 
 











 