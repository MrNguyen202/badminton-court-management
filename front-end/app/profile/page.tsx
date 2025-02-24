// "use client";
// import { useRouter } from "next/navigation";
// import { useState, useEffect, useContext } from "react";

// type User = {
//   firstName: string;
//   lastName: string;
//   email: string;
//   phone: string;
//   address: string;
//   role: string;
// };

// function ProfilePage() {
//   const router = useRouter();

//   const [useAuth, setUseAuth] = useState<User | null>(null);

//   useEffect(() => {
//     const loadUser = () => {
//       const userData = localStorage.getItem("user");
//       if (userData) {
//         setUseAuth(JSON.parse(userData));
//       }
//     };

//     loadUser(); // Load khi component mount

//     // Lắng nghe khi localStorage thay đổi (do đăng nhập)
//     window.addEventListener("storage", loadUser);

//     return () => {
//       window.removeEventListener("storage", loadUser);
//     };
//   }, []);

//   console.log("profile", useAuth);

//   const handleLogout = () => {
//     localStorage.removeItem("user");

//     window.location.reload();

//     router.push("/");
//   };

//   return (
//     <div>
//       {useAuth ? (
//         <div>
//           <h1>Chào, {useAuth.phone}!</h1>
//           <button onClick={handleLogout}>Đăng xuất</button>
//         </div>
//       ) : (
//         <p>Bạn chưa đăng nhập.</p>
//       )}
//     </div>
//   );
// }

// export default ProfilePage;

"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface User {
  firstName: string;
  lastName: string;
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
    router.push("/sign-in");
  };

  const handleGoToUpdate = () => {
    router.push('/profile/update'); // Chuyển hướng đến trang update profile
  };

  if (!user) return <p className="text-center mt-10">Loading...</p>;

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-blue-500 to-purple-500 p-4">
      <div className="bg-white shadow-xl rounded-2xl p-8 w-96 text-center transform transition duration-500 hover:scale-105">
        {/* Avatar */}
        <div className="relative">
          <img
            src={user.avatar || "https://via.placeholder.com/150"}
            alt="User Avatar"
            className="w-28 h-28 mx-auto rounded-full border-4 border-blue-300 shadow-lg"
          />
        </div>
        ?
        <h2 className="text-2xl font-semibold text-gray-800 mt-4">
          {user?.lastName}
        </h2>
        <p className="text-gray-500">{user.email}</p>
        <span
          className={`px-4 py-1 rounded-full text-sm mt-2 inline-block ${
            user.role === "ADMIN"
              ? "bg-red-200 text-red-600"
              : "bg-green-200 text-green-600"
          }`}
        >
          {user.role}
        </span>
        {/* Nút chỉnh sửa & đăng xuất */}
        <div className="mt-6 flex justify-center space-x-4">
          <button onClick={handleGoToUpdate} className="flex items-center bg-blue-600 text-white px-4 py-2 rounded-lg shadow-lg hover:bg-blue-700 transition duration-300">
            Chỉnh sửa
          </button>
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
