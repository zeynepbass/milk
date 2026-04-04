import { useState } from "react";
import { ArrowRightIcon } from "@heroicons/react/24/outline";

export function SalesSupport() {
  const [type, setType] = useState("genel");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!message.trim()) return;

    setLoading(true);

    const payload = {
      type,
      message,
    };

    try {
      console.log(payload);
    } finally {
      setLoading(false);
    }
  };

  const types = [
    { label: "Genel", value: "genel" },
    { label: "Hata Bildirimi", value: "hata" },
    { label: "Talep", value: "talep" },
  ];

  return (
    <div className="max-w-full mx-auto p-6 bg-white rounded-2xl shadow-lg border space-y-6">
      <div>
      <h3 className="text-md font-semibold text-gray-700 mb-2">
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
                      ? "bg-blue-500 text-white border-blue-500 shadow"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
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
            className="w-full p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-300 resize-none"
          />
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={!message.trim() || loading}
            className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white px-5 py-2 rounded-full disabled:opacity-50 disabled:cursor-not-allowed transition"
          >
            {loading ?  "Gönderiliyor..." :  <ArrowRightIcon className="w-4 h-4" />}
          </button>
        </div>
      </form>
    </div>
  );
}
