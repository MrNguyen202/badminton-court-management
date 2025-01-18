"use client"
import React, { useEffect, useState } from "react";
import AutocompleteAddress from "./AutocompleteAddress";

function MapAddress() {
  const [screenHeight, setScreenHeight] = useState<number>(0);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setScreenHeight(window.innerHeight * 0.25); // Lấy giá trị window.innerHeight
    }
  }, []);

  return (
    <div className="p-5">
      <h2 className="text-[20px] font-semibold">Nhập địa chỉ</h2>
      <div
        className="border-[1px] p-5 rounded-md"
        style={{ height: screenHeight }}
      >
        <AutocompleteAddress />
      </div>
    </div>
  );
}

export default MapAddress;
