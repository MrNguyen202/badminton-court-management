package vn.edu.iuh.fit.bookingservices.models;

import jakarta.persistence.*;
import lombok.*;
import vn.edu.iuh.fit.bookingservices.enums.BookingStatus;

import java.math.BigDecimal;
import java.util.Date;

@Entity
@Data
@Getter @Setter
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "booking")
public class Booking {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long userId;

    private Long courtId;

    @Temporal(TemporalType.TIMESTAMP)
    private Date startTime;

    @Temporal(TemporalType.TIMESTAMP)
    private Date endTime;

    @Enumerated(EnumType.STRING)
    private BookingStatus status;

    private BigDecimal totalAmount;

    private String paymentId;

}
