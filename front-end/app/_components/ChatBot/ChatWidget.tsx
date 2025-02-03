import { ScrollShadow } from "@heroui/scroll-shadow";
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
        <div className="w-100 h-98 bg-white shadow-xl rounded-2xl border p-4 fixed bottom-20 right-4 flex flex-col transition-all">
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
          {/* <div className="flex-1 overflow-auto p-2 space-y-2">
            <div className="p-2 bg-gray-200 rounded-lg text-gray-800 w-max">
              Xin chào! Tôi có thể giúp gì?
            </div>
          </div> */}

          <ScrollShadow hideScrollBar className="w-[300px] h-[400px]">
            <div>
              <p>
                Sit nulla est ex deserunt exercitation anim occaecat. Nostrud
                ullamco deserunt aute id consequat veniam incididunt duis in
                sint irure nisi. Mollit officia cillum Lorem ullamco minim
                nostrud elit officia tempor esse quis.
              </p>
              <p>
                Sunt ad dolore quis aute consequat. Magna exercitation
                reprehenderit magna aute tempor cupidatat consequat elit dolor
                adipisicing. Mollit dolor eiusmod sunt ex incididunt cillum
                quis. Velit duis sit officia eiusmod Lorem aliqua enim laboris
                do dolor eiusmod. Et mollit incididunt nisi consectetur esse
                laborum eiusmod pariatur proident Lorem eiusmod et. Culpa
                deserunt nostrud ad veniam.
              </p>
              <p>
                Est velit labore esse esse cupidatat. Velit id elit consequat
                minim. Mollit enim excepteur ea laboris adipisicing aliqua
                proident occaecat do do adipisicing adipisicing ut fugiat.
                Consequat pariatur ullamco aute sunt esse. Irure excepteur eu
                non eiusmod. Commodo commodo et ad ipsum elit esse pariatur sit
                adipisicing sunt excepteur enim.
              </p>
              <p>
                Incididunt duis commodo mollit esse veniam non exercitation
                dolore occaecat ea nostrud laboris. Adipisicing occaecat fugiat
                fugiat irure fugiat in magna non consectetur proident fugiat.
                Commodo magna et aliqua elit sint cupidatat. Sint aute ullamco
                enim cillum anim ex. Est eiusmod commodo occaecat consequat
                laboris est do duis. Enim incididunt non culpa velit quis aute
                in elit magna ullamco in consequat ex proident.
              </p>
              <p>
                Dolore incididunt mollit fugiat pariatur cupidatat ipsum laborum
                cillum. Commodo consequat velit cupidatat duis ex nisi non
                aliquip ad ea pariatur do culpa. Eiusmod proident adipisicing
                tempor tempor qui pariatur voluptate dolor do ea commodo. Veniam
                voluptate cupidatat ex nisi do ullamco in quis elit.
              </p>
              <p>
                Cillum proident veniam cupidatat pariatur laborum tempor
                cupidatat anim eiusmod id nostrud pariatur tempor reprehenderit.
                Do esse ullamco laboris sunt proident est ea exercitation
                cupidatat. Do Lorem eiusmod aliqua culpa ullamco consectetur
                veniam voluptate cillum. Dolor consequat cillum tempor laboris
                mollit laborum reprehenderit reprehenderit veniam aliqua
                deserunt cupidatat consequat id.
              </p>
              <p>
                Est id tempor excepteur enim labore sint aliquip consequat duis
                minim tempor proident. Dolor incididunt aliquip minim elit ea.
                Exercitation non officia eu id.
              </p>
              <p>
                Ipsum ipsum consequat incididunt do aliquip pariatur nostrud.
                Qui ut sint culpa labore Lorem. Magna deserunt aliquip aute duis
                consectetur magna amet anim. Magna fugiat est nostrud veniam.
                Officia duis ea sunt aliqua.
              </p>
              <p>
                Ipsum minim officia aute anim minim aute aliquip aute non in
                non. Ipsum aliquip proident ut dolore eiusmod ad fugiat fugiat
                ut ex. Ea velit Lorem ut et commodo nulla voluptate veniam ea et
                aliqua esse id. Pariatur dolor et adipisicing ea mollit. Ipsum
                non irure proident ipsum dolore aliquip adipisicing laborum
                irure dolor nostrud occaecat exercitation.
              </p>
              <p>
                Culpa qui reprehenderit nostrud aliqua reprehenderit et ullamco
                proident nisi commodo non ut. Ipsum quis irure nisi sint do qui
                velit nisi. Sunt voluptate eu reprehenderit tempor consequat
                eiusmod Lorem irure velit duis Lorem laboris ipsum cupidatat.
                Pariatur excepteur tempor veniam cillum et nulla ipsum veniam ad
                ipsum ad aute. Est officia duis pariatur ad eiusmod id
                voluptate.
              </p>
            </div>
          </ScrollShadow>

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
