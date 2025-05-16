package vn.edu.iuh.fit.bookingservices.dtos;

import lombok.*;
import vn.edu.iuh.fit.bookingservices.models.Booking;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@ToString
public class BookingResponseDTO {
    private Booking booking;
    private String paymentUrl;
}
