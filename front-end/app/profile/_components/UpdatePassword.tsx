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

interface User {
  email: string;
  confirmPassword: string;
  currentPassword: string;
  newPassword: string;
}

export default function UpdatePassword() {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [user, setUser] = useState<User | null>(null);
  const [formData, setFormData] = useState({
    email: "",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const router = useRouter();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const userData = JSON.parse(storedUser);
      setFormData((prev) => ({ ...prev, email: userData.email }));
    } else {
      alert("Vui lòng đăng nhập trước!");
      router.push("/sign-in");
    }
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.newPassword !== formData.confirmPassword) {
      alert("Mật khẩu không khớp!");
      return;
    }

    try {
      const response = await fetch(
        "http://localhost:8080/api/auth/update-password",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: formData.email,
            currentPassword: formData.currentPassword,
            newPassword: formData.newPassword,
          }),
        }
      );

      const data = await response.json();
      if (response.ok) {
        alert("Cập nhật mật khẩu thành công!");
        // localStorage.removeItem("user"); // Xóa thông tin cũ, yêu cầu đăng nhập lại
        // router.push("/sign-in");

        localStorage.setItem("user", JSON.stringify(data));
        setUser(data);
        onOpenChange();
        setTimeout(() => window.location.reload(), 500);
      } else {
        alert(data.error || "Cập nhật thất bại!");
      }
    } catch (error) {
      alert("Có lỗi xảy ra, vui lòng thử lại!");
    }
  };

  return (
    <>
      <button onClick={onOpen}>Thay đổi mật khẩu</button>

      <Modal isOpen={isOpen} onOpenChange={onOpenChange} size="lg">
        <ModalContent>
          <ModalHeader className="flex flex-col gap-1 text-center text-xl font-bold text-blue-600">
            Thay đổi mật khẩu
          </ModalHeader>
          <ModalBody>
            <form className="space-y-4">
              <Input
                label="Mật khẩu hiện tại"
                name="currentPassword"
                type="password"
                value={formData.currentPassword}
                onChange={handleChange}
                isRequired
              />
              <Input
                label="Mật khẩu mới"
                name="newPassword"
                type="password"
                value={formData.newPassword}
                onChange={handleChange}
                isRequired
              />
              <Input
                label="Nhập lại mật khẩu mới"
                name="confirmPassword"
                type="password"
                value={formData.confirmPassword}
                onChange={handleChange}
                isRequired
              />
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
