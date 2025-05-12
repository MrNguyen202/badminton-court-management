package vn.edu.iuh.fit.bookingservices.services;

import vn.edu.iuh.fit.bookingservices.models.Booking;
import java.util.List;

public interface BookingService {
    Booking createBooking(Booking booking);
    Booking getBooking(Long id);
    List<Booking> getUserBookings(Long userId);
    Booking cancelBooking(Long id);
    Booking confirmBooking(Long id);
} 