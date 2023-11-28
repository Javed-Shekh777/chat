const mongoose = require('mongoose');

const messageModel = mongoose.Schema(
    {
        sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        content: { type: String, trim: true },
        image : {type : String,default : '' },
        emoji : {type : String ,default : ''},
        chat: { type: mongoose.Schema.Types.ObjectId, ref: 'Chat' },
        readBy: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],

    },
    {
        timestamps: true,
    }
);

const Message = mongoose.model('Message', messageModel);

module.exports = Message;

//name of the Sender or Id
//content of the message
//reference to the chat which is belongs to 
