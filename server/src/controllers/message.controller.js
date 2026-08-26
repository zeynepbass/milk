import Message from "../models/Message.js";
import Conversation from "../models/Conversation.js";

export const sendMessage = async (req, res) => {
  try {
    const { senderId, receiverId, text } = req.body;

    let conversation = await Conversation.findOne({
      participants: { $all: [senderId, receiverId] },
    });

    if (!conversation) {
      conversation = await Conversation.create({
        participants: [senderId, receiverId],
      });
    }

    const message = await Message.create({
      senderId,
      receiverId,
      text,
      conversationId: conversation._id,
    });

    conversation.lastMessage = text;
    await conversation.save();

    res.json({
      ...message.toObject(),
      conversationId: conversation._id,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Mesaj gönderilemedi" });
  }
};
