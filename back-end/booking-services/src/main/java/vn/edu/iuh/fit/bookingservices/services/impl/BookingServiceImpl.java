package vn.edu.iuh.fit.bookingservices.services.impl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import vn.edu.iuh.fit.bookingservices.enums.BookingStatus;
import vn.edu.iuh.fit.bookingservices.models.Booking;
import vn.edu.iuh.fit.bookingservices.repositories.BookingRepository;
import vn.edu.iuh.fit.bookingservices.services.BookingService;

import java.util.List;

@Service
public class BookingServiceImpl implements BookingService {

    @Autowired
    private BookingRepository bookingRepository;

    @Override
    public Booking createBooking(Booking booking) {
        booking.setStatus(BookingStatus.NEW);
        return bookingRepository.save(booking);
    }

    @Override
    public Booking getBooking(Long id) {
        return bookingRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Booking not found"));
    }

    @Override
    public List<Booking> getUserBookings(Long userId) {
        return bookingRepository.findByUserId(userId);
    }

    @Override
    public Booking cancelBooking(Long id) {
        Booking booking = getBooking(id);
        if (booking.getStatus() == BookingStatus.PAID) {
            throw new RuntimeException("Cannot cancel a paid booking");
        }
        booking.setStatus(BookingStatus.CANCELLED);
        return bookingRepository.save(booking);
    }

    @Override
    public Booking confirmBooking(Long id) {
        Booking booking = getBooking(id);
        if (booking.getStatus() != BookingStatus.NEW) {
            throw new RuntimeException("Only new bookings can be confirmed");
        }
        booking.setStatus(BookingStatus.CONFIRMED);
        return bookingRepository.save(booking);
    }
} 