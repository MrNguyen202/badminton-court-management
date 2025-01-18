"use client";
import { NextUIProvider } from "@nextui-org/react";
import React from "react";
import Header from "./_components/Header";

function Provider({ children }: { children: React.ReactNode }) {
  return (
    <NextUIProvider className="bg-white">
      {/* Header */}
      <Header />
      {children}
    </NextUIProvider>
  );
}

export default Provider;
