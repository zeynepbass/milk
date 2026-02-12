import { useState } from "react";
import {
  HeartIcon,
  BookmarkIcon,
  ChatBubbleBottomCenterIcon,
  ArrowRightIcon,
  TrashIcon,
  UserPlusIcon
} from "@heroicons/react/24/outline";
import { Link } from "react-router-dom";
export default function Card() {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [showComments, setShowComments] = useState(false);

  const handleAddComment = () => {
    if (newComment.trim() === "") return;
    setComments([...comments, newComment]);
    setNewComment("");
  };

  return (
    <div className="h-[800px] overflow-y-auto">

        <div className="max-w-sm bg-white shadow-lg rounded-xl overflow-hidden m-4 hover:shadow-xl transition-shadow duration-300">
        <Link to="/detay"> <img
            className="w-full h-56 object-cover"
            src="https://www.butikkahvalti.com/images/urunler/Keci-Tereyag-resim-371.jpg"
            alt="Card image"
          /></Link>

          <div className="p-5">
            <div className="flex items-center mb-3">
              <img
                className="w-12 h-12 rounded-full border-2 border-gray-200 mr-4"
                src="https://via.placeholder.com/40"
                alt="Profile"
              />
              <div className="flex-1">
                <h2 className="font-semibold text-gray-700 text-lg">
                  Ad Soyad
                </h2>
                <p className="text-gray-500 text-sm ">Kategori</p>
              </div>
            </div>

            <div className="flex justify-end space-x-4 mb-3 text-gray-600">
              <button
                onClick={() => setShowComments(!showComments)}
                className="flex items-center space-x-1  rounded-full hover:bg-gray-100 transition"
              >
                <ChatBubbleBottomCenterIcon className="w-5 h-5" />
              </button>

              <button className="flex items-center justify-center  rounded-full hover:bg-red-100 transition">
                <HeartIcon className="w-5 h-5 text-red-500" />
              </button>

              <button className="flex items-center justify-center  rounded-full hover:bg-blue-100 transition">
                <BookmarkIcon className="w-5 h-5 text-blue-500" />
              </button>
              <button className="flex items-center justify-center  rounded-full hover:bg-gray-300 transition">
              <UserPlusIcon className="w-6 h-6 text-gray-500 hover:text-gray-600 transition cursor-pointer" />
            
     
              </button>
              <button className="flex items-center justify-center  rounded-full hover:bg-[#B38471] transition">
              <TrashIcon className="w-6 h-6 text-yellow-500" />

              </button>
            </div>

            {showComments && (
              <div className="mt-4">
                <div className="space-y-2 mb-3 max-h-[300px] overflow-y-auto px-2 scrollbar-thin scrollbar-thumb-blue-500 scrollbar-track-blue-100">
                  {comments.length === 0 && (
                    <p className="text-gray-400 text-sm italic">
                      Henüz yorum yok
                    </p>
                  )}
                  {comments.map((comment, index) => (
                    <div
                      key={index}
                      className="bg-gray-100 p-2 rounded text-gray-700 text-sm"
                    >
                      {comment}
                    </div>
                  ))}
                </div>

                <div className="flex space-x-2">
                  <input
                    type="text"
                    placeholder="Yorum yap..."
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    className="flex-1 border border-gray-300 rounded-full px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-400"
                  />
                  <button
                    onClick={handleAddComment}
                    className="bg-[rgb(137,205,251)]
hover:bg-gray-200 text-white px-4 py-2 rounded-full shadow-md font-medium transition"
                  >
                    <ArrowRightIcon className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>{" "}

    </div>
  );
}
