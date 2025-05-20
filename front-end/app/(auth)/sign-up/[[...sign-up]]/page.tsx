"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { userApi } from "@/app/api/user-services/userAPI";
import Image from "next/image";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const SignUp = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    password: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [error, setError] = useState<string | null>(null); // Thêm state để chứa lỗi

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Kiểm tra mật khẩu khớp
    if (formData.password !== formData.confirmPassword) {
      toast.error("Mật khẩu không khớp!");
      return;
    }

    // Kiểm tra định dạng email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      toast.error("Email không hợp lệ!");
      return;
    }

    // Kiểm tra số điện thoại
    if (!/^\d{10}$/.test(formData.phone)) {
      toast.error(
        "Số điện thoại không hợp lệ! Vui lòng nhập số điện thoại 10 chữ số."
      );
      return;
    }

    try {
      const userData = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        password: formData.password,
        address: formData.address,
      };

      const data = await userApi.register(userData);
      toast.success("Đăng ký thành công!");
      router.push("/");
      setTimeout(() => window.location.reload(), 500);
      // router.push("/sign-in");
    } catch (error: any) {
      toast.error("Đăng ký thất bại!");
    }
  };

  const handleSignInClick = () => {
    router.push("/sign-in");
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2 bg-gray-100">
      <main className="flex flex-col items-center justify-center w-full flex-1 px-20 text-center">
        <div className="bg-white rounded-2xl shadow-2xl flex w-2/3 max-w-4xl">
          {/* 1 */}
          <div className="w-3/5 p-5">
            <div className="text-left font-bold">
              <span className="text-primary">B</span>T
            </div>
            <div className="py-5">
              <h2 className="text-3xl font-bold text-primary">Đăng kí</h2>
              <div className="border-2 w-10 border-green-500 inline-block"></div>

              {/* login */}
              <p className="text-gray-400 mb-2">
                Hãy điền vào các thông tin dưới đây
              </p>
              <form onSubmit={handleSubmit}>
                <div className="flex flex-col items-center">
                  {/* Input Fields */}
                  <div className="bg-gray-100 w-64 p-2 flex items-center mb-3">
                    <input
                      type="text"
                      name="name"
                      placeholder="Tên tài khoản"
                      onChange={handleChange}
                      required
                      className="bg-gray-100 outline-none text-sm flex-1 ml-2"
                    />
                  </div>
                  <div className="bg-gray-100 w-64 p-2 flex items-center mb-3">
                    <input
                      type="email"
                      name="email"
                      placeholder="Email"
                      onChange={handleChange}
                      required
                      className="bg-gray-100 outline-none text-sm flex-1 ml-2"
                    />
                  </div>
                  <div className="bg-gray-100 w-64 p-2 flex items-center mb-3">
                    <input
                      type="text"
                      name="phone"
                      placeholder="Số điện thoại"
                      onChange={handleChange}
                      required
                      className="bg-gray-100 outline-none text-sm flex-1 ml-2"
                    />
                  </div>
                  <div className="bg-gray-100 w-64 p-2 flex items-center mb-3">
                    <input
                      type="text"
                      name="address"
                      placeholder="Địa chỉ"
                      onChange={handleChange}
                      required
                      className="bg-gray-100 outline-none text-sm flex-1 ml-2"
                    />
                  </div>
                  <div className="bg-gray-100 w-64 p-2 flex items-center mb-3">
                    <div className="relative w-64">
                      <input
                        type={showPassword ? "text" : "password"}
                        name="password"
                        placeholder="Mật khẩu"
                        onChange={handleChange}
                        required
                        className="bg-gray-100 outline-none text-sm flex-1 ml-2 w-full"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-1 top-1/2 transform -translate-y-1/2 text-sm"
                      >
                        {showPassword ? (
                          <Image
                            src="/show-pass.png"
                            width={25}
                            height={25}
                            alt="show"
                          />
                        ) : (
                          <Image
                            src="/hide-pass.png"
                            width={25}
                            height={25}
                            alt="hide"
                          />
                        )}
                      </button>
                    </div>
                  </div>
                  <div className="bg-gray-100 w-64 p-2 flex items-center mb-3">
                    <div className="relative w-64">
                      <input
                        type={showConfirmPassword ? "text" : "password"}
                        name="confirmPassword"
                        placeholder="Nhập lại mật khẩu"
                        onChange={handleChange}
                        required
                        className="bg-gray-100 outline-none text-sm flex-1 ml-2 w-full"
                      />
                      <button
                        type="button"
                        onClick={() =>
                          setShowConfirmPassword(!showConfirmPassword)
                        }
                        className="absolute right-1 top-1/2 transform -translate-y-1/2 text-sm"
                      >
                        {showConfirmPassword ? (
                          <Image
                            src="/show-pass.png"
                            width={25}
                            height={25}
                            alt="show"
                          />
                        ) : (
                          <Image
                            src="/hide-pass.png"
                            width={25}
                            height={25}
                            alt="hide"
                          />
                        )}
                      </button>
                    </div>
                  </div>
                  {/* Hiển thị thông báo lỗi nếu có */}
                  {error && <p className="text-red-500">{error}</p>}
                  <button
                    type="submit"
                    className="border-2 border-primary rounded-full px-12 py-2 inline-block font-semibold hover:bg-primary hover:text-white"
                  >
                    Đăng kí
                  </button>
                </div>
              </form>
            </div>
          </div>

          {/* 2 */}
          <div className="w-2/5 bg-primary text-white rounded-tr-2xl rounded-br-2xl py-36 px-12">
            <h2 className="text-3xl font-bold mb-2">Chào bạn!</h2>
            <div className="border-2 w-10 border-white inline-block mb-2"></div>
            <p>Chào mừng đến với BT.</p>

            <p className="mb-10">Đăng ký ngay để chơi cùng mọi người nhé.</p>

            <button
              onClick={handleSignInClick}
              className="border-2 border-white rounded-full px-12 py-2 inline-block font-semibold hover:bg-white hover:text-primary"
            >
              Đăng nhập
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default SignUp;
