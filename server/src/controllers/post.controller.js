import Post from "../models/Post.js";
import User from "../models/User.js";
import Comment from "../models/Comment.js";

import Notification from "../models/Notification.js";

export const getNotifications = async (req, res) => {
  try {
    const userId = req.user.id || req.user._id;

    const notifications = await Notification.find({ userId }).sort({
      createdAt: -1,
    });

    const formatted = notifications.map((n) => {
      let message = "";

      if (n.type === "new_post") {
        message = `İlinde ${n.name} ${n.surname} yeni bir gönderi paylaştı`;
      }

      return {
        _id: n._id,
        message,
        isRead: n.isRead,
        createdAt: n.createdAt,
        postId: n.postId,
        userId: n.senderId,
        type: n.type,
      };
    });

    res.json(formatted);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
export const createPost = async (req, res) => {
  try {
    const userId = req.user.id || req.user._id;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "Kullanıcı bulunamadı" });
    }

    if (user.role === "alici") {
      return res
        .status(403)
        .json({ message: "Alıcı rolündeki kullanıcı post paylaşamaz" });
    }

    const images = req.files
      ? req.files.map((file) => `/uploads/${file.filename}`)
      : [];

    const post = await Post.create({
      user: user._id,
      ownerName: user.name,
      ownerSurname: user.surname,
      ownerRole: user.role,
      image: user.avatar,
      province: req.body.province,
      title: req.body.title,
      description: req.body.description,
      images: images,
      district: req.body.district,
      category: req.body.category,
    });

    const today = new Date().toISOString().split("T")[0];

    const users = await User.find({
      province: post.province,
      _id: { $ne: user._id },
    });

    const existingNotifications = await Notification.find({
      type: "new_post",
      province: post.province,
      date: today,
    }).select("userId");

    const sentUserIds = existingNotifications.map((n) => n.userId.toString());

    const usersToNotify = users.filter(
      (u) => !sentUserIds.includes(u._id.toString())
    );

    const notificationsToCreate = usersToNotify.map((u) => ({
      userId: u._id,
      type: "new_post",
      province: post.province,
      date: today,
      name: user.name,
      surname: user.surname,
      postId: post._id,
      senderId: user._id,
    }));

    if (notificationsToCreate.length > 0) {
      await Notification.insertMany(notificationsToCreate);
    }

    res.status(201).json(post);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};
export const getFollowingPosts = async (req, res) => {
  try {
    const userId = req.user._id;

    const user = await User.findById(userId).select("following");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const followingIds = user.following;

    if (!followingIds || followingIds.length === 0) {
      return res.json([]);
    }

    const posts = await Post.find({
      user: { $in: followingIds },
      isActive: true,
    })
      .sort({ createdAt: -1 })
      .select(
        "title price district category createdAt user images ownerName ownerSurname ownerRole"
      )
      .populate({
        path: "user",
        select: "name surname avatar dogrulanmisSatici",
      })
      .lean();

    res.json(posts);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const markAsRead = async (req, res) => {
  try {
    const { id } = req.params;

    await Notification.findByIdAndUpdate(id, { isRead: true });

    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
export const getPosts = async (req, res) => {
  try {
    const { district, category, title } = req.query;

    const filter = { isActive: true };

    if (district) {
      filter.district = district;
    }

    if (category) {
      filter.category = category;
    }

    if (title && title.trim() !== "") {
      filter.$text = { $search: title.trim() };
    }

    const posts = await Post.find(filter)
      .sort({ createdAt: -1 })
      .select(
        "title price district category createdAt user images ownerName ownerSurname ownerRole"
      )
      .populate({
        path: "user",
        select: "name surname avatar dogrulanmisSatici",
      })
      .lean();

    return res.status(200).json(posts);
  } catch (err) {
    console.error("getPosts error:", err);
    return res.status(500).json({
      message: "Server error",
      error: err.message,
    });
  }
};
export const getPostById = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id).populate(
      "user",
      "name surname avatar"
    );

    if (!post || !post.isActive) {
      return res.status(404).json({ message: "Post bulunamadı" });
    }

    const comments = await Comment.find({
      post: post._id,
      isActive: true,
    })
      .populate("user", "name surname avatar")
      .sort({ createdAt: -1 });

    res.json({
      post,
      comments,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const deletePost = async (req, res) => {
  try {
    const userId = req.user.id || req.user._id;

    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: "Post bulunamadı" });

    if (post.user.toString() !== userId)
      return res.status(403).json({ message: "Yetkisiz" });

    post.isActive = false;
    await post.save();

    res.json({ message: "Post kaldırıldı" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const toggleLikePost = async (req, res) => {
  try {
    const userId = req.user.id || req.user._id;

    const post = await Post.findById(req.params.id);

    if (!post || !post.isActive) {
      return res.status(404).json({ message: "Post bulunamadı" });
    }

    const alreadyLiked = post.likes.some(
      (id) => id.toString() === userId.toString()
    );

    if (alreadyLiked) {
      post.likes.pull(userId);
    } else {
      post.likes.push(userId);
    }

    await post.save();

    return res.status(200).json({
      postId: post._id,
      likes: post.likes,
      likesCount: post.likes.length,
      liked: !alreadyLiked,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

//favoriler
export const toggleSavePost = async (req, res) => {
  try {
    const userId = req.user.id || req.user._id;
    const post = await Post.findById(req.params.id);

    if (!post || !post.isActive)
      return res.status(404).json({ message: "Post bulunamadı" });

    const isSaved = post.savedBy.includes(userId);

    isSaved ? post.savedBy.pull(userId) : post.savedBy.push(userId);

    await post.save();

    res.json({
      saved: !isSaved,
      savedCount: post.savedBy.length,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getSavedPosts = async (req, res) => {
  try {
    const userId = req.user.id || req.user._id;

    const posts = await Post.find({
      savedBy: userId,
      isActive: true,
    })
      .populate("user", "username avatar")
      .sort({ createdAt: -1 });

    res.json(posts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
//kullanıcının postları
export const getMyPosts = async (req, res) => {
  try {
    const userId = req.user.id || req.user._id;

    const posts = await Post.find({
      user: userId,
      isActive: true,
    })
      .sort({ createdAt: -1 })
      .populate({
        path: "user",
        select: "name surname avatar dogrulanmisSatici",
      })
      .lean();

    res.json(posts);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
export const updatePost = async (req, res) => {
  try {
    const userId = req.user.id || req.user._id;
    const { id } = req.params;

    const post = await Post.findById(id);

    if (!post || !post.isActive) {
      return res.status(404).json({ message: "Post bulunamadı" });
    }

    if (post.user.toString() !== userId.toString()) {
      return res
        .status(403)
        .json({ message: "Bu postu güncelleme yetkiniz yok" });
    }

    const { title, description } = req.body;

    if (title !== undefined) post.title = title;
    if (description !== undefined) post.description = description;

    if (req.files && req.files.length > 0) {
      const newImages = req.files.map((file) => `/uploads/${file.filename}`);

      post.images = [...(post.images || []), ...newImages];
    }

    await post.save();

    res.json(post);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
