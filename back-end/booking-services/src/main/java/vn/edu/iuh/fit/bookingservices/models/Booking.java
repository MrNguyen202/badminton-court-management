package vn.edu.iuh.fit.bookingservices.models;

import jakarta.persistence.*;
import lombok.*;
import vn.edu.iuh.fit.bookingservices.enums.BookingStatus;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "booking")
public class Booking {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long userId; // ID người dùng đã đăng nhập (nullable nếu không đăng nhập)

    private Long courtId; // ID sân chính

    private Long subCourtId; // ID sân con

    private LocalDateTime startTime; // Thời gian bắt đầu (thay vì Date)

    private LocalDateTime endTime; // Thời gian kết thúc

    @Enumerated(EnumType.STRING)
    private BookingStatus status; // Trạng thái đặt sân

    private BigDecimal totalAmount; // Tổng tiền

    private String paymentId; // ID thanh toán PayPal

    @Column(columnDefinition = "TEXT") // Lưu thông tin người dùng dưới dạng JSON
    private String userInfo; // Thông tin người đặt không đăng nhập (name, phone, email)
}