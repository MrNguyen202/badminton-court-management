import { DirectionDataContext } from "@/context/DirectionDataContext";
import React, { useContext } from "react";

function DistanceTime() {
  const { directionData, setDirectionData } = useContext(DirectionDataContext);

  return (
    directionData?.routes && (
      <div className="bg-[#21A691] p-3">
        <h2 className="text-white opacity-80 text-[15px]">
          Khoảng cách: 
          <span className="font-bold mr-3 text-black">
            {(directionData?.routes[0]?.distance * 0.000621371192).toFixed(2)}{"  "}
            Km
          </span>
          Thời gian: {"  "}
          <span className="font-bold text-black">
            {(directionData?.routes[0]?.duration / 60).toFixed(2)} phút
          </span>
        </h2>
      </div>
    )
  );
}

export default DistanceTime;
