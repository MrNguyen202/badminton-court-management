"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import SignUpAdmin from "./_components/SignUpAdmin";
import RecommendedItem from "../_components/RecommendedItem";
import Footer from "../_components/Footer";
import userImage from "../../public/user-header.png";
import { ProvinceSelector } from "./_components/LocationComponent";
import { DistrictSelector } from "./_components/LocationComponent";
import { WardSelector } from "./_components/LocationComponent";
import CourtAlbumUploader from "./_components/CourtAlbumUploader";
import { courtApi } from "../../api/court-services/courtAPI";
import noImage from "../../public/no-product-image.jpg";
import location from "../../public/location.png";
import AddCourt from "./court-detail/_components/AddCourt";

type User = {
  id: number;
  name: string;
  email: string;
  phone: string;
  address: string;
  role: string;
};

type SubCourt = {
  id: number;
  subName: string;
  type: string;
};

type Court = {
  id: number;
  name: string;
  address: Address;
  phone: string;
  description: string;
  numberOfSubCourts: number;
  status: string;
  userID: number;
  images: Image[] | null;
  rating: number;
  district: string;
  utilities: string;
  openTime: string;
  closeTime: string;
  linkWeb: string;
  linkMap: string;
  subCourts: SubCourt[] | null;
  createDate: string;
};

type Image = {
  id: number;
  fileName: string;
  url: string;
  upLoadDate: string;
  upLoadBy: string;
};

type Address = {
  province: string;
  district: string;
  ward: string;
  specificAddress: string;
};

function AdminPage() {
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();
  const [yourCourts, setYourCourts] = useState<Court[]>([]);
  const [reloadTrigger, setReloadTrigger] = useState(0);

  // Callback để reload lịch
  const handleAddCourted = () => {
    setReloadTrigger((prev) => prev + 1); // Tăng giá trị để trigger useEffect
  };

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  console.log("User:", user);

  // Lấy danh sách sân của chủ sân
  // useEffect(() => {
  //   const fetchCourts = async () => {
  //     try {
  //       if (user?.id !== undefined) {
  //         const response = await courtApi.getCourtByUserID(user.id);
  //         setYourCourts(response);
  //       }
  //     } catch (error) {
  //       console.error("Lỗi khi lấy danh sách sân:", error);
  //       setYourCourts([]);
  //       alert("Có lỗi xảy ra khi lấy danh sách sân.");
  //     }
  //   };
  //   fetchCourts();
  // }, [user, router, reloadTrigger]);

  // console.log("Danh sách sân của bạn:", yourCourts);

  // Lấy danh sách sân của chủ sân
  useEffect(() => {
    const fetchCourts = async () => {
      try {
        if (!user || !user.id) {
          console.log("User hoặc user.id không tồn tại:", user);
          setYourCourts([]);
          return;
        }

        const token = localStorage.getItem("token");
        if (!token) {
          console.log("Token không tồn tại, chuyển hướng về đăng nhập");
          router.push("/sign-in");
          return;
        }

        const userId = Number(user.id);
        if (isNaN(userId)) {
          console.log("user.id không phải là số hợp lệ:", user.id);
          setYourCourts([]);
          return;
        }

        console.log("Gọi API với userID:", userId);
        const response = await courtApi.getCourtByUserID(userId);
        setYourCourts(response);
      } catch (error: any) {
        console.error("Lỗi khi lấy danh sách sân:", error.message);
        setYourCourts([]);
        alert("Có lỗi xảy ra khi lấy danh sách sân: " + error.message);
      }
    };

    fetchCourts();
  }, [user, router, reloadTrigger]);

  console.log("Danh sách sân của bạn:", yourCourts);

  // Nếu chưa đăng nhập, hiển thị thông báo
  if (!user) return <p className="text-center mt-10">Bạn chưa đăng nhập</p>;

  // Nếu chưa là ADMIN, không cho truy cập trang
  if (user.role !== "ADMIN") {
    return (
      <div className="text-center mt-10">
        <h1 className="text-2xl font-bold">Bạn không phải Admin</h1>
        <p className="mt-2">Bạn cần đăng ký làm Admin để truy cập trang này.</p>
        <div className="mt-2 mb-20">
          <SignUpAdmin />
        </div>
        <RecommendedItem />
        <Footer />
      </div>
    );
  }

  // Hàm xử lý xóa sân
  const handleDelete = async (courtId: number) => {
    if (window.confirm("Bạn có chắc muốn xóa sân này?")) {
      try {
        await courtApi.deleteCourt(courtId); // Giả sử có API deleteCourt
        setYourCourts((prevCourts) =>
          prevCourts.filter((court) => court.id !== courtId)
        );
        alert("Xóa sân thành công!");
      } catch (error) {
        console.error("Lỗi khi xóa sân:", error);
        alert("Có lỗi xảy ra khi xóa sân.");
      }
    }
  };

  // Hàm xử lý xem chi tiết (chuyển trang)
  const handleViewDetails = (court: Court) => {
    router.push(`/owners/court-detail?courtID=${court.id}`);
  };

  // Hàm xử lý sửa (có thể mở form chỉnh sửa)
  const handleEdit = (court: Court) => {
    console.log("Sửa sân:", court);
    // Có thể mở modal với form đã điền sẵn thông tin sân
  };

  return (
    <div className="px-5 flex w-full mt-9">
      {/* Thông tin chủ sân */}
      <div className="w-1/4 px-6">
        <h1 className="text-2xl font-bold mb-3">Thông tin chủ sân</h1>
        <div className="border border-gray-300 p-4 rounded-lg shadow-md text-center">
          <img
            src={userImage.src}
            alt="Owner"
            className="w-24 h-24 rounded-full mx-auto"
          />
          <h2 className="text-xl font-bold mt-4">{user.name}</h2>
          <div className="mt-10 text-left">
            <p className="mb-3">
              <span className="font-bold">Email:</span> {user.email}
            </p>
            <p className="mb-3">
              <span className="font-bold">Số điện thoại:</span> {user.phone}
            </p>
            <p className="mb-3">
              <span className="font-bold">Địa chỉ:</span> {user.address}
            </p>
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
              <AddCourt
                length={yourCourts.length}
                initialUser={user}
                onAddCourted={handleAddCourted}
              />
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {yourCourts.map((court) => (
                <div
                  key={court.id}
                  className="border border-gray-300 p-4 rounded-lg shadow-md hover:shadow-lg transition duration-300 max-h-72 justify-between flex-row"
                >
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
                    <div className="h-48 w-48 rounded-md bg-slate-200">
                      <img
                        src={court.images?.[0]?.url || noImage.src}
                        alt={court.name}
                        className="object-cover rounded-md w-full h-full"
                      />
                    </div>
                    <div className="text-left justify-start h-full">
                      <h2 className="text-xl font-bold text-gray-800 mb-4 ">
                        {court.name}
                      </h2>
                      <div className="flex">
                        <img
                          src={location.src}
                          alt="location"
                          className="w-5 h-5 mr-1"
                        />
                        <p className="text-gray-600 mb-4">
                          {court.address.specificAddress}, {court.address.ward},{" "}
                          {court.address.district}, {court.address.province}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="flex justify-between gap-2 mt-4">
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
              <AddCourt
                length={yourCourts.length}
                initialUser={user}
                onAddCourted={handleAddCourted}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default AdminPage;
