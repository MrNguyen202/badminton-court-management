"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { userApi } from "@/app/api/user-services/userAPI";

const ForgotPassword = () => {
  const router = useRouter();

  const [formData, setFormData] = useState({
    email: "",
    phone: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate cơ bản
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      toast.error("Email không hợp lệ!");
      return;
    }

    if (!/^\d{10}$/.test(formData.phone)) {
      toast.error("Số điện thoại phải đủ 10 chữ số!");
      return;
    }

    // try {
    //   // Giả định API kiểm tra đúng email và số điện thoại
    //   const res = await userApi.verifyUserByEmailAndPhone(
    //     formData.email,
    //     formData.phone
    //   );

    //   if (res.success) {
    //     toast.success("Xác minh thành công. Vui lòng đặt lại mật khẩu.");
    //     router.push("/reset-password"); // Điều hướng sang trang đặt lại mật khẩu
    //   } else {
    //     toast.error("Email hoặc số điện thoại không đúng!");
    //   }
    // } catch (error: any) {
    //   toast.error("Có lỗi xảy ra, vui lòng thử lại!");
    // }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2 bg-gray-100">
      <main className="flex flex-col items-center justify-center w-full flex-1 px-20 text-center">
        <div className="bg-white rounded-2xl shadow-2xl flex w-2/3 max-w-4xl">
          <div className="w-full p-10">
            <h2 className="text-3xl font-bold text-primary mb-5">
              Quên mật khẩu
            </h2>
            <p className="text-gray-500 mb-6">
              Nhập email và số điện thoại để xác minh.
            </p>

            <form onSubmit={handleSubmit}>
              <div className="flex flex-col items-center">
                <div className="bg-gray-100 w-64 p-2 flex items-center mb-4">
                  <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    onChange={handleChange}
                    required
                    className="bg-gray-100 outline-none text-sm flex-1 ml-2"
                  />
                </div>
                <div className="bg-gray-100 w-64 p-2 flex items-center mb-6">
                  <input
                    type="text"
                    name="phone"
                    placeholder="Số điện thoại"
                    onChange={handleChange}
                    required
                    className="bg-gray-100 outline-none text-sm flex-1 ml-2"
                  />
                </div>
                <button
                  type="submit"
                  className="border-2 border-primary rounded-full px-12 py-2 inline-block font-semibold hover:bg-primary hover:text-white"
                >
                  Xác minh
                </button>
              </div>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ForgotPassword;
