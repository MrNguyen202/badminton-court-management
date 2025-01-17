import { DestinationCoordinateContext } from "@/context/DestinationCoordinateContext";
import { SourceCoordinateContext } from "@/context/SourceCoordinateContext";
import React, { useContext, useEffect, useState } from "react";

const session_token = "5ccce4a4-ab0a-4a7c-943d-580e55542363";
const MAPBOX_RETRIVE_URL =
  "https://api.mapbox.com/search/searchbox/v1/retrieve/";

function AutocompleteAddress() {
  const [source, setSource] = useState(""); // Khởi tạo với chuỗi rỗng
  const [destination, setDestination] = useState(""); // Khởi tạo với chuỗi rỗng

  const { sourceCoordinates, setSourceCoordinates } = useContext(
    SourceCoordinateContext
  );
  const { destinationCoordinates, setDestinationCoordinates } = useContext(
    DestinationCoordinateContext
  );

  const [addressList, setAddressList] = useState<any>([]);
  const [sourceChange, setSourceChange] = useState(false); // Đặt giá trị mặc định là false
  const [destinationChange, setDestinationChange] = useState(false); // Đặt giá trị mặc định là false

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (source.trim()) {
        getAddressList("source"); // Gọi API cho 'Where From'
      }
    }, 1000);
    return () => clearTimeout(delayDebounceFn);
  }, [source]);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (destination.trim()) {
        getAddressList("destination"); // Gọi API cho 'Where To'
      }
    }, 1000);
    return () => clearTimeout(delayDebounceFn);
  }, [destination]);

  const getAddressList = async (type: "source" | "destination") => {
    const query = type === "source" ? source : destination;
    const res = await fetch("/api/search-address?q=" + query, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    const result = await res.json();
    setAddressList(result);
  };

  const onSourceAddressClick = async (item: any) => {
    setSource(item.full_address);
    setAddressList([]); // Xóa danh sách địa chỉ khi chọn
    setSourceChange(false); // Đặt lại trạng thái

    const res = await fetch(
      MAPBOX_RETRIVE_URL +
        item.mapbox_id +
        "?session_token=" +
        session_token +
        "&access_token=" +
        process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN
    );

    const result = await res.json();

    setSourceCoordinates({
      lng: result.features[0].geometry.coordinates[0],
      lat: result.features[0].geometry.coordinates[1],
    });

    console.log(result);
  };

  const onDestinationAddressClick = async (item: any) => {
    setDestination(item.full_address);
    setAddressList([]); // Xóa danh sách địa chỉ khi chọn
    setDestinationChange(false); // Đặt lại trạng thái
    
    const res = await fetch(
      MAPBOX_RETRIVE_URL +
        item.mapbox_id +
        "?session_token=" +
        session_token +
        "&access_token=" +
        process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN
    );

    const result = await res.json();

    setDestinationCoordinates({
      lng: result.features[0].geometry.coordinates[0],
      lat: result.features[0].geometry.coordinates[1],
    });

    console.log(result);
  };

  return (
    <div className="mt-5">
      <div className="relative z-10">
        <label className="text-gray-500">Điểm đi ?</label>
        <input
          type="text"
          className="bg-white p-1 border-[1px] w-full rounded-md outline-none focus:border-green-300"
          value={source}
          onChange={(e) => {
            setSource(e.target.value);
            setSourceChange(true); // Đảm bảo trạng thái sourceChange được set
          }}
        />
        {addressList?.suggestions && sourceChange && source.trim() !== "" ? (
          <div className="shadow-md p-1 rounded-md absolute w-full bg-white z-20">
            {addressList.suggestions.map((item: any, index: number) => {
              return (
                <h2
                  key={index}
                  className="p-3 hover:bg-gray-100 cursor-pointer"
                  onClick={() => {
                    onSourceAddressClick(item);
                  }}
                >
                  {item.full_address}
                </h2>
              );
            })}
          </div>
        ) : null}
      </div>

      <div className="mt-3 relative">
        <label className="text-gray-500">Điểm đến ?</label>
        <input
          type="text"
          className="bg-white p-1 border-[1px] w-full rounded-md outline-none focus:border-green-300"
          value={destination}
          onChange={(e) => {
            setDestination(e.target.value);
            setDestinationChange(true); // Đảm bảo trạng thái destinationChange được set
          }}
        />

        {addressList?.suggestions &&
        destinationChange &&
        destination.trim() !== "" ? (
          <div className="shadow-md p-1 rounded-md absolute w-full bg-white">
            {addressList.suggestions.map((item: any, index: number) => {
              return (
                <h2
                  key={index}
                  className="p-3 hover:bg-gray-100 cursor-pointer"
                  onClick={() => {
                    onDestinationAddressClick(item);
                  }}
                >
                  {item.full_address}
                </h2>
              );
            })}
          </div>
        ) : null}
      </div>
    </div>
  );
}

export default AutocompleteAddress;
