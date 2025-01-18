import React, { useContext, useEffect, useRef } from "react";
import { Map } from "react-map-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { UserLocationContext } from "@/context/UserLocationContext";
import { SourceCoordinateContext } from "@/context/SourceCoordinateContext";
import { DestinationCoordinateContext } from "@/context/DestinationCoordinateContext";
import { DirectionDataContext } from "@/context/DirectionDataContext";
import MapBoxRoute from "./MapBoxRoute";
import DistanceTime from "./DistanceTime";
import Markers from "./Markers";

const MAPBOX_DRIVING_ENDPOINT =
  "https://api.mapbox.com/directions/v5/mapbox/driving/";

function MapBoxMap() {
  const mapRef = useRef<any>(null);
  const { userLocation, setUserLocation } = useContext(UserLocationContext);
  const { sourceCoordinates, setSourceCoordinates } = useContext(
    SourceCoordinateContext
  );
  const { destinationCoordinates, setDestinationCoordinates } = useContext(
    DestinationCoordinateContext
  );

  const { directionData, setDirectionData } = useContext(DirectionDataContext);

  // dịch chuyển tới vị trí người dùng
  useEffect(() => {
    if (sourceCoordinates) {
      mapRef.current?.flyTo({
        center: [sourceCoordinates.lng, sourceCoordinates.lat],
        duration: 2500,
      });
    }
  }, [sourceCoordinates]);

  // dịch chuyển tới vị trí đích
  useEffect(() => {
    if (destinationCoordinates) {
      mapRef.current?.flyTo({
        center: [destinationCoordinates.lng, destinationCoordinates.lat],
        duration: 2500,
      });
    }

    if (sourceCoordinates && destinationCoordinates) {
      getDirectionRoute();
    }
  }, [destinationCoordinates]);

  const getDirectionRoute = async () => {
    const res = await fetch(
      MAPBOX_DRIVING_ENDPOINT +
        sourceCoordinates.lng +
        "," +
        sourceCoordinates.lat +
        ";" +
        destinationCoordinates.lng +
        "," +
        destinationCoordinates.lat +
        "?overview=full&geometries=geojson" +
        "&access_token=" +
        process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    const result = await res.json();
    setDirectionData(result);
  };

  return (
    <div className="p-5">
      <h2 className="text-[20px] font-semibold">Bản đồ</h2>
      <div className="rounded-lg overflow-hidden">
        {userLocation ? (
          <Map
            ref={mapRef}
            mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN}
            initialViewState={{
              longitude: userLocation?.lng,
              latitude: userLocation?.lat,
              zoom: 14,
            }}
            style={{ width: "100%", height: 600, borderRadius: 10 }}
            mapStyle="mapbox://styles/mapbox/streets-v9"
          >
            <Markers />

            {directionData?.routes ? (
              <MapBoxRoute
                coordinates={directionData?.routes[0]?.geometry?.coordinates}
              />
            ) : null}
          </Map>
        ) : null}
      </div>
      <div className="xl:w-[400px] right-[20px] hidden md:block">
        <DistanceTime />
      </div>
    </div>
  );
}

export default MapBoxMap;
