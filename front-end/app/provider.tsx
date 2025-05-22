"use client";
import { NextUIProvider } from "@nextui-org/react";
import React, { useEffect, useState } from "react";
import Header from "./_components/Header";
import ChatWidget from "./_components/ChatBot/ChatWidget";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { UserLocationContext } from "@/context/UserLocationContext";
import { SourceCoordinateContext } from "@/context/SourceCoordinateContext";
import { DestinationCoordinateContext } from "@/context/DestinationCoordinateContext";
import { DirectionDataContext } from "@/context/DirectionDataContext";

function Provider({ children }: { children: React.ReactNode }) {
  const [userLocation, setUserLocation] = useState<any>();
  const [sourceCoordinates, setSourceCoordinates] = useState<any>([]);
  const [destinationCoordinates, setDestinationCoordinates] = useState<any>([]);
  const [directionData, setDirectionData] = useState<any>([]);

  useEffect(() => {
    getUserLocation();
  }, []);

  const getUserLocation = () => {
    navigator.geolocation.getCurrentPosition(function (pos) {
      setUserLocation({
        lat: pos.coords.latitude,
        lng: pos.coords.longitude,
      });
    });
  };
  return (
    <NextUIProvider className="bg-white">
      {/* <Header />
        {children}
        <ChatWidget />
        <ToastContainer /> */}

      <UserLocationContext.Provider value={{ userLocation, setUserLocation }}>
        <SourceCoordinateContext.Provider
          value={{ sourceCoordinates, setSourceCoordinates }}
        >
          <DestinationCoordinateContext.Provider
            value={{ destinationCoordinates, setDestinationCoordinates }}
          >
            <DirectionDataContext.Provider
              value={{ directionData, setDirectionData }}
            >
              <Header />
              {children}
              <ChatWidget />
              <ToastContainer />
            </DirectionDataContext.Provider>
          </DestinationCoordinateContext.Provider>
        </SourceCoordinateContext.Provider>
      </UserLocationContext.Provider>
    </NextUIProvider>
  );
}

export default Provider;
