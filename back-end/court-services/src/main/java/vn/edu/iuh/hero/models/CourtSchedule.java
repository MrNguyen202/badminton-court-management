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

import jakarta.persistence.*;
import vn.edu.iuh.hero.enums.Status;

import java.time.LocalDate;

@Entity
@Table(name = "court_schedule")
public class CourtSchedule {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private LocalDate toHour;
    private LocalDate fromHour;
    private int indexCourt;
    @Enumerated(EnumType.STRING)
    private Status status;

    @ManyToOne
    @JoinColumn(name = "court_id")
    private Court court;
}
