import Comment from "../models/Comment.js";
import Post from "../models/Post.js";

//yorum ekle
export const addComment = async (req, res) => {
  try {
    const userId = req.user.id || req.user._id;
    const { text } = req.body;
    const postId = req.params.id;

    if (!postId) {
      return res.status(400).json({ message: "Post id yok" });
    }

    if (!text || !text.trim()) {
      return res.status(400).json({ message: "Yorum boş olamaz" });
    }

    const post = await Post.findById(postId);
    if (!post || post.isActive === false) {
      return res.status(404).json({ message: "Post bulunamadı" });
    }

    const comment = await Comment.create({
      post: post._id,
      user: userId,
      text,
    });

    // 🔥 populate ekledik
    const populatedComment = await Comment.findById(comment._id)
      .populate("user", "name surname avatar");

    res.status(201).json(populatedComment);
  } catch (err) {
    console.error("ADD COMMENT ERROR:", err);
    res.status(500).json({ message: err.message });
  }
};
  //yorum beggen
  export const toggleLikeComment = async (req, res) => {
    try {
      const userId = req.user.id || req.user._id;
  
      const comment = await Comment.findById(req.params.id)
        .populate("likes", "name surname avatar");
  
      if (!comment || !comment.isActive)
        return res.status(404).json({ message: "Yorum bulunamadı" });
  
      const liked = comment.likes.some(
        (id) => id._id.toString() === userId.toString()
      );
  
      if (liked) {
        comment.likes.pull(userId);
      } else {
        comment.likes.push(userId);
      }
  
      await comment.save();
  
      const updatedComment = await Comment.findById(req.params.id)
        .populate("likes", "name surname avatar");
  
      res.json({
        likesCount: updatedComment.likes.length,
        liked: !liked,
        likes: updatedComment.likes 
      });
  
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  };
  
  
  export const deleteComment = async (req, res) => {
    try {
      const userId = req.user.id || req.user._id;
  
      const commentId = req.params.commentId || req.params.id; 
  
      const comment = await Comment.findById(commentId);
      if (!comment)
        return res.status(404).json({ message: "Yorum bulunamadı" });
  
      if (comment.user.toString() !== userId)
        return res.status(403).json({ message: "Yetkisiz" });
  
      comment.isActive = false;
      await comment.save();
      res.json({ message: "Yorum silindi" });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  };
  export const getComment = async (req, res) => {
    try {
      const { id } = req.params;
  
      const comments = await Comment.find({
        post: id,
        isActive: true   // 🔥 SİLİNENLER GELMEZ
      })
        .populate("user", "name surname avatar")
        .sort({ createdAt: -1 });
  
      res.status(200).json(comments);
  
    } catch (error) {
      res.status(500).json({
        message: "Yorumlar alınamadı",
        error: error.message,
      });
    }
  };
  
