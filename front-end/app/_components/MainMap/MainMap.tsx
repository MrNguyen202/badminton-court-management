import MapBoxMap from "@/components/Map/MapBoxMap";
import MapAddress from "@/components/MapAddress/MapAddress";
import React from "react";

function MainMap() {
  return (
    <div>
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
