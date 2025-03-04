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

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;
import lombok.*;
import vn.edu.iuh.hero.enums.CourtStatus;

import java.util.List;
import java.util.Set;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
@Entity
@Table(name = "court")
public class Court {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String name;
    private String phone;
    private String description;
    @Column(name = "number_of_courts")
    private int numberOfCourts;
    @Enumerated(EnumType.STRING)
    private CourtStatus status;
    @Column(name = "user_id")
    private Long userID;
    private String utilities;
    private String linkWeb;
    private String linkMap;
    private String openTime;
    private String closeTime;

    @OneToMany(mappedBy = "court")
    @JsonManagedReference
    @ToString.Exclude
    private Set<Image> images;

    @OneToMany(mappedBy = "court")
    @JsonManagedReference
    @ToString.Exclude
    private Set<CourtSchedule> courtSchedules;

    @OneToOne
    @JoinColumn(name = "address_id")
    @JsonManagedReference
    @ToString.Exclude
    private Address address;
}
