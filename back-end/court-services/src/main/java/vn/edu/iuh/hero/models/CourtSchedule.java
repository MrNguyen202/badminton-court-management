/*
 * @ (#) CourtSchedule.java    1.0    2/24/2025
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
import vn.edu.iuh.hero.enums.Status;
import vn.edu.iuh.hero.enums.StatusSchedule;

import java.sql.Time;
import java.time.LocalDate;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
@Entity
@Table(name = "court_schedule")
public class CourtSchedule {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "to_hour")
    private Time toHour;

    @Column(name = "from_hour")
    private Time fromHour;

    @Column(name = "date")
    private LocalDate date;

    @Column(name = "price")
    private double price;

    @Column(name = "index_court", nullable = false)
    private int indexCourt;

    @Enumerated(EnumType.STRING)
    @Column(name = "status")
    private StatusSchedule status;

    @ManyToOne
    @JoinColumn(name = "court_id")
    @JsonBackReference
    private Court court;
}
