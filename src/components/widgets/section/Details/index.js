import { useState } from "react";
import {
  HeartIcon,
  BookmarkIcon,
  ChatBubbleBottomCenterIcon,
  ArrowRightIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { useParams } from "react-router-dom";
import useCommentAll from "../../../../hooks/post/usePostDetails";

export function Detail() {
  const { id } = useParams();

  const {
    handleDelete,
    handleComment,
    details,
    loading,
    handleLike,
    user,
    comments,
    handlePostLike,
    handlePostSave,
  } = useCommentAll(id);

  const [currentImage, setCurrentImage] = useState(0);

  const [newComment, setNewComment] = useState("");
  const [showComments, setShowComments] = useState(false);

  if (loading) {
    return <p className="text-center mt-10">Yükleniyor...</p>;
  }

  if (!details) {
    return <p className="text-center mt-10">Gönderi bulunamadı</p>;
  }

  const images = details.images || [];

  const nextImage = () => setCurrentImage((prev) => (prev + 1) % images.length);

  const prevImage = () =>
    setCurrentImage((prev) => (prev - 1 + images.length) % images.length);

  const handleAddComment = (postId) => {
    if (!newComment.trim()) return;

    handleComment(postId, newComment);
    setNewComment("");
  };

  return (
    <div className="max-w-5xl mx-auto p-6">
      {images.length > 0 && (
        <div className="relative w-full h-96">
          <img
            src={images[currentImage]}
            alt={details.title}
            className="w-full h-full object-cover rounded-xl"
          />

          {images.length > 1 && (
            <>
              <button
                onClick={prevImage}
                className="absolute top-1/2 left-3 -translate-y-1/2 bg-white/70 rounded-full p-2"
              >
                <ArrowRightIcon className="w-6 h-6 rotate-180" />
              </button>

              <button
                onClick={nextImage}
                className="absolute top-1/2 right-3 -translate-y-1/2 bg-white/70 rounded-full p-2"
              >
                <ArrowRightIcon className="w-6 h-6" />
              </button>
            </>
          )}
        </div>
      )}

      <div className="mt-6 space-y-6">
        <div className="flex items-center space-x-4">
          <div className="bg-gray-200 w-14 h-14 rounded-full flex items-center justify-center font-semibold">
            {details.ownerName?.[0]}
            {details.ownerSurname?.[0]}
          </div>

          <div>
            <p className="font-bold">
              {details.ownerName} {details.ownerSurname}
            </p>
            <p className="text-sm text-gray-400">{details.ownerRole}</p>
          </div>
        </div>

        <div>
          <h1 className="text-3xl font-bold">{details.title}</h1>
          <p className="text-gray-500 mt-2">{details.description}</p>
        </div>

        <div className="flex gap-3">
          {details.category && (
            <span className="px-4 py-1 bg-[#B38471] text-white rounded-full text-sm capitalize">
              {details.category.replace("_", " ")}
            </span>
          )}

          {details.district && (
            <span className="px-4 py-1 bg-gray-100 rounded-full text-sm">
              {details.district}
            </span>
          )}
        </div>

        <div className="flex justify-end gap-3">
          <button
            onClick={() => setShowComments(!showComments)}
            className="p-3 rounded-full bg-purple-100"
          >
            <ChatBubbleBottomCenterIcon className="w-5 h-5" />
          </button>

          <button className=" flex items-center p-3 rounded-full bg-pink-100">
            <HeartIcon
              className="w-5 h-5 text-red-500"
              onClick={() => handlePostLike(details._id)}
            />
            <span className="text-sm text-red-500">
              {" "}
              {details.likes.length}
            </span>
          </button>
          <button
            className="  flex items-center p-3 rounded-full bg-yellow-100"
            onClick={() => handlePostSave(details._id)}
          >
            <BookmarkIcon className="w-5 h-5 text-yellow-500" />
            <span className="text-sm text-yellow-500">
              {" "}
              {details.savedBy.length || 0}
            </span>
          </button>
        </div>

        {showComments && (
          <div className="mt-4">
            <div className="space-y-2 max-h-40 overflow-y-auto mb-3">
              {comments.length === 0 ? (
                <p className="text-gray-400 text-sm italic">Henüz yorum yok</p>
              ) : (
                comments.map((comment) => (
                  <div key={comment._id} className="mb-3">
                    <div className="flex items-start gap-3">
                      <img
                        src={
                          comment?.user?.profileImage ||
                          "https://i.pravatar.cc/150"
                        }
                        alt="profile"
                        className="w-8 h-8 rounded-full object-cover"
                      />

                      <div className="flex flex-col w-full">
                        <div className="flex justify-between">
                          <p className="text-sm font-semibold">
                            {comment?.user?.name} {comment?.user?.surname}
                          </p>
                          <p className="text-right text-sm">
                            {user?.id === comment?.user?._id && (
                              <button onClick={() => handleDelete(comment._id)}>
                                <XMarkIcon className="w-4 h-4 text-gray-400 hover:text-red-500 cursor-pointer transition" />
                              </button>
                            )}
                          </p>
                        </div>

                        <p className="text-sm text-gray-600">{comment.text}</p>
                        <div className="flex gap-2">
                          {comment.likes?.length > 0 && (
                            <div className="flex items-center mt-2">
                              <div className="flex -space-x-2">
                                {comment.likes.slice(0, 10).map((user) => (
                                  <img
                                    key={user._id}
                                    src={
                                      user.profileImage ||
                                      "https://i.pravatar.cc/150"
                                    }
                                    className="w-6 h-6 rounded-full object-cover border-2 border-white"
                                    alt="like-user"
                                  />
                                ))}

                                {comment.likes.length > 10 && (
                                  <div className="w-6 h-6 rounded-full bg-gray-300 text-xs flex items-center justify-center border-2 border-white">
                                    +{comment.likes.length - 10}
                                  </div>
                                )}
                              </div>
                            </div>
                          )}

                          <button
                            onClick={() => handleLike(comment._id)}
                            className="text-left"
                          >
                            <span className="underline text-xs">
                              {comment?.liked ? "Beğenmekten Vazgeç" : "Beğen"}
                            </span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            <div className="flex space-x-2">
              <input
                type="text"
                placeholder="Yorum yap..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                className="flex-1 border rounded-full px-3 py-2 text-sm"
              />

              <button
                onClick={() => handleAddComment(details._id)}
                className="bg-[rgb(137,205,251)] text-white p-2 rounded-full"
              >
                <ArrowRightIcon className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
