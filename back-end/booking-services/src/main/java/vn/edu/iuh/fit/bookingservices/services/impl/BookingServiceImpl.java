package vn.edu.iuh.fit.bookingservices.services.impl;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import vn.edu.iuh.fit.bookingservices.enums.BookingStatus;
import vn.edu.iuh.fit.bookingservices.models.Booking;
import vn.edu.iuh.fit.bookingservices.repositories.BookingRepository;
import vn.edu.iuh.fit.bookingservices.services.BookingService;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class BookingServiceImpl implements BookingService {

    @Autowired
    private BookingRepository bookingRepository;

    @Autowired
    private ObjectMapper objectMapper; // Để parse JSON

    @Override
    public Booking createBooking(Booking booking, String userInfoJson) {
        if (bookingRepository.findByCourtIdAndSubCourtIdAndScheduleId(booking.getCourtId(), booking.getSubCourtId(), booking.getScheduleId()).isPresent()) {
            throw new RuntimeException("Lịch đặt sân bị trùng. Vui lòng chọn khung giờ khác.");
        }
        System.out.println("No conflict, proceeding to save booking: " + booking);
        booking.setStatus(BookingStatus.NEW);
        Booking savedBooking = bookingRepository.save(booking);
        savedBooking.setUserInfo(userInfoJson);
        return bookingRepository.save(savedBooking);
    }

    @Override
    public Boolean deleteBooking(Long courtId, Long subCourtId, Long bookedScheduleId) {
        try {
            // Tìm booking dựa trên courtId, subCourtId, và scheduleId
            Optional<Booking> bookingOptional = bookingRepository.findByCourtIdAndSubCourtIdAndScheduleId(
                    courtId, subCourtId, bookedScheduleId
            );
            if (bookingOptional.isPresent()) {
                bookingRepository.delete(bookingOptional.get());
                return true;
            }
            return false;
        } catch (Exception e) {
            throw new RuntimeException("Lỗi khi xóa booking: " + e.getMessage());
        }
    }

    @Override
    public Booking getBooking(Long id) {
        return bookingRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy booking"));
    }

    @Override
    public List<Booking> getBookingsByUserId(Long userId) {
        return bookingRepository.findByUserId(userId);
    }

    @Override
    public List<Booking> getUserBookings(Long userId) {
        return bookingRepository.findByUserId(userId);
    }

    @Override
    public Booking cancelBooking(Long id) {
        Booking booking = getBooking(id);
        if (booking.getStatus() == BookingStatus.PAID) {
            throw new RuntimeException("Không thể hủy booking đã thanh toán");
        }
        booking.setStatus(BookingStatus.CANCELLED);
        return bookingRepository.save(booking);
    }

    @Override
    public Booking confirmBooking(Long id) {
        Booking booking = getBooking(id);
        if (booking.getStatus() != BookingStatus.NEW) {
            throw new RuntimeException("Chỉ có thể xác nhận booking mới");
        }
        booking.setStatus(BookingStatus.CONFIRMED);
        return bookingRepository.save(booking);
    }
}