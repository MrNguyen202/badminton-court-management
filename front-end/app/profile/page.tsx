"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

function page() {
  const router = useRouter();
  const [showExtraFields, setShowExtraFields] = useState(false);
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");

  const handleLogout = () => {
    localStorage.removeItem("user");
    router.push("/sign-in"); // Điều hướng về trang đăng nhập
  };
  

  return (
    <div className="max-w-3xl mx-auto mt-10 p-6 bg-white rounded-xl shadow-lg">
      <h1 className="text-2xl font-bold text-center mb-6">Trang cá nhân</h1>
      <button onClick={handleLogout} className="btn-logout">Đăng xuất</button>

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
            <label className="block text-sm font-medium mt-4">
              Số điện thoại
            </label>
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
            <p className="text-sm text-gray-600">
              Địa chỉ: {address || "Chưa có"}
            </p>
            <p className="text-sm text-gray-600 mt-2">
              Số điện thoại: {phone || "Chưa có"}
            </p>
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
