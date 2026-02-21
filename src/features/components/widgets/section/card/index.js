import {
  HeartIcon,
  BookmarkIcon,
  ChatBubbleBottomCenterIcon,
  ArrowRightIcon,
  UserPlusIcon,
  TrashIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";

import { Link } from "react-router-dom";

export default function Card({
  data = [],
  loading,
  user,
  followId,
  selected,
  handleShowed,
  handlePostLike,
  handleDelete,
  deleted,
  handlePostSave,
  handleCommentLike,
  comments = [],
  newComment,
  setNewComment,
  handleAddComment,
}) {
  if (loading) {
    return <p className="text-center text-gray-500">Loading...</p>;
  }

  if (!data.length) {
    return (
      <p className="text-center text-gray-400 mt-10">
        Gönderi bulunamadı
      </p>
    );
  }

  return (
    <>
      {data.map((item) => {
        const isOwner = user?.id !== item?.user?._id;
        const hasUser = item?.user;

        return (
          <div key={item._id} className="mb-6">

            <div className="w-full max-w-md bg-white rounded-2xl shadow-md">
              <Link to={`/detay/${item._id}`}>
                <img
                  className="w-full h-60 object-cover rounded-t-2xl"
                  src={item.images?.[0] || "https://via.placeholder.com/400"}
                  alt="Post"
                />
              </Link>

              <div className="p-5">
           
                <div className="flex items-center mb-4">
                  <img
                    className="w-12 h-12 rounded-full border object-cover"
                    src={
                      item.profileImage ||
                      "https://i.pravatar.cc/150"
                    }
                    alt="Profile"
                  />

                  <div className="ml-3 flex-1">
                    <p className="text-sm font-semibold flex justify-between">
                      <span>
                        {item.ownerName} {item.ownerSurname}
                      </span>
                      <span className="text-xs text-[rgb(137,205,251)]">
                        {item.ownerRole}
                      </span>
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                      {item.title}
                    </p>
                  </div>
                </div>

                <p className="text-sm text-gray-600 mb-4">
                  {item.description}
                </p>

     
                <div className="flex justify-between items-center border-t pt-3 text-gray-600">
                  <div className="flex space-x-4">
                    <button
                      onClick={() => handleShowed(item._id)}
                      className="hover:text-blue-500 transition"
                    >
                      <ChatBubbleBottomCenterIcon className="w-5 h-5" />
                    </button>

                    <button
                      className="flex items-center space-x-1 hover:text-red-600 transition"
                      onClick={() => handlePostLike(item._id)}
                    >
                      <HeartIcon className="w-5 h-5" />
                      <span className="text-sm">
                        {item.likes?.length || 0}
                      </span>
                    </button>

                    <button
                      className="flex items-center hover:text-green-600 transition"
                      onClick={() => handlePostSave(item._id)}
                    >
                      <BookmarkIcon className="w-5 h-5" />
                      <span className="text-sm">
                        {item.savedBy?.length || 0}
                      </span>
                    </button>
                  </div>

                  <div className="flex space-x-3">

                    {!isOwner && hasUser && (
                      <button
                        onClick={() => followId(item?.user._id)}
                      >
                        <UserPlusIcon className="w-5 h-5 hover:text-green-500 cursor-pointer" />
                      </button>
                    )}

        
                    {isOwner && (
                      <button
                        onClick={() => deleted(item._id)}
                      >
                        <TrashIcon className="w-5 h-5 hover:text-yellow-500 cursor-pointer" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>


            {selected === item._id && (
              <div className="mt-2 bg-white rounded-2xl shadow-md p-4 max-w-md">
                <div className="space-y-3 max-h-48 overflow-y-auto mb-3">
                  {comments.length === 0 ? (
                    <p className="text-gray-400 text-sm italic">
                      Henüz yorum yok
                    </p>
                  ) : (
                    comments.map((comment) => {
                      const isCommentOwner =
                        user?.id === comment?.user?._id;

                      return (
                        <div key={comment._id}>
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
                                  {comment?.user?.name}{" "}
                                  {comment?.user?.surname}
                                </p>

                                {isCommentOwner && (
                                  <button
                                    onClick={() =>
                                      handleDelete(comment._id)
                                    }
                                  >
                                    <XMarkIcon className="w-4 h-4 text-gray-400 hover:text-red-500 cursor-pointer transition" />
                                  </button>
                                )}
                              </div>

                              <p className="text-sm text-gray-600">
                                {comment.text}
                              </p>

                              <div className="flex gap-3 mt-1">
                                <button
                                  onClick={() =>
                                    handleCommentLike(comment._id)
                                  }
                                  className="text-xs underline"
                                >
                                  {comment?.liked
                                    ? "Beğenmekten Vazgeç"
                                    : "Beğen"}
                                </button>

                                <span className="text-xs text-gray-400">
                                  {comment?.likes?.length || 0} beğeni
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>


                <div className="flex space-x-2">
                  <input
                    type="text"
                    placeholder="Yorum yap..."
                    value={newComment}
                    onChange={(e) =>
                      setNewComment(e.target.value)
                    }
                    className="flex-1 border rounded-full px-3 py-2 text-sm"
                  />

                  <button
                    onClick={() =>
                      handleAddComment(item._id)
                    }
                    className="bg-[rgb(137,205,251)] text-white p-2 rounded-full"
                  >
                    <ArrowRightIcon className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </div>
        );
      })}
    </>
  );
}
