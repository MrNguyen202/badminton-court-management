package vn.edu.iuh.fit.bookingservices.controllers;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import vn.edu.iuh.fit.bookingservices.dtos.BookingRequestDTO;
import vn.edu.iuh.fit.bookingservices.models.Booking;
import vn.edu.iuh.fit.bookingservices.services.BookingService;
import vn.edu.iuh.fit.bookingservices.services.PaypalService;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

@RestController
@RequestMapping("/api/bookings")
@CrossOrigin(origins = "http://localhost:3000")
public class BookingController {

    @Autowired
    private BookingService bookingService;

    @Autowired
    private PaypalService paypalService;

    @Autowired
    private ObjectMapper objectMapper;

    @PostMapping
    public ResponseEntity<?> createBooking(@RequestBody BookingRequestDTO bookingRequest) {
        try {
            System.out.println("Received request: " + bookingRequest);

            if (bookingRequest.getCourtId() == null || bookingRequest.getSubCourtId() == null) {
                return ResponseEntity.badRequest().body("courtId và subCourtId không được để trống");
            }

            if (bookingRequest.getFromHour() == null || bookingRequest.getToHour() == null) {
                return ResponseEntity.badRequest().body("fromHour và toHour không được để trống");
            }

            if (bookingRequest.getTotalCost() == null) {
                return ResponseEntity.badRequest().body("totalCost không được để trống");
            }

            DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd'T'HH:mm:ss");
            LocalDateTime startTime;
            LocalDateTime endTime;
            try {
                startTime = LocalDateTime.parse(bookingRequest.getFromHour(), formatter);
                endTime = LocalDateTime.parse(bookingRequest.getToHour(), formatter);
                System.out.println("Parsed startTime: " + startTime + ", endTime: " + endTime);
            } catch (Exception e) {
                System.out.println("Error parsing time: " + e.getMessage());
                return ResponseEntity.badRequest().body("Định dạng thời gian không hợp lệ. Vui lòng sử dụng định dạng yyyy-MM-dd'T'HH:mm:ss");
            }

            Booking booking = new Booking();
            booking.setCourtId(bookingRequest.getCourtId());
            booking.setSubCourtId(bookingRequest.getSubCourtId());
            booking.setUserId(bookingRequest.getUserId());
            booking.setStartTime(startTime);
            booking.setEndTime(endTime);
            booking.setTotalAmount(BigDecimal.valueOf(bookingRequest.getTotalCost()));

            String userInfoJson = null;
            if (bookingRequest.getUserId() == null) {
                if (bookingRequest.getUserInfo() == null) {
                    return ResponseEntity.badRequest().body("userInfo không được để trống khi không có userId");
                }
                userInfoJson = objectMapper.writeValueAsString(bookingRequest.getUserInfo());
            }

            Booking createdBooking = bookingService.createBooking(booking, userInfoJson);
            System.out.println("Booking created: " + createdBooking);

            return ResponseEntity.ok(createdBooking.getId()); // Trả về ID booking
        } catch (Exception e) {
            System.out.println("Error in createBooking: " + e.getMessage());
            return ResponseEntity.badRequest().body("Lỗi khi tạo booking: " + e.getMessage());
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getBooking(@PathVariable Long id) {
        try {
            Booking booking = bookingService.getBooking(id);
            return ResponseEntity.ok(booking);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<?> getUserBookings(@PathVariable Long userId) {
        try {
            return ResponseEntity.ok(bookingService.getUserBookings(userId));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping("/{id}/cancel")
    public ResponseEntity<?> cancelBooking(@PathVariable Long id) {
        try {
            Booking cancelledBooking = bookingService.cancelBooking(id);
            return ResponseEntity.ok(cancelledBooking);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping("/{id}/confirm")
    public ResponseEntity<?> confirmBooking(@PathVariable Long id) {
        try {
            Booking confirmedBooking = bookingService.confirmBooking(id);
            return ResponseEntity.ok(confirmedBooking);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}