"use client";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

interface User {
  name: string;
  email: string;
  phone: string;
  address: string;
}

function page() {
  const router = useRouter();

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 p-4">
      <div className="bg-white shadow-lg rounded-xl p-6 w-full max-w-md">
        <h1 className="text-2xl font-semibold text-gray-700 text-center mb-4">
          Lịch đã đặt
        </h1>
      </div>
    </div>
  );
}

export default page;
