"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { userApi } from "@/app/api/user-services/userAPI";

const SignIn = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);

  const [user, setUser] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSignUpClick = () => {
    router.push("/sign-up");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const loginData = await userApi.login(formData.email, formData.password);
      localStorage.setItem("token", loginData.token);
      const userInfo = await userApi.getMe();
      localStorage.setItem("user", JSON.stringify(userInfo));
      alert("Đăng nhập thành công!");
      router.push("/");
      setTimeout(() => window.location.reload(), 500);
    } catch (error: any) {
      alert(error.message);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-green-100 to-blue-100">
      <main className="flex flex-col items-center justify-center w-full flex-1 px-20 text-center">
        <div className="bg-white rounded-2xl shadow-2xl flex w-2/3 max-w-4xl">
          <div className="w-3/5 p-5">
            <div className="text-left font-bold">
              <span className="text-primary">B</span>T
            </div>
            <div className="py-10">
              <h2 className="text-3xl font-bold text-primary">Đăng nhập</h2>
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

              <p className="text-gray-400 my-3">Sử dụng tài khoản email</p>
              <form onSubmit={handleSubmit}>
                <div className="flex flex-col items-center">
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

                  <div className="bg-gray-100 w-64 p-2 flex items-center mb-3 relative">
                    <Image
                      src="/lock.png"
                      width={30}
                      height={30}
                      alt="password"
                    />
                    <input
                      type={showPassword ? "text" : "password"}
                      name="password"
                      placeholder="Mật khẩu"
                      onChange={handleChange}
                      required
                      className="bg-gray-100 outline-none text-sm flex-1 ml-2 pr-8"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2"
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

                  <div className="flex justify-end w-64 mb-5">
                    <a href="/forgot-password" className="text-xs">
                      Quên mật khẩu?
                    </a>
                  </div>

                  <button
                    type="submit"
                    className="border-2 border-primary rounded-full px-12 py-2 inline-block font-semibold hover:bg-primary hover:text-white"
                  >
                    Đăng nhập
                  </button>
                </div>
              </form>
            </div>
          </div>

          <div className="w-2/5 bg-primary text-white rounded-tr-2xl rounded-br-2xl py-36 px-12">
            <h2 className="text-3xl font-bold mb-2">Chào bạn!</h2>
            <div className="border-2 w-10 border-white inline-block mb-2"></div>
            <p className="mb-10">
              Điền vào thông tin cá nhân và bắt đầu ra sân nào.
            </p>
            <button
              onClick={handleSignUpClick}
              className="border-2 border-white rounded-full px-12 py-2 inline-block font-semibold hover:bg-white hover:text-primary"
            >
              Đăng kí
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default SignIn;
