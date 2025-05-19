import uuid
import re
from src.services.court_service import fetch_courts
from src.models.deepseek_processor import process_user_input

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
            "greeting_sent": False,
            "intent_confirmed": False
        }

    session_data = sessions.get(session_id, {
        "step": 0,
        "user_input": {"date": "2025-04-21"},
        "greeting_sent": False,
        "intent_confirmed": False
    })

    # Chuẩn hóa tin nhắn người dùng
    user_message = user_message.strip().lower() if user_message else ""

    # Gửi lời chào mặc định khi chưa có tin nhắn hoặc greeting chưa gửi
    if not session_data["greeting_sent"]:
        session_data["greeting_sent"] = True
        sessions[session_id] = session_data
        return {
            "session_id": session_id,
            "message": "Chào bạn! Tôi có thể giúp gì cho bạn?",
            "show_area_suggestions": False  # Không hiển thị gợi ý khu vực
        }

    # Kiểm tra ý định tìm sân
    if not session_data["intent_confirmed"]:
        # Các câu thể hiện ý định tìm sân
        intent_keywords = ["tìm sân", "muốn tìm sân", "tìm sân cầu lông", "sân cầu lông", "đặt sân"]
        if any(keyword in user_message for keyword in intent_keywords):
            session_data["intent_confirmed"] = True
            session_data["step"] = 0
            sessions[session_id] = session_data
            return {
                "session_id": session_id,
                "message": "Chào bạn! Mình là chatbot tìm sân cầu lông. Mình sẽ giúp bạn tìm sân phù hợp nhé!\n" + STEPS[0]["question"],
                "show_area_suggestions": True  # Hiển thị gợi ý khu vực khi bắt đầu luồng
            }
        else:
            # Xử lý các câu chào hoặc câu hỏi khác
            if user_message in ["hello", "hi", "xin chào"]:
                return {
                    "session_id": session_id,
                    "message": "Chào bạn! Tôi có thể giúp gì cho bạn?",
                    "show_area_suggestions": False
                }
            elif "bạn là ai" in user_message or "bạn là gì" in user_message:
                return {
                    "session_id": session_id,
                    "message": "Mình là chatbot tìm sân cầu lông, được thiết kế để giúp bạn tìm sân phù hợp. Tôi có thể giúp gì cho bạn?",
                    "show_area_suggestions": False
                }
            else:
                # Kiểm tra nếu yêu cầu công việc khác
                non_sport_keywords = ["học", "làm bài", "mua hàng", "đặt vé", "hỗ trợ công việc", "trò chuyện"]
                if any(keyword in user_message for keyword in non_sport_keywords):
                    return {
                        "session_id": session_id,
                        "message": "Tôi chỉ là chat bot hỗ trợ tìm sân, xin lỗi bạn vì không hỗ trợ được cho bạn công việc này!",
                        "show_area_suggestions": False
                    }
                return {
                    "session_id": session_id,
                    "message": "Tôi không hiểu ý bạn lắm. Tôi có thể giúp gì khác cho bạn?",
                    "show_area_suggestions": False
                }

    # Nếu ý định đã được xác nhận, tiếp tục luồng hỏi đáp
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
                "message": "Vui lòng nhập khung giờ hợp lệ (ví dụ: 18:00 đến 20:00).",
                "show_area_suggestions": True
            }
    elif current_step == 3:
        if user_message.strip().lower() == "không":
            user_input["amenities"] = []
        else:
            user_input["amenities"] = [item.strip().lower() for item in user_message.split(",")]

    # Xử lý input người dùng bằng DeepSeek
    extracted_info = process_user_input(user_message)
    user_input = session_data["user_input"]
    user_input.update({
        "area": extracted_info["area"],
        "court_type": extracted_info["court_type"],
        "start_time": extracted_info["start_time"],
        "end_time": extracted_info["end_time"],
        "amenities": extracted_info["amenities"]
    })
    
    # Tìm sân
    result = fetch_courts(user_input)
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
        "courts": result["courts"] if courts_found else [],
        "show_area_suggestions": True  # Hiển thị gợi ý khu vực trong luồng tìm sân
    }
    
# import uuid
# from src.services.court_service import fetch_courts
# from src.models.mistral_processor import process_user_input

# # Lưu session in-memory
# sessions = {}

# def handle_conversation(session_id, user_message):
#     if not session_id:
#         session_id = str(uuid.uuid4())
#         sessions[session_id] = {
#             "greeting_sent": False,
#             "intent_confirmed": False,
#             "user_input": {"date": "2025-04-21"}
#         }

#     session_data = sessions.get(session_id, {
#         "greeting_sent": False,
#         "intent_confirmed": False,
#         "user_input": {"date": "2025-04-21"}
#     })

#     # Chuẩn hóa tin nhắn người dùng
#     user_message = user_message.strip().lower() if user_message else ""

#     # Gửi lời chào mặc định khi chưa có tin nhắn hoặc greeting chưa gửi
#     if not session_data["greeting_sent"]:
#         session_data["greeting_sent"] = True
#         sessions[session_id] = session_data
#         return {
#             "session_id": session_id,
#             "message": "Chào bạn! Tôi có thể giúp gì cho bạn? Ví dụ: 'Tìm sân cầu lông ở Gò Vấp, sân đôi, từ 18:00 đến 20:00, có wifi'.",
#             "show_area_suggestions": False
#         }

#     # Kiểm tra ý định tìm sân
#     if not session_data["intent_confirmed"]:
#         intent_keywords = ["tìm sân", "muốn tìm sân", "tìm sân cầu lông", "sân cầu lông", "đặt sân"]
#         if any(keyword in user_message for keyword in intent_keywords):
#             session_data["intent_confirmed"] = True
#             sessions[session_id] = session_data
#             return {
#                 "session_id": session_id,
#                 "message": "Chào bạn! Hãy cho mình biết yêu cầu của bạn, ví dụ: 'Tìm sân ở Quận 7, sân đơn, từ 17:00 đến 19:00, có bãi đỗ xe'.",
#                 "show_area_suggestions": True
#             }
#         else:
#             if user_message in ["hello", "hi", "xin chào"]:
#                 return {
#                     "session_id": session_id,
#                     "message": "Chào bạn! Tôi có thể giúp gì cho bạn?",
#                     "show_area_suggestions": False
#                 }
#             elif "bạn là ai" in user_message or "bạn là gì" in user_message:
#                 return {
#                     "session_id": session_id,
#                     "message": "Mình là chatbot tìm sân cầu lông, được thiết kế để giúp bạn tìm sân phù hợp. Tôi có thể giúp gì cho bạn?",
#                     "show_area_suggestions": False
#                 }
#             else:
#                 non_sport_keywords = ["học", "làm bài", "mua hàng", "đặt vé", "hỗ trợ công việc", "trò chuyện"]
#                 if any(keyword in user_message for keyword in non_sport_keywords):
#                     return {
#                         "session_id": session_id,
#                         "message": "Tôi chỉ là chat bot hỗ trợ tìm sân, xin lỗi bạn vì không hỗ trợ được cho bạn công việc này!",
#                         "show_area_suggestions": False
#                     }
#                 return {
#                     "session_id": session_id,
#                     "message": "Tôi không hiểu ý bạn lắm. Tôi có thể giúp gì khác cho bạn?",
#                     "show_area_suggestions": False
#                 }

#     # Xử lý input người dùng bằng mistral_processor
#     extracted_info = process_user_input(user_message)
#     user_input = session_data["user_input"]
#     user_input.update({
#         "area": extracted_info["area"],
#         "court_type": extracted_info["court_type"],
#         "start_time": extracted_info["start_time"],
#         "end_time": extracted_info["end_time"],
#         "amenities": extracted_info["amenities"]
#     })

#     # Tìm sân
#     result = fetch_courts(user_input, sort_by_price=True)
#     bot_message = result["message"]
#     courts_found = len(result["courts"]) > 0

#     # Xử lý phản hồi
#     if not courts_found:
#         bot_message += "\nVui lòng thử yêu cầu khác, ví dụ: 'Tìm sân ở Gò Vấp, sân đôi, từ 18:00 đến 20:00'."
#     else:
#         bot_message += "\nBạn muốn tìm sân khác không? Hãy cho mình biết yêu cầu mới!"

#     session_data["user_input"] = {"date": "2025-04-21"}  # Reset sau khi tìm
#     sessions[session_id] = session_data

#     return {
#         "session_id": session_id,
#         "message": bot_message,
#         "courts": result["courts"] if courts_found else [],
#         "show_area_suggestions": True
#     }