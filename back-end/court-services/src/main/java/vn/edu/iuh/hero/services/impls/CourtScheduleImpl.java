/*
 * @ (#) CourtScheduleImpl.java    1.0    3/2/2025
 *
 *
 */

package vn.edu.iuh.hero.services.impls;
/*
 * @Description:
 * @Author: Nguyen Thanh Thuan
 * @Date: 3/2/2025
 * @Version: 1.0
 *
 */

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import vn.edu.iuh.hero.models.CourtSchedule;
import vn.edu.iuh.hero.repositories.CourtScheduleRepository;
import vn.edu.iuh.hero.services.IServices;

import java.time.LocalDate;
import java.util.Comparator;
import java.util.List;
import java.util.Map;
import java.util.TreeMap;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class CourtScheduleImpl implements IServices<CourtSchedule, Long> {

    @Autowired
    private CourtScheduleRepository courtScheduleRepository;

    @Override
    public Iterable<CourtSchedule> findAll() {
        return null;
    }

    @Override
    public Optional<CourtSchedule> findById(Long aLong) {
        return Optional.empty();
    }

    @Override
    public CourtSchedule save(CourtSchedule courtSchedule) {
        return null;
    }

    @Override
    public CourtSchedule delete(Long aLong) {
        return null;
    }

    @Override
    public CourtSchedule update(CourtSchedule courtSchedule) {
        return null;
    }

    public Map<LocalDate, List<CourtSchedule>> findByCourtId(Long courtId, LocalDate startDate) {
        if (startDate == null) {
            startDate = LocalDate.now();
        }
        LocalDate endOfWeek = startDate.plusDays(6);

        Iterable<CourtSchedule> schedules = courtScheduleRepository.findByCourt_IdAndDateBetween(courtId, startDate, endOfWeek);
        return ((List<CourtSchedule>) schedules)
                .stream()
                .collect(Collectors.groupingBy(
                        CourtSchedule::getDate,
                        TreeMap::new, // Sử dụng TreeMap để sắp xếp theo ngày
                        Collectors.collectingAndThen(
                                Collectors.toList(),
                                list -> list.stream()
                                        .sorted(Comparator.comparing(CourtSchedule::getFromHour)) // Sắp xếp theo giờ
                                        .collect(Collectors.toList())
                        )
                ));
    }
}
