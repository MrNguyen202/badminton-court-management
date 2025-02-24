"use client";
import { NextUIProvider } from "@nextui-org/react";
import React, { useEffect, useState } from "react";
import Header from "./_components/Header";
import ChatWidget from "./_components/ChatBot/ChatWidget";

function Provider({ children }: { children: React.ReactNode }) {
  return (
    <NextUIProvider className="bg-white">
      {/* Header */}
      <Header />
      {children}
      <ChatWidget />
    </NextUIProvider>
  );
}

export default Provider;
