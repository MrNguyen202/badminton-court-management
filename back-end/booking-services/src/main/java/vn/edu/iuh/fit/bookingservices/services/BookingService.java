package vn.edu.iuh.fit.bookingservices.services;

import vn.edu.iuh.fit.bookingservices.models.Booking;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

public interface BookingService {
    Booking createBooking(Booking booking, String userInfoJson);
    Boolean deleteBooking(Long courtId, Long subCourtId, Long scheduleId);
    Booking getBooking(Long id);
    List<Booking> getBookingsByUserId(Long userId);
    Booking confirmBooking(Booking booking, String userInfoJson);
    Optional<Booking> getBookingByCourtAndSchedule(Long subCourtId, Long scheduleId);
}