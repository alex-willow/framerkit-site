// src/components/SimpleAvatarGroup.tsx
import { useState } from "react";

interface SimpleAvatarGroupProps {
  size?: number;       // размер аватара в px
  overlap?: number;    // на сколько пикселей каждый аватар накладывается на следующий
}

export default function SimpleAvatarGroup({
  size = 40,
  overlap = 8, // по умолчанию накладываем на 8px
}: SimpleAvatarGroupProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const avatars = [
    { src: "https://storage.googleapis.com/framerkit/heroavatar1.jpg", alt: "User 1" },
    { src: "https://storage.googleapis.com/framerkit/heroavatar2.jpg", alt: "User 2" },
    { src: "https://storage.googleapis.com/framerkit/heroavatar3.jpg", alt: "User 3" },
    { src: "https://storage.googleapis.com/framerkit/heroavatar4.jpg", alt: "User 4" },
    { src: "https://storage.googleapis.com/framerkit/heroavatar5.jpg", alt: "User 5" },
  ];
  

  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
      {avatars.map((avatar, index) => (
        <div
          key={index}
          // Накладываем: все, кроме последнего, сдвигаются влево
          style={{
            width: size,
            height: size,
            borderRadius: "50%",
            border: "2px solid #fff",
            boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
            overflow: "hidden",
            backgroundColor: "#f5f5f5",
            transform: hoveredIndex === index ? "translateY(-4px) scale(1.05)" : "none",
            transition: "transform 0.2s ease",
            zIndex: hoveredIndex === index ? 10 : 1,
            // Наложение: все аватары, кроме последнего, съезжают влево
            marginRight: index === avatars.length - 1 ? "0" : `-${overlap}px`,
            position: "relative",
          }}
          onMouseEnter={() => setHoveredIndex(index)}
          onMouseLeave={() => setHoveredIndex(null)}
        >
          <img
            src={avatar.src}
            alt={avatar.alt}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              display: "block",
            }}
          />
        </div>
      ))}
    </div>
  );
}