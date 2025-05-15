package vn.edu.iuh.hero.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import vn.edu.iuh.hero.models.Feedback;

public interface FeedbackRepository extends JpaRepository<Feedback, Long> {
    Iterable<Feedback> findAllByCourt_Id(Long courtId);
}