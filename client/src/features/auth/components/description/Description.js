import { useState } from "react";
import { Button } from "@/shared/components/atoms";
export function Description({ text, maxLength = 150 }) {
  const [expanded, setExpanded] = useState(false);

  if (!text) return null;

  const isLong = text.length > maxLength;

  const displayText =
    expanded || !isLong
      ? text
      : `${text.slice(0, maxLength)}...`;

  return (
    <p className="mb-4 text-sm text-gray-600 dark:text-gray-200">
      {displayText}{" "}
      {isLong && (
        
<Button
  type="button"
  onClick={() => setExpanded((prev) => !prev)}
  variant="primary"

>
  {expanded ? "Gizle" : "Devamını Gör"}
</Button>
      )}
    </p>
  );
}