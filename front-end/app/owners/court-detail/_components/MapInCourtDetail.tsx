import React, { useEffect, useRef, useState } from "react";
import { Map, Marker } from "react-map-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import Image from "next/image";
import MapBoxRoute from "@/components/Map/MapBoxRoute";

const MAPBOX_DRIVING_ENDPOINT =
  "https://api.mapbox.com/directions/v5/mapbox/driving/";
const MAPBOX_GEOCODING_ENDPOINT =
  "https://api.mapbox.com/geocoding/v5/mapbox.places/";

type Address = {
  province: string;
  district: string;
  ward: string;
  specificAddress: string;
};

type Coordinates = {
  lng: number;
  lat: number;
};

type MapInCourtDetailProps = {
  courtAddress: Address | undefined;
};

function MapInCourtDetail({ courtAddress }: MapInCourtDetailProps) {
  const mapRef = useRef<any>(null);
  const [userLocation, setUserLocation] = useState<Coordinates | null>(null);
  const [courtCoordinates, setCourtCoordinates] = useState<Coordinates | null>(
    null
  );
  const [directionData, setDirectionData] = useState<any>(null);

  // Lấy vị trí người dùng từ Geolocation API
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        (error) => {
          console.error("Lỗi khi lấy vị trí người dùng:", error);
        }
      );
    } else {
      console.error("Trình duyệt không hỗ trợ Geolocation.");
    }
  }, []);

  // Chuyển địa chỉ sân thành tọa độ
  useEffect(() => {
    if (courtAddress) {
      const fetchCourtCoordinates = async () => {
        try {
          const addressString = `${courtAddress.specificAddress}, ${courtAddress.ward}, ${courtAddress.district}, ${courtAddress.province}`;
          const encodedAddress = encodeURIComponent(addressString);

          const res = await fetch(
            `${MAPBOX_GEOCODING_ENDPOINT}${encodedAddress}.json?access_token=${process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN}`,
            {
              headers: {
                "Content-Type": "application/json",
              },
            }
          );
          const result = await res.json();

          if (result.features && result.features.length > 0) {
            const [lng, lat] = result.features[0].center;
            setCourtCoordinates({ lng, lat });
          } else {
            console.error("Không tìm thấy tọa độ cho địa chỉ sân.");
          }
        } catch (error) {
          console.error("Lỗi khi lấy tọa độ sân:", error);
        }
      };
      fetchCourtCoordinates();
    }
  }, [courtAddress]);

  // Dịch chuyển bản đồ tới vị trí sân hoặc người dùng
  useEffect(() => {
    if (courtCoordinates && mapRef.current) {
      mapRef.current.flyTo({
        center: [courtCoordinates.lng, courtCoordinates.lat],
        duration: 2500,
        zoom: 14,
      });
    } else if (userLocation && mapRef.current) {
      mapRef.current.flyTo({
        center: [userLocation.lng, userLocation.lat],
        duration: 2500,
        zoom: 14,
      });
    }
  }, [userLocation, courtCoordinates]);

  // Lấy tuyến đường từ vị trí người dùng đến sân
  useEffect(() => {
    if (userLocation && courtCoordinates) {
      const getDirectionRoute = async () => {
        try {
          const res = await fetch(
            `${MAPBOX_DRIVING_ENDPOINT}${userLocation.lng},${userLocation.lat};${courtCoordinates.lng},${courtCoordinates.lat}?overview=full&geometries=geojson&access_token=${process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN}`,
            {
              headers: {
                "Content-Type": "application/json",
              },
            }
          );
          const result = await res.json();
          setDirectionData(result);
        } catch (error) {
          console.error("Lỗi khi lấy hướng dẫn đường đi:", error);
        }
      };
      getDirectionRoute();
    }
  }, [userLocation, courtCoordinates]);

  return (
    <div className="p-5">
      <h2 className="text-[20px] font-semibold pb-2">Tuyến đường từ vị trí hiện tại đến sân</h2>
      <div className="rounded-lg overflow-hidden">
        {userLocation ? (
          <Map
            ref={mapRef}
            mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN}
            initialViewState={{
              longitude: userLocation?.lng || 0,
              latitude: userLocation?.lat || 0,
              zoom: 14,
            }}
            style={{ width: "100%", height: 600, borderRadius: 10 }}
            mapStyle="mapbox://styles/mapbox/streets-v9"
          >
            {/* Marker cho vị trí người dùng */}
            {userLocation && (
              <Marker
                longitude={userLocation.lng}
                latitude={userLocation.lat}
                anchor="bottom"
              >
                <Image src="/pin.png" width={50} height={50} alt="pin" />
              </Marker>
            )}

            {/* Marker cho vị trí sân */}
            {courtCoordinates && (
              <Marker
                longitude={courtCoordinates.lng}
                latitude={courtCoordinates.lat}
                anchor="bottom"
              >
                <Image src="/pin.png" width={50} height={50} alt="pin" />
              </Marker>
            )}

            {/* Tuyến đường */}
            {directionData?.routes && (
              <MapBoxRoute
                coordinates={directionData.routes[0].geometry.coordinates}
              />
            )}
          </Map>
        ) : (
          <div>Đang tải vị trí...</div>
        )}
      </div>
      {/* Tích hợp DistanceTime trực tiếp */}
      <div className="xl:w-[400px] right-[20px] hidden md:block">
        {directionData?.routes?.[0] ? (
          <div className="bg-[#21A691] p-3">
            <h2 className="text-white opacity-80 text-[15px]">
              Khoảng cách:
              <span className="font-bold mr-3 text-black">
                {(directionData.routes[0].distance * 0.000621371192).toFixed(2)}{" "}
                Km
              </span>
              Thời gian:
              <span className="font-bold text-black">
                {(directionData.routes[0].duration / 60).toFixed(2)} phút
              </span>
            </h2>
          </div>
        ) : (
          <div className="bg-[#21A691] p-3 text-white opacity-80 text-[15px]">
            Chưa có dữ liệu tuyến đường
          </div>
        )}
      </div>
    </div>
  );
}

export default MapInCourtDetail;
