import uuid
import re
from src.services.court_service import fetch_courts

# Lưu session in-memory
sessions = {}

STEPS = [
    {"key": "area", "question": "Bạn muốn chơi ở khu vực nào? (Ví dụ: Quận 1, Bình Thạnh)"},
    {"key": "court_type", "question": "Bạn muốn loại sân Đơn hay Đôi?"},
    {"key": "time", "question": "Bạn muốn chơi từ mấy giờ đến mấy giờ? (Ví dụ: 18:00 đến 20:00)"},
    {"key": "amenities", "question": "Bạn cần những tiện ích nào? (Ví dụ: bãi đỗ xe, nhà tắm). Nhập 'không' nếu không cần tiện ích."}
]

FRIENDLY_QUESTIONS = [
    {"key": "area", "question": "Không tìm thấy sân ở khu vực này. Bạn thử chọn khu vực khác nhé, ví dụ Quận 1 hoặc Bình Thạnh?"},
    {"key": "court_type", "question": "Không tìm thấy sân phù hợp. Bạn muốn thử loại sân khác không, Đơn hay Đôi?"},
    {"key": "time", "question": "Không tìm thấy sân trống trong khung giờ này. Bạn thử chọn khung giờ khác nhé, ví dụ 14:00 đến 16:00?"},
    {"key": "amenities", "question": "Không tìm thấy sân với các tiện ích này. Bạn thử chọn tiện ích khác nhé, như bãi đỗ xe hoặc wifi? Hoặc nhập 'không' nếu không cần tiện ích."}
]

def handle_conversation(session_id, user_message):
    if not session_id:
        session_id = str(uuid.uuid4())
        sessions[session_id] = {
            "step": 0,
            "user_input": {"date": "2025-04-21"},
            "greeting_sent": False
        }

    session_data = sessions.get(session_id, {
        "step": 0,
        "user_input": {"date": "2025-04-21"},
        "greeting_sent": False
    })

    if not session_data["greeting_sent"]:
        session_data["greeting_sent"] = True
        session_data["step"] = 0
        sessions[session_id] = session_data
        return {
            "session_id": session_id,
            "message": "Chào bạn! Mình là chatbot tìm sân cầu lông. Mình sẽ giúp bạn tìm sân phù hợp nhé!\n" + STEPS[0]["question"]
        }

    current_step = session_data["step"]
    user_input = session_data["user_input"]

    # Xử lý input người dùng
    if current_step == 0:
        user_input["area"] = user_message.strip().lower()
    elif current_step == 1:
        user_input["court_type"] = "Singles" if "đơn" in user_message.lower() else "Doubles"
    elif current_step == 2:
        time_match = re.match(r"(\d{1,2}:\d{2})\s*(?:đến|-)\s*(\d{1,2}:\d{2})", user_message)
        if time_match:
            user_input["start_time"] = time_match.group(1)
            user_input["end_time"] = time_match.group(2)
        else:
            session_data["step"] = current_step
            sessions[session_id] = session_data
            return {
                "session_id": session_id,
                "message": "Vui lòng nhập khung giờ hợp lệ (ví dụ: 18:00 đến 20:00)."
            }
    elif current_step == 3:
        if user_message.strip().lower() == "không":
            user_input["amenities"] = []
        else:
            user_input["amenities"] = [item.strip().lower() for item in user_message.split(",")]

    # Tìm sân
    result = fetch_courts(user_input, sort_by_price=True if current_step == 3 else False)
    bot_message = result["message"]
    courts_found = len(result["courts"]) > 0

    # Xử lý bước tiếp theo
    next_step = current_step + 1 if current_step < 3 else 0
    if not courts_found:
        # Nếu không tìm thấy sân, hỏi lại câu hỏi cũ
        bot_message = f"{result['message']}\n{FRIENDLY_QUESTIONS[current_step]['question']}"
        next_step = current_step  # Giữ nguyên bước hiện tại
    elif next_step == 0:
        # Nếu hoàn thành luồng, reset
        user_input = {"date": "2025-04-21"}
        bot_message += "\nBạn muốn tìm sân khác không? Hãy cho mình biết khu vực mới!"
    else:
        # Nếu tìm thấy sân, hỏi câu hỏi tiếp theo
        bot_message += "\n" + STEPS[next_step]["question"]

    session_data["step"] = next_step
    session_data["user_input"] = user_input
    sessions[session_id] = session_data

    return {
        "session_id": session_id,
        "message": bot_message,
        "courts": result["courts"] if courts_found else []
    }