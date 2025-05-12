package vn.edu.iuh.fit.bookingservices.services;

import vn.edu.iuh.fit.bookingservices.models.Booking;

import java.time.LocalDateTime;
import java.util.List;

public interface BookingService {
    Booking createBooking(Booking booking, String userInfoJson);
    Booking getBooking(Long id);
    List<Booking> getUserBookings(Long userId);
    Booking cancelBooking(Long id);
    Booking confirmBooking(Long id);
    boolean isBookingConflict(Long subCourtId, LocalDateTime startTime, LocalDateTime endTime);
}