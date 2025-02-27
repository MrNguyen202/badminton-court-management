"use client"
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";

const SignIn = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    password: "",
    resetPassword: "",
  });

  const [error, setError] = useState<string | null>(null); // Thêm state để chứa lỗi

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Kiểm tra tên
    const nameError = validateName(formData.name);
    if (nameError !== "Tên hợp lệ") {
      setError(nameError);  // Hiển thị lỗi
      return;
    }
    setError(null);  // Nếu tên hợp lệ, xóa lỗi

    // Kiểm tra số điện thoại
    if (!/^\d{10}$/.test(formData.phone)) {
      alert("Số điện thoại không hợp lệ!");
      return;
    }

    // Kiểm tra nếu mật khẩu không khớp
    if (formData.password !== formData.resetPassword) {
      alert("Mật khẩu không khớp!");
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:8080/api/auth/register",
        {
          name: formData.name,
          phone: formData.phone,
          address: formData.address,
          email: formData.email,
          password: formData.password,
        }
      );
      alert(response.data); // Hiển thị thông báo thành công
      router.push("/sign-in");
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
                      placeholder="Name"
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
                      placeholder="Phone"
                      onChange={handleChange}
                      required
                      className="bg-gray-100 outline-none text-sm flex-1 ml-2"
                    />
                  </div>
                  <div className="bg-gray-100 w-64 p-2 flex items-center mb-3">
                    <input
                      type="text"
                      name="address"
                      placeholder="Address"
                      onChange={handleChange}
                      required
                      className="bg-gray-100 outline-none text-sm flex-1 ml-2"
                    />
                  </div>
                  <div className="bg-gray-100 w-64 p-2 flex items-center mb-3">
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
                    <input
                      type="password"
                      name="resetPassword"
                      placeholder="Nhập lại Password"
                      onChange={handleChange}
                      required
                      className="bg-gray-100 outline-none text-sm flex-1 ml-2"
                    />
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

function validateName(name: string): string {
  // Kiểm tra tên không được rỗng
  if (name.trim() === '') {
    return "Tên không được để trống";
  }

  // Kiểm tra tên không phải là số
  if (!isNaN(Number(name))) {
    return "Tên không được là chữ số";
  }

  return "Tên hợp lệ";
}

export default SignIn;
