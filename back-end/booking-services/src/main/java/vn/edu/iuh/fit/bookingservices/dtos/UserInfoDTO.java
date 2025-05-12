package vn.edu.iuh.fit.bookingservices.dtos;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@ToString
public class UserInfoDTO {
    private String name;
    private String phone;
    private String email;
}
