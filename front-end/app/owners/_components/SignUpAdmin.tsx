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

interface RoleUser {
  name: string;
  email: string;
  phone: string;
  address: string;
  role: string;
}

function SignUpAdmin() {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [user, setUser] = useState<RoleUser | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    role: "",
  });

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.role !== "ADMIN") {
      alert("Nhập chưa đúng!");
      return;
    }

    try {
      const response = await fetch(
        "http://localhost:8080/api/auth/update-role",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        }
      );

      const data = await response.json();
      if (response.ok) {
        alert("Đăng kí ADMIN thành công!");

        localStorage.setItem("user", JSON.stringify(data));
        setUser(data);
        onOpenChange();
        setTimeout(() => window.location.reload(), 500);
      } else {
        alert(data.error || "Đăng kí thất bại!");
      }
    } catch (error) {
      alert("Có lỗi xảy ra, vui lòng thử lại!");
    }
  };

  return (
    <>
      <button
        className="p-10 px-4 py-2 bg-blue-600 text-white rounded-lg shadow-lg hover:bg-blue-700 transition duration-300"
        onClick={onOpen}
      >
        Đăng kí làm chủ sân
      </button>

      <Modal isOpen={isOpen} onOpenChange={onOpenChange} size="lg">
        <ModalContent>
          <ModalHeader className="flex flex-col gap-1 text-center text-xl font-bold text-blue-600">
            Đăng kí làm chủ sân
          </ModalHeader>
          <ModalBody>
            <form className="space-y-4">
              <p>Xin chào {formData.name}</p>
              <Input
                label="Nhập chữ ADMIN để xác nhận"
                name="role"
                type="text"
                value={formData.role}
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

export default SignUpAdmin;
