/*
 * @ (#) Address.java    1.0    2/27/2025
 *
 *
 */

package vn.edu.iuh.hero.models;
/*
 * @Description:
 * @Author: Nguyen Thanh Thuan
 * @Date: 2/27/2025
 * @Version: 1.0
 *
 */

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
@Entity
@Table(name = "addresses")
public class Address {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", nullable = false)
    private Long id;
    @Column(name = "province", nullable = false)
    private String province; // Tên tỉnh/thành phố

    @Column(name = "district", nullable = false)
    private String district; // Tên quận/huyện

    @Column(name = "ward", nullable = false)
    private String ward; // Tên phường/xã

    @Column(name = "specific_address", nullable = false)
    private String specificAddress; // Địa chỉ chi tiết

    @OneToOne(mappedBy = "address")
    @JsonBackReference
    private Court court;
}
