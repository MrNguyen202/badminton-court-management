package vn.edu.iuh.fit.bookingservices.controllers;

import com.paypal.api.payments.Links;
import com.paypal.api.payments.Payment;
import com.paypal.base.rest.PayPalRESTException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import vn.edu.iuh.fit.bookingservices.enums.BookingStatus;
import vn.edu.iuh.fit.bookingservices.models.Booking;
import vn.edu.iuh.fit.bookingservices.repositories.BookingRepository;
import vn.edu.iuh.fit.bookingservices.services.BookingService;
import vn.edu.iuh.fit.bookingservices.services.PaypalService;

import java.util.Collections;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/paypal")
@CrossOrigin(origins = "http://localhost:3000")
public class PaypalController {

    @Autowired
    private PaypalService paypalService;

    @Autowired
    private BookingService bookingService;

    @Autowired
    private BookingRepository bookingRepository;

    private static final String SUCCESS_URL = "http://localhost:3000/dashboard";
    private static final String CANCEL_URL = "http://localhost:8083/api/paypal/cancel";

    @PostMapping("/pay")
    public ResponseEntity<String> makePayment(@RequestParam("bookingId") Long bookingId) {
        try {
            Booking booking = bookingService.getBooking(bookingId);
            if (booking == null) {
                return ResponseEntity.badRequest().body("Booking không tồn tại");
            }

            double totalInVND = booking.getTotalAmount().doubleValue();
            double totalInUSD = Math.max(0.01, totalInVND / 25.0);
            System.out.println("Total in VND: " + totalInVND + ", Total in USD: " + totalInUSD);

            Payment payment = paypalService.createPayment(
                    totalInUSD,
                    "USD",
                    "paypal",
                    "sale",
                    "Thanh toán đặt sân #" + bookingId,
                    CANCEL_URL + "?bookingId=" + bookingId,
                    SUCCESS_URL,
                    false);

            for (Links links : payment.getLinks()) {
                if (links.getRel().equals("approval_url")) {
                    booking.setPaymentId(payment.getId());
                    bookingRepository.save(booking);
                    return ResponseEntity.ok("Redirect to: " + links.getHref());
                }
            }
        } catch (PayPalRESTException e) {
            System.out.println("PayPal error: " + e.getMessage());
            return ResponseEntity.badRequest().body("Lỗi PayPal: " + e.getMessage());
        } catch (Exception e) {
            System.out.println("Error: " + e.getMessage());
            return ResponseEntity.badRequest().body("Lỗi: " + e.getMessage());
        }
        return ResponseEntity.badRequest().body("Không thể tạo thanh toán");
    }

    @GetMapping("/success")
    public ResponseEntity<Map<String, String>> paymentSuccess(
            @RequestParam("paymentId") String paymentId,
            @RequestParam("PayerID") String payerId,
            @RequestParam("bookingId") Long bookingId) {
        try {
            Payment payment = paypalService.executePayment(paymentId, payerId);
            if (payment.getState().equals("approved")) {
                Booking booking = bookingService.getBooking(bookingId);
                booking.setStatus(BookingStatus.PAID);
                bookingRepository.save(booking);

                Map<String, String> response = new HashMap<>();
                response.put("redirectUrl", "http://localhost:3000/dashboard?message=Thanh toán thành công cho booking #" + bookingId);
                return ResponseEntity.ok(response);
            }
        } catch (PayPalRESTException e) {
            return ResponseEntity.badRequest().body(Collections.singletonMap("error", "Lỗi khi xử lý thanh toán: " + e.getMessage()));
        }
        return ResponseEntity.badRequest().body(Collections.singletonMap("error", "Thanh toán thất bại"));
    }

    @GetMapping("/cancel")
    public String paymentCancel(@RequestParam("bookingId") Long bookingId) {
        try {
            Booking booking = bookingService.cancelBooking(bookingId);
            return "Thanh toán bị hủy cho booking #" + bookingId;
        } catch (Exception e) {
            return "Lỗi khi hủy thanh toán: " + e.getMessage();
        }
    }
}