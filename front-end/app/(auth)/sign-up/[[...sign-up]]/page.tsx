"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import Image from "next/image";

const SignIn = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    resetPassword: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Kiểm tra nếu mật khẩu không khớp
    if (formData.password !== formData.resetPassword) {
      alert("Mật khẩu không khớp!");
      return;
    }
  
    try {
      const response = await axios.post(
        "http://localhost:8080/api/auth/register",
        { 
          username: formData.username,
          email: formData.email,
          password: formData.password
        }
      );
      alert(response.data); // Hiển thị thông báo thành công
    } catch (error) {
      alert("Đăng ký thất bại!"); // Hiển thị thông báo lỗi
    }
  };
  

  // Xử lý điều hướng đến trang đăng ký
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
            <div className="py-10">
              <h2 className="text-3xl font-bold text-primary">Đăng kí</h2>
              <div className="border-2 w-10 border-green-500 inline-block mb-2"></div>
              <div className="flex justify-center my-2">
                <button className="mx-2">
                  <Image
                    src="/facebook.png"
                    width={50}
                    height={50}
                    alt="facebook"
                  />
                </button>
                <button className="mx-2">
                  <Image src="/IN.png" width={50} height={50} alt="IN" />
                </button>
                <button className="mx-2">
                  <Image src="/G.png" width={50} height={50} alt="G" />
                </button>
              </div>

              {/* login */}
              <p className="text-gray-400 my-3">
                Hãy điền vào các thông tin dưới đây
              </p>
              <form onSubmit={handleSubmit}>
                <div className="flex flex-col items-center">
                  <div className="bg-gray-100 w-64 p-2 flex items-center mb-3">
                    <Image src="/user.png" width={30} height={30} alt="mail" />
                    <input
                      type="username"
                      name="username"
                      placeholder="UserName"
                      onChange={handleChange}
                      required
                      className="bg-gray-100 outline-none text-sm flex-1 ml-2"
                    />
                  </div>
                  <div className="bg-gray-100 w-64 p-2 flex items-center mb-3">
                    <Image src="/mail.png" width={30} height={30} alt="mail" />
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
                    <Image
                      src="/lock.png"
                      width={30}
                      height={30}
                      alt="password"
                    />
                    <input
                      type="password"
                      name="password"
                      placeholder="Password"
                      onChange={handleChange}
                      required
                      className="bg-gray-100 outline-none text-sm flex-1 ml-2"
                    />
                  </div>
                  <div className="bg-gray-100 w-64 p-2 flex items-center mb-3">
                    <Image
                      src="/reset-password.png"
                      width={30}
                      height={30}
                      alt="password"
                    />
                    <input
                      type="password"
                      name="resetPassword"
                      placeholder="Nhập lại Password"
                      onChange={handleChange}
                      required
                      className="bg-gray-100 outline-none text-sm flex-1 ml-2"
                    />
                  </div>
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
            <p className="mb-10">
              Chào mừng đến với BT.
              <p>Đăng ký ngay để chơi cùng mọi người nhé.</p>
            </p>

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

export default SignIn;
