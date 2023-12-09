const asyncHandler = require("express-async-handler");
const Message = require("../models/messageModel");
const User = require("../models/userModel");
const Chat = require("../models/chatModel");
const { encrypt, decrypt, generateKey } = require("../services/helper");

const sendMessage = asyncHandler(async (req, res) => {
  const { content, chatId } = req.body;

  if (!content || !chatId) {
    console.log("Invalid data passed into request");
    return res.sendStatus(400);
  }

  // const key = generateKey();
  const keyBuffer = Buffer.from(
    "b7765eaf07ae2911f65e98485b2a22a445933b6ada1f25646438964dc16ab73a",
    "hex"
  );
  const key = keyBuffer.toString("hex");

  const encryptedMessage = encrypt(content, key);
  // const encryptedContent = JSON.stringify(encryptedMessage);
  var newMessage = {
    sender: req.user._id,
    content: encryptedMessage.trim(),
    chat: chatId,
  };

  try {
    var message = await Message.create(newMessage);

    message = await message.populate("sender", "name pic");
    message = await message.populate("chat");
    message = await User.populate(message, {
      path: "chat.users",
      select: "name pic email",
    });

    await Chat.findByIdAndUpdate(req.body.chatId, { latestMessage: message });

    res.json(message);
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
});

// const allMessages = asyncHandler(async (req, res) => {
//   const keyBuffer = Buffer.from(
//     "b7765eaf07ae2911f65e98485b2a22a445933b6ada1f25646438964dc16ab73a",
//     "hex"
//   );
//   const key = keyBuffer.toString("hex");
//   try {
//     const messages = await Message.find({ chat: req.params.chatId })
//       .populate("sender", "name pic email")
//       .populate("chat");
//     res.json(messages);
//   } catch (error) {
//     res.status(400);
//     throw new Error(error.message);
//   }
// });
const allMessages = asyncHandler(async (req, res) => {
  const keyBuffer = Buffer.from(
    "b7765eaf07ae2911f65e98485b2a22a445933b6ada1f25646438964dc16ab73a",
    "hex"
  );
  const key = keyBuffer.toString("hex");
  try {
    const messages = await Message.find({ chat: req.params.chatId })
      .populate("sender", "name pic email")
      .populate("chat");

    // Decrypt the content of each message
    const decryptedMessages = messages.map((message) => {
      if (message.content) {
        const decryptedContent = decrypt(message.content, key);
        message.content = decryptedContent;
      }
      return message;
    });

    res.json(decryptedMessages);
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
});

module.exports = { sendMessage, allMessages };
