const formatTime = (value) =>
  new Date(value).toLocaleTimeString("tr-TR", { hour: "2-digit", minute: "2-digit" });

const deliveryLabel = (message) => {
  if (message.pending) return "Gönderiliyor";
  return message.readAt ? "Okundu" : "Gönderildi";
};

export function MessageBubble({ message, isMine }) {
  return (
    <li className={`flex ${isMine ? "justify-end" : "justify-start"}`}>
      <div
        className={`px-4 py-2 rounded-2xl max-w-xs text-sm shadow break-words ${
          isMine
            ? "bg-blue-500 dark:bg-yellow-500 text-white rounded-br-none"
            : "bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-bl-none"
        } ${message.pending ? "opacity-70" : ""}`}
      >
        <p>{message.text}</p>
        <p className={`text-[10px] mt-1 text-right ${isMine ? "text-white/80" : "text-gray-500"}`}>
          {formatTime(message.createdAt)}
          {isMine && <span> · {deliveryLabel(message)}</span>}
        </p>
      </div>
    </li>
  );
}
