// "use client";
// import { useRouter } from "next/navigation";
// import React, { useEffect, useState } from "react";

// interface User {
//   name: string;
//   email: string;
//   phone: string;
//   address: string;
//   role: string;
// }

// function page() {
//   const [user, setUser] = useState<User | null>(null);
//     const router = useRouter();

//     // Lấy thông tin user từ localStorage hoặc API
//     useEffect(() => {
//       const storedUser = localStorage.getItem("user");
//       if (storedUser) {
//         setUser(JSON.parse(storedUser));
//       } else {
//         alert("Vui lòng đăng nhập trước!");
//         router.push("/sign-in");
//       }
//     }, []);

//   return (
//     <div>
//       <h1>Update Your Profile</h1>
//       {/* Form hoặc UI để cập nhật hồ sơ */}
//       <form>
//         {/* Các input field cho việc cập nhật hồ sơ */}
//         <input type="text" placeholder="Name" />
//         <input type="email" placeholder="Email" />
//         <button type="submit">Save Changes</button>
//       </form>
//     </div>
//   );
// }

// export default page;

"use client";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

interface User {
  name: string;
  email: string;
  phone: string;
  address: string;
}

function UpdateProfile() {
  const [user, setUser] = useState<User | null>(null);
  const [formData, setFormData] = useState<User>({
    name: "",
    email: "",
    phone: "",
    address: "",
  });

  const router = useRouter();
  const [reloadKey, setReloadKey] = useState(0);

  // Lấy thông tin user từ localStorage
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const userData = JSON.parse(storedUser);
      setUser(userData);
      setFormData(userData);
    } else {
      alert("Vui lòng đăng nhập trước!");
      router.push("/sign-in");
    }
  }, []);

  // Xử lý khi người dùng nhập vào input
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch(
        "http://localhost:8080/api/auth/update-user",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );
  
      const data = await response.json();
      if (response.ok) {
        alert("Cập nhật thành công!");
        localStorage.setItem("user", JSON.stringify(data));
        setUser(data);
        
        // Chuyển hướng trước
        router.push("/profile");
  
        // Đợi 500ms rồi reload trang
        setTimeout(() => {
          window.location.reload();
        }, 500);
      } else {
        alert(data.error || "Có lỗi xảy ra khi cập nhật");
      }
    } catch (error) {
      console.error("Lỗi cập nhật:", error);
      alert("Không thể kết nối đến server!");
    }
  };
  
  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 p-4">
      <div className="bg-white shadow-lg rounded-xl p-6 w-full max-w-md">
        <h1 className="text-2xl font-semibold text-gray-700 text-center mb-4">
          Cập nhật hồ sơ
        </h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-600 text-sm font-medium mb-1">
              Họ và Tên
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Nhập tên của bạn"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          <div>
            <label className="block text-gray-600 text-sm font-medium mb-1">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              disabled
              className="w-full px-4 py-2 border bg-gray-200 text-gray-500 rounded-lg cursor-not-allowed"
            />
          </div>

          <div>
            <label className="block text-gray-600 text-sm font-medium mb-1">
              Số điện thoại
            </label>
            <input
              type="text"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="Nhập số điện thoại"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          <div>
            <label className="block text-gray-600 text-sm font-medium mb-1">
              Địa chỉ
            </label>
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleChange}
              placeholder="Nhập địa chỉ"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white font-semibold py-2 rounded-lg hover:bg-blue-700 transition duration-300"
          >
            Lưu thay đổi
          </button>
        </form>
      </div>
    </div>
  );
}

export default UpdateProfile;
