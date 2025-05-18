/*
 * @ (#) SubCourtScheduleID.java    1.0    3/5/2025
 *
 *
 */

package vn.edu.iuh.hero.ids;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.Hibernate;

import java.util.Objects;

/*
 * @Description:
 * @Author: Nguyen Thanh Thuan
 * @Date: 3/5/2025
 * @Version: 1.0
 *
 */
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Embeddable
public class SubCourtScheduleID {
    @Column(name = "sub_court_id", nullable = false)
    private Long subCourtId;
    @Column(name = "schedule_id", nullable = false)
    private Long scheduleId;

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || Hibernate.getClass(this) != Hibernate.getClass(o)) return false;
        SubCourtScheduleID entity = (SubCourtScheduleID) o;
        return Objects.equals(this.subCourtId, entity.subCourtId) &&
                Objects.equals(this.scheduleId, entity.scheduleId);
    }

    @Override
    public int hashCode() {
        return Objects.hash(subCourtId, scheduleId);
    }
}
