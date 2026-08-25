import User from "../models/User.js";
import bcrypt from "bcryptjs";
import { generateToken } from "../config/jwt.js"; 

import Feedback from "../models/Feedback.js";
export const getFeetBack = async (req, res) => {
  try {
    const feedbacks = await Feedback.find()
      .populate("user", "name email role") 
      .sort({ createdAt: -1 });

    res.status(200).json(feedbacks);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
export const createFeedback = async (req, res) => {
  try {
    const { message,type } = req.body;

    const feedback = await Feedback.create({
      message,
      type,
      user: req.user._id, 
    });

    res.status(201).json(feedback);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
export const register = async (req, res) => {
  try {
    const { name, surname, email, password, role } = req.body;


    if (!name || !surname || !email || !password) {
      return res.status(400).json({
        message: "Tüm alanlar zorunludur"
      });
    }


    const emailRegex = /^\S+@\S+\.\S+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        message: "Geçerli bir email adresi giriniz"
      });
    }


    if (password.length < 6) {
      return res.status(400).json({
        message: "Şifre en az 6 karakter olmalıdır"
      });
    }


    const userExist = await User.findOne({ email });
    if (userExist) {
      return res.status(400).json({
        message: "Bu email zaten kayıtlı"
      });
    }


    const allowedRoles = ["alici", "satici"];
    const safeRole = allowedRoles.includes(role) ? role : "satici";


    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      surname,
      email,
      password: hashedPassword,
      role: safeRole
    });


    res.status(201).json({
      message: "Kayıt başarılı 🎉",

      user: {
        id: user._id,
        name: user.name,
        surname: user.surname,
        email: user.email,
        role: user.role
      }
    });

  } catch (err) {

    if (err.name === "ValidationError") {
      return res.status(400).json({
        message: err.message
      });
    }

    res.status(500).json({
      message: "Sunucu hatası"
    });
  }
};
export const getUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password"); 
    res.status(200).json(users);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Alıcı kullanıcılar alınamadı" });
  }
};
export const updateUserStatus = async (req, res) => {
  try {
    const { userId, organicStatus } = req.body;

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "Kullanıcı bulunamadı" });
    }

    if (organicStatus !== undefined) {
      user.organicStatus = organicStatus;

  
      if (organicStatus === true) {
        user.dogrulanmisSatici = true;
      }
    }

    await user.save();

    res.status(200).json({
      message: "Kullanıcı başarıyla güncellendi",
      user,
    });

  } catch (error) {
    console.error(error);

    if (error.code === 11000) {
      return res.status(400).json({
        message: "Bu email zaten kullanılıyor",
      });
    }

    res.status(500).json({
      message: "Sunucu hatası",
    });
  }
};
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log("BODY:", req.body);
    const user = await User.findOne({
       email,
      status: true
    });
    if (!user)
      return res.status(404).json({ message: "Kullanıcı bulunamadı" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({ message: "Şifre hatalı" });

    const token = await generateToken({ id: user._id.toString() });

    res.json({
      token,
      user: {
        _id: user._id,
        name: user.name,
        surname: user.surname,
        avatar: user.avatar,
        email: user.email,
        role: user.role,
        province: user.province,
        district: user.district,
      }
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
      .select("-password")
      .populate("followers following", "name surname");

    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
export const deleteUser = async (req, res) => {
  try {
    const userId = req.user.id; 

    const user = await User.findByIdAndDelete(userId);

    if (!user) {
      return res.status(404).json({
        message: "Kullanıcı bulunamadı",
      });
    }

    res.status(200).json({
      message: "Kullanıcı başarıyla silindi",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Sunucu hatası",
    });
  }
};
export const updateUser = async (req, res) => {
  try {
    const id = req.user.id;
    const { name, surname, email, password, role, avatar,province,district,organic } = req.body;

    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({ message: "Kullanıcı bulunamadı" });
    }


    if (name !== undefined) user.name = name;
    if (surname !== undefined) user.surname = surname;
    if (email !== undefined) user.email = email;
    if (role !== undefined) user.role = role;
    if (avatar !== undefined) user.avatar = avatar;
    if (province !== undefined) user.province = province;
    if (district !== undefined) user.district = district;
    if (organic !== undefined) user.organic = organic;
    

    if (password && password.trim() !== "") {
      const hashedPassword = await bcrypt.hash(password, 10);
      user.password = hashedPassword;
    }

    await user.save();

    res.status(200).json({
      message: "Kullanıcı başarıyla güncellendi",
      user,
    });

  } catch (error) {
    console.error(error);

    if (error.code === 11000) {
      return res.status(400).json({
        message: "Bu email zaten kullanılıyor",
      });
    }

    res.status(500).json({
      message: "Sunucu hatası",
    });
  }
};
export const freezeUser = async (req, res) => {
  try {
    const userId = req.user.id;

    const user = await User.findByIdAndUpdate(
      userId,
      { status: false },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({
        message: "Kullanıcı bulunamadı",
      });
    }

    res.status(200).json({
      message: "Hesap donduruldu",
    });
  } catch (error) {
    res.status(500).json({
      message: "Sunucu hatası",
    });
  }
};
export const followUser = async (req, res) => {
  try {
    const targetUser = await User.findById(req.params.id);
    const currentUser = await User.findById(req.user.id);

    if (!targetUser)
      return res.status(404).json({ message: "Kullanıcı bulunamadı" });

    // ✅ kendini takip engeli
    if (targetUser._id.equals(currentUser._id)) {
      return res.status(400).json({
        message: "Kendini takip edemezsin"
      });
    }

    const isFollowing = currentUser.following.includes(targetUser._id);

    if (isFollowing) {
      currentUser.following.pull(targetUser._id);
      targetUser.followers.pull(currentUser._id);
    } else {
      currentUser.following.push(targetUser._id);
      targetUser.followers.push(currentUser._id);
    }

    await currentUser.save();
    await targetUser.save();

    res.json({
      message: isFollowing ? "Takipten çıkıldı" : "Takip edildi"
    });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


