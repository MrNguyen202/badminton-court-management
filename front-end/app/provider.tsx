"use client";
import { NextUIProvider } from "@nextui-org/react";
import React from "react";
import Header from "./_components/Header";
import ChatWidget from "./_components/ChatBot/ChatWidget";
import { UserProvider } from "@/context/UserContext";

function Provider({ children }: { children: React.ReactNode }) {
  return (
    <NextUIProvider className="bg-white">
      <UserProvider>
        {/* Header */}
        <Header />
        {children}
        <ChatWidget />
      </UserProvider>
    </NextUIProvider>
  );
}

export default Provider;
