package vn.edu.iuh.fit.bookingservices.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import vn.edu.iuh.fit.bookingservices.enums.BookingStatus;
import vn.edu.iuh.fit.bookingservices.models.Booking;

import java.time.LocalDateTime;
import java.util.List;

public interface BookingRepository extends JpaRepository<Booking, Long> {
    List<Booking> findByUserId(Long userId);

    // Kiểm tra trùng lịch đặt sân
    List<Booking> findBySubCourtIdAndStartTimeLessThanEqualAndEndTimeGreaterThanEqual(
            Long subCourtId, LocalDateTime endTime, LocalDateTime startTime);

    List<Booking> findByStatus(BookingStatus status);
}