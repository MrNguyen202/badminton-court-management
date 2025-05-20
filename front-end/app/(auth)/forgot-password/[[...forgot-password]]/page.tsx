"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { userApi } from "@/app/api/user-services/userAPI";
import Image from "next/image";

const ForgotPassword = () => {
  const router = useRouter();

  const [formData, setFormData] = useState({
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const togglePassword = () => setShowPassword(!showPassword);
  const toggleConfirmPassword = () =>
    setShowConfirmPassword(!showConfirmPassword);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      toast.error("Email không hợp lệ!");
      return;
    }

    if (!/^\d{10}$/.test(formData.phone)) {
      toast.error("Số điện thoại phải đủ 10 chữ số!");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      toast.error("Mật khẩu không khớp!");
      return;
    }

    try {
      const data = await userApi.forgotPassword({
        email: formData.email,
        phone: formData.phone,
        newPassword: formData.password,
      });
      if (data) {
        toast.success("Mật khẩu đã được đặt lại thành công!");
        router.push("/sign-in");
      }
    } catch (error: any) {
      toast.error(
        error.response?.data?.error ||
          "Đặt lại mật khẩu thất bại, vui lòng thử lại!"
      );
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-green-100 to-blue-100">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-3xl p-10">
        <h2 className="text-3xl font-bold text-primary mb-4 text-center">
          Quên mật khẩu
        </h2>
        <p className="text-gray-500 mb-6 text-center">
          Nhập email và số điện thoại để xác minh và đặt lại mật khẩu.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex items-center bg-gray-100 rounded-md px-3 py-2">
            <input
              type="email"
              name="email"
              placeholder="Email"
              onChange={handleChange}
              required
              className="bg-gray-100 outline-none text-sm flex-1"
            />
          </div>

          <div className="flex items-center bg-gray-100 rounded-md px-3 py-2">
            <input
              type="text"
              name="phone"
              placeholder="Số điện thoại"
              onChange={handleChange}
              required
              className="bg-gray-100 outline-none text-sm flex-1"
            />
          </div>

          <div className="flex items-center bg-gray-100 rounded-md px-3 py-2 relative">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Mật khẩu mới"
              onChange={handleChange}
              required
              className="bg-gray-100 outline-none text-sm flex-1 pr-8"
            />
            <span
              onClick={togglePassword}
              className="absolute right-3 cursor-pointer"
            >
              {showPassword ? (
                <Image src="/show-pass.png" width={20} height={20} alt="show" />
              ) : (
                <Image src="/hide-pass.png" width={20} height={20} alt="hide" />
              )}
            </span>
          </div>

          <div className="flex items-center bg-gray-100 rounded-md px-3 py-2 relative">
            <input
              type={showConfirmPassword ? "text" : "password"}
              name="confirmPassword"
              placeholder="Nhập lại mật khẩu mới"
              onChange={handleChange}
              required
              className="bg-gray-100 outline-none text-sm flex-1 pr-8"
            />
            <span
              onClick={toggleConfirmPassword}
              className="absolute right-3 cursor-pointer"
            >
              {showConfirmPassword ? (
                <Image src="/show-pass.png" width={20} height={20} alt="show" />
              ) : (
                <Image src="/hide-pass.png" width={20} height={20} alt="hide" />
              )}
            </span>
          </div>
          <div className="flex justify-end w-full mb-5">
            <a href="/sign-in" className="text-xs">
              <span className="text-primary hover:text-green-600 transition duration-300">
                Quay lại trang đăng nhập
              </span>
            </a>
          </div>
          <div className="flex justify-center mt-6">
            <button
              type="submit"
              className="bg-primary text-white px-8 py-2 rounded-full font-semibold hover:bg-green-600 transition duration-300"
            >
              Xác minh & Đặt lại mật khẩu
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ForgotPassword;
