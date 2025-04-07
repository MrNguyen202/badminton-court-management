"use client";
import { useRouter, useParams, useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { courtApi } from "../../api/court-services/courtAPI";
import MenuFocus from "./_components/MenuFocus";
import locationImage from "../../../public/location.png";
import Album from "./_components/Album";
import timeImage from "../../../public/time.svg";
import courtImage from "../../../public/football-field.gif";
import phoneImage from "../../../public/telephone-stroke-rounded.svg";
import websiteImage from "../../../public/internet-stroke-rounded.svg";
import Schedule from "./_components/Schedule";
import Footer from "../../_components/Footer";

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

function page() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const courtID = searchParams.get("courtID");
    const [user, setUser] = useState<User | null>(null);
    const [court, setCourt] = useState<Court | null>(null);

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
                    <h2 className="text-xl font-sans">{court?.address.specificAddress} - {court?.address.ward}, {court?.address.district}, {court?.address.province}</h2>
                </div>
                <span className="text-xl font-sans">Đánh giá: {court?.numberOfSubCourts.toFixed(1)}⭐ ({court?.numberOfSubCourts} lượt)</span>
            </div>
            <div className="flex gap-4 mt-4">
                <div className="w-2/3 h-96">
                    <Album items={court?.images?.map(image => ({ src: image.url, alt: `Image ${image.id}` })) ?? []} />
                </div>
                <div className="w-1/3 border border-gray-300 rounded-md m-2 shadow-xl">
                    <h2 className="text-xl font-bold border-l-4 border-orange-300 m-3 pl-3">Thông tin sân</h2>
                    <div className="m-3 pt-2">
                        <div className="flex justify-between items-center text-lg mt-2">
                            <div className="flex items-center gap-2">
                                <img src={timeImage.src} alt="" />
                                <span>Giờ mở cửa:</span>
                            </div>
                            <span className="font-bold">{court?.openTime}h - {court?.closeTime}h</span>
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
                            <span className="font-bold"><a href={court?.linkWeb}>{court?.linkWeb}</a></span>
                        </div>
                    </div>
                    <div className="m-3 pt-2 pb-4 bg-slate-200 rounded-md">
                        <h2 className="text-xl font-bold border-l-4 border-orange-300 m-3 pl-3">Tiện ích</h2>
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
            <Footer/>
        </div>
    );
}

export default page;
