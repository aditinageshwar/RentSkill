import React, { useState, useEffect } from "react";

const ChukBhookParagraph = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [color, setColor] = useState("text-red-500"); // Default color is red

  useEffect(() => {
    // Toggle visibility and change color every 2 seconds
    const interval = setInterval(() => {
      setIsVisible((prev) => !prev);

      // Change color in the order of red -> green -> blue
      setColor((prevColor) => {
        if (prevColor === "text-red-500") return "text-green-500";
        if (prevColor === "text-green-500") return "text-blue-500";
        return "text-red-500";
      });
    }, 2000);

    // Cleanup on component unmount
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="text-center">
      <div
        className={`text-lg p-4 rounded shadow transition-opacity duration-1000 ${color} ${
          isVisible ? "opacity-100" : "opacity-0"
        }`}
      >
        This text changes colors and appears/disappears automatically!
      </div>
    </div>
  );
};

export default ChukBhookParagraph;
