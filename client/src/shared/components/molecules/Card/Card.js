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
  CheckBadgeIcon,
} from "@heroicons/react/24/outline";

import { Description } from "@/features/auth/components";
import { Button, Input } from "@/shared/components/atoms";
import { Link } from "react-router-dom";
import { Suspense, lazy } from "react";
const UpdatedPostForm = lazy(() =>
  import("@/features/auth/components").then((module) => ({
    default: module.UpdatedPostForm,
  }))
);
export function Card({
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
          <div key={item._id} className="flex flex-col">
            <div className="flex flex-col bg-white dark:bg-gray-700 rounded-2xl rounded-b-none shadow-md w-full mt-4">
              <Link to={`/detay/${item._id}`}>
                <img
                  className="w-full h-60 object-cover rounded-t-2xl"
                  src={
                    item?.images?.[0]
                      ? `http://localhost:5346${item.images[0]}`
                      : "/assets/logo.png"
                  }
                  alt="Post"
                  loading="lazy"
                />
              </Link>

              <div className="p-5 flex flex-col justify-between h-full">
                <div>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-full overflow-hidden shadow relative">
                      <img
                        src={
                          item.user?.avatar ||
                          item?.image ||
                          "https://cdn-icons-png.flaticon.com/512/9131/9131478.png"
                        }
                        alt="profile"
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />

                      {item.user?.dogrulanmisSatici && (
                        <CheckBadgeIcon className="w-4 h-4 text-blue-500 absolute -top-1 -right-1 bg-white rounded-full" />
                      )}
                    </div>

                    <div className="flex-1">
                      <div className="flex justify-between items-center">
                        <p className="text-sm font-semibold dark:text-gray-400">
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
                  <div className="flex items-center">
                    <Button
                      variant="icon"
                      onClick={() => handleShowed(item._id)}
                      className="flex items-center  dark:text-gray-400 hover:text-red-500"
                    >
                      <ChatBubbleBottomCenterIcon className="w-5 h-5 transition hover:scale-110" />
                    </Button>

                    <Button
                      variant="icon"
                      onClick={() => handlePostLike(item._id)}
                      className="flex items-center  dark:text-gray-400 hover:text-red-500"
                    >
                      <HeartIcon className="w-5 h-5" />

                      <span className="text-sm">{item.likes?.length || 0}</span>
                    </Button>

                    {!postUserId && (
                      <Button
                        variant="icon"
                        onClick={() => handlePostSave(item._id)}
                        className={`flex items-center dark:text-gray-400 ${
                          favoruite ? "text-red-500" : ""
                        }`}
                      >
                        <BookmarkIcon className="w-5 h-5" />

                        <span className="text-sm">
                          {item.savedBy?.length || 0}
                        </span>
                      </Button>
                    )}
                  </div>

                  <div className="flex items-center">
                    {!postUserId && (
                      <>
                        <Button
                          variant="icon"
                          onClick={() => followId(item.user?._id)}
                          className="dark:text-gray-400 hover:text-green-500"
                        >
                          <UserPlusIcon className="w-5 h-5" />
                        </Button>

                        <Button
                          variant="icon"
                          onClick={() => handleClick(item)}
                          className="text-[rgb(137,205,251)] dark:text-gray-400 hover:text-blue-400"
                        >
                          <ChatBubbleLeftRightIcon className="w-5 h-5" />
                        </Button>
                      </>
                    )}

                    {postUserId && (
                      <>
                        <Button
                          variant="icon"
                          onClick={() => deleted(item._id)}
                          className="dark:text-gray-400 hover:text-red-500"
                        >
                          <TrashIcon className="w-5 h-5" />
                        </Button>

                        <Button
                          variant="icon"
                          onClick={() => handeleUpdated(item._id)}
                          className="dark:text-gray-400 hover:text-yellow-500"
                        >
                          <PencilIcon className="w-5 h-5" />
                        </Button>
                      </>
                    )}
                  </div>

                  {open && (
                    <div className="fixed inset-0 flex items-center justify-center bg-black/30 backdrop-blur-sm z-50">
                      <div className="bg-white p-6 rounded-2xl shadow-xl w-full max-w-md">
                        <Suspense
                          fallback={
                            <div className="text-white">Yükleniyor...</div>
                          }
                        >
                          <UpdatedPostForm
                            editPostId={editPostId}
                            setOpen={setOpen}
                          />
                        </Suspense>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {selected === item._id && (
              <div className="bg-white rounded-t-none dark:bg-gray-700 dark:border-none rounded-2xl shadow-sm border p-4 max-w-full">
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
                              comment?.user?.avatar ||
                              "https://i.pravatar.cc/150"
                            }
                            alt="profile"
                            loading="lazy"
                            className="w-9 h-9 rounded-full object-cover shadow-sm"
                          />

                          <div className="flex flex-col w-full">
                            <div className="flex justify-between items-center">
                              <p className="text-sm font-semibold">
                                {comment?.user?.name} {comment?.user?.surname}
                              </p>

                              {isCommentOwner && (
                                <Button
                                  variant="icon"
                                  onClick={() => handleDelete(comment._id)}
                                  className="p-1"
                                >
                                  <XMarkIcon className="w-4 h-4 hover:text-red-500" />
                                </Button>
                              )}
                            </div>

                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              {comment.text}
                            </p>

                            <div className="flex items-center gap-4 mt-1">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleCommentLike(comment._id)}
                                className="p-0 text-xs text-blue-500 dark:text-yellow-400 hover:underline"
                              >
                                {comment?.liked
                                  ? "Beğenmekten Vazgeç"
                                  : "Beğen"}
                              </Button>

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
                  <div className="flex-1 min-w-0">
                    <Input
                      type="text"
                      placeholder="Yorum yap..."
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      className="w-full rounded-full dark:bg-gray-900 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[rgb(137,205,251)] transition"
                    />
                  </div>

                  <Button
                    type="button"
                    variant="primary"
                    onClick={() => handleAddComment(item._id)}
                    className="p-3 shrink-0"
                  >
                    <ArrowRightIcon className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            )}
          </div>
        );
      })}
    </>
  );
}
