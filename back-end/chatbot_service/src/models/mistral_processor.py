import os
import json
from mistralai.client import MistralClient
from mistralai.models.chatcompletionchoice import ChatMessage

# Thiết lập API key và LangSmith tracing
MISTRAL_API_KEY = os.getenv("MISTRAL_API_KEY", "POHnNMWrnjJxtqU0e2jgqRn8X3yambwc")
client = MistralClient(api_key=MISTRAL_API_KEY)

 

def process_user_input(user_message):
    """
    Gửi input người dùng đến Mistral AI để trích xuất thông tin khu vực, loại sân, khung giờ, tiện ích.
    Trả về dictionary chứa các giá trị đã chuẩn hóa.
    """
    try:
        # Prompt để yêu cầu Mistral AI trích xuất thông tin
        prompt = f"""
        Bạn là một trợ lý giúp trích xuất thông tin từ câu hỏi của người dùng về tìm sân cầu lông. 
        Hãy phân tích câu sau và trả về các thông tin sau dưới dạng JSON:
        - area: Khu vực (ví dụ: Gò Vấp, Quận 1)
        - court_type: Loại sân (Singles hoặc Doubles)
        - start_time: Thời gian bắt đầu (định dạng HH:MM, ví dụ: 18:00)
        - end_time: Thời gian kết thúc (định dạng HH:MM, ví dụ: 20:00)
        - amenities: Danh sách tiện ích (ví dụ: ["bãi đỗ xe", "wifi"])
        
        Nếu thông tin không có, để trống (giá trị rỗng). Chuẩn hóa khu vực về dạng chuẩn (ví dụ: "go vap" → "Gò Vấp").
        Câu của người dùng: "{user_message}"
        """

        # Gửi yêu cầu đến Mistral AI
        messages = [
            ChatMessage(role="system", content="Bạn là trợ lý trích xuất thông tin."),
            ChatMessage(role="user", content=prompt)
        ]
        response = client.chat(
            model="mistral-large-latest",  # Sử dụng mô hình Mistral phù hợp
            messages=messages,
            temperature=0.3,
            max_tokens=150
        )

        # Lấy kết quả từ Mistral AI
        result = response.choices[0].message.content
        extracted_info = json.loads(result)

        # Đảm bảo các trường cần thiết
        return {
            "area": extracted_info.get("area", ""),
            "court_type": extracted_info.get("court_type", ""),
            "start_time": extracted_info.get("start_time", ""),
            "end_time": extracted_info.get("end_time", ""),
            "amenities": extracted_info.get("amenities", [])
        }

    except Exception as e:
        print(f"Error processing user input with Mistral AI: {str(e)}")
        # Fallback: Trả về giá trị rỗng nếu có lỗi
        return {
            "area": "",
            "court_type": "",
            "start_time": "",
            "end_time": "",
            "amenities": []
        }