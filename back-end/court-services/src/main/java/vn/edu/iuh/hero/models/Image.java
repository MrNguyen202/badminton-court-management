/*
 * @ (#) Image.java    1.0    2/24/2025
 *
 *
 */

package vn.edu.iuh.hero.models;
/*
 * @Description:
 * @Author: Nguyen Thanh Thuan
 * @Date: 2/24/2025
 * @Version: 1.0
 *
 */

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
@Entity
@Table(name = "image")
public class Image {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String url;
    private LocalDate createDate;

    @ManyToOne
    @JoinColumn(name = "court_id")
    @JsonBackReference
    private Court court;
}
