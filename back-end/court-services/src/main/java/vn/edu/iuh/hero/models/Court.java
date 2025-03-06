/*
 * @ (#) Court.java    1.0    2/24/2025
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

import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.proxy.HibernateProxy;
import vn.edu.iuh.hero.enums.CourtStatus;

import java.time.LocalDate;
import java.util.Objects;
import java.util.Set;

@Getter
@Setter
@ToString
@RequiredArgsConstructor
@Entity
@Table(name = "court")
public class Court {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String name;
    private String phone;
    private String description;
    @Column(name = "number_of_sub_courts")
    private int numberOfSubCourts;
    @Enumerated(EnumType.STRING)
    private CourtStatus status;
    @Column(name = "user_id")
    private Long userID;
    private String utilities;
    @Column(name = "link_web")
    private String linkWeb;
    @Column(name = "link_map")
    private String linkMap;
    @Column(name = "open_time")
    private String openTime;
    @Column(name = "close_time")
    private String closeTime;
    @Column(name = "create_date")
    private LocalDate createDate;

    @OneToMany(mappedBy = "court")
    @JsonManagedReference
    @ToString.Exclude
    private Set<Image> images;

    @OneToMany(mappedBy = "court")
    @JsonManagedReference
    @ToString.Exclude
    private Set<SubCourt> subCourts;

    @OneToOne
    @JoinColumn(name = "address_id")
    @JsonManagedReference
    @ToString.Exclude
    private Address address;

    @Override
    public final boolean equals(Object o) {
        if (this == o) return true;
        if (o == null) return false;
        Class<?> oEffectiveClass = o instanceof HibernateProxy ? ((HibernateProxy) o).getHibernateLazyInitializer().getPersistentClass() : o.getClass();
        Class<?> thisEffectiveClass = this instanceof HibernateProxy ? ((HibernateProxy) this).getHibernateLazyInitializer().getPersistentClass() : this.getClass();
        if (thisEffectiveClass != oEffectiveClass) return false;
        Court court = (Court) o;
        return getId() != null && Objects.equals(getId(), court.getId());
    }

    @Override
    public final int hashCode() {
        return this instanceof HibernateProxy ? ((HibernateProxy) this).getHibernateLazyInitializer().getPersistentClass().hashCode() : getClass().hashCode();
    }
}
