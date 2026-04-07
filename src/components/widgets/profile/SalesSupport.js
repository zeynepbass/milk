import { useState } from "react";
import { ArrowRightIcon } from "@heroicons/react/24/outline";
import usePost from "@/features/hooks/feed/user/useUserPost"
export function SalesSupport() {
  const {onSubmitFeedback,feedback} = usePost();
  const [type, setType] = useState("genel");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (!message.trim()) return;

    const payload = {
      type,
      message,
    };

    await onSubmitFeedback(payload);
    setMessage("");
    setType("genel");
  };

  const types = [
    { label: "Genel", value: "genel" },
    { label: "Hata Bildirimi", value: "hata" },
    { label: "Talep", value: "talep" },
  ];

  return (
    <div className="max-w-full mx-auto p-6 bg-white dark:border-gray-400 dark:bg-gray-800 rounded-2xl shadow-lg border space-y-6">
      <div>
      <h3 className="text-md font-semibold text-gray-700 mb-2 dark:text-gray-400 ">
          Görüş, Öneri veya Hata Bildir
        </h3>
        <p className="text-gray-400 text-sm mb-4">
          Geri bildirimleriniz bizim için değerlidir.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-6">
        <div className="flex flex-col gap-2">
          <label className="text-sm text-gray-500">Geri bildirim türü</label>

          <div className="flex flex-wrap gap-2">
            {types.map((item) => (
              <button
                key={item.value}
                type="button"
                onClick={() => setType(item.value)}
                className={`px-4 py-1 rounded-full border text-sm transition-all
                  ${
                    type === item.value
                    ? "bg-gray-100 text-gray-600 dark:text-gray-200 hover:bg-gray-200 dark:bg-gray-900 dark:bg-opacity-5"
                      : "bg-blue-500 text-white  dark:text-gray-400  dark:bg-gray-900  dark:border-gray-500 border-blue-500 shadow"

                  }
                `}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-sm text-gray-500">Mesaj</label>

          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            rows={5}
            placeholder="Mesajınızı yazın..."
            className="w-full p-3 rounded-lg border dark:bg-gray-700 border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-300 resize-none"
          />
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={!message || !type || feedback}
           className=" bg-[rgb(82,144,246)] dark:bg-gray-900 hover:opacity-90 text-white gap-2 px-5 py-2 rounded-full  transition disabled:cursor-not-allowed"

          >
            {feedback ?  "Gönderiliyor..." :  <ArrowRightIcon className="w-4 h-4" />}
          </button>
        </div>
      </form>
    </div>
  );
}
