const monggose = require('mongoose')

const messageModel = monggose.Schema({

    sender :{type:monggose.Schema.Types.ObjectId,ref:"User"},
    content: {type: String, trim:true},
    chat:{type:monggose.Schema.Types.ObjectId,ref:"Chat"},
},
    {
        timestamps: true,
    }
);

const Message = monggose.model("Message",messageModel);


module.exports = Message;