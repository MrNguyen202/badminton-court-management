package vn.edu.iuh.fit.userservices.dtos;

import jakarta.persistence.Entity;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Data
public class UserDTO {
    private String name;
    private String email;
    private String password;
    private String phone;
    private String address;
    private String role;
}
