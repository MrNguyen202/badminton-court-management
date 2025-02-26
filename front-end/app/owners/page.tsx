"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import SignUpAdmin from "./_components/SignUpAdmin";
import RecommendedItem from "../_components/RecommendedItem";
import Footer from "../_components/Footer";

type User = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  role: string;
};

function AdminPage() {
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  // Nếu chưa đăng nhập, hiển thị thông báo
  if (!user) return <p className="text-center mt-10">Bạn chưa đăng nhập</p>;

  // Nếu là USER, hiển thị nút đăng ký làm Admin
  const handleRegisterAsAdmin = async () => {
    try {
      const response = await axios.put("http://localhost:8080/api/users/update-role", {
        email: user.email,
        role: "ADMIN",
      });

      if (response.data.success) {
        const updatedUser = { ...user, role: "ADMIN" };
        localStorage.setItem("user", JSON.stringify(updatedUser)); // Cập nhật localStorage
        setUser(updatedUser); // Cập nhật state để re-render
        alert("Bạn đã trở thành Admin!");
      }
    } catch (error) {
      alert("Có lỗi xảy ra khi cập nhật quyền Admin.");
    }
  };

  // Nếu chưa là ADMIN, không cho truy cập trang
  if (user.role !== "ADMIN") {
    return (
      <div className="text-center mt-10">
        <h1 className="text-2xl font-bold">Bạn không phải Admin</h1>
        <p className="mt-2">Bạn cần đăng ký làm Admin để truy cập trang này.</p>
        <div className="mt-2 mb-20"><SignUpAdmin /></div>
        <RecommendedItem/>
        <Footer/>
      </div>
    );
  }

  return (
    <div className="text-center mt-10">
      <h1 className="text-2xl font-bold">Chào {user.email}, bạn là Admin!</h1>
      <p className="mt-2">Bạn có thể sử dụng trang này.</p>
    </div>
  );
}

export default AdminPage;
