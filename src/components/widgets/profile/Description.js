import { useState } from "react";

export default function Description({ text, maxLength }) {
  const [expanded, setExpanded] = useState(false);

  if (!text) return null;

  const isLong = text.length > maxLength;
  const displayText = expanded || !isLong ? text : text.slice(0, maxLength) + "...";

  return (
    <p className="text-sm text-gray-600 mb-4 dark:text-gray-200">
      {displayText}{" "}
      {isLong && (
        <span
          onClick={() => setExpanded(!expanded)}
          className="text-blue-500 cursor-pointer hover:underline"
        >
          {expanded ? "Gizle" : "Devamını Gör"}
        </span>
      )}
    </p>
  );
}