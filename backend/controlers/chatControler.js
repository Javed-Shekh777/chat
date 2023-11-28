const asyncHandler = require('express-async-handler');
const Chat = require('../models/chatModel');
const User = require('../models/userModel');
// const Message = require('../models/messageModel');

const accessChat = asyncHandler(async (req,res,next)=>{

   const {userId} =  req.body;
 

   if(!userId){
    
    return res.sendStatus(400);
   }

   var isChat = await Chat.find({
      isGroupChat :false,
      $and : [
         {users : {$elemMatch : {$eq : req.user._id}}},
         {users : {$elemMatch : {$eq : userId}}}
      ],
   })
   .populate("users","-password")
   .populate("latestMessage");

   isChat = await  User.populate(isChat,{
      path : 'latestMessage.sender',
      select : 'name pic email',
   });

   if(isChat.length > 0){
      res.send(isChat[0])
   }else{
      var chatData = {
         chatName : "sender",
         isGroupChat : false,
         users : [req.user._id , userId],
      }

      try {
         const createdChat = await Chat.create(chatData);

         const FullChat = await Chat.find({_id : createdChat._id}).populate("users","-password")
         // .populate("latestMessage");

         res.status(200).json(FullChat)
      } catch (err){
         res.status(400).send(err);
         throw new Error(err.message);
      }
   }

});

const fecthChats = asyncHandler ( async (req,res,next)=>{
 
   try {
 
   Chat.find({ users: { $elemMatch: { $eq: req.user._id } } })
    .populate("users", "-password")
   .populate("groupAdmin", "-password")
   .populate("latestMessage")
   // .populate('chat')
      .sort({ updatedAt: -1 })
      .then(async (results) => {
        results = await User.populate(results, {
          path: "latestMessage.sender",
          select: "name pic email",
        });
        results = await Chat.populate(results, {
         path: "latestMessage.chat",
       });
        
        res.status(200).send(results);
      });
      
      
   } catch (err){
      res.status(400).send(err);
      throw new Error(err.message);
   }
})


const createGrouptChat = asyncHandler (async (req,res,next)=>{
   if(!req.body.name && !req.body.users){
      return res.status(400).send({
         Message : "Please Fill all the fileds",
      });
   }

   var users = JSON.parse(req.body.users);

   if(users.length < 2){
      return res.status(400).send({
         Message : "More than 2 users are rerquired to create a group chat",
      })
   }

   users.push(req.user);

    try {

      const groupChat = await Chat.create({
         chatName : req.body.name,
         isGroupChat : true,
         groupAdmin : req.user,
         users : users
      });

      const FullChat = await Chat.find({_id : groupChat._id}).populate("users","-password").populate("groupAdmin","-password");

      res.status(200).json(FullChat);
      // .send({
      //    Message : "Groupchat created"
      // }).json
      
    } catch (error) {
      res.status(400);
      throw new Error(error.message);
      
    }


});


const renameGroup = asyncHandler (async (req,res,next)=>{
   const {chatId , chatName} = req.body;

   const updatedChat = await Chat.findByIdAndUpdate(
      chatId , 
      {chatName : chatName},
      {new : true})
   .populate("users","-password")
   .populate("groupAdmin","-password");

   if(!updatedChat){
      res.status(404);
      throw new Error("Chat Not found!");
   }else{
      res.send(updatedChat);
   }
})



const addToGroup = asyncHandler (async (req,res,next)=>{
   const {chatId , userId} = req.body;

   const  added = await Chat.findByIdAndUpdate(chatId ,
       {
         $push : {users : userId}
       },
       {new : true}
       )
   .populate("users","-password")
   .populate("groupAdmin","-password");

   if(!added){
      res.status(404).send({
         Message : "User Not Added"
      })
      throw new Error("User Not Added");
   }else{
      res.send(added);
   }
});



const removeFromGroup = asyncHandler (async (req,res,next)=>{
   const {chatId , userId} = req.body;

   const  removed = await Chat.findByIdAndUpdate(chatId ,
       {
         $pull : {users : userId}
       },
       {new : true}
       )
   .populate("users","-password")
   .populate("groupAdmin","-password");

   if(!removed){
      res.status(404),send({Message :"Chat Not Found" })
      throw new Error("Chat Not Found");
   }else{
      res.send(removed);
   }
})

module.exports = {accessChat,fecthChats,createGrouptChat,renameGroup,addToGroup, removeFromGroup};