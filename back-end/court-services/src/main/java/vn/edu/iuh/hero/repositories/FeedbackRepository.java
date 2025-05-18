package vn.edu.iuh.hero.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import vn.edu.iuh.hero.models.Feedback;

public interface FeedbackRepository extends JpaRepository<Feedback, Long> {
    Iterable<Feedback> findAllByCourt_Id(Long courtId);

    // Get average star rating by court id
    @Query("SELECT AVG(f.numberStar) FROM Feedback f WHERE f.court.id = :courtId")
    Double getAverageStarByCourtId(Long courtId);
}