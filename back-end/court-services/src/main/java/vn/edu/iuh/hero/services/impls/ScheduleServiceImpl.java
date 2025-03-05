/*
 * @ (#) ScheduleServiceImpl.java    1.0    3/5/2025
 *
 *
 */

package vn.edu.iuh.hero.services.impls;
/*
 * @Description:
 * @Author: Nguyen Thanh Thuan
 * @Date: 3/5/2025
 * @Version: 1.0
 *
 */

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import vn.edu.iuh.hero.models.Schedule;
import vn.edu.iuh.hero.repositories.ScheduleRepository;
import vn.edu.iuh.hero.services.IServices;

import java.sql.Time;
import java.time.LocalDate;
import java.util.Optional;

@Service
public class ScheduleServiceImpl implements IServices<Schedule, Long> {
    @Autowired
    private ScheduleRepository scheduleRepository;

    @Override
    public Iterable<Schedule> findAll() {
        return scheduleRepository.findAll();
    }

    @Override
    public Optional<Schedule> findById(Long aLong) {
        return scheduleRepository.findById(aLong);
    }

    @Override
    public Schedule save(Schedule schedule) {
        return scheduleRepository.save(schedule);
    }

    @Override
    public Schedule delete(Long aLong) {
        return null;
    }

    @Override
    public Schedule update(Schedule schedule) {
        return scheduleRepository.save(schedule);
    }

    public Optional<Schedule> findByDateAndFromHourAndToHour(LocalDate date, Time fromHour, Time toHour) {
        return scheduleRepository.findByDateAndFromHourAndToHour(date, fromHour, toHour);
    }
}
