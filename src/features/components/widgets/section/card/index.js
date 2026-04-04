import {
  HeartIcon,
  BookmarkIcon,
  ChatBubbleBottomCenterIcon,
  ArrowRightIcon,
  ChatBubbleLeftRightIcon,
  UserPlusIcon,
  TrashIcon,
  XMarkIcon,
  PencilIcon,
} from "@heroicons/react/24/outline";
import { CheckBadgeIcon } from "@heroicons/react/24/solid";
import { UpdatedPostForm } from "../../profile/UpdatedPostForm";
import Description from "../../profile/Description";
import { Link } from "react-router-dom";

export default function Card({
  data = [],
  open,
  setOpen,
  favoruite,

  profileForm,
  followId,
  selected,
  setEditPostId,
  editPostId,
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
  navigate,
}) {
  const handeleUpdated = (id) => {
    setOpen(true);
    setEditPostId(id);
  };

  const handleClick = (item) => {
    const minimalProduct = {
      productId: item._id,
      name: item.description,
      userId: item.user._id,
    };
    localStorage.setItem("product", JSON.stringify(minimalProduct));
    navigate("/mesajlar");
  };
  return (
    <>
      {data.map((item) => {
        const postUserId = (item?.user?._id || item?.user) === profileForm?._id;

        return (
          <div
            key={item._id}
            className="flex flex-col bg-white rounded-2xl shadow-md w-full "
          >
            <Link to={`/detay/${item._id}`}>
              <img
                className="w-full h-60 object-cover rounded-t-2xl"
                src={item?.images[0] || "/images/logo.png"}
                alt="Post"
              />
            </Link>

            <div className="p-5 flex flex-col justify-between h-full">
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-full overflow-hidden shadow relative">
                    <img
                      src={
                        item.user?.avatar ||
                        item.image ||
                        "https://cdn-icons-png.flaticon.com/512/9131/9131478.png"
                      }
                      alt="profile"
                      className="w-full h-full object-cover"
                    />

                    {item.user?.dogrulanmisSatici && (
                      <CheckBadgeIcon className="w-4 h-4 text-blue-500 absolute -top-1 -right-1 bg-white rounded-full" />
                    )}
                  </div>

                  <div className="flex-1">
                    <div className="flex justify-between items-center">
                      <p className="text-sm font-semibold">
                        {item.ownerName} {item.ownerSurname}
                      </p>

                      <span className="text-xs text-[rgb(137,205,251)]">
                        {item.ownerRole}
                      </span>
                    </div>

                    <p className="text-xs text-gray-400 mt-1 line-clamp-1">
                      {item.title}
                    </p>
                  </div>
                </div>

                <Description text={item.description} maxLength={150} />
              </div>

              <div className="flex justify-between items-center border-t pt-4 mt-4 text-gray-600">
                <div className="flex items-center gap-5">
                  <button
                    onClick={() => handleShowed(item._id)}
                    className="hover:text-blue-500 transition"
                  >
                    <ChatBubbleBottomCenterIcon className="w-5 h-5" />
                  </button>

                  <button
                    onClick={() => handlePostLike(item._id)}
                    className="flex items-center gap-1 hover:text-red-500 transition"
                  >
                    <HeartIcon className="w-5 h-5" />
                    <span className="text-sm">{item.likes?.length || 0}</span>
                  </button>

                  <button
                    onClick={() => handlePostSave(item._id)}
                    className="flex items-center gap-1 hover:text-green-500 transition"
                  >
                    {!postUserId && (
                      <>
                        <BookmarkIcon
                          className={`w-5 h-5 ${
                            favoruite ? "text-red-500" : ""
                          }`}
                        />
                        <span
                          className={`text-sm ${
                            favoruite ? "text-red-500" : ""
                          }`}
                        >
                          {item.savedBy?.length || 0}
                        </span>
                      </>
                    )}
                  </button>
                </div>

                <div className="flex items-center gap-3">
                  {!postUserId && (
                    <>
                      <button onClick={() => followId(item.user?._id)}>
                        <UserPlusIcon className="w-5 h-5 hover:text-green-500 cursor-pointer transition" />
                      </button>

                      <button onClick={() => handleClick(item)}>
                        <ChatBubbleLeftRightIcon className="w-5 h-5 text-[rgb(137,205,251)] cursor-pointer hover:scale-110 transition" />
                      </button>
                    </>
                  )}

                  {postUserId && (
                    <>
                      <button onClick={() => deleted(item._id)}>
                        <TrashIcon className="w-5 h-5 hover:text-red-500 cursor-pointer transition" />
                      </button>

                      <button onClick={() => handeleUpdated(item._id)}>
                        <PencilIcon className="w-5 h-5 hover:text-yellow-500 cursor-pointer transition" />
                      </button>
                    </>
                  )}
                </div>

                {open && (
                  <div className="fixed inset-0 flex items-center justify-center bg-black/30 backdrop-blur-sm z-50">
                    <div className="bg-white p-6 rounded-2xl shadow-xl w-full max-w-md">
                      <UpdatedPostForm
                        editPostId={editPostId}
                        setOpen={setOpen}
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>

            {selected === item._id && (
              <div className="mt-3 bg-white rounded-2xl shadow-sm border p-4 max-w-md">
                <div className="space-y-4 max-h-60 overflow-y-auto mb-4 pr-1">
                  {comments.length === 0 ? (
                    <p className="text-gray-400 text-sm italic text-center py-4">
                      Henüz yorum yok
                    </p>
                  ) : (
                    comments.map((comment) => {
                      const isCommentOwner =
                        profileForm?._id === comment?.user?._id;

                      return (
                        <div key={comment._id} className="flex gap-3">
                          <img
                            src={
                              comment?.user?.profileImage ||
                              "https://i.pravatar.cc/150"
                            }
                            alt="profile"
                            className="w-9 h-9 rounded-full object-cover shadow-sm"
                          />

                          <div className="flex flex-col w-full">
                            <div className="flex justify-between items-center">
                              <p className="text-sm font-semibold">
                                {comment?.user?.name} {comment?.user?.surname}
                              </p>

                              {isCommentOwner && (
                                <button
                                  onClick={() => handleDelete(comment._id)}
                                  className="hover:bg-gray-100 p-1 rounded-full transition"
                                >
                                  <XMarkIcon className="w-4 h-4 text-gray-400 hover:text-red-500 transition" />
                                </button>
                              )}
                            </div>

                            <p className="text-sm text-gray-600 mt-1">
                              {comment.text}
                            </p>

                            <div className="flex items-center gap-4 mt-2">
                              <button
                                onClick={() => handleCommentLike(comment._id)}
                                className="text-xs text-blue-500 hover:underline transition"
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
                      );
                    })
                  )}
                </div>

                <div className="flex items-center gap-2 border-t pt-3">
                  <input
                    type="text"
                    placeholder="Yorum yap..."
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    className="flex-1 border rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[rgb(137,205,251)] transition"
                  />

                  <button
                    onClick={() => handleAddComment(item._id)}
                    className="bg-[rgb(137,205,251)] hover:opacity-90 text-white p-2 rounded-full transition"
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
