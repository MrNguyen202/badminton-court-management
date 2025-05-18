package vn.edu.iuh.fit.bookingservices.enums;

public enum BookingStatus {
    NEW,        // Mới tạo, chờ thanh toán
    PAID,       // Đã thanh toán
    CONFIRMED,  // Đã xác nhận (cho trường hợp thanh toán tại sân)
    COMPLETED,  // Đã hoàn thành
    CANCELLED,  // Đã hủy
    PAYMENT_FAILED  // Thanh toán thất bại hoặc bị hủy (mới thêm)
}