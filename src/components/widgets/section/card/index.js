import { useState } from "react";
import {
  HeartIcon,
  BookmarkIcon,
  ChatBubbleBottomCenterIcon,
  ArrowRightIcon,
  UserPlusIcon,
  TrashIcon,
  XMarkIcon
} from "@heroicons/react/24/outline";


import { Link } from "react-router-dom";
import usePostAll from "../../../../hooks/post/usePost";
import useCommentAll from "../../../../hooks/post/comments/useComments"
export default function Card() {
  const { data = [], loading, user } = usePostAll();

  return (
    <div className="h-[800px] px-4 py-6">
      {loading && <p className="text-center text-gray-500">Loading...</p>}

      {data.map((item) => (
        <PostItem key={item._id} item={item} currentUser={user} />
      ))}
    </div>
  );
}



function PostItem({ item, currentUser }) {

  const { handleComment, comments } = useCommentAll(item._id);

  const [showComments, setShowComments] = useState(false);
  const [newComment, setNewComment] = useState("");

  const handleAddComment = () => {
    if (!newComment.trim()) return;

    handleComment(newComment);
    setNewComment("");
  };
  return (
    <div className="max-w-md bg-white rounded-2xl shadow-md hover:shadow-xl transition duration-300 mb-8">


      <Link to={`/detay/${item._id}`}>
        <img
          className="w-full h-60 rounded-sm object-cover"
          src={item.images?.[0] || "https://via.placeholder.com/400"}
          alt="Post"
        />
      </Link>


      <div className="p-5">


        <div className="flex items-center mb-4">
          <img
            className="w-12 h-12 rounded-full border object-cover"
            src={item.profileImage || "https://i.pravatar.cc/150"}
            alt="Profile"
          />

          <div className="ml-3 flex-1">
            <p className="text-sm font-semibold flex justify-between">
              <span>{item.ownerName} {item.ownerSurname}</span>
              <span className="text-xs text-[rgb(137,205,251)] ">
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
              onClick={() => setShowComments(!showComments)}
              className="hover:text-blue-500 transition"
            >
              <ChatBubbleBottomCenterIcon className="w-5 h-5" />
            </button>

            <button className="flex items-center space-x-1 hover:text-red-500 transition">
              <HeartIcon className="w-5 h-5" />
              <span className="text-sm">{item.likes?.length || 0}</span>
            </button>

            <button className="hover:text-blue-600 transition">
              <BookmarkIcon className="w-5 h-5" />
            </button>
          </div>

          <div className="flex space-x-3">
     <UserPlusIcon className="w-5 h-5 hover:text-green-500 cursor-pointer" /> 
          
     {currentUser?.user?.id===item.user._id &&   
      <TrashIcon className="w-5 h-5 hover:text-yellow-500 cursor-pointer" />
      }
          </div>
        </div>


        {showComments && (
          <div className="mt-4">
              <div className="space-y-2 max-h-40 overflow-y-auto mb-3">
              {comments.length === 0 ? (
                <p className="text-gray-400 text-sm italic">
                  Henüz yorum yok
                </p>
              ) : (
                comments.map((comment) => (
                  <div key={comment._id} className="mb-3">
                  <div className="flex items-start gap-3">
                
       
                    <img
                      src={comment?.user?.profileImage || "https://i.pravatar.cc/150"}
                      alt="profile"
                      className="w-8 h-8 rounded-full object-cover"
                    />
                
   
                    <div className="flex flex-col w-full">
                      <div className="flex justify-around">
                       <p className="text-sm font-semibold">{comment?.user?.name} {comment?.user?.surname}</p>
                        <p className="text-right text-sm"><span> <XMarkIcon
    
    className="w-4 h-4 text-gray-400 hover:text-red-500 cursor-pointer transition"
  /></span></p>
                      </div>

                      <p className="text-sm text-gray-600">
                        {comment.text}
                      </p>
                   
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
                onClick={handleAddComment}
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
