import React, { useContext } from "react";
import { UserLocationContext } from "@/context/UserLocationContext";
import { DestinationCoordinateContext } from "@/context/DestinationCoordinateContext";
import { SourceCoordinateContext } from "@/context/SourceCoordinateContext";
import { Marker } from "react-map-gl";

function Markers() {
  const { userLocation, setUserLocation } = useContext(UserLocationContext);

  const { sourceCoordinates, setSourceCoordinates } = useContext(
    SourceCoordinateContext
  );
  const { destinationCoordinates, setDestinationCoordinates } = useContext(
    DestinationCoordinateContext
  );

  return (
    <div>
      {/* Đánh dấu người dùng */}
      <Marker
        longitude={userLocation?.lng}
        latitude={userLocation?.lat}
        anchor="bottom"
      >
        <img src="./pin.png" className="w-10 h-10" />
      </Marker>

      {/* Đánh dấu điểm đi */}

      {sourceCoordinates.length != 0 ? (
        <Marker
          longitude={sourceCoordinates?.lng}
          latitude={sourceCoordinates?.lat}
          anchor="bottom"
        >
          <img src="./pin.png" className="w-10 h-10" />
        </Marker>
      ) : null}

      {/* Đánh dấu điểm đích */}

      {destinationCoordinates.length != 0 ? (
        <Marker
          longitude={destinationCoordinates?.lng}
          latitude={destinationCoordinates?.lat}
          anchor="bottom"
        >
          <img src="./pin.png" className="w-10 h-10" />
        </Marker>
      ) : null}
    </div>
  );
}

export default Markers;
