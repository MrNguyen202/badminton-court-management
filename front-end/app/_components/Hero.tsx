import React from "react";
import MainMap from "./MainMap/MainMap";
import RecommendedItem from "./RecommendedItem";
import Footer from "./Footer";
import Image from "next/image";
import TypicalFeatures from "./TypicalFeatures";

function Hero() {
  return (
    <div>
      <div className="pb-20 px-8 pt-20">
        <div className="container mx-auto grid grid-cols-1 gap-x-10 gap-y-20 md:grid-cols-1 xl:grid-cols-2">
          <div>
            <p className="text-7xl pt-5 m-10">
              Phần mềm quản lý lịch hẹn đặt sân thể thao
            </p>
            <p className="ml-10 text-xl">
              Đặt hẹn và quản lý lịch hẹn Sân thể thao: Sân đá bóng, Sân Tennis,
              Sân Bóng rổ, Sân Cầu lông…tiện lợi và nhanh chóng với phần mềm BT
            </p>
          </div>
          <div className="flex justify-center items-center">
            <Image
              src="/calendar.gif"
              alt="badminton"
              width={300}
              height={300}
              className="mx-auto"
            />
          </div>
        </div>
      </div>

      <RecommendedItem />
      <TypicalFeatures />
      <MainMap />

      <Footer />
    </div>
  );
}

export default Hero;
