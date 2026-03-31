import { useState } from "react";
import { ArrowRightIcon } from "@heroicons/react/24/outline";
export function SalesSupport() {
  const [type, setType] = useState("genel");
  const [message, setMessage] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    const payload = {
      type,
      message,
    };

    console.log(payload);
  };

  return (
    <div className="max-w-full mx-auto p-6 bg-white rounded-2xl shadow-md">
      <h2 className="text-xl font-semibold mb-4 text-gray-500">
        Görüş, Öneri veya Hata Bildir!
      </h2>

      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        <div className="flex flex-col gap-2">
          <label className="text-sm text-gray-400">
            Geri bildirim türü
          </label>

          <div className="flex flex-wrap gap-1 ">
            {[
              { label: "Genel", value: "genel" },
              { label: "Hata Bildirimi", value: "hata" },
              { label: "Talep", value: "talep" },
            ].map((item) => (
              <button
                key={item.value}
                type="button"
                onClick={() => setType(item.value)}
                className={`px-4 py-2 rounded-full border transition-all text-sm bg-[rgb(137,205,251)] text-gray-500
                  ${
                    type === item.value
                      ? "opacity-100"
                      : "bg-[rgb(242,246,248)]"
                  }
                `}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-sm text-gray-400">
            Mesaj
          </label>

          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            rows={5}
            placeholder="Mesajınızı yazın..."
            className="w-full p-3 rounded-lg border border-gray-300 bg-transparent focus:outline-none focus:ring-2 focus:ring-[rgb(137,205,251)]"
          />
        </div>

        <div className="flex justify-end mt-2">
          <button
            type="submit"
            className="bg-[rgb(137,205,251)] text-white p-3 rounded-full"
          >
            <ArrowRightIcon className="w-4 h-4" />
          </button>
        </div>
      </form>
    </div>
  );
}