package vn.edu.iuh.hero.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import vn.edu.iuh.hero.models.Schedule;

import java.sql.Time;
import java.time.LocalDate;
import java.util.Optional;

public interface ScheduleRepository extends JpaRepository<Schedule, Long> {
    Optional<Schedule> findByDateAndFromHourAndToHour(LocalDate date, Time fromHour, Time toHour);
}