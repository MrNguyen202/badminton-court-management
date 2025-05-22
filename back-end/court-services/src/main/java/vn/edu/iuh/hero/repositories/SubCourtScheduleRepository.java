package vn.edu.iuh.hero.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import vn.edu.iuh.hero.enums.StatusSchedule;
import vn.edu.iuh.hero.ids.SubCourtScheduleID;
import vn.edu.iuh.hero.models.SubCourtSchedule;

import java.sql.Time;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

public interface SubCourtScheduleRepository extends JpaRepository<SubCourtSchedule, SubCourtScheduleID> {
    Iterable<SubCourtSchedule> findBySubCourt_IdAndSchedule_DateBetween(Long subCourtId, LocalDate startDate, LocalDate endDate);
    @Modifying
    @Query("""
    UPDATE SubCourtSchedule s
    SET s.status = 'EXPIRED'
    WHERE s.status = 'AVAILABLE'
      AND (
          s.schedule.date < :today
          OR (s.schedule.date = :today AND s.schedule.fromHour < :nowTime)
      )
""")
    void expireSchedulesBefore(@Param("today") LocalDate today, @Param("nowTime") Time nowTime);

    @Query("SELECT scs FROM SubCourtSchedule scs WHERE scs.subCourt.id = :subCourtId AND scs.schedule.date = :date")
    List<SubCourtSchedule> findBySubCourtIdAndScheduleDate(@Param("subCourtId") Long subCourtId, @Param("date") LocalDate date);
}