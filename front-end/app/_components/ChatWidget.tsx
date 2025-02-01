import { useState } from "react";

const ChatWidget = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="fixed bottom-4 right-4">
      {/* Nút mở/tắt chat */}
      <button
        className="bg-[#21A691] text-white p-3 rounded-full shadow-lg flex items-center justify-center transition-transform hover:scale-105"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? "Tắt" : "💬 Chat"}
      </button>

      {/* Hộp chat */}
      {isOpen && (
        <div className="w-80 h-96 bg-white shadow-xl rounded-2xl border p-4 fixed bottom-20 right-4 flex flex-col transition-all">
          {/* Tiêu đề chat */}
          <div className="flex justify-between items-center border-b pb-2">
            <h2 className="text-lg font-semibold text-gray-700">
              Hỗ trợ trực tuyến
            </h2>
            <button className=" text-gray-500" onClick={() => setIsOpen(false)}>
              ✖
            </button>
          </div>

          {/* Nội dung chat */}
          <div className="flex-1 overflow-auto p-2 space-y-2">
            <div className="p-2 bg-gray-200 rounded-lg text-gray-800 w-max">
              Xin chào! Tôi có thể giúp gì?
            </div>
          </div>

          {/* Thanh nhập tin nhắn */}
          <div className="border-t pt-2 flex items-center">
            <input
              type="text"
              placeholder="Nhập tin nhắn..."
              className="border p-2 w-full rounded-lg outline-none focus:ring-2 focus:ring-green-400"
            />
            <button className="ml-2 bg-[#21A691] text-white p-2 rounded-lg hover:bg-[#21a692d0]">
              Gửi
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatWidget;
