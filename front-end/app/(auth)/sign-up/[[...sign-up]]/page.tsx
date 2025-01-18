"use client";
import { useState, useEffect } from "react";
import { SignUp } from "@clerk/nextjs";
import Image from "next/image";

export default function Page() {
  // Danh sách các ảnh
  const images = ["/shuttlecock.png", "/badminton1.png", "/badminton2.png", "/scoreboard.png"];

  // State để lưu ảnh hiện tại
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Hiệu ứng để thay đổi ảnh sau 1-2 giây
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 2000); // Thay đổi ảnh sau mỗi 2 giây (2000ms)

    return () => clearInterval(interval); // Dọn dẹp interval khi component unmount
  }, [images.length]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2">
      {/* Phần hiển thị ảnh */}
      <div className="flex justify-center items-center mt-20">
        <Image
          src={images[currentImageIndex]} // Hiển thị ảnh hiện tại
          alt="badminton"
          width={400}
          height={400}
        />
      </div>

      {/* Phần SignUp */}
      <div className="flex justify-center items-center order-first md:order-last mt-20">
        <SignUp />
      </div>
    </div>
  );
}
