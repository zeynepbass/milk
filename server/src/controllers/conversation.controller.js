import Conversation from "../models/Conversation.js";
import Message from "../models/Message.js";
import mongoose from "mongoose";

export const getConversationBetweenUsers = async (req, res) => {
  try {
    const { userId, otherUserId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(userId) || !mongoose.Types.ObjectId.isValid(otherUserId)) {
      return res.status(400).json({ error: "Geçersiz kullanıcı ID" });
    }

    const u1 = new mongoose.Types.ObjectId(userId);
    const u2 = new mongoose.Types.ObjectId(otherUserId);

    let conversation = await Conversation.findOne({
      participants: { $all: [u1, u2] },
    }).populate("participants", "name surname avatar"); // Kullanıcı bilgileri

    if (!conversation) {
      return res.json({ _id: null, participants: [], messages: [] });
    }

    // Mesajları çek ve sırala
    const messages = await Message.find({ conversationId: conversation._id }).sort({ createdAt: 1 });

    res.json({ ...conversation.toObject(), messages });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Mesajlar alınamadı" });
  }
};
export const getUserConversations = async (req, res) => {
  try {
    const { userId } = req.params;

    const conversations = await Conversation.find({
      participants: userId,
    })
      .sort({ lastMessageAt: -1 })
      .populate("participants", "name surname avatar");

    res.json(conversations);
  } catch (error) {
    res.status(500).json({ error: "Chat listesi alınamadı" });
  }
};