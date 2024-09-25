"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { images } from "@/store/constants";
import { ChevronLeft, ChevronRight } from "lucide-react";

const Slider = () => {
  const [activeImage, setActiveImage] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  const clickNext = () => {
    setActiveImage((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  const clickPrev = () => {
    setActiveImage((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  useEffect(() => {
    if (!isHovered) {
      const timer = setInterval(() => {
        clickNext();
      }, 5000);
      return () => {
        clearInterval(timer);
      };
    }
  }, [isHovered]);

  return (
    <div
      className="relative w-full mx-auto max-w-5xl mt-4"
      onMouseOver={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative h-[80vh] overflow-hidden">
        {images.map((elem, idx) => (
          <div
            key={idx}
            className={`absolute top-0 left-0 w-full h-full transition-opacity duration-500 ${
              idx === activeImage ? "opacity-100" : "opacity-0"
            }`}
          >
            <Image
              src={elem.src}
              alt={`Slider Image ${idx + 1}`}
              layout="fill"
              objectFit="cover"
              className="rounded-xl transition-all duration-500 ease-in-out"
            />
          </div>
        ))}
        <button
          onClick={clickPrev}
          className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white rounded-full p-2 shadow-lg"
        >
          <ChevronLeft className="text-gray-400" />
        </button>
        <button
          onClick={clickNext}
          className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white rounded-full p-2 shadow-lg"
        >
          <ChevronRight className="text-gray-400" />
        </button>
      </div>
      <div className="flex justify-center mt-4">
        {images.map((_, index) => (
          <div
            key={index}
            className={`h-1 w-10 mx-1 ${
              index === activeImage
                ? "bg-[#beff46] rounded-xl"
                : "bg-gray-300 rounded-xl"
            } transition-all duration-500 ease-in-out`}
          ></div>
        ))}
      </div>
    </div>
  );
};

export default Slider;
