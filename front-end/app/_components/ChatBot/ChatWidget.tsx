import { ScrollShadow } from "@heroui/scroll-shadow";
import { useState, useRef, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

interface Message {
  sender: "user" | "bot";
  text: string;
  courts?: Array<{
    id: string;
    name: string;
    location: string;
    court_type: string;
    close_time: string;
    open_time: string;
    rating: number;
    amenities: string[];
  }>;
  suggestions?: string[];
  suggestionType?: "area" | "courtType" | "timeSlot" | "amenities";
}

const ChatWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState<string>("");
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  // Danh sách gợi ý
  const areas = ["Gò Vấp", "Quận 1", "Quận 7", "Bình Thạnh"];
  const courtTypes = ["Đơn", "Đôi"];
  const timeSlots = ["08:00 đến 10:00", "10:00 đến 12:00", "14:00 đến 16:00", "18:00 đến 20:00"];
  const amenitiesOptions = ["bãi đỗ xe", "nhà tắm", "cafe", "wifi"];
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      fetchInitialMessage();
    }
  }, [isOpen]);

  const fetchInitialMessage = async () => {
    try {
      const response = await axios.post("http://localhost:5001/chatbot", {});
      setSessionId(response.data.session_id);
      setMessages([
        {
          sender: "bot",
          text: response.data.message,
          suggestions: response.data.show_area_suggestions ? areas : undefined,
          suggestionType: response.data.show_area_suggestions ? "area" : undefined,
        },
      ]);
    } catch (error) {
      setMessages([{ sender: "bot", text: "Đã có lỗi khi khởi tạo chatbot. Vui lòng thử lại!" }]);
    }
  };

  const sendMessage = async (userMessage: string) => {
    if (!userMessage.trim() || !sessionId) return;

    const userMsg: Message = { sender: "user", text: userMessage };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setSelectedAmenities([]);

    try {
      const response = await axios.post("http://localhost:5001/chatbot", {
        session_id: sessionId,
        message: userMessage,
      });

      console.log("Response from server:", response.data);

      // Phân tích phản hồi
      const botMessageText = response.data.message;
      const courts: Message["courts"] = (response.data.courts || []).map((court: any) => ({
        id: court.id,
        name: court.name,
        location: court.location,
        court_type: court.court_type,
        close_time: court.close_time,
        open_time: court.open_time,
        amenities: court.amenities.map((item: string) => item.trim()),
      }));
      let question = botMessageText.split("\n").pop()?.trim() || "";
      let suggestions: string[] | undefined = undefined;
      let suggestionType: "area" | "courtType" | "timeSlot" | "amenities" | undefined = undefined;

      // Gán gợi ý dựa trên show_area_suggestions từ server
      if (response.data.show_area_suggestions) {
        if (question.includes("khu vực")) {
          suggestions = areas;
          suggestionType = "area";
        } else if (question.includes("Đơn hay Đôi")) {
          suggestions = courtTypes;
          suggestionType = "courtType";
        } else if (question.includes("mấy giờ")) {
          suggestions = timeSlots;
          suggestionType = "timeSlot";
        } else if (question.includes("tiện ích")) {
          suggestions = amenitiesOptions;
          suggestionType = "amenities";
        }
      }

      const botMessage: Message = {
        sender: "bot",
        text: botMessageText,
        courts,
        suggestions,
        suggestionType,
      };
      setMessages((prev) => [...prev, botMessage]);
      setSessionId(response.data.session_id);
      setCurrentQuestion(question);
    } catch (error) {
      console.error("Lỗi:", error);
      const errorMessage: Message = { sender: "bot", text: "Đã có lỗi khi xử lý yêu cầu. Vui lòng thử lại!" };
      setMessages((prev) => [...prev, errorMessage]);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      sendMessage(input);
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    if (currentQuestion.includes("tiện ích")) {
      const newSelectedAmenities = [...selectedAmenities];
      if (newSelectedAmenities.includes(suggestion)) {
        newSelectedAmenities.splice(newSelectedAmenities.indexOf(suggestion), 1);
      } else {
        newSelectedAmenities.push(suggestion);
      }
      setSelectedAmenities(newSelectedAmenities);
      setInput(newSelectedAmenities.join(", "));
    } else {
      sendMessage(suggestion);
    }
  };

  return (
    <div className="fixed bottom-4 right-4">
      <button
        className="bg-[#21A691] text-white p-3 rounded-full shadow-lg flex items-center justify-center transition-transform hover:scale-105"
        onClick={() => {
          setIsOpen(!isOpen);
          if (!isOpen) {
            setMessages([]);
            setSessionId(null);
            setCurrentQuestion("");
            setSelectedAmenities([]);
          }
        }}
      >
        {isOpen ? "Tắt" : "💬 Chat"}
      </button>
      {isOpen && (
        <div className="w-[350px] h-[500px] bg-white shadow-xl rounded-2xl border p-4 fixed bottom-20 right-4 flex flex-col transition-all">
          <div className="flex justify-between items-center border-b pb-2">
            <h2 className="text-lg font-semibold text-gray-700">
              Tìm sân cầu lông
            </h2>
            <button className="text-gray-500" onClick={() => setIsOpen(false)}>
              ✖
            </button>
          </div>
          <ScrollShadow hideScrollBar className="flex-1">
            <div className="p-2 space-y-2" ref={chatContainerRef}>
              {messages.map((msg, index) => (
                <div key={index} className="space-y-2">
                  <div
                    className={`p-2 rounded-lg text-gray-800 w-max max-w-[80%] ${msg.sender === "user"
                      ? "bg-[#21A691] text-white ml-auto"
                      : "bg-gray-200"
                      }`}
                  >
                    {msg.text.split("\n").map((line, i) => (
                      <p key={i}>{line}</p>
                    ))}
                  </div>
                  {msg.courts && msg.courts.length > 0 && (
                    <div className="space-y-2">
                      {msg.courts.map((court, i) => (
                        <div
                          key={i}
                          className="p-2 rounded-lg bg-gray-100 w-max max-w-[80%] border border-gray-300 cursor-pointer hover:bg-gray-200"
                          onClick={() => router.push(`/owners/court-detail?courtID=${court.id}`)}
                        >
                          <p>
                            <strong>{court.name}</strong>
                          </p>
                          <p>Địa điểm: {court.location}</p>
                          <p>Giờ mở cửa: {court.open_time}h</p>
                          <p>Giờ đóng cửa: {court.close_time}h</p>
                          <p>Tiện ích: {court.amenities.join(", ")}</p>
                        </div>
                      ))}
                    </div>
                  )}
                  {msg.suggestions && (
                    <div className="flex flex-wrap gap-2 mt-2">
                      {msg.suggestions.map((suggestion) => (
                        <button
                          key={suggestion}
                          className={`px-3 py-1 rounded-full text-sm ${msg.suggestionType === "amenities" &&
                            selectedAmenities.includes(suggestion)
                            ? "bg-[#21A691] text-white"
                            : "bg-gray-300 text-gray-800"
                            } hover:bg-[#21a692d0]`}
                          onClick={() => handleSuggestionClick(suggestion)}
                        >
                          {suggestion}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </ScrollShadow>
          <div className="border-t pt-2 flex items-center">
            <input
              type="text"
              placeholder={
                currentQuestion.includes("tiện ích") && selectedAmenities.length > 0
                  ? selectedAmenities.join(", ")
                  : "Nhập câu trả lời hoặc chọn gợi ý..."
              }
              className="border p-2 w-full rounded-lg outline-none focus:ring-2 focus:ring-green-400"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
            />
            <button
              className="ml-2 bg-[#21A691] text-white p-2 rounded-lg hover:bg-[#21a692d0]"
              onClick={() => sendMessage(input)}
            >
              Gửi
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatWidget;