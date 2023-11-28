const asyncHandler = require("express-async-handler");
const Message = require('../models/messageModel');
const User = require("../models/userModel");
const Chat = require('../models/chatModel')



const sendMessage =asyncHandler (async (req,res)=>{

    const {content,chatId,image,emoji} = req.body;
 

    if(!chatId && (!content || !image || !emoji) ){
        
        return res.sendStatus(400)
    }

    


if(image === ""){
  var newMessage = {
    sender : req.user._id,
    content : content,
    image : image,
    chat : chatId
};
}else if(emoji === ""){
  var newMessage = {
    sender : req.user._id,
    content : content,
    image : image,
    chat : chatId
};
}
else{
  var newMessage = {
    sender : req.user._id,
    content : content,
    image : image,
    chat : chatId
};
}
   
    try {
        var message = await Message.create(newMessage);
        
        message = await message.populate("sender","name pic");
        message = await message.populate("chat");
        message = await message.populate("chat.groupAdmin")
        message = await message.populate("chat.latestMessage")
         message = await User.populate(message,{
            path : 'chat.users',
            select : 'name pic email',
        });

        await Chat.findByIdAndUpdate(req.body.chatId, {
            latestMessage : message,
        });

        res.json(message);
        
    } catch (error) {
        
    }
 


});

const allMessages = asyncHandler(async (req, res) => {
    try {
      const messages = await Message.find({ chat: req.params.chatId })
        .populate("sender", "name pic email")
        .populate("chat");
      res.json(messages);
    } catch (error) {
      res.status(400);
      throw new Error(error.message);
    }
  });



  const deleteMessages = asyncHandler (async (req,res)=>{

const {messageIds} = req.body;
 
 

try {
 
  await Message.deleteMany({_id : {$in : messageIds}}).then(res=>{
   
  })
  res.status(200).json({Message : "Messages deleted successfully"});
  
} catch (error) {
 
    res.status(500).json({ error: 'An error occurred while deleting messages' });
  
}

  });

module.exports = {sendMessage,allMessages,deleteMessages}