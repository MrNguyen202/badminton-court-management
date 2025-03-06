import React, { useEffect, useState } from "react";
import {
    Modal,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
    useDisclosure,
} from "@nextui-org/modal";
import { courtApi } from "../../../api/court-services/courtAPI";
import { ProvinceSelector } from "../../_components/LocationComponent";
import { DistrictSelector } from "../../_components/LocationComponent";
import { WardSelector } from "../../_components/LocationComponent";
import CourtAlbumUploader from "../../_components/CourtAlbumUploader";
import { on } from "events";

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
    imageFiles: Image[] | null;
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
    url: string;
    courtID: number;
};

type Address = {
    province: string;
    district: string;
    ward: string;
    specificAddress: string;
};

interface AddCourtProps {
    length: number;
    initialUser: User;
    onAddCourted: () => void;
};

function AddCourt({ length, initialUser, onAddCourted }: AddCourtProps) {
    const [user, setUser] = useState<User | null>(initialUser);
    const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
    const [images, setImages] = useState<File[]>([]);
    const [yourCourts, setYourCourts] = useState<Court[]>([]);
    const [numberOfSubCourts, setNumberOfSubCourts] = useState<number>(0);
    const [subCourts, setSubCourts] = useState<SubCourt[]>([]);

    const [selectedProvince, setSelectedProvince] = useState<string | null>(null);
    const [selectedDistrict, setSelectedDistrict] = useState<{ name: string | null; code: number | null }>({
        name: null,
        code: null,
    });
    const [selectedWard, setSelectedWard] = useState<string | null>(null);

    const handleNumberOfCourtsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = Number(e.target.value);
        setNumberOfSubCourts(value);
        
        setSubCourts(Array(value).fill(null).map((_, index) => ({
            id: 0, // Temporary ID, will be assigned by backend
            subName: `Sân ${index + 1}`,
            type: 'SINGLE'
        })));
    };

    const handleSubCourtChange = (index: number, field: keyof SubCourt, value: string) => {
        setSubCourts(prev => {
            const newSubCourts = [...prev];
            newSubCourts[index] = {
                ...newSubCourts[index],
                [field]: value
            };
            return newSubCourts;
        });
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);

        // Create court object matching the Court type
        const courtData: Partial<Court> = {
            name: formData.get("businessName") as string,
            phone: formData.get("businessPhone") as string,
            address: {
                province: selectedProvince || "",
                district: selectedDistrict.name || "",
                ward: selectedWard || "",
                specificAddress: formData.get("specificAddress") as string,
            },
            description: formData.get("description") as string,
            numberOfSubCourts: numberOfSubCourts,
            status: "pending", // Default status, adjust as needed
            userID: user?.id || 0,
            imageFiles: images.map((file, index) => ({
                id: 0, // Temporary ID, will be assigned by backend
                url: "", // URL will be set after upload
                courtID: 0 // Will be set after court creation
            })),
            rating: 0, // Default rating
            district: selectedDistrict.name || "",
            utilities: [
                formData.get("amenities[wifi]") ? "Wifi" : "",
                formData.get("amenities[canteen]") ? "Căn tin" : "",
                formData.get("amenities[parking]") ? "Bãi giữ xe" : "",
                formData.get("amenities[lighting]") ? "Đèn chiếu sáng" : "",
                formData.get("amenities[racketRental]") ? "Thuê vợt" : "",
                formData.get("businessNew") as string
            ].filter(Boolean).join(", "),
            openTime: formData.get("businessOpenTime") as string,
            closeTime: formData.get("businessCloseTime") as string,
            linkWeb: formData.get("websiteLink") as string,
            linkMap: formData.get("mapLink") as string,
            subCourts: subCourts,
            createDate: new Date().toISOString() // Current date
        };

        try {
            console.log("courtData", courtData);
            const response = await courtApi.createCourt(courtData);
            if (response) {
                alert("Tạo sân thành công!");
                setYourCourts((prevCourts) => {
                    const updatedCourts = Array.isArray(prevCourts) ? prevCourts : [];
                    return [...updatedCourts, response];
                });
                onAddCourted();
                onClose();
            }
        } catch (error) {
            console.error("Lỗi khi tạo sân:", error);
            alert("Có lỗi xảy ra khi tạo sân.");
        }
    };

    return (
        <>
            {length === 0 ? (
                <button
                    className="mt-3 bg-slate-900 text-white px-4 py-2 rounded-md hover:bg-slate-700 transition duration-500"
                    onClick={onOpen}
                >
                    Tạo sân mới
                </button>
            ) : (
                <div className="border border-gray-300 p-4 rounded-lg shadow-md hover:shadow-lg transition duration-300">
                    <button
                        className="w-full h-full flex items-center justify-center text-3xl text-gray-500 border-dashed border-4 border-gray-300 rounded-lg hover:border-gray-500 transition duration-300"
                        onClick={onOpen}
                    >
                        <span className="text-6xl">+</span>
                    </button>
                </div>
            )}
            <Modal
                isOpen={isOpen}
                onOpenChange={onOpenChange}
                size="5xl"
                scrollBehavior="inside"
                classNames={{
                    base: "max-h-[90vh]",
                    body: "overflow-y-auto",
                }}
            >
                <ModalContent>
                    <ModalHeader className="text-2xl font-bold text-gray-800 text-center mb-4">Đăng ký sân mới</ModalHeader>
                    <ModalBody>
                        <form id="form-id" onSubmit={handleSubmit} className="space-y-4">
                            <div className="max-h-[80vh] overflow-y-auto scrollbar-default">
                                <div className="w-full">
                                    <h3 className="text-lg font-bold text-green-600 mb-2">Thông tin sân</h3>
                                    <div className="space-y-4">
                                        <div>
                                            <label htmlFor="businessName" className="block text-gray-700">Tên sân</label>
                                            <input type="text" id="businessName" name="businessName" className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500" required />
                                        </div>
                                        <div className="flex flex-col sm:flex-row gap-4">
                                            <div className="w-full sm:w-1/4">
                                                <label htmlFor="businessPhone" className="block text-gray-700">Số điện thoại</label>
                                                <input type="text" id="businessPhone" name="businessPhone" className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500" required />
                                            </div>
                                            <div className="w-full sm:w-1/4">
                                                <label htmlFor="businessNumberOfCourt" className="block text-gray-700">Số lượng sân</label>
                                                <input
                                                    type="number"
                                                    id="businessNumberOfCourt"
                                                    name="businessNumberOfCourt"
                                                    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                                                    min="1"
                                                    required
                                                    onChange={handleNumberOfCourtsChange}
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

                                        {numberOfSubCourts > 0 && (
                                            <div className="mt-4">
                                                <h4 className="text-md font-semibold text-gray-700 mb-2">Thông tin các sân con</h4>
                                                {subCourts.map((subCourt, index) => (
                                                    <div key={index} className="border p-4 rounded-md mb-4">
                                                        <div className="flex flex-col gap-4">
                                                            <div>
                                                                <label className="block text-gray-700">Tên sân con</label>
                                                                <input
                                                                    type="text"
                                                                    value={subCourt.subName}
                                                                    onChange={(e) => handleSubCourtChange(index, 'subName', e.target.value)}
                                                                    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                                                                    required
                                                                />
                                                            </div>
                                                            <div>
                                                                <label className="block text-gray-700 mb-2">Loại sân</label>
                                                                <div className="flex gap-4">
                                                                    <label className="flex items-center">
                                                                        <input
                                                                            type="radio"
                                                                            name={`subCourtType-${index}`}
                                                                            value="SINGLE"
                                                                            checked={subCourt.type === 'SINGLE'}
                                                                            onChange={() => handleSubCourtChange(index, 'type', 'SINGLE')}
                                                                            className="mr-2"
                                                                        />
                                                                        Đơn
                                                                    </label>
                                                                    <label className="flex items-center">
                                                                        <input
                                                                            type="radio"
                                                                            name={`subCourtType-${index}`}
                                                                            value="DOUBLE"
                                                                            checked={subCourt.type === 'DOUBLE'}
                                                                            onChange={() => handleSubCourtChange(index, 'type', 'DOUBLE')}
                                                                            className="mr-2"
                                                                        />
                                                                        Đôi
                                                                    </label>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div className="w-full">
                                    <h3 className="text-lg font-bold text-green-600 mb-2">Tiện ích của sân</h3>
                                    <div className="space-y-4">
                                        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                                            <div className="flex items-center">
                                                <input type="checkbox" id="wifi" name="amenities[wifi]" className="h-5 w-5 text-green-600 border-gray-300 rounded focus:ring-green-500" />
                                                <label htmlFor="wifi" className="ml-2 text-gray-700">Wifi</label>
                                            </div>
                                            <div className="flex items-center">
                                                <input type="checkbox" id="canteen" name="amenities[canteen]" className="h-5 w-5 text-green-600 border-gray-300 rounded focus:ring-green-500" />
                                                <label htmlFor="canteen" className="ml-2 text-gray-700">Căn tin</label>
                                            </div>
                                            <div className="flex items-center">
                                                <input type="checkbox" id="parking" name="amenities[parking]" className="h-5 w-5 text-green-600 border-gray-300 rounded focus:ring-green-500" />
                                                <label htmlFor="parking" className="ml-2 text-gray-700">Bãi giữ xe</label>
                                            </div>
                                            <div className="flex items-center">
                                                <input type="checkbox" id="lighting" name="amenities[lighting]" className="h-5 w-5 text-green-600 border-gray-300 rounded focus:ring-green-500" />
                                                <label htmlFor="lighting" className="ml-2 text-gray-700">Đèn chiếu sáng</label>
                                            </div>
                                            <div className="flex items-center">
                                                <input type="checkbox" id="racketRental" name="amenities[racketRental]" className="h-5 w-5 text-green-600 border-gray-300 rounded focus:ring-green-500" />
                                                <label htmlFor="racketRental" className="ml-2 text-gray-700">Thuê vợt</label>
                                            </div>
                                            <div className="flex items-center">
                                                <label htmlFor="businessNew" className="block text-gray-700">Khác:</label>
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

                                <div>
                                    <h3 className="text-lg font-bold text-green-600 mb-2">Địa chỉ</h3>
                                    <div className="space-y-4">
                                        <div className="flex flex-col sm:flex-row gap-4">
                                            <div className="w-full sm:w-1/3">
                                                <ProvinceSelector onProvinceChange={setSelectedProvince} />
                                            </div>
                                            <div className="w-full sm:w-1/3">
                                                <DistrictSelector provinceName={selectedProvince} onDistrictChange={setSelectedDistrict} />
                                            </div>
                                            <div className="w-full sm:w-1/3">
                                                <WardSelector district={selectedDistrict} onWardChange={setSelectedWard} />
                                            </div>
                                        </div>
                                        <div className="flex flex-col sm:flex-row gap-4">
                                            <div className="w-full sm:w-1/2">
                                                <label htmlFor="specificAddress" className="block text-gray-700">Địa chỉ chi tiết</label>
                                                <input
                                                    type="text"
                                                    id="specificAddress"
                                                    name="specificAddress"
                                                    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                                                    placeholder="12 - Nguyễn Văn Bảo"
                                                    required
                                                />
                                            </div>
                                            <div className="w-full sm:w-1/2">
                                                <label htmlFor="websiteLink" className="block text-gray-700">Link website</label>
                                                <input
                                                    type="url"
                                                    id="websiteLink"
                                                    name="websiteLink"
                                                    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                                                    placeholder="https://badminton.vn/"
                                                />
                                            </div>
                                        </div>
                                        <div>
                                            <label htmlFor="mapLink" className="block text-gray-700">Link google map</label>
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

                                <div>
                                    <h3 className="text-lg font-bold text-green-600 mb-2">Mô tả</h3>
                                    <textarea
                                        id="description"
                                        name="description"
                                        className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 h-32"
                                        placeholder="Nhập mô tả chi tiết về sân..."
                                        required
                                    />
                                </div>

                                <div>
                                    <CourtAlbumUploader onChange={setImages} />
                                </div>
                            </div>
                        </form>
                    </ModalBody>
                    <ModalFooter>
                        <div className="flex justify-between w-full items-center">
                            <span className="text-gray-600">
                                Thêm sân để thu hút khách hàng đến với dịch vụ của bạn.
                            </span>
                            <div className="flex gap-2">
                                <button
                                    type="button"
                                    onClick={onClose}
                                    className="bg-gray-500 text-white py-2 px-4 rounded-lg hover:bg-gray-600 transition duration-300"
                                >
                                    Hủy
                                </button>
                                <button
                                    type="submit"
                                    form="form-id"
                                    className="bg-green-500 text-white py-2 px-4 rounded-lg hover:bg-green-600 transition duration-300"
                                >
                                    Đăng ký
                                </button>
                            </div>
                        </div>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    );
}

export default AddCourt;