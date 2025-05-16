package vn.edu.iuh.fit.bookingservices.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import vn.edu.iuh.fit.bookingservices.enums.BookingStatus;
import vn.edu.iuh.fit.bookingservices.models.Booking;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

public interface BookingRepository extends JpaRepository<Booking, Long> {
    List<Booking> findByUserId(Long userId);

    Optional<Booking> findByCourtIdAndSubCourtIdAndScheduleId(Long courtId, Long subCourtId, Long scheduleId);
}