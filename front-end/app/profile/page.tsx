"use client";

import { useUser } from "@clerk/nextjs";
import { useState } from "react";

function page() {
  const { user } = useUser();
  const [showExtraFields, setShowExtraFields] = useState(false);
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");

  if (!user) {
    return (
      <div className="flex h-screen items-center justify-center">
        <p className="text-xl font-semibold">Bạn chưa đăng nhập</p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto mt-10 p-6 bg-white rounded-xl shadow-lg">
      <h1 className="text-2xl font-bold text-center mb-6">Trang cá nhân</h1>
      <div className="flex flex-col items-center">
        <img
          src={user?.imageUrl}
          alt="Avatar"
          className="w-24 h-24 rounded-full border-2 border-gray-300"
        />
        <div className="text-center mt-4">
          <p className="text-lg font-semibold">{user.fullName}</p>
          <p className="text-gray-500">{user.emailAddresses[0]?.emailAddress}</p>
        </div>
      </div>

      <div className="mt-6">
        {showExtraFields ? (
          <div>
            <label className="block text-sm font-medium">Địa chỉ</label>
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="w-full p-2 border rounded mt-1"
            />
            <label className="block text-sm font-medium mt-4">Số điện thoại</label>
            <input
              type="text"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full p-2 border rounded mt-1"
            />
            <div className="flex justify-end mt-4">
              <button
                onClick={() => setShowExtraFields(false)}
                className="px-4 py-2 bg-gray-500 text-white rounded mr-2"
              >
                Hủy
              </button>
              <button
                onClick={() => setShowExtraFields(false)}
                className="px-4 py-2 bg-blue-500 text-white rounded"
              >
                Lưu
              </button>
            </div>
          </div>
        ) : (
          <div className="mt-4">
            <p className="text-sm text-gray-600">Địa chỉ: {address || "Chưa có"}</p>
            <p className="text-sm text-gray-600 mt-2">Số điện thoại: {phone || "Chưa có"}</p>
            <button
              onClick={() => setShowExtraFields(true)}
              className="mt-4 px-4 py-2 bg-green-500 text-white rounded"
            >
              Thêm thông tin
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default page;