package vn.edu.iuh.hero.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import vn.edu.iuh.hero.models.Court;

import java.util.Optional;

public interface CourtRepository extends JpaRepository<Court, Long> {
    Iterable<Court> getCourtByUserID(Long userID);

    Iterable<Court> findAllByUserIDNot(Long userID);
}