/*
 * @ (#) SubCourtSchedule.java    1.0    3/5/2025
 *
 *
 */

package vn.edu.iuh.hero.models;
/*
 * @Description:
 * @Author: Nguyen Thanh Thuan
 * @Date: 3/5/2025
 * @Version: 1.0
 *
 */

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.proxy.HibernateProxy;
import vn.edu.iuh.hero.enums.Status;
import vn.edu.iuh.hero.ids.SubCourtScheduleID;

import java.util.Objects;

@Getter
@Setter
@ToString
@NoArgsConstructor
@Entity
@Table(name = "sub_court_schedule")
public class SubCourtSchedule {
    @EmbeddedId
    private SubCourtScheduleID subCourtScheduleID;

    @MapsId("subCourtId")
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "sub_court_id", nullable = false)
    @ToString.Exclude
    private SubCourt subCourt;

    @MapsId("scheduleId")
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "schedule_id", nullable = false)
    @ToString.Exclude
    private Schedule schedule;

    @Column(name = "price")
    private double price;

    @Enumerated(EnumType.STRING)
    private Status status;

    public SubCourtSchedule(SubCourt subCourt, Schedule schedule, double price, Status status) {
        this.subCourtScheduleID = new SubCourtScheduleID(subCourt.getId(), schedule.getId());
        this.subCourt = subCourt;
        this.schedule = schedule;
        this.price = price;
        this.status = status;
    }

    @Override
    public final boolean equals(Object o) {
        if (this == o) return true;
        if (o == null) return false;
        Class<?> oEffectiveClass = o instanceof HibernateProxy ? ((HibernateProxy) o).getHibernateLazyInitializer().getPersistentClass() : o.getClass();
        Class<?> thisEffectiveClass = this instanceof HibernateProxy ? ((HibernateProxy) this).getHibernateLazyInitializer().getPersistentClass() : this.getClass();
        if (thisEffectiveClass != oEffectiveClass) return false;
        SubCourtSchedule that = (SubCourtSchedule) o;
        return getSubCourtScheduleID() != null && Objects.equals(getSubCourtScheduleID(), that.getSubCourtScheduleID());
    }

    @Override
    public final int hashCode() {
        return Objects.hash(subCourtScheduleID);
    }
}
