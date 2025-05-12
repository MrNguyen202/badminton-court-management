package vn.edu.iuh.fit.bookingservices.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import vn.edu.iuh.fit.bookingservices.models.Booking;
import java.util.List;

public interface BookingRepository extends JpaRepository<Booking, Long> {
    List<Booking> findByUserId(Long userId);
} 