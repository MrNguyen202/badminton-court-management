import { Button } from "@nextui-org/button";
import Image from "next/image";
import Link from "next/link";
import React from "react";

function Hero() {
  return (
    // <div className="px-10 md:px-28 lg:px-44 mt-10 h-screen">
    //   <div className="grid grid-cols-1 md:grid-cols-2">
    //     <div>
    //       <h2 className="text-[70px] text-primary font-extrabold py-10 mt-20">
    //         Craft Magical Stories for kids in Minutes
    //       </h2>
    //       <p className="text-2xl text-primary font-light">
    //         Create fun and personalised stories that bring your child's
    //         adventures to life and spark their passion for reading. It only
    //         takes a fow seconds!
    //       </p>
    //       <Link href={"/create-story"}>
    //         <Button
    //           size="lg"
    //           color="primary"
    //           className="mt-5 font-bold text-2xl p-8"
    //         >
    //           Create Story
    //         </Button>
    //       </Link>
    //     </div>
    //     <div>
    //       <Image src={"/hero.png"} alt="hero" width={800} height={500} />
    //     </div>
    //   </div>
    // </div>

    <div className="relative min-h-screen w-full bg-[url('/course.png')] bg-cover bg-no-repeat">
      <div className="absolute inset-0 h-full w-full bg-gray-900/60" />
      <div className="grid min-h-screen px-8">
        <div className="container relative z-10 my-auto mx-auto grid place-items-center text-center">
          <div className="md:max-w-full lg:max-w-3xl text-white text-[50px] font-extrabold">
            Master the Power of React Beginner Course
          </div>
          <div className="mt-6 mb-10 w-full md:max-w-full lg:max-w-3xl text-white text-[20px]">
            Our React Course is your gateway to becoming a proficient React
            developer. Learn to build dynamic and interactive web applications
            using one of the most popular JavaScript libraries in the industry.
          </div>
          <Link href={"/find-address"}>
            <Button color="default" size="lg">
              ENROLL TODAY
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Hero;
