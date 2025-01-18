import Image from "next/image";
import React from "react";

function EventSearch() {
  return (
    <div className="flex items-center gap-[10px] w-full xl:w-[190px]">
      <Image src="/search.png" width={30} height={30} alt="Search" />

      <div>
        <input
          placeholder="Search"
          type="text"
          className="w-full p-0 bg-transparent border-0 focus:outline-none focus:ring-0"
        />
      </div>
    </div>
  );
}

export default EventSearch;
