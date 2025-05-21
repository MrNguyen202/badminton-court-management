package vn.edu.iuh.fit.bookingservices.controllers;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.paypal.api.payments.Links;
import com.paypal.api.payments.Payment;
import com.paypal.base.rest.PayPalRESTException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import vn.edu.iuh.fit.bookingservices.dtos.BookingRequestDTO;
import vn.edu.iuh.fit.bookingservices.enums.BookingStatus;
import vn.edu.iuh.fit.bookingservices.models.Booking;
import vn.edu.iuh.fit.bookingservices.repositories.BookingRepository;
import vn.edu.iuh.fit.bookingservices.services.BookingService;
import vn.edu.iuh.fit.bookingservices.services.EmailService;
import vn.edu.iuh.fit.bookingservices.services.PaypalService;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.Collections;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/paypal")
public class PaypalController {

    @Autowired
    private PaypalService paypalService;

    @Autowired
    EmailService emailService;

    @Autowired
    private BookingService bookingService;

    @Autowired
    private BookingRepository bookingRepository;

    @Autowired
    private ObjectMapper objectMapper;

    private static final String SUCCESS_URL = "http://localhost:3000/owners/court-detail?courtID=";
    private static final String CANCEL_URL = "http://localhost:3000/owners/court-detail?courtID=";

    @PostMapping("/pay")
    public ResponseEntity<String> makePayment(@RequestBody BookingRequestDTO bookingRequest) {
        try {
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
            } catch (Exception e) {
                return ResponseEntity.badRequest().body("Định dạng thời gian không hợp lệ. Vui lòng sử dụng định dạng yyyy-MM-dd'T'HH:mm:ss");
            }

            double totalInVND = bookingRequest.getTotalCost();
            double totalInUSD = Math.max(0.01, totalInVND / 25000.0);

            // Lưu thông tin booking tạm thời vào session hoặc database với trạng thái NEW
            Booking tempBooking = new Booking();
            tempBooking.setCourtId(bookingRequest.getCourtId());
            tempBooking.setSubCourtId(bookingRequest.getSubCourtId());
            tempBooking.setUserId(bookingRequest.getUserId());
            tempBooking.setScheduleId(bookingRequest.getScheduleId());
            tempBooking.setStartTime(startTime);
            tempBooking.setEndTime(endTime);
            tempBooking.setTotalAmount(BigDecimal.valueOf(bookingRequest.getTotalCost()));
            tempBooking.setStatus(BookingStatus.NEW);

            String userInfoJson = null;
            if (bookingRequest.getUserId() == null) {
                if (bookingRequest.getUserInfo() == null) {
                    return ResponseEntity.badRequest().body("userInfo không được để trống khi không có userId");
                }
                userInfoJson = objectMapper.writeValueAsString(bookingRequest.getUserInfo());
            }

            Booking createdTempBooking = bookingService.createBooking(tempBooking, userInfoJson);

            Payment payment = paypalService.createPayment(
                    totalInUSD,
                    "USD",
                    "paypal",
                    "sale",
                    "Thanh toán đặt sân #" + bookingRequest.getSubCourtId(),
                    CANCEL_URL + bookingRequest.getCourtId() + "&message=failed&subCourtId=" + bookingRequest.getSubCourtId() + "&bookedScheduleId=" + bookingRequest.getScheduleId(),
                    SUCCESS_URL + bookingRequest.getCourtId() + "&message=success&subCourtId=" + bookingRequest.getSubCourtId() + "&bookedScheduleId=" + bookingRequest.getScheduleId(),
                    bookingRequest.isDeposit());

            for (Links links : payment.getLinks()) {
                if (links.getRel().equals("approval_url")) {
                    createdTempBooking.setPaymentId(payment.getId());
                    bookingRepository.save(createdTempBooking);
                    return ResponseEntity.ok("Redirect to: " + links.getHref());
                }
            }
        } catch (PayPalRESTException e) {
            return ResponseEntity.badRequest().body("Lỗi PayPal: " + e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Lỗi: " + e.getMessage());
        }
        return ResponseEntity.badRequest().body("Không thể tạo thanh toán");
    }

    @PostMapping("/confirm")
    public ResponseEntity<String> directPayment(@RequestBody BookingRequestDTO bookingRequest) {
        try {

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
            } catch (Exception e) {
                return ResponseEntity.badRequest().body("Định dạng thời gian không hợp lệ. Vui lòng sử dụng định dạng yyyy-MM-dd'T'HH:mm:ss");
            }

            double totalInVND = bookingRequest.getTotalCost();
            double totalInUSD = Math.max(0.01, totalInVND / 25000.0);

            // Lưu thông tin booking vào database với trạng thái DIRECT_PAYMENT
            Booking tempBooking = new Booking();
            tempBooking.setCourtId(bookingRequest.getCourtId());
            tempBooking.setSubCourtId(bookingRequest.getSubCourtId());
            tempBooking.setUserId(bookingRequest.getUserId());
            tempBooking.setScheduleId(bookingRequest.getScheduleId());
            tempBooking.setStartTime(startTime);
            tempBooking.setEndTime(endTime);
            tempBooking.setTotalAmount(BigDecimal.valueOf(bookingRequest.getTotalCost()));
            tempBooking.setStatus(BookingStatus.DIRECT_PAYMENT);

            String userInfoJson = null;
            if (bookingRequest.getUserId() == null) {
                if (bookingRequest.getUserInfo() == null) {
                    return ResponseEntity.badRequest().body("userInfo không được để trống khi không có userId");
                }
                userInfoJson = objectMapper.writeValueAsString(bookingRequest.getUserInfo());
            }

            Booking createdTempBooking = bookingService.confirmBooking(tempBooking, userInfoJson);

            bookingRepository.save(createdTempBooking);

            return ResponseEntity.ok("success");
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error: " + e.getMessage());
        }
    }

    @PostMapping("/success")
    public ResponseEntity<?> paymentSuccess(@RequestBody Map<String, String> request) {
        try {
            String email = request.get("email");

            emailService.sendEmail(
                    email,
                    "Xác nhận thanh toán thành công",
                    "Cảm ơn bạn đã đặt sân. Thông tin đặt sân: \n" +
                            "Sân: XXX" + "\n" +
                            "Thời gian: XX" + " - XX" + "\n" +
                            "Tổng tiền: XXX.XXX" + " VNĐ" + "\n" +
                            "Hãy đưa email để xác nhận khi đến sân nhé!" + "\n"
            );

            Map<String, Object> response = new HashMap<>();
            response.put("status", "success");

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("error", "Lỗi server: " + e.getMessage());
            return ResponseEntity.status(500).body(errorResponse);
        }
    }

    @GetMapping("/success")
    public ResponseEntity<Map<String, String>> paymentSuccess(
            @RequestParam("paymentId") String paymentId,
            @RequestParam("PayerID") String payerId,
            @RequestParam("courtId") Long courtId,
            @RequestParam("subCourtId") Long subCourtId,
            @RequestParam("bookedScheduleId") Long bookedScheduleId) {
        try {
            Payment payment = paypalService.executePayment(paymentId, payerId);
            if (payment.getState().equals("approved")) {
                // Tạo và lưu booking chỉ khi thanh toán thành công
                Booking booking = new Booking();
                booking.setCourtId(courtId);
                booking.setSubCourtId(subCourtId);
                booking.setUserId(null); // Cần lấy từ session hoặc request nếu có
                booking.setStartTime(LocalDateTime.parse(payment.getCreateTime(), DateTimeFormatter.ISO_OFFSET_DATE_TIME));
                booking.setEndTime(booking.getStartTime().plusHours(1)); // Điều chỉnh theo logic thực tế
                booking.setTotalAmount(BigDecimal.valueOf(100.0)); // Lấy từ bookingRequest hoặc payment
                booking.setStatus(BookingStatus.PAID);
                booking.setPaymentId(payment.getId());

                String userInfoJson = null; // Lấy từ session hoặc request
                Booking createdBooking = bookingService.createBooking(booking, userInfoJson);

                Map<String, String> response = new HashMap<>();
                response.put("status", "success");
                response.put("message", "Bạn đã thanh toán thành công cho booking #" + createdBooking.getId());
                response.put("bookingId", String.valueOf(createdBooking.getId()));
                response.put("subCourtId", String.valueOf(subCourtId));
                response.put("startTime", createdBooking.getStartTime().toString());
                response.put("endTime", createdBooking.getEndTime().toString());
                return ResponseEntity.ok(response);
            }
        } catch (PayPalRESTException e) {
            return ResponseEntity.badRequest().body(Collections.singletonMap("error", "Lỗi khi xử lý thanh toán: " + e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Collections.singletonMap("error", "Error: " + e.getMessage()));
        }
        return ResponseEntity.badRequest().body(Collections.singletonMap("error", "Thanh toán thất bại"));
    }

    @GetMapping("/cancel")
    public ResponseEntity<Map<String, String>> paymentCancel(
            @RequestParam("courtID") Long courtId,
            @RequestParam("subCourtId") Long subCourtId,
            @RequestParam("bookedScheduleId") Long bookedScheduleId) {
        try {
            Boolean isDeleted = bookingService.deleteBooking(courtId, subCourtId, bookedScheduleId);
            Map<String, String> response = new HashMap<>();
            if (isDeleted) {
                response.put("status", "success");
                response.put("redirectUrl", "http://localhost:3000/owners/court-detail?courtID=" + courtId + "&message=Thanh toán bị hủy");
                return ResponseEntity.ok(response);
            }
            response.put("status", "error");
            response.put("message", "Không tìm thấy booking #" + bookedScheduleId);
            return ResponseEntity.badRequest().body(response);
        } catch (Exception e) {
            Map<String, String> errorResponse = new HashMap<>();
            errorResponse.put("status", "error");
            errorResponse.put("message", "Lỗi khi xử lý hủy thanh toán: " + e.getMessage());
            return ResponseEntity.badRequest().body(errorResponse);
        }
    }
}