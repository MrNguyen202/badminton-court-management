package vn.edu.iuh.hero.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import vn.edu.iuh.hero.ids.SubCourtScheduleID;
import vn.edu.iuh.hero.models.SubCourtSchedule;

import java.time.LocalDate;

public interface SubCourtScheduleRepository extends JpaRepository<SubCourtSchedule, SubCourtScheduleID> {
    Iterable<SubCourtSchedule> findBySubCourt_IdAndSchedule_DateBetween(Long subCourtId, LocalDate startDate, LocalDate endDate);
}