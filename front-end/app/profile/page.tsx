"use client";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import UpdateProfile from "./_components/UpdateProfile";
import UpdatePassword from "./_components/UpdatePassword";

interface User {
  name: string;
  email: string;
  phone: string;
  address: string;
  role: string;
  avatar?: string; // Ảnh đại diện (tùy chọn)
}

const Profile = () => {
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();

  // Lấy thông tin user từ localStorage hoặc API
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    } else {
      alert("Vui lòng đăng nhập trước!");
      router.push("/sign-in");
    }
  }, []);

  // Xử lý đăng xuất
  const handleLogout = () => {
    localStorage.removeItem("user");
    router.push("/");

    // Đợi 500ms rồi reload trang
    setTimeout(() => {
      window.location.reload();
    }, 500);
  };

  if (!user) return <p className="text-center mt-10">Loading...</p>;

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-lg flex">
      {/* Sidebar */}
      <div className="w-1/4 border-r">
        <div className="flex flex-col items-center">
          <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center text-gray-500">
            <Image
              src={"/user-header.png"}
              alt="user-header"
              width={35}
              height={35}
            />
          </div>
          <h3 className="mt-2 text-lg font-semibold">{user.name}</h3>
        </div>

        <div className="mt-6 text-gray-700">
          <div className="font-semibold">📄 Tài khoản của tôi</div>
          <div className="ml-7">
            <p className="py-3">Thông tin tài khoản</p>
            <p><UpdatePassword /></p>
          </div>
          <div className="mt-4">
            <div className="font-semibold">📅 Danh sách lịch của tôi</div>
            <div className="ml-7 py-3">
              <Link href={"/profile/booked"}>Lịch đã đặt</Link>
            </div>
          </div>
        </div>
      </div>
      {/* Main Content */}
      <div className="w-3/4 p-6">
        <h2 className="text-2xl font-bold border-b pb-2">Thông tin cá nhân</h2>
        <div className="mt-6 space-y-4 text-gray-800">
          <div className="flex justify-between border-b pb-2">
            <span className="font-semibold">Email:</span>
            <span>{user.email}</span>
          </div>
          <div className="flex justify-between border-b pb-2">
            <span className="font-semibold">Số điện thoại:</span>
            <span>{user.phone}</span>
          </div>
          <div className="flex justify-between border-b pb-2">
            <span className="font-semibold">Họ & tên:</span>
            <span>{user.name}</span>
          </div>
          <div className="flex justify-between border-b pb-2">
            <span className="font-semibold">Địa chỉ:</span>
            <span>{user.address}</span>
          </div>
        </div>
        <div className="flex justify-between items-center mt-6">
          <UpdateProfile />
          <button
            className="flex items-center bg-red-500 text-white px-4 py-2 rounded-lg shadow-lg hover:bg-red-600 transition duration-300"
            onClick={handleLogout}
          >
            Đăng xuất
          </button>
        </div>
      </div>
    </div>
  );
};

export default Profile;
