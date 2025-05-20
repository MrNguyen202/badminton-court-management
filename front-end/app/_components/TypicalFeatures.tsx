import Image from "next/image";
import React from "react";

const features = [
  {
    title: "Đặt thuê sân trực tuyến",
    description:
      "Khách có thể đặt lịch thuê sân ngay cả khi ngoài giờ làm việc và nhận được xác nhận đặt lịch tự động nhanh chóng từ hệ thống.",
    icon: <Image src="/check-blue.png" alt="calendar" width={50} height={50} />,
  },
  {
    title: "Sắp xếp và quản lý sân",
    description:
      "Thiết lập và theo dõi tình trạng sân như: sân trống, sân đã đặt, đang có khách, đang sửa chữa...",
    icon: <Image src="/check-red.png" alt="calendar" width={30} height={30} />,
  },
  {
    title: "Quản lý lịch hẹn đặt sân",
    description:
      "Quản lý thông tin lịch hẹn, thông tin khách hàng. Cho phép hẹn đặt lịch sân cố định thời gian tùy theo yêu cầu.",
    icon: (
      <Image src="/check-green.png" alt="calendar" width={50} height={50} />
    ),
  },
  {
    title: "SMS, Email thông báo lịch đặt sân",
    description:
      "Gửi tin nhắn xác nhận lịch đặt sân, nhắc lịch, hủy lịch, thay đổi thời gian đặt...",
    icon: (
      <Image
        src="/check-blue-white.png"
        alt="calendar"
        width={34}
        height={34}
      />
    ),
  },
  {
    title: "Quản lý đa nền tảng",
    description:
      "Dễ dàng sử dụng trên các nền tảng: mobile app, trình duyệt web cùng nhiều loại thiết bị khác nhau có kết nối Internet.",
    icon: (
      <Image src="/check-orange.png" alt="calendar" width={50} height={50} />
    ),
  },
  {
    title: "Báo cáo - Thống kê",
    description:
      "Theo dõi doanh thu và các thống kê về lịch đặt sân như: số lượng lịch đặt sân theo tuần/tháng/năm...",
    icon: (
      <Image src="/check-blue-dark.png" alt="calendar" width={50} height={50} />
    ),
  },
];

function TypicalFeatures() {
  return (
    <div className="bg-gray-100 mt-20 px-8 bg-gradient-to-br from-green-100 to-blue-100">
      <div className=" min-h-screen flex justify-center items-center">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          <div className="ml-10">
            <h2 className="text-5xl font-bold text-gray-800">
              Tính năng tiêu biểu
            </h2>
            <p className="text-gray-600 mt-2 text-xl">
              Giải pháp số quản lý tối ưu lịch hẹn đặt sân tập, sân bóng đá, sân
              cầu lông...
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 gap-4 max-w-4xl mx-auto mt-6">
              {features.map((feature, index) => (
                <div key={index} className="row">
                  <div className="mb-30 flex justify-start items-center bg-white shadow-lg rounded-lg p-4">
                    <div className="w-20">{feature.icon}</div>
                    <div className="w-100 h-100 p-4 rounded-lg ml-4">
                      <p className="text-2xl font-semibold mt-4 text-gray-800">
                        {feature.title}
                      </p>
                      <p className="text-gray-600 mt-2 text-x">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-center items-center">
            <Image
              src="/tinh-nang-tieu-bieu.png"
              alt="features"
              width={1000}
              height={1000}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default TypicalFeatures;
