const Message = require("../module/messageModule");

const createMessage = async (req, res) => {
  try {
    const { recipientId, message, conversationId } = req.body;
    const senderId = req.user.id; // from your auth middleware

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

    res.status(201).json({
      status: true,
      data: newMessage,
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      message: error.message,
    });
  }
};

module.exports = { createMessage };
