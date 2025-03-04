package vn.edu.iuh.hero.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import vn.edu.iuh.hero.models.CourtSchedule;

import java.time.LocalDate;

public interface CourtScheduleRepository extends JpaRepository<CourtSchedule, Long> {
    Iterable<CourtSchedule> findByCourt_IdAndDateBetween(Long courtId, LocalDate startDate, LocalDate endDate);
}