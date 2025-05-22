"use client";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import UpdateProfile from "./_components/UpdateProfile";
import UpdatePassword from "./_components/UpdatePassword";
import { UserCircle2, Mail, Phone, MapPin, Tag, Calendar, LogOut, User, Info } from "lucide-react";

interface User {
  name: string;
  email: string;
  phone: string;
  address: string;
  role: string;
  avatar?: string;
}

const Profile = () => {
  const [user, setUser] = useState<User | null>(null);
  const [activeTab, setActiveTab] = useState("profile");
  const router = useRouter();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    } else {
      alert("Vui lòng đăng nhập trước!");
      router.push("/sign-in");
    }
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem("user");
    router.push("/");

    setTimeout(() => {
      window.location.reload();
    }, 500);
  };

  if (!user) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto my-8 px-4">
      <div className="bg-gradient-to-r from-green-400 to-blue-300 rounded-t-2xl p-8 text-white">
        <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
          <div className="relative">
            {user.avatar ? (
              <Image
                src={user.avatar}
                alt="Avatar"
                width={100}
                height={100}
                className="rounded-full border-4 border-white shadow-lg object-cover"
              />
            ) : (
              <div className="w-24 h-24 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-white border-4 border-white shadow-lg">
                <UserCircle2 size={48} />
              </div>
            )}
          </div>
          <div className="text-center md:text-left">
            <h1 className="text-3xl font-bold">{user.name}</h1>
            <div className="flex items-center justify-center md:justify-start mt-2 gap-2">
              <Tag size={16} />
              <span className="bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-sm">
                {user.role}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-b-2xl shadow-xl">
        <div className="flex flex-col md:flex-row">
          {/* Sidebar */}
          <div className="md:w-1/4 border-r border-gray-200">
            <nav className="p-4">
              <ul className="space-y-1">
                <li>
                  <button
                    onClick={() => setActiveTab("profile")}
                    className={`w-full flex items-center gap-3 p-3 rounded-lg transition-colors ${
                      activeTab === "profile"
                        ? "bg-blue-50 text-blue-600 font-medium"
                        : "hover:bg-gray-100"
                    }`}
                  >
                    <User size={18} />
                    <span>Thông tin tài khoản</span>
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => setActiveTab("password")}
                    className={`w-full flex items-center gap-3 p-3 rounded-lg transition-colors ${
                      activeTab === "password"
                        ? "bg-blue-50 text-blue-600 font-medium"
                        : "hover:bg-gray-100"
                    }`}
                  >
                    <Info size={18} />
                    <span>Đổi mật khẩu</span>
                  </button>
                </li>
                <li>
                  <Link
                    href="/profile/booked-calendar"
                    className="w-full flex items-center gap-3 p-3 rounded-lg transition-colors hover:bg-gray-100"
                  >
                    <Calendar size={18} />
                    <span>Lịch đã đặt</span>
                  </Link>
                </li>
                <li>
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 p-3 rounded-lg text-red-500 hover:bg-red-50 transition-colors"
                  >
                    <LogOut size={18} />
                    <span>Đăng xuất</span>
                  </button>
                </li>
              </ul>
            </nav>
          </div>

          {/* Main Content */}
          <div className="md:w-3/4 p-6">
            {activeTab === "profile" && (
              <>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-gray-800">Thông tin cá nhân</h2>
                  <UpdateProfile />
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-gray-100">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6">
                    <div className="flex items-center gap-4 bg-gray-50 p-4 rounded-lg">
                      <div className="bg-blue-100 p-3 rounded-full">
                        <Mail size={20} className="text-blue-600" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Email</p>
                        <p className="font-medium">{user.email}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 bg-gray-50 p-4 rounded-lg">
                      <div className="bg-green-100 p-3 rounded-full">
                        <Phone size={20} className="text-green-600" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Số điện thoại</p>
                        <p className="font-medium">{user.phone}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 bg-gray-50 p-4 rounded-lg">
                      <div className="bg-purple-100 p-3 rounded-full">
                        <User size={20} className="text-purple-600" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Họ & tên</p>
                        <p className="font-medium">{user.name}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 bg-gray-50 p-4 rounded-lg">
                      <div className="bg-orange-100 p-3 rounded-full">
                        <Tag size={20} className="text-orange-600" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Vai trò</p>
                        <p className="font-medium">{user.role}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 bg-gray-50 p-4 rounded-lg md:col-span-2">
                      <div className="bg-red-100 p-3 rounded-full">
                        <MapPin size={20} className="text-red-600" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Địa chỉ</p>
                        <p className="font-medium">{user.address}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}

            {activeTab === "password" && (
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">Đổi mật khẩu</h2>
                <UpdatePassword />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;