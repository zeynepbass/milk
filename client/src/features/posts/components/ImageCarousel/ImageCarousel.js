import { useState } from "react";
import { toAssetUrl } from "@/shared/config/env";

export function ImageCarousel({ images, title }) {
  const [current, setCurrent] = useState(0);

  if (images.length === 0) return null;

  return (
    <div className="w-full">
      <img
        src={toAssetUrl(images[current])}
        alt={`${title} görsel ${current + 1}`}
        className="w-full h-96 object-cover rounded-xl"
        loading="lazy"
      />

      {images.length > 1 && (
        <div className="flex gap-2 justify-center mt-3" role="group" aria-label="Görsel seçimi">
          {images.map((image, index) => (
            <button
              type="button"
              key={image}
              aria-label={`${index + 1}. görsel`}
              aria-pressed={index === current}
              onClick={() => setCurrent(index)}
              className={`w-3 h-3 rounded-full ${index === current ? "bg-gray-800 dark:bg-yellow-400" : "bg-gray-300"}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
