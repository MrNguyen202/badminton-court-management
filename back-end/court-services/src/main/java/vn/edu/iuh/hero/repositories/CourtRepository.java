package vn.edu.iuh.hero.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import vn.edu.iuh.hero.models.Court;

public interface CourtRepository extends JpaRepository<Court, Long> {
    Iterable<Court> getCourtByUserID(Long userID);
}