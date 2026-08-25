import Message from "../models/Message.js";
import Conversation from "../models/Conversation.js";


export const sendMessage = async (req, res) => {
  try {
    const { senderId, receiverId, text } = req.body;

    // 🔥 conversation var mı?
    let conversation = await Conversation.findOne({
      participants: { $all: [senderId, receiverId] },
    });

    // ❗ yoksa oluştur
    if (!conversation) {
      conversation = await Conversation.create({
        participants: [senderId, receiverId],
      });
    }

    // mesaj oluştur
    const message = await Message.create({
      senderId,
      receiverId,
      text,
      conversationId: conversation._id,
    });

    // last message update
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