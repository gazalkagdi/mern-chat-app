import Conversation from "../models/conversations.js";
import Message from "../models/message.js";
import { getReceiverSocketId, io } from "../socket/socket.js";

export const getUnreadCounts = async (req, res) => {
  try {
    const userId = req.user._id;
    if (!userId) {
      return res.status(401).json({ error: "User not authenticated" });
    }

    const unreadMessages = await Message.find({
      receiverId: userId,
      isRead: false,
    });

    if (!unreadMessages || unreadMessages.length === 0) {
      return res.status(200).json([]);
    }

    const unreadSenderIds = [
      ...new Set(
        unreadMessages
          .filter((msg) => msg.senderId)
          .map((msg) => msg.senderId.toString()),
      ),
    ];

    return res.status(200).json(unreadSenderIds);
  } catch (error) {
    console.error("Error in getUnreadCounts controller: ", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const sendMessage = async (req, res) => {
  try {
    const { message } = req.body;
    const { id: receiverId } = req.params;
    const senderId = req.user._id;

    let conversation = await Conversation.findOne({
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
    });

    await newMessage.save();

    if (newMessage) {
      conversation.messages.push(newMessage._id);
      // Explicitly update the conversation's updatedAt to trigger sorting
      conversation.updatedAt = Date.now();
      await conversation.save();
    }

    const receiverSocketId = getReceiverSocketId(receiverId);
    if (receiverSocketId) {
      // io.to(socketId).emit() is used to send events to specific client
      io.to(receiverSocketId).emit("newMessage", newMessage);
    }

    res.status(201).json(newMessage);
  } catch (error) {
    console.log("Error in sendMessage controller: ", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getMessages = async (req, res) => {
  try {
    const { id: userToChatId } = req.params;
    const senderId = req.user._id;

    const conversation = await Conversation.findOne({
      participants: { $all: [senderId, userToChatId] },
    }).populate("messages");

    if (!conversation) return res.status(200).json([]);

    const messages = conversation.messages;

    // Mark messages as read
    await Message.updateMany(
      {
        receiverId: senderId,
        senderId: userToChatId,
        isRead: false,
      },
      { $set: { isRead: true } },
    );

    res.status(200).json(messages);
  } catch (error) {
    console.log("Error in getMessages controller: ", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};
