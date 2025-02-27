"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import SignUpAdmin from "./_components/SignUpAdmin";
import RecommendedItem from "../_components/RecommendedItem";
import Footer from "../_components/Footer";
import userImage from "../../public/user-header.png";
import { ProvinceSelector } from "./_components/LocationComponent";
import { DistrictSelector } from "./_components/LocationComponent";
import { WardSelector } from "./_components/LocationComponent";
import CourtAlbumUploader from "./_components/CourtAlbumUploader";
import { courtApi } from "../api/court-services/courtAPI";


type User = {
  id: number;
  name: string;
  email: string;
  phone: string;
  address: string;
  role: string;
};

type Court = {
  id: number;
  name: string;
  address: Address;
  phone: string;
  description: string;
  numberOfCourts: number;
  status: string;
  userID: number;
  price: string;
  images: Image[] | null;
  courtSchedules: string[] | null;
  rating: number;
  district: string;
  utilities: string;
};

type Image = {
  id: number;
  url: string;
  courtID: number;
}

type Address = {
  province: number;
  district: number;
  ward: number;
  specificAddress: string;
}


function AdminPage() {
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();
  const [yourCourts, setYourCourts] = useState<Court[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  //address
  const [selectedProvince, setSelectedProvince] = useState<number | null>(null);
  const [selectedDistrict, setSelectedDistrict] = useState<number | null>(null);
  const [selectedWard, setSelectedWard] = useState<number | null>(null);

  const [images, setImages] = useState<File[]>([]);


  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  // Lấy danh sách sân của chủ sân
  useEffect(() => {
    const fetchCourts = async () => {
      try {
        if (user?.id !== undefined) {
          const response = await courtApi.getCourtByUserID(user.id);
          setYourCourts(response);
        }
      } catch (error) {
        console.error("Lỗi khi lấy danh sách sân:", error);
        setYourCourts([]);
        alert("Có lỗi xảy ra khi lấy danh sách sân.");
      }
    };
    fetchCourts();
  }, [user]);

  //create court function
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    // Chuẩn bị dữ liệu gửi đến backend
    const courtData = {
      name: formData.get("businessName"),
      phone: formData.get("businessPhone"),
      address: {
        province: selectedProvince,
        district: selectedDistrict,
        ward: selectedWard,
        specificAddress: formData.get("specificAddress"),
      },
      numberOfCourts: Number(formData.get("businessNumberOfCourt")),
      openTime: formData.get("businessOpenTime"),
      closeTime: formData.get("businessCloseTime"),
      utilities: [
        formData.get("amenities[wifi]") ? "Wifi" : "",
        formData.get("amenities[canteen]") ? "Căn tin" : "",
        formData.get("amenities[parking]") ? "Bãi giữ xe" : "",
        formData.get("amenities[lighting]") ? "Đèn chiếu sáng" : "",
        formData.get("amenities[racketRental]") ? "Thuê vợt" : "",
        formData.get("businessNew"),
      ].filter(Boolean).join(", "),
      description: formData.get("description"),
      websiteLink: formData.get("websiteLink"),
      mapLink: formData.get("mapLink"),
      userID: user?.id,
      images: images,
    };

    try {
      console.log("courtData", courtData);
      const response = await courtApi.createCourt(courtData);
      if (response) {
        alert("Tạo sân thành công!");
        setYourCourts((prevCourts) => {
          // Nếu prevCourts không phải mảng, khởi tạo lại
          const updatedCourts = Array.isArray(prevCourts) ? prevCourts : [];
          return [...updatedCourts, response];
        });
        setIsModalOpen(false);
      } else {
        alert("Tạo sân thất bại! Hãy thử lại.");
      }
    } catch (error) {
      console.error("Lỗi khi tạo sân:", error);
      alert("Có lỗi xảy ra khi tạo sân.");
    }
  };

  // Nếu chưa đăng nhập, hiển thị thông báo
  if (!user) return <p className="text-center mt-10">Bạn chưa đăng nhập</p>;

  // Nếu là USER, hiển thị nút đăng ký làm Admin
  const handleRegisterAsAdmin = async () => {
    try {
      const response = await axios.put("http://localhost:8080/api/users/update-role", {
        email: user.email,
        role: "ADMIN",
      });

      if (response.data.success) {
        const updatedUser = { ...user, role: "ADMIN" };
        localStorage.setItem("user", JSON.stringify(updatedUser)); // Cập nhật localStorage
        setUser(updatedUser); // Cập nhật state để re-render
        alert("Bạn đã trở thành Admin!");
      }
    } catch (error) {
      alert("Có lỗi xảy ra khi cập nhật quyền Admin.");
    }
  };

  // Nếu chưa là ADMIN, không cho truy cập trang
  if (user.role !== "ADMIN") {
    return (
      <div className="text-center mt-10">
        <h1 className="text-2xl font-bold">Bạn không phải Admin</h1>
        <p className="mt-2">Bạn cần đăng ký làm Admin để truy cập trang này.</p>
        <div className="mt-2 mb-20"><SignUpAdmin /></div>
        <RecommendedItem />
        <Footer />
      </div>
    );
  }

  //Mở modal đăng ký sân
  const handleRegister = () => {
    setIsModalOpen(true);
  };

  // Đóng modal đăng ký sân
  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  // Xem chi tiết sân
  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    // Chỉ đóng modal khi click vào overlay, không phải modal
    if (e.target === e.currentTarget) {
      handleCloseModal();
    }
  };

  // Hàm xử lý xóa sân
  const handleDelete = async (courtId: number) => {
    if (window.confirm("Bạn có chắc muốn xóa sân này?")) {
      try {
        await courtApi.deleteCourt(courtId); // Giả sử có API deleteCourt
        setYourCourts((prevCourts) => prevCourts.filter((court) => court.id !== courtId));
        alert("Xóa sân thành công!");
      } catch (error) {
        console.error("Lỗi khi xóa sân:", error);
        alert("Có lỗi xảy ra khi xóa sân.");
      }
    }
  };

  // Hàm xử lý xem chi tiết (có thể mở modal hoặc chuyển trang)
  const handleViewDetails = (court: Court) => {
    console.log("Xem chi tiết sân:", court);
    // Có thể mở modal hoặc chuyển hướng tới trang chi tiết
  };

  // Hàm xử lý sửa (có thể mở form chỉnh sửa)
  const handleEdit = (court: Court) => {
    console.log("Sửa sân:", court);
    // Có thể mở modal với form đã điền sẵn thông tin sân
  };

  return (
    <div className="px-5 flex w-full mt-9" >
      {/* Thông tin chủ sân */}
      <div className="w-1/4 px-6">
        <h1 className="text-2xl font-bold mb-3">Thông tin chủ sân</h1>
        <div className="border border-gray-300 p-4 rounded-lg shadow-md text-center">
          <img src={userImage.src} alt="Owner" className="w-24 h-24 rounded-full mx-auto" />
          <h2 className="text-xl font-bold mt-4">{user.name}</h2>
          <div className="mt-10 text-left">
            <p className="mb-3"><span className="font-bold">Email:</span> {user.email}</p>
            <p className="mb-3"><span className="font-bold">Số điện thoại:</span> {user.phone}</p>
            <p className="mb-3"><span className="font-bold">Địa chỉ:</span> {user.address}</p>
          </div>
        </div>
      </div>
      <div className="w-3/4 px-6 ">
        <h1 className="text-2xl font-bold mb-3">Danh sách sân của bạn</h1>
        <div className="border border-gray-300 p-4 rounded-lg shadow-md text-center">
          {/* Danh sách sân */}
          {yourCourts.length === 0 ? (
            <div className="py-10 text-center">
              <p className="text-gray-500">Bạn chưa có sân nào</p>
              <button
                className="mt-3 bg-slate-900 text-white px-4 py-2 rounded-md hover:bg-slate-700 transition duration-500"
                onClick={handleRegister}
              >
                Tạo sân mới
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {yourCourts.map((court) => (
                <div
                  key={court.id}
                  className="border border-gray-300 p-4 rounded-lg shadow-md hover:shadow-lg transition duration-300"
                >
                  <h2 className="text-xl font-bold text-gray-800 mb-2">{court.name}</h2>
                  <p className="text-gray-600 mb-4">
                    {court.address.specificAddress}, {court.address.ward}, {court.address.district},{" "}
                    {court.address.province}
                  </p>
                  <div className="flex justify-between gap-2">
                    <button
                      onClick={() => handleViewDetails(court)}
                      className="flex-1 bg-blue-500 text-white px-3 py-1 rounded-md hover:bg-blue-600 transition duration-300"
                    >
                      Xem chi tiết
                    </button>
                    <button
                      onClick={() => handleEdit(court)}
                      className="flex-1 bg-yellow-500 text-white px-3 py-1 rounded-md hover:bg-yellow-600 transition duration-300"
                    >
                      Sửa
                    </button>
                    <button
                      onClick={() => handleDelete(court.id!)}
                      className="flex-1 bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-600 transition duration-300"
                    >
                      Xóa
                    </button>
                  </div>
                </div>
              ))}
              <div className="border border-gray-300 p-4 rounded-lg shadow-md hover:shadow-lg transition duration-300">
                <button
                  className="w-full h-full flex items-center justify-center text-3xl text-gray-500 border-dashed border-4 border-gray-300 rounded-lg hover:border-gray-500 transition duration-300"
                  onClick={handleRegister}
                >
                  <span className="text-6xl">+</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
      {/* Modal */}
      {isModalOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center pointer-events-auto z-50"
          onClick={handleOverlayClick}
        >
          <div className="bg-white pl-4 py-6 rounded-lg shadow-lg w-full max-w-4xl pointer-events-auto">
            <h2 className="text-2xl font-bold text-gray-800 text-center mb-4">
              Đăng ký sân mới
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="max-h-[80vh] overflow-y-auto scrollbar-default">
                {/* Thông tin sân */}
                <div className="w-full">
                  <h3 className="text-lg font-bold text-green-600 mb-2">Thông tin sân</h3>
                  <div className="space-y-4">
                    <div>
                      <label htmlFor="businessName" className="block text-gray-700">
                        Tên sân
                      </label>
                      <input
                        type="text"
                        id="businessName"
                        name="businessName"
                        className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                        required
                      />
                    </div>
                    <div className="flex flex-col sm:flex-row gap-4">
                      <div className="w-full sm:w-1/4">
                        <label htmlFor="businessPhone" className="block text-gray-700">
                          Số điện thoại
                        </label>
                        <input
                          type="text"
                          id="businessPhone"
                          name="businessPhone"
                          className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                          required
                        />
                      </div>
                      <div className="w-full sm:w-1/4">
                        <label htmlFor="businessNumberOfCourt" className="block text-gray-700">
                          Số lượng sân
                        </label>
                        <input
                          type="number"
                          id="businessNumberOfCourt"
                          name="businessNumberOfCourt"
                          className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                          min="1"
                          required
                        />
                      </div>
                      <div className="w-full sm:w-2/4">
                        <label className="block text-gray-700">Thời gian hoạt động</label>
                        <div className="flex items-center gap-2">
                          <input
                            type="time"
                            id="businessOpenTime"
                            name="businessOpenTime"
                            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                            required
                          />
                          <span className="text-gray-700">-</span>
                          <input
                            type="time"
                            id="businessCloseTime"
                            name="businessCloseTime"
                            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                            required
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Tiện ích sân */}
                <div className="w-full">
                  <h3 className="text-lg font-bold text-green-600 mb-2">Tiện ích của sân</h3>
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                      {/* Wifi */}
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          id="wifi"
                          name="amenities[wifi]"
                          className="h-5 w-5 text-green-600 border-gray-300 rounded focus:ring-green-500"
                        />
                        <label htmlFor="wifi" className="ml-2 text-gray-700">Wifi</label>
                      </div>

                      {/* Căn tin */}
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          id="canteen"
                          name="amenities[canteen]"
                          className="h-5 w-5 text-green-600 border-gray-300 rounded focus:ring-green-500"
                        />
                        <label htmlFor="canteen" className="ml-2 text-gray-700">Căn tin</label>
                      </div>

                      {/* Bãi giữ xe */}
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          id="parking"
                          name="amenities[parking]"
                          className="h-5 w-5 text-green-600 border-gray-300 rounded focus:ring-green-500"
                        />
                        <label htmlFor="parking" className="ml-2 text-gray-700">Bãi giữ xe</label>
                      </div>

                      {/* Đèn chiếu sáng */}
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          id="lighting"
                          name="amenities[lighting]"
                          className="h-5 w-5 text-green-600 border-gray-300 rounded focus:ring-green-500"
                        />
                        <label htmlFor="lighting" className="ml-2 text-gray-700">Đèn chiếu sáng</label>
                      </div>

                      {/* Thuê vợt */}
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          id="racketRental"
                          name="amenities[racketRental]"
                          className="h-5 w-5 text-green-600 border-gray-300 rounded focus:ring-green-500"
                        />
                        <label htmlFor="racketRental" className="ml-2 text-gray-700">Thuê vợt</label>
                      </div>
                      {/* Khác */}
                      <div className="flex items-center">
                        <label htmlFor="businessNew" className="block text-gray-700">
                          Khác:
                        </label>
                        <input
                          type="text"
                          id="businessNew"
                          name="businessNew"
                          className="w-full h-8 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 ml-1 text-sm"
                          placeholder="Ví dụ: thuốc, bia,..."
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Địa chỉ */}
                <div>
                  <h3 className="text-lg font-bold text-green-600 mb-2">Địa chỉ</h3>
                  <div className="space-y-4">
                    {/* Tỉnh/Thành phố, Quận/Huyện, Phường/Xã - xếp ngang trên màn lớn */}
                    <div className="flex flex-col sm:flex-row gap-4">
                      <div className="w-full sm:w-1/3">
                        <ProvinceSelector onProvinceChange={setSelectedProvince} />
                      </div>
                      <div className="w-full sm:w-1/3">
                        <DistrictSelector provinceCode={selectedProvince} onDistrictChange={setSelectedDistrict} />
                      </div>
                      <div className="w-full sm:w-1/3">
                        <WardSelector districtCode={selectedDistrict} onWardChange={setSelectedWard} />
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4">
                      {/* Địa chỉ chi tiết */}
                      <div className="w-full sm:w-1/2">
                        <label htmlFor="specificAddress" className="block text-gray-700">
                          Địa chỉ chi tiết
                        </label>
                        <input
                          type="text"
                          id="specificAddress"
                          name="specificAddress"
                          className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                          placeholder="12 - Nguyễn Văn Bảo"
                          required
                        />
                      </div>

                      {/* Link website */}
                      <div className="w-full sm:w-1/2">
                        <label htmlFor="websiteLink" className="block text-gray-700">
                          Link website
                        </label>
                        <input
                          type="url"
                          id="websiteLink"
                          name="websiteLink"
                          className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                          placeholder="https://badminton.vn/"
                        />
                      </div>
                    </div>
                    {/* Link gg map */}
                    <div>
                      <label htmlFor="mapLink" className="block text-gray-700">
                        Link google map
                      </label>
                      <input
                        type="url"
                        id="mapLink"
                        name="mapLink"
                        className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                        placeholder="https://maps.app.goo.gl/6FBTRSJXuVsnPDfL7"
                      />
                    </div>
                  </div>
                </div>

                {/* Mô tả */}
                <div>
                  <h3 className="text-lg font-bold text-green-600 mb-2">Mô tả</h3>
                  <textarea
                    id="description"
                    name="description"
                    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 h-32" // Chiều cao 32px (8 rows ~ 200px), có thể điều chỉnh
                    placeholder="Nhập mô tả chi tiết về sân..."
                    required
                  />
                </div>

                {/* Album */}
                <div>
                  <CourtAlbumUploader onChange={setImages} />
                </div>
              </div>
              <div className="flex justify-end gap-2 pr-4">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="bg-gray-500 text-white py-2 px-4 rounded-lg hover:bg-gray-600 transition duration-300"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="bg-green-500 text-white py-2 px-4 rounded-lg hover:bg-green-600 transition duration-300"
                >
                  Đăng ký
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminPage;
