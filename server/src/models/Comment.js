import mongoose from "mongoose";

const commentSchema = new mongoose.Schema(
  {
    post: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Post",
      required: true,
      index: true
    },

    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    text: {
      type: String,
      required: true,
      trim: true,
      maxlength: 500
    },
    likes: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User"
        }
      ],
      isActive: {
        type: Boolean,
        default: true
      },
      
    isEdited: {
      type: Boolean,
      default: false
    },

  },
  {
    timestamps: true
  }
);

commentSchema.index({ post: 1, createdAt: -1 });

export default mongoose.model("Comment", commentSchema);
