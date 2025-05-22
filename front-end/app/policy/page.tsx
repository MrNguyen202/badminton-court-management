"use client";

import Footer from "../_components/Footer";

export default function PolicyPage() {
  return (
    <div>
      <div className="min-h-screen py-12 px-4 bg-gradient-to-br from-blue-100 to-green-100">
        <div className="max-w-3xl mx-auto bg-white p-8 shadow-lg rounded-lg">
          <h1 className="text-3xl font-bold text-center text-blue-600 decoration-blue-400 mb-8">
            Chính Sách Sử Dụng Dịch Vụ BT
          </h1>

          <section className="mb-6">
            <h2 className="text-xl font-semibold text-gray-900">
              1. Giới thiệu
            </h2>
            <p className="text-gray-700 mt-2 leading-relaxed">
              Trang web đặt sân cầu lông giúp người dùng tìm kiếm, đặt lịch và
              quản lý sân cầu lông thuận tiện. Khi sử dụng dịch vụ, bạn cần tuân
              thủ các điều khoản dưới đây.
            </p>
          </section>

          <section className="mb-6">
            <h2 className="text-xl font-semibold text-gray-900">
              2. Quyền và trách nhiệm của người dùng
            </h2>
            <ul className="list-disc pl-6 text-gray-700 mt-2 space-y-1">
              <li>
                Người dùng phải cung cấp thông tin chính xác khi đăng ký tài
                khoản.
              </li>
              <li>
                Không được sử dụng trang web vào mục đích vi phạm pháp luật.
              </li>
              <li>
                Người dùng có thể đăng ký làm Chủ sân để quản lý sân của mình.
              </li>
              <li>
                Chịu trách nhiệm bảo mật tài khoản và tuân theo quy định đặt
                sân.
              </li>
            </ul>
          </section>

          <section className="mb-6">
            <h2 className="text-xl font-semibold text-gray-900">
              3. Quyền và trách nhiệm của Chủ sân
            </h2>
            <ul className="list-disc pl-6 text-gray-700 mt-2 space-y-1">
              <li>Chủ sân có quyền đăng tải, cập nhật thông tin sân.</li>
              <li>Đảm bảo thông tin chính xác, cập nhật thường xuyên.</li>
              <li>
                Chịu trách nhiệm giải quyết các khiếu nại liên quan đến sân.
              </li>
            </ul>
          </section>

          <section className="mb-6">
            <h2 className="text-xl font-semibold text-gray-900">
              4. Chính sách thanh toán
            </h2>
            <ul className="list-disc pl-6 text-gray-700 mt-2 space-y-1">
              <li>Hỗ trợ thanh toán trực tuyến hoặc trực tiếp tại sân.</li>
              <li>Chấp nhận chuyển khoản, ví điện tử hoặc tiền mặt.</li>
              <li>Mọi giao dịch cần tuân theo quy định bảo mật.</li>
            </ul>
          </section>

          <section className="mb-6">
            <h2 className="text-xl font-semibold text-gray-900">
              5. Chính sách hủy đặt sân
            </h2>
            <ul className="list-disc pl-6 text-gray-700 mt-2 space-y-1">
              <li>Hủy đặt sân theo quy định của từng chủ sân.</li>
              <li>
                Các khoản hoàn tiền (nếu có) xử lý theo chính sách chủ sân.
              </li>
              <li>Tranh chấp về hủy đặt sân sẽ do chủ sân quyết định.</li>
            </ul>
          </section>

          <section className="mb-6">
            <h2 className="text-xl font-semibold text-gray-900">
              6. Bảo mật thông tin
            </h2>
            <ul className="list-disc pl-6 text-gray-700 mt-2 space-y-1">
              <li>Cam kết bảo vệ thông tin cá nhân người dùng.</li>
              <li>Không chia sẻ thông tin cá nhân nếu không có sự đồng ý.</li>
              <li>
                Cho phép người dùng yêu cầu chỉnh sửa hoặc xóa dữ liệu cá nhân.
              </li>
            </ul>
          </section>

          <section className="mb-6">
            <h2 className="text-xl font-semibold text-gray-900">
              7. Điều khoản sử dụng dịch vụ
            </h2>
            <ul className="list-disc pl-6 text-gray-700 mt-2 space-y-1">
              <li>Có quyền đình chỉ tài khoản vi phạm quy định.</li>
              <li>Xử lý nghiêm hành vi gian lận, lạm dụng hệ thống.</li>
              <li>
                Không được sử dụng nội dung trang web cho mục đích thương mại
                khi chưa có sự đồng ý.
              </li>
            </ul>
          </section>

          <section className="mb-6">
            <h2 className="text-xl font-semibold text-gray-900">
              8. Thay đổi chính sách
            </h2>
            <p className="text-gray-700 mt-2 leading-relaxed">
              Chính sách này có thể thay đổi mà không cần báo trước. Người dùng
              cần kiểm tra thường xuyên để cập nhật. Nếu có thắc mắc, vui lòng
              liên hệ với chúng tôi qua email hoặc số điện thoại hỗ trợ.
            </p>
          </section>

          <section className="mb-6">
            <h2 className="text-xl font-semibold text-gray-900">9. Cam kết</h2>
            <ul className="list-disc pl-6 text-gray-700 mt-2 space-y-1">
              <li>
                Mọi thành viên và đối tác khi sử dụng BT là đã chấp thuận tuân
                theo quy chế này.
              </li>
              <li>
                Mọi thắc mắc của đối tác, thành viên vui lòng liên hệ với BT
                theo thông tin dưới đây
              </li>
              <li>Địa chỉ liên lạc chính thức của website BT:</li>
              <li>Nền tảng đặt sân trực tuyến BT</li>
              <li>CÔNG TY Cổ phần Phần mềm BT Việt Nam</li>
              <li>Địa chỉ: Đại học Công nghiệp Thành phố Hồ Chí Minh</li>
              <li>Tel: 84+ 12345678</li>
              <li>Email: bt@gmail.com</li>
            </ul>
          </section>

          <div className="text-center mt-8">
            <button className="px-6 py-2 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 transition">
              Liên hệ hỗ trợ
            </button>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
