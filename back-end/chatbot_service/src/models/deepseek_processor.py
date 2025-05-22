import json
import requests
import re
from config import Config

# Thiết lập API key và endpoint
DEEPSEEK_API_KEY = Config.DEEPSEEK_API_KEY
API_URL = "https://api.deepseek.com/v1/chat/completions"

# Cache để lưu kết quả trích xuất tạm thời
cache = {}

def process_user_input(user_message):
    """
    Gửi input người dùng đến DeepSeek API để trích xuất thông tin khu vực, loại sân, khung giờ, tiện ích.
    Nếu API thất bại, sử dụng regex fallback.
    Trả về dictionary chứa các giá trị đã chuẩn hóa.
    """
    print(f"Debug: Processing user message = {user_message}")  # Debug
    # Kiểm tra cache
    cache_key = user_message.strip().lower()
    if cache_key in cache:
        print(f"Debug: Using cached result for {cache_key}")
        return cache[cache_key]

    # Hàm helper để xử lý regex fallback
    def regex_fallback(message):
        try:
            message = message.strip().lower()
            # Khu vực
            area = ""
            area_patterns = [
                r"(?:quận|quan)\s*(\d+)",
                r"g[oò]\s*v[ắă]p",
                r"b[ìi]nh\s*th[ạa]nh",
                r"th[ủu]\s*đ[ứư][cứ]c"
            ]
            area_mappings = {
                "go vap": "Gò Vấp",
                "gò vấp": "Gò Vấp",
                "binh thanh": "Bình Thạnh",
                "thu duc": "Thủ Đức"
            }
            for pattern in area_patterns:
                match = re.search(pattern, message)
                if match:
                    matched_area = match.group(0).replace(" ", "").lower()
                    if matched_area in area_mappings:
                        area = area_mappings[matched_area]
                    elif match.group(1):
                        area = f"Quận {match.group(1)}"
                    break

            # Loại sân
            court_type = "Singles" if "đơn" in message else "Doubles" if "đôi" in message else ""

            # Khung giờ
            time_match = re.search(r"(\d{1,2}:\d{2})\s*(?:đến|-)\s*(\d{1,2}:\d{2})", message)
            start_time = time_match.group(1) if time_match else ""
            end_time = time_match.group(2) if time_match else ""

            # Tiện ích
            amenities = []
            if "wifi" in message:
                amenities.append("wifi")
            if "bãi đỗ xe" in message or "đỗ xe" in message:
                amenities.append("bãi đỗ xe")
            if "nhà tắm" in message or "tắm" in message:
                amenities.append("nhà tắm")

            result = {
                "area": area,
                "court_type": court_type,
                "start_time": start_time,
                "end_time": end_time,
                "amenities": amenities
            }
            print(f"Debug: Regex fallback result = {result}")  # Debug
            return result
        except Exception as e:
            print(f"Regex fallback failed: {str(e)}")
            return {
                "area": "",
                "court_type": "",
                "start_time": "",
                "end_time": "",
                "amenities": []
            }

    try:
        # Prompt cho DeepSeek
        prompt = f"""
        Bạn là một trợ lý giúp trích xuất thông tin từ câu hỏi của người dùng về tìm sân cầu lông. 
        Hãy phân tích câu sau và trả về các thông tin sau dưới dạng JSON:
        - area: Khu vực (ví dụ: Gò Vấp, Quận 1)
        - court_type: Loại sân (Singles hoặc Doubles)
        - start_time: Thời gian bắt đầu (định dạng HH:MM, ví dụ: 18:00)
        - end_time: Thời gian kết thúc (định dạng HH:MM, ví dụ: 20:00)
        - amenities: Danh sách tiện ích (ví dụ: ["bãi đỗ xe", "wifi"])
        
        Nếu thông tin không có, để trống (giá trị rỗng). Chuẩn hóa khu vực về dạng chuẩn (ví dụ: "go vap" → "Gò Vấp").
        Ví dụ:
        Input: "Tìm sân ở quận 7, sân đơn, từ 17:00 đến 19:00, có bãi đỗ xe"
        Output: {{"area": "Quận 7", "court_type": "Singles", "start_time": "17:00", "end_time": "19:00", "amenities": ["bãi đỗ xe"]}}
        Câu của người dùng: "{user_message}"
        """

        headers = {
            "Authorization": f"Bearer {DEEPSEEK_API_KEY}",
            "Content-Type": "application/json"
        }
        payload = {
            "model": "deepseek-chat",
            "messages": [
                {"role": "system", "content": "Bạn là trợ lý trích xuất thông tin."},
                {"role": "user", "content": prompt}
            ],
            "temperature": 0.3,
            "max_tokens": 100  # Giảm để tiết kiệm chi phí
        }

        response = requests.post(API_URL, headers=headers, json=payload)
        response.raise_for_status()

        result = response.json()["choices"][0]["message"]["content"]
        try:
            extracted_info = json.loads(result)
            # Chuẩn hóa đầu ra
            extracted_info = {
                "area": extracted_info.get("area", "").strip(),
                "court_type": extracted_info.get("court_type", "").strip(),
                "start_time": extracted_info.get("start_time", "").strip(),
                "end_time": extracted_info.get("end_time", "").strip(),
                "amenities": [item.strip() for item in extracted_info.get("amenities", [])]
            }
            print(f"Debug: Extracted info from DeepSeek = {extracted_info}")  # Debug
            # Lưu vào cache
            cache[cache_key] = extracted_info
            return extracted_info
        except json.JSONDecodeError:
            print(f"Invalid JSON response from DeepSeek: {result}")
            return regex_fallback(user_message)

    except Exception as e:
        print(f"Error processing user input with DeepSeek: {str(e)}")
        return regex_fallback(user_message)