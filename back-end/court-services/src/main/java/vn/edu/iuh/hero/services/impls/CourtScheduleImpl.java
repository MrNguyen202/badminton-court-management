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
import vn.edu.iuh.hero.dtos.ScheduleDTO;
import vn.edu.iuh.hero.models.Court;
import vn.edu.iuh.hero.models.CourtSchedule;
import vn.edu.iuh.hero.repositories.CourtRepository;
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
    @Autowired
    private CourtRepository courtRepository;

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
        return courtScheduleRepository.save(courtSchedule);
    }

    @Override
    public CourtSchedule delete(Long aLong) {
        return null;
    }

    @Override
    public CourtSchedule update(CourtSchedule courtSchedule) {
        return null;
    }

    public Map<Integer, Map<LocalDate, List<CourtSchedule>>> findByCourtId(Long courtId, LocalDate startDate) {
        if (startDate == null) {
            startDate = LocalDate.now();
        }
        LocalDate endOfWeek = startDate.plusDays(6);

        Iterable<CourtSchedule> schedules = courtScheduleRepository.findByCourt_IdAndDateBetween(courtId, startDate, endOfWeek);

        return ((List<CourtSchedule>) schedules)
                .stream()
                .collect(Collectors.groupingBy(
                        CourtSchedule::getIndexCourt, // Nhóm theo số sân trước
                        TreeMap::new,                 // Sử dụng TreeMap để sắp xếp số sân
                        Collectors.groupingBy(        // Nhóm lồng theo ngày
                                CourtSchedule::getDate,
                                TreeMap::new,         // Sử dụng TreeMap để sắp xếp ngày
                                Collectors.collectingAndThen(
                                        Collectors.toList(),
                                        list -> list.stream()
                                                .sorted(Comparator.comparing(CourtSchedule::getFromHour)) // Sắp xếp theo giờ
                                                .collect(Collectors.toList())
                                )
                        )
                ));
    }

//    // Thêm phương thức để chuyển đổi sang DTO
//    public ScheduleDTO toDTO(CourtSchedule courtSchedule) {
//        ScheduleDTO dto = new ScheduleDTO();
//        dto.setToHour(courtSchedule.getToHour());
//        dto.setFromHour(courtSchedule.getFromHour());
//        dto.setDate(courtSchedule.getDate());
//        dto.setPrice(courtSchedule.getPrice());
//        dto.setIndexCourt(courtSchedule.getIndexCourt());
//        dto.setStatus(courtSchedule.getStatus());
//        dto.setCourtId(courtSchedule.getCourt() != null ? courtSchedule.getCourt().getId() : null);
//        return dto;
//    }
}
