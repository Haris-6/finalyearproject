const Message = require("../schema/message");
const Conversation = require("../schema/conversation");
const User = require("../schema/user");
const Joi = require("joi");  //it commonly used for input validation.
const mongoose = require("mongoose");
const { getReceiverSocketId, getIo } = require("../config/socket");

// Sending a message btw user
const sendMessage = async (req, res) => {
  try {
    const result = validateMessage(req.body);  //validateMessage is use to check the message body is valid
    if (result.error) {
      res.status(400).send({ message: result.error.details[0].message });
      return;
    }

    const { message } = req.body;
    const { id: receiverId } = req.params;  //reciving id get from url parameters
    const senderId = req.user._id;

    let conversation = await Conversation.findOne({  // find existing conversation btw two user
      participants: { $all: [senderId, receiverId] },
    });
    if (!conversation) {
      conversation = await Conversation.create({
        participants: [senderId, receiverId],
      });
    }

    const newMessage = new Message({
      senderId,
      receiverId,
      message,
      read: false, // New message is unread by default
    });

    if (newMessage) {  //pf message create successfully it insert in conversation array
      conversation.messages.push(newMessage._id);  
    }

    await Promise.all([conversation.save(), newMessage.save()]);  //parallel both data are save in database

    const receiverSocketId = getReceiverSocketId(receiverId);  //receiver socket id store
    const io = getIo();  //it is use to real time chart throug socket
    io.to(receiverSocketId).emit("newMessage", newMessage);

    res.status(200).json(newMessage);
  } catch (error) {
    res.status(500).json(error);
  }
};

// Retrieving messages and marking them as read
const getMessages = async (req, res) => {
  try {
    const { id: receiverId } = req.params;
    const senderId = req.user._id;

    let conversation = await Conversation.findOne({  //find conversation btw sender and reciver
      participants: { $all: [senderId, receiverId] },
    }).populate("messages");

    if (!conversation) {
      return res.status(200).json([]); //if conversation not fins send empty array
    }

    // Mark all messages as read
    await Message.updateMany(
      { _id: { $in: conversation.messages }, receiverId: senderId, read: false },
      { $set: { read: true } }
    );

    res.status(200).json(conversation.messages);
  } catch (error) {
    res.status(500).json(error);
  }
};

// Retrieve chat users
const getChatUser = async (req, res) => {
  try {
    const id = new mongoose.Types.ObjectId(req.user._id);
    const conversations = await Conversation.find({
      participants: { $in: [id] },
    });
 
    const userIds = [];   //It ensures no duplicate IDs are added to the userIds array.
    conversations.forEach((convo) => {
      convo.participants.forEach((participantId) => {
        if (
          !participantId.equals(id) &&  
          !userIds.includes(participantId.toString())
        ) {
          userIds.push(participantId.toString());
        }
      });
    });

    const users = await User.find({
      _id: { $in: userIds },
    });

    res.status(200).json(users);
  } catch (error) {
    res.status(500).json(error);
  }
};

// Validate message input
const validateMessage = (data) => {
  const schema = Joi.object({
    message: Joi.string().required(),
  });

  return schema.validate(data);
};

module.exports = { sendMessage, getMessages, getChatUser };
