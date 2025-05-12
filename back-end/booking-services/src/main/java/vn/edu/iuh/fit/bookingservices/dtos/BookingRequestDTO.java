package vn.edu.iuh.fit.bookingservices.dtos;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Getter @Setter @ToString
public class BookingRequestDTO {
    private Long courtId;
    private Long subCourtId;
    private String date;
    private String fromHour;
    private String toHour;
    private Double totalCost;
    private Long userId;
    private UserInfoDTO userInfo;
    private boolean isDeposit; // true nếu chọn đặt cọc 10%
}