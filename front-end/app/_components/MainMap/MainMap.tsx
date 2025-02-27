import MapBoxMap from "@/components/Map/MapBoxMap";
import MapAddress from "@/components/MapAddress/MapAddress";
import React from "react";

function MainMap() {
  return (
    <div className="pb-20 px-8 pt-20">
      <div className="grid grid-cols-1 md:grid-cols-3">
        <div className="">
          <MapAddress />
        </div>
        <div className="col-span-2">
          <MapBoxMap />
        </div>
      </div>
    </div>
  );
}

export default MainMap;
