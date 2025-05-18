/*
 * @ (#) Feedback.java    1.0    5/15/2025
 *
 *
 */

package vn.edu.iuh.hero.models;
/*
 * @Description:
 * @Author: Nguyen Thanh Thuan
 * @Date: 5/15/2025
 * @Version: 1.0
 *
 */

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.Setter;
import lombok.ToString;

import java.time.LocalDate;
import java.util.Objects;

@Getter
@Setter
@ToString
@RequiredArgsConstructor
@Entity
@Table(name = "feed_back")
public class Feedback {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(name = "content")
    private String content;
    @Column(name = "number_star")
    private int numberStar;
    @Column(name = "user_id")
    private Long userId;
    @Column(name = "date")
    private LocalDate date;
    @Column(name = "user_name")
    private String userName;

    @ManyToOne
    @JoinColumn(name = "court_id", nullable = false)
    @JsonBackReference
    private Court court;

    @Override
    public boolean equals(Object o) {
        if (!(o instanceof Feedback feedback)) return false;
        return getNumberStar() == feedback.getNumberStar() && Objects.equals(getId(), feedback.getId()) && Objects.equals(getContent(), feedback.getContent()) && Objects.equals(getUserId(), feedback.getUserId()) && Objects.equals(getCourt(), feedback.getCourt());
    }

    @Override
    public int hashCode() {
        return Objects.hash(getId(), getContent(), getNumberStar(), getUserId(), getCourt());
    }
}
