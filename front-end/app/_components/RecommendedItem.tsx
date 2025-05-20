import Image from "next/image";
import React from "react";

const features = [
  {
    title: "Đặt sân online 24/7",
    desc: "Khách dễ dàng đặt sân qua website hoặc ứng dụng di động tiện lợi.",
    icon: (
      <Image
        src="/football-field.gif"
        alt="badminton"
        width={100}
        height={100}
        className="mx-auto"
        unoptimized={true}
      />
    ),
  },
  {
    title: "Tối ưu lịch hẹn",
    desc: "Quản lý thời gian đặt sân và sắp xếp lịch hẹn tự động giúp tối ưu lịch trống.",
    icon: (
      <Image
        src="/check-calendar.gif"
        alt="badminton"
        width={100}
        height={100}
        className="mx-auto"
        unoptimized={true}
      />
    ),
  },
  {
    title: "Tương thích nhiều thiết bị",
    desc: "Hoạt động tốt trên điện thoại di động, laptop, PC...",
    icon: (
      <Image
        src="/pc-tablet-phone.gif"
        alt="badminton"
        width={100}
        height={100}
        className="mx-auto"
        unoptimized={true}
      />
    ),
  },
  {
    title: "Nâng cao doanh thu",
    desc: "Tăng lượt khách đặt sân, tiết kiệm chi phí vận hành cho chủ sân.",
    icon: (
      <Image
        src="/doanh-thu.gif"
        alt="badminton"
        width={100}
        height={100}
        className="mx-auto"
        unoptimized={true}
      />
    ),
  },
  {
    title: "Đơn giản, dễ dàng sử dụng",
    desc: "Giao diện thân thiện, làm quen sau 5 phút.",
    icon: (
      <Image
        src="/click-base.gif"
        alt="badminton"
        width={100}
        height={100}
        className="mx-auto"
        unoptimized={true}
      />
    ),
  },
  {
    title: "Chi phí hợp lý",
    desc: "Chỉ từ 6.000 đồng/ngày để sở hữu ngay một phần mềm quản lý thông minh.",
    icon: (
      <Image
        src="/dollar.gif"
        alt="badminton"
        width={100}
        height={100}
        className="mx-auto"
        unoptimized={true}
      />
    ),
  },
  {
    title: "Luôn cập nhật phiên bản mới",
    desc: "Hỗ trợ nâng cấp phần mềm với các tính năng mới nhất.",
    icon: (
      <Image
        src="/update.gif"
        alt="badminton"
        width={100}
        height={100}
        className="mx-auto"
        unoptimized={true}
      />
    ),
  },
  {
    title: "Triển khai, hỗ trợ nhanh chóng",
    desc: "Tư vấn, triển khai và hỗ trợ kỹ thuật nhanh chóng.",
    icon: (
      <Image
        src="/helpdesk.gif"
        alt="badminton"
        width={100}
        height={100}
        className="mx-auto"
        unoptimized={true}
      />
    ),
  },
];

function RecommendedItem() {
  return (
    <section className="pb-20 px-8 pt-20 bg-[#eef1f6] py-12 text-center bg-gradient-to-br from-blue-100 to-green-100">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-5xl font-bold text-gray-800">
          Điểm khác biệt của phần mềm quản lý lịch hẹn đặt sân BT
        </h2>
        <p className="text-gray-600 mt-2 text-xl">
          Quản lý lịch hẹn tối ưu, thao tác đơn giản, dễ sử dụng.
        </p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 max-w-6xl mx-auto mt-8">
        {features.map((feature, index) => (
          <div
            key={index}
            className="px-6 py-14 bg-white shadow-lg rounded-xl text-center"
          >
            <div className="w-20 h-20 mx-auto flex items-center justify-center">
              {feature.icon}
            </div>
            <h3 className="text-2xl font-semibold mt-4 text-gray-800">
              {feature.title}
            </h3>
            <p className="text-gray-600 mt-2 text-x">{feature.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

export default RecommendedItem;
