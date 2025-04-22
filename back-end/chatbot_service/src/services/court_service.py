import pandas as pd
from src.tools.db_handler import get_db_connection

def fetch_courts(user_input, sort_by_price=False):
    try:
        conn = get_db_connection()
        # Truy vấn cơ bản chỉ cần court và addresses
        query = """
            SELECT DISTINCT 
                c.id, c.name, c.description, c.utilities,
                a.district, a.ward, a.specific_address
            FROM court c
            JOIN addresses a ON c.address_id = a.id
            WHERE c.status = 'OPEN'
        """
        params = {}
        joins_added = False

        # Lọc theo khu vực
        if user_input.get('area'):
            area = user_input['area'].strip().lower()
            query += " AND (LOWER(a.district) LIKE %(area)s OR LOWER(a.ward) LIKE %(area)s)"
            params['area'] = f"%{area}%"

        # Nếu có tiêu chí loại sân, khung giờ hoặc giá, cần join thêm bảng
        if user_input.get('court_type') or (user_input.get('start_time') and user_input.get('end_time')):
            query = query.replace("FROM court c", """
                FROM court c
                LEFT JOIN sub_court sc ON sc.court_id = c.id
                LEFT JOIN sub_court_schedule scs ON scs.sub_court_id = sc.id
            """)
            query = query.replace("c.id, c.name", "c.id, c.name, sc.id AS sub_court_id, sc.sub_name, sc.type AS sub_court_type, scs.price")
            joins_added = True

        # Lọc theo loại sân
        if user_input.get('court_type'):
            court_type = 'SINGLES' if user_input['court_type'] == 'Singles' else 'DOUBLES'
            query += " AND sc.type = %(court_type)s"
            params['court_type'] = court_type

        # Lọc theo khung giờ
        if user_input.get('start_time') and user_input.get('end_time') and user_input.get('date'):
            query += """
                AND EXISTS (
                    SELECT 1 
                    FROM sub_court_schedule scs2
                    JOIN schedule s ON scs2.schedule_id = s.id
                    WHERE scs2.sub_court_id = sc.id
                    AND s.date = %(date)s
                    AND s.from_hour <= %(end_time)s
                    AND s.to_hour >= %(start_time)s
                    AND scs2.status = 'AVAILABLE'
                )
            """
            params['start_time'] = user_input['start_time']
            params['end_time'] = user_input['end_time']
            params['date'] = user_input['date']

        # Lọc theo tiện ích
        if user_input.get('amenities') and user_input['amenities']:
            amenities = user_input['amenities']
            for i, amenity in enumerate(amenities):
                query += f" AND LOWER(c.utilities) LIKE %(amenity_{i})s"
                params[f'amenity_{i}'] = f"%{amenity}%"

        # Thực hiện truy vấn
        df = pd.read_sql(query, conn, params=params)
        conn.close()

        if df.empty:
            return {"message": "Hiện tại chưa tìm thấy sân phù hợp.", "courts": []}

        # Xử lý dữ liệu
        df['distance'] = 5.0  # Giá trị giả định
        df['rating'] = 4.0    # Giá trị giả định
        if joins_added:
            df['price'] = df['price'].fillna(100000.0)  # Giá mặc định nếu không có
        else:
            df['price'] = 100000.0  # Giá mặc định khi không join sub_court_schedule
            df['sub_court_type'] = 'N/A'  # Loại sân mặc định khi không join sub_court

        # Nhóm dữ liệu để tránh trùng lặp
        group_by_columns = ['id', 'name', 'district', 'ward', 'specific_address', 'utilities']
        agg_dict = {
            'distance': 'first',
            'rating': 'first',
            'price': 'min' if joins_added else 'first'
        }
        if joins_added:
            group_by_columns.extend(['sub_court_id', 'sub_name', 'sub_court_type'])
            agg_dict.update({
                'sub_court_id': 'first',
                'sub_name': 'first',
                'sub_court_type': 'first'
            })

        grouped = df.groupby(group_by_columns).agg(agg_dict).reset_index()

        # Sắp xếp theo giá nếu yêu cầu
        if sort_by_price:
            grouped = grouped.sort_values(by='price', ascending=True)

        # Chuyển đổi thành danh sách sân
        courts_list = []
        for _, court in grouped.iterrows():
            courts_list.append({
                "id": court['id'],  # Add court ID
                "name": court['name'],
                "location": f"{court['specific_address']}, {court['ward']}, {court['district']}",
                "court_type": court['sub_court_type'] if joins_added and pd.notna(court['sub_court_type']) else "N/A",
                "price": court['price'],
                "distance": court['distance'],
                "rating": court['rating'],
                "amenities": court['utilities'].split(',') if pd.notna(court['utilities']) else []
         })

        return {
            "message": f"Tìm thấy {len(courts_list)} sân phù hợp:",
            "courts": courts_list
        }

    except Exception as e:
        return {"message": f"Đã có lỗi khi truy vấn sân: {str(e)}", "courts": []}