package vn.edu.iuh.hero.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import vn.edu.iuh.hero.models.CourtSchedule;

public interface CourtScheduleRepository extends JpaRepository<CourtSchedule, Long> {
}