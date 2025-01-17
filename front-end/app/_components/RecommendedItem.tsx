import Image from "next/image";
import React from "react";

function RecommendedItem() {
  return (
    <div className="pb-20 px-8 pt-20">
      <div className="container mx-auto grid grid-cols-1 gap-x-10 gap-y-20 md:grid-cols-2 xl:grid-cols-3">
        <div>
          <Image
            src="/football-field.gif"
            alt="badminton"
            width={300}
            height={300}
            className="mx-auto"
          />
          <p className="text-2xl font-bold pt-5 text-center">
            Tìm kiếm vị trí sân
          </p>
          <p className="text-center">
            Dữ liệu sân đấu dồi dào, liên tục cập nhật, giúp bạn dễ dàng tìm
            kiếm theo khu vực mong muốn
          </p>
        </div>
        <div>
          <Image
            src="/calendar.gif"
            alt="badminton"
            width={300}
            height={300}
            className="mx-auto"
          />
          <p className="text-2xl font-bold pt-5 text-center">Đặt lịch online</p>
          <p className="text-center">
            Không cần đến trực tiếp, không cần gọi điện đặt lịch, bạn hoàn toàn
            có thể đặt sân ở bất kì đâu có internet
          </p>
        </div>
        <div>
          <Image
            src="/football-player.gif"
            alt="badminton"
            width={300}
            height={300}
            className="mx-auto"
          />
          <p className="text-2xl font-bold pt-5 text-center">
            Tìm đối thủ, bắt cặp đấu
          </p>
          <p className="text-center">
            Tìm kiếm, giao lưu các đội thi đấu thể thao, kết nối, xây dựng cộng
            đồng thể thao sôi nổi, mạnh mẽ
          </p>
        </div>
      </div>
    </div>
  );
}

export default RecommendedItem;
