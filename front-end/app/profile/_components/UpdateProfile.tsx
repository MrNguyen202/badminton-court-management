"use client";
import { Button } from "@nextui-org/button";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
} from "@nextui-org/modal";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Input } from "@nextui-org/input";
import { userApi } from "@/api/user-services/userAPI";

interface User {
  name: string;
  email: string;
  phone: string;
  address: string;
  role: string;
}

export default function UpdateProfile() {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [user, setUser] = useState<User | null>(null);
  const [formData, setFormData] = useState<User>({
    name: "",
    email: "",
    phone: "",
    address: "",
    role: "",
  });
  const [error, setError] = useState<string | null>(null); // State để lưu thông báo lỗi

  const router = useRouter();

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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // const handleSubmit = async (e: React.FormEvent) => {
  //   e.preventDefault();

  //   const nameError = validateName(formData.name);
  //   if (nameError !== "Tên hợp lệ") {
  //     setError(nameError);
  //     return;
  //   }
  //   setError(null);

  //   if (!/^\d{10}$/.test(formData.phone)) {
  //     alert("Số điện thoại không hợp lệ!");
  //     return;
  //   }

  //   try {
  //     const token = localStorage.getItem("token");
  //     if (!token) {
  //       alert("Bạn chưa đăng nhập! Vui lòng đăng nhập lại.");
  //       router.push("/sign-in");
  //       return;
  //     }

  //     const response = await axios.post(
  //       "http://localhost:8080/api/auth/update-user",
  //       formData,
  //       {
  //         headers: {
  //           Authorization: `Bearer ${token}`,
  //         },
  //         withCredentials: true,
  //       }
  //     );

  //     if (response.status === 200) {
  //       alert("Cập nhật thành công!");
  //       localStorage.setItem("user", JSON.stringify(response.data));
  //       setUser(response.data);
  //       onOpenChange();
  //       setTimeout(() => window.location.reload(), 500);
  //     }
  //   } catch (error: any) {
  //     console.error("Lỗi cập nhật:", error);
  //     alert(error.response?.data?.error || "Không thể kết nối đến server!");
  //   }
  // };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const nameError = validateName(formData.name);
    if (nameError !== "Tên hợp lệ") {
      setError(nameError);
      return;
    }
    setError(null);

    if (!/^\d{10}$/.test(formData.phone)) {
      alert("Số điện thoại không hợp lệ!");
      return;
    }

    try {
      const data = await userApi.updateProfile(formData);
      alert("Cập nhật thành công!");
      localStorage.setItem("user", JSON.stringify(data));
      setUser(data);
      onOpenChange();
      setTimeout(() => window.location.reload(), 500);
    } catch (error: any) {
      alert(error.message);
    }
  };

  return (
    <>
      <button
        onClick={onOpen}
        className="px-4 py-2 bg-blue-600 text-white rounded-lg shadow-lg hover:bg-blue-700 transition duration-300"
      >
        Cập nhật thông tin
      </button>

      <Modal isOpen={isOpen} onOpenChange={onOpenChange} size="lg">
        <ModalContent>
          <ModalHeader className="flex flex-col gap-1 text-center text-xl font-bold text-blue-600">
            Cập nhật hồ sơ
          </ModalHeader>
          <ModalBody>
            <form className="space-y-4">
              <Input
                label="Email"
                name="email"
                value={formData.email}
                isReadOnly
                className="bg-gray-100 cursor-not-allowed"
              />
              <Input
                label="Họ và tên"
                name="name"
                value={formData.name}
                onChange={handleChange}
                isRequired
              />
              <Input
                label="Số điện thoại"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                isRequired
              />
              <Input
                label="Địa chỉ"
                name="address"
                value={formData.address}
                onChange={handleChange}
                isRequired
              />
              <Input
                label="Vai trò"
                name="role"
                value={formData.role}
                onChange={handleChange}
              />

              {/* Hiển thị thông báo lỗi tên nếu có */}
              {error && <p className="text-red-500">{error}</p>}
            </form>
          </ModalBody>
          <ModalFooter className="flex justify-end">
            <Button color="primary" onClick={handleSubmit}>
              Lưu
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}

function validateName(name: string): string {
  // Kiểm tra tên không được rỗng
  if (name.trim() === "") {
    return "Tên không được để trống";
  }

  // Kiểm tra tên không phải là số
  if (!isNaN(Number(name))) {
    return "Tên không được là chữ số";
  }

  return "Tên hợp lệ";
}
