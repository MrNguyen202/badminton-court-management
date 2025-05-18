import pandas as pd
from src.tools.db_handler import get_db_connection

def fetch_courts(user_input, sort_by_price=False):
    try:
        conn = get_db_connection()

        # Bước 1: Lọc court theo khu vực
        query = """
            SELECT DISTINCT 
                c.id, c.name, c.description, c.utilities,
                a.district, a.ward, a.specific_address
            FROM court c
            JOIN addresses a ON c.address_id = a.id
            WHERE c.status = 'OPEN'
        """
        params = {}

        # Chuẩn hóa khu vực
        if user_input.get('area'):
            area = user_input['area'].strip().lower()
            area_mappings = {
                "go vap": "Gò Vấp",
                "gò vấp": "Gò Vấp",
                "quan 1": "Quận 1",
                "quận 1": "Quận 1",
                "quan 7": "Quận 7",
                "quận 7": "Quận 7",
                "binh thanh": "Bình Thạnh",
                "bình thạnh": "Bình Thạnh",
            }
            standardized_area = area_mappings.get(area, area.title())
            query += " AND (LOWER(a.district) LIKE %(area)s OR LOWER(a.ward) LIKE %(area)s)"
            params['area'] = f"%{standardized_area.lower()}%"

        df_courts = pd.read_sql(query, conn, params=params)

        if df_courts.empty:
            return {"message": "Hiện tại chưa tìm thấy sân phù hợp.", "courts": []}

        # Bước 2: Nếu có yêu cầu loại sân, lọc lại theo sub_court.type
        if user_input.get('court_type'):
            court_type = 'SINGLE' if user_input['court_type'] == 'Singles' else 'DOUBLE'
            court_ids = tuple(df_courts['id'].tolist()) or (0,)
            placeholders = ', '.join(['%s'] * len(court_ids))

            filter_query = f"""
                SELECT DISTINCT court_id
                FROM sub_court
                WHERE court_id IN ({placeholders}) AND type = %s
            """
            filter_params = (*court_ids, court_type)
            df_filtered_ids = pd.read_sql(filter_query, conn, params=filter_params)

            if df_filtered_ids.empty:
                return {"message": "Hiện tại chưa tìm thấy sân phù hợp.", "courts": []}

            valid_ids = df_filtered_ids['court_id'].tolist()
            df_courts = df_courts[df_courts['id'].isin(valid_ids)]

        conn.close()

        # Thêm giả lập giá, khoảng cách, đánh giá
        df_courts['price'] = 100000.0
        df_courts['distance'] = 5.0
        df_courts['rating'] = 4.0

        if sort_by_price:
            df_courts = df_courts.sort_values(by='price', ascending=True)

        courts_list = []
        for _, row in df_courts.iterrows():
            courts_list.append({
                "id": row['id'],
                "name": row['name'],
                "location": f"{row['specific_address']}, {row['ward']}, {row['district']}",
                "price": row['price'],
                "distance": row['distance'],
                "rating": row['rating'],
                "amenities": row['utilities'].split(',') if pd.notna(row['utilities']) else []
            })

        return {
            "message": f"Tìm thấy {len(courts_list)} sân phù hợp:",
            "courts": courts_list
        }

    except Exception as e:
        return {"message": f"Đã có lỗi khi truy vấn sân: {str(e)}", "courts": []}