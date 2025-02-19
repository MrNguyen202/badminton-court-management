// "use client";
// import { useState, useEffect } from "react";
// import Image from "next/image";

// export default function Page() {
//   // Danh sách các ảnh
//   const images = ["/shuttlecock.png", "/badminton1.png", "/badminton2.png", "/scoreboard.png"];

//   // State để lưu ảnh hiện tại
//   const [currentImageIndex, setCurrentImageIndex] = useState(0);

//   // Hiệu ứng để thay đổi ảnh sau 1-2 giây
//   useEffect(() => {
//     const interval = setInterval(() => {
//       setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
//     }, 2000); // Thay đổi ảnh sau mỗi 2 giây (2000ms)

//     return () => clearInterval(interval); // Dọn dẹp interval khi component unmount
//   }, [images.length]);

//   return (
//     <div className="grid grid-cols-1 md:grid-cols-2">
//       {/* Phần hiển thị ảnh */}
//       <div className="flex justify-center items-center mt-20">
//         <Image
//           src={images[currentImageIndex]} // Hiển thị ảnh hiện tại
//           alt="badminton"
//           width={400}
//           height={400}
//         />
//       </div>

//       {/* Phần SignIn */}
//       <div className="flex justify-center items-center order-first md:order-last mt-20">
//         {/* <SignIn /> */}
//       </div>
//     </div>
//   );
// }

"use client";
import React, { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import Image from "next/image";

const SignIn = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Xử lý điều hướng đến trang đăng ký
  const handleSignUpClick = () => {
    router.push("/sign-up");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:8080/api/auth/login",
        formData
      );
      if (response.data.status === "success") {
        // Lưu thông tin người dùng vào localStorage
        localStorage.setItem("user", JSON.stringify(response.data));

        alert(`Chào mừng ${response.data.email}!`);

        router.push("/dashboard"); // Chuyển đến trang dashboard
      }
    } catch (error) {
      alert("Đăng nhập thất bại! Kiểm tra lại thông tin đăng nhập.");
    }
  };
  console.log(formData);

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

              {/* login */}
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
                  <div className="flex justify-end w-64 mb-5">
                    <a href="#" className="text-xs">
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

          {/* 2 */}
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
