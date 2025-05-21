"use client";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { courtApi } from "../../../api/court-services/courtAPI";
import locationImage from "@/public/location.png";
import timeImage from "@/public/time.svg";
import courtImage from "@/public/football-field.gif";
import phoneImage from "@/public/telephone-stroke-rounded.svg";
import websiteImage from "@/public/internet-stroke-rounded.svg";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { subCourtScheduleApi } from "@/app/api/court-services/subCourtSchedule";
import MenuFocus from "./MenuFocus";
import Album from "./Album";
import Schedule from "./Schedule";
import Feedback from "./Feedback";
import Footer from "@/app/_components/Footer";
import MapInCourtDetail from "./MapInCourtDetail";

type User = {
  name: string;
  email: string;
  phone: string;
  address: string;
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

function CourtDetail() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const courtID = searchParams.get("courtID");
  const subCourtId = searchParams.get("subCourtId");
  const scheduleId = searchParams.get("bookedScheduleId");
  const message = searchParams.get("message");
  const [user, setUser] = useState<User | null>(null);
  const [court, setCourt] = useState<Court | null>(null);
  const [showSuccessToast, setShowSuccessToast] = useState(false);
  const [showErrorToast, setShowErrorToast] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    if (message === "success" && subCourtId && scheduleId) {
      const updateStatus = async () => {
        try {
          await subCourtScheduleApi.updateStatusSubCourtSchedule(
            Number(scheduleId),
            Number(subCourtId),
            "BOOKED"
          );
          setShowSuccessToast(true);

          const userInfo = JSON.parse(localStorage.getItem("user") || "null");

          if (userInfo) {
            const token = localStorage.getItem("token") || userInfo.token;
            const response = await fetch(
              "http://localhost:8080/api/paypal/success",
              {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                  email: userInfo.email,
                }),
              }
            );

            const result = await response.json();
            if (result.status === "success") {
              toast.success("Kiểm tra email nhé!");
            }
          }
        } catch (error: any) {
          setErrorMessage(error.message || "Cập nhật trạng thái thất bại");
          setShowErrorToast(true); // Kích hoạt toast lỗi
        }
      };
      updateStatus();
    } else if (message === "failed") {
      const cancelBooking = async () => {
        try {
          const response = await fetch(
            `http://localhost:8080/api/paypal/cancel?courtID=${courtID}&subCourtId=${subCourtId}&bookedScheduleId=${scheduleId}`,
            {
              method: "GET",
              headers: { "Content-Type": "application/json" },
            }
          );
          const result = await response.json();
          if (result.status === "success") {
            toast.success("Hủy thanh toán thành công!");
          } else {
            setErrorMessage(result.message || "Hủy thanh toán thất bại");
            setShowErrorToast(true);
          }
        } catch (error: any) {
          setErrorMessage(error.message || "Cập nhật trạng thái thất bại");
          setShowErrorToast(true);
        }
      };
      cancelBooking();
    }
  }, [searchParams]);

  // Hiển thị toast khi state thay đổi
  useEffect(() => {
    if (showSuccessToast) {
      toast.success("Thanh toán thành công! Đang cập nhật lại lịch", {
        onClose: () => setShowSuccessToast(false),
      });
    }
    if (showErrorToast) {
      toast.error(`Lỗi: ${errorMessage}`, {
        onClose: () => setShowErrorToast(false),
      });
    }
  }, [showSuccessToast, showErrorToast, errorMessage]);

  //menu items
  const itemMenu = [
    { label: "Trang chủ", link: "/" },
    { label: "Quản lý sân", link: "/owners" },
    { label: "Chi tiết sân", link: `/owners/court-detail?courtID=${courtID}` },
  ];

  //get court by id
  useEffect(() => {
    const fetchCourt = async () => {
      try {
        if (!courtID) return;
        const response = await courtApi.getCourtById(Number(courtID));
        setCourt(response);
      } catch (error) {
        console.error("Lỗi khi lấy danh sách sân:", error);
        setCourt(null);
        alert("Có lỗi xảy ra khi lấy danh sách sân.");
      }
    };
    fetchCourt();
  }, [courtID]);

  return (
    <div className="px-32 w-full mt-9 flex-col">
      <MenuFocus items={itemMenu} />
      <h1 className="text-3xl font-bold mt-6">{court?.name}</h1>
      <div className="flex justify-between items-center gap-4 mt-4">
        <div className="flex items-center gap-4">
          <img src={locationImage.src} alt="Location" className="w-8 h-8" />
          <h2 className="text-xl font-sans">
            {court?.address.specificAddress} - {court?.address.ward},{" "}
            {court?.address.district}, {court?.address.province}
          </h2>
        </div>
        <span className="text-xl font-sans">
          Đánh giá: {court?.numberOfSubCourts.toFixed(1)}⭐ (
          {court?.numberOfSubCourts} lượt)
        </span>
      </div>
      <div className="flex gap-4 mt-4">
        <div className="w-2/3 h-96">
          <Album
            items={
              court?.images?.map((image) => ({
                src: image.url,
                alt: `Image ${image.id}`,
              })) ?? []
            }
          />
        </div>
        <div className="w-1/3 border border-gray-300 rounded-md m-2 shadow-xl">
          <h2 className="text-xl font-bold border-l-4 border-orange-300 m-3 pl-3">
            Thông tin sân
          </h2>
          <div className="m-3 pt-2">
            <div className="flex justify-between items-center text-lg mt-2">
              <div className="flex items-center gap-2">
                <img src={timeImage.src} alt="" />
                <span>Giờ mở cửa:</span>
              </div>
              <span className="font-bold">
                {court?.openTime}h - {court?.closeTime}h
              </span>
            </div>
            <div className="flex justify-between items-center text-lg mt-2">
              <div className="flex items-center gap-2">
                <img src={courtImage.src} alt="" className="w-6 h-6" />
                <span>Số sân thi đấu:</span>
              </div>
              <span className="font-bold">{court?.numberOfSubCourts} sân</span>
            </div>
            <div className="flex justify-between items-center text-lg mt-2">
              <div className="flex items-center gap-2">
                <img src={phoneImage.src} alt="" />
                <span>Số điện thoại liên hệ:</span>
              </div>
              <span className="font-bold">{court?.phone}</span>
            </div>
            <div className="flex justify-between items-center text-lg mt-2">
              <div className="flex items-center gap-2">
                <img src={websiteImage.src} alt="" />
                <span>Website:</span>
              </div>
              <span className="font-bold">
                <a href={court?.linkWeb}>{court?.linkWeb}</a>
              </span>
            </div>
          </div>
          <div className="m-3 pt-2 pb-4 bg-slate-200 rounded-md">
            <h2 className="text-xl font-bold border-l-4 border-orange-300 m-3 pl-3">
              Tiện ích
            </h2>
            <ul className="grid grid-cols-3 gap-4 list-disc pl-8">
              {court?.utilities.split(",").map((utility, index) => (
                <li key={index} className="text-lg">
                  {utility}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
      {courtID && <Schedule courtID={Number(courtID)} />}
      <div>
        <MapInCourtDetail courtAddress={court?.address}/>
      </div>
      <Feedback courtID={Number(courtID)} />
      <Footer />
    </div>
  );
}

export default CourtDetail;
