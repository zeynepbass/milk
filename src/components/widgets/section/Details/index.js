import { useState } from "react";
import posts from "./test.json";
import {
  HeartIcon,
  BookmarkIcon,
  ChatBubbleBottomCenterIcon,
  ArrowRightIcon,
} from "@heroicons/react/24/outline";
export function Detail() {
  const [post] = useState(posts);

  const [currentImage, setCurrentImage] = useState(0);

  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [showComments, setShowComments] = useState(false);

  const nextImage = () => setCurrentImage((prev) => (prev + 1) % post.images.length);
  const prevImage = () => setCurrentImage((prev) => (prev - 1 + post.images.length) % post.images.length);

  const handleAddComment = () => {
    if (newComment.trim() === "") return;
    setComments([...comments, newComment]);
    setNewComment("");
  };

  return (
    <div className="max-w-full  p-6">
      <div className=" overflow-hidden duration-300">


        {post.images.length > 0 && (
          <div className="relative w-full h-96">
            <img
              src={post.images[currentImage]}
              alt={post.title}
              className="w-full h-full object-cover"
            />
            <button
              onClick={prevImage}
              className="absolute top-1/2 left-3 -translate-y-1/2 bg-white/70 rounded-full p-2 hover:bg-white transition"
            >
              <ArrowRightIcon className="w-6 h-6 rotate-180 text-gray-700" />
            </button>
            <button
              onClick={nextImage}
              className="absolute top-1/2 right-3 -translate-y-1/2 bg-white/70 rounded-full p-2 hover:bg-white transition"
            >
              <ArrowRightIcon className="w-6 h-6 text-gray-700" />
            </button>
          </div>
        )}


        <div className="p-6 space-y-5">


          <div className="flex items-center space-x-4">
            <div className="bg-gray-200 w-14 h-14 rounded-full flex items-center justify-center text-gray-700 font-semibold shadow-sm text-lg">
              {post.ownerName[0]}{post.ownerSurname[0]}
            </div>
            <div>
              <p className="font-bold text-gray-600 text-lg">{post.ownerName} {post.ownerSurname}</p>
              <p className="text-gray-400 text-sm capitalize">{post.ownerRole}</p>
            </div>
          </div>


          <div>
            <h1 className="text-3xl font-bold text-gray-600">{post.title}</h1>
            <p className="text-gray-500 mt-2 text-lg">{post.description}</p>
          </div>


          <div className="flex flex-wrap gap-3">
            <span className="px-4 py-1 bg-[#B38471] text-white rounded-full text-sm font-medium capitalize">
              {post.category.replace("_", " ")}
            </span>
            {post.district && (
              <span className="px-4 py-1 bg-gray-100 text-gray-700 rounded-full text-sm font-medium">
                {post.district}
              </span>
            )}
          </div>


          <div className="flex flex-wrap justify-end gap-3 mb-3">
            <button
              onClick={() => setShowComments(!showComments)}
              className="flex items-center space-x-2 px-4 py-2 shadow-sm rounded-full bg-purple-100 text-purple-700 hover:bg-purple-200 transition"
            >
                <ChatBubbleBottomCenterIcon className="w-5 h-5" />
            </button>
            <button className="flex items-center justify-center  shadow-sm px-4 py-2 rounded-full bg-pink-100 text-pink-600 hover:bg-pink-200 transition">
            <HeartIcon className="w-5 h-5 text-red-500" />
            </button>
            <button className="flex items-center justify-center shadow-sm px-4 py-2 rounded-full bg-[#FFFBEB] text-[#FBBF24] hover:bg-yellow-200 transition">
            <BookmarkIcon className="w-5 h-5 text-yellow-500 " />
            </button>
            <button className="flex items-center justify-center shadow-sm px-4 py-2 rounded-full bg-green-100 text-green-700 hover:bg-green-200 transition">
            <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke-width="1.5"
                  stroke="currentColor"
                  className="size-6"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M18 7.5v3m0 0v3m0-3h3m-3 0h-3m-2.25-4.125a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0ZM3 19.235v-.11a6.375 6.375 0 0 1 12.75 0v.109A12.318 12.318 0 0 1 9.374 21c-2.331 0-4.512-.645-6.374-1.766Z"
                  />
                </svg>
            </button>
          </div>


          {showComments && (
            <div className="mt-4">
              <div className="space-y-2 mb-3 max-h-64 overflow-y-auto px-2 scrollbar-thin scrollbar-thumb-blue-500 scrollbar-track-blue-100">
                {comments.length === 0 && (
                  <p className="text-gray-400 text-sm italic">Henüz yorum yok</p>
                )}
                {comments.map((comment, index) => (
                  <div key={index} className="bg-gray-100 p-2 rounded text-gray-700 text-sm">
                    {comment}
                  </div>
                ))}
              </div>

              <div className="flex space-x-2 mt-2">
                <input
                  type="text"
                  placeholder="Yorum yap..."
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  className="flex-1 border border-gray-300 rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-400"
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
      </div>
    </div>
  );
}
