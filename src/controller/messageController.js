const Message = require("../module/messageModule");

const createMessage = async (req, res) => {
  try {
    const { recipientId, message, conversationId } = req.body;
    const senderId = req.user.id;

    // Basic validation
    if (!recipientId || !message || !conversationId) {
      return res.status(400).json({
        status: false,
        message: "recipientId, message, and conversationId are required",
      });
    }

    // Create message
    const newMessage = new Message({
      senderId,
      recipientId,
      conversationId,
      message: message.trim(),
    });

    await newMessage.save();

    // Format response like getMessages
    const formattedMessage = {
      _id: newMessage._id.toString(),
      conversationId: newMessage.conversationId,
      senderId: newMessage.senderId.toString(),
      recipientId: newMessage.recipientId.toString(),
      message: newMessage.message,
      isRead: newMessage.isRead,
      dbSaved: true,
      createdAt: newMessage.createdAt,
      updatedAt: newMessage.updatedAt,
    };

    res.status(201).json({
      status: true,
      data: formattedMessage,
      message: "Message saved successfully",
    });
  } catch (error) {
    console.error("Error creating message:", error);
    res.status(500).json({
      status: false,
      message: error.message,
    });
  }
};

const getMessages = async (req, res) => {
  try {
    const { conversationId } = req.query;

    if (!conversationId) {
      return res.status(400).json({
        status: false,
        message: "conversationId is required",
      });
    }

    // Get messages
    const messages = await Message.find({ conversationId }).sort({
      createdAt: 1,
    });

    // Transform messages to ensure IDs are strings
    const formattedMessages = messages.map((msg) => ({
      _id: msg._id.toString(),
      conversationId: msg.conversationId,
      senderId: msg.senderId.toString(),
      recipientId: msg.recipientId.toString(),
      message: msg.message,
      isRead: msg.isRead,
      createdAt: msg.createdAt,
      updatedAt: msg.updatedAt,
    }));

    res.status(200).json({
      status: true,
      data: formattedMessages,
    });
  } catch (error) {
    console.error("Error fetching messages:", error);
    res.status(500).json({
      status: false,
      message: error.message,
    });
  }
};

module.exports = { createMessage, getMessages };
