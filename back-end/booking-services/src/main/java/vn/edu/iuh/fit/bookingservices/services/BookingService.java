package vn.edu.iuh.fit.bookingservices.services;

import vn.edu.iuh.fit.bookingservices.models.Booking;

import java.time.LocalDateTime;
import java.util.List;

public interface BookingService {
    Booking createBooking(Booking booking, String userInfoJson);
    Boolean deleteBooking(Long courtId, Long subCourtId, Long scheduleId);
    Booking getBooking(Long id);
    List<Booking> getUserBookings(Long userId);
    Booking cancelBooking(Long id);
    Booking confirmBooking(Long id);
}