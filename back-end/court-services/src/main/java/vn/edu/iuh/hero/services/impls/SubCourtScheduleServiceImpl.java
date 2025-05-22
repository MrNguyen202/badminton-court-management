/*
 * @ (#) SubCourtScheduleServiceImpl.java    1.0    3/5/2025
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

import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import vn.edu.iuh.hero.dtos.SubCourtScheduleDTO;
import vn.edu.iuh.hero.ids.SubCourtScheduleID;
import vn.edu.iuh.hero.models.SubCourtSchedule;
import vn.edu.iuh.hero.repositories.SubCourtScheduleRepository;
import vn.edu.iuh.hero.services.IServices;

import java.sql.Time;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class SubCourtScheduleServiceImpl implements IServices<SubCourtSchedule, SubCourtScheduleID> {
    @Autowired
    private SubCourtScheduleRepository subCourtScheduleRepository;

    /**
     * Lấy danh sách SubCourtSchedule theo subCourtId và ngày bắt đầu.
     * @param subCourtId ID của subCourt cần tìm
     * @param startDate Ngày bắt đầu (nếu null, mặc định là ngày hiện tại)
     * @return Map với key là subCourtId, value là Map của ngày và danh sách SubCourtSchedule
     */
    public Map<Long, Map<LocalDate, List<SubCourtScheduleDTO>>> findBySubCourtId(Long subCourtId, LocalDate startDate) {
        if (startDate == null) {
            startDate = LocalDate.now();
        }
        LocalDate endOfWeek = startDate.plusDays(6);

        Iterable<SubCourtSchedule> schedules = subCourtScheduleRepository
                .findBySubCourt_IdAndSchedule_DateBetween(subCourtId, startDate, endOfWeek);

        return ((List<SubCourtSchedule>) schedules)
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.groupingBy(
                        SubCourtScheduleDTO::getSubCourtId,
                        TreeMap::new,
                        Collectors.groupingBy(
                                SubCourtScheduleDTO::getDate,
                                TreeMap::new,
                                Collectors.collectingAndThen(
                                        Collectors.toList(),
                                        list -> list.stream()
                                                .sorted(Comparator.comparing(SubCourtScheduleDTO::getFromHour))
                                                .collect(Collectors.toList())
                                )
                        )
                ));
    }

    private SubCourtScheduleDTO convertToDTO(SubCourtSchedule entity) {
        SubCourtScheduleDTO dto = new SubCourtScheduleDTO();
        dto.setSubCourtId(entity.getSubCourt().getId());
        dto.setSubCourtName(entity.getSubCourt().getSubName());
        dto.setScheduleId(entity.getSchedule().getId());
        dto.setFromHour(entity.getSchedule().getFromHour());
        dto.setToHour(entity.getSchedule().getToHour());
        dto.setDate(entity.getSchedule().getDate());
        dto.setPrice(entity.getPrice());
        dto.setStatus(entity.getStatus() != null ? entity.getStatus().name() : null);
        return dto;
    }

    @Override
    public Iterable<SubCourtSchedule> findAll() {
        return null;
    }

    @Override
    public Optional<SubCourtSchedule> findById(SubCourtScheduleID subCourtScheduleID) {
        return subCourtScheduleRepository.findById(subCourtScheduleID);
    }

    @Override
    public SubCourtSchedule save(SubCourtSchedule subCourtSchedule) {
        return subCourtScheduleRepository.save(subCourtSchedule);
    }

    @Override
    @Transactional
    public SubCourtSchedule delete(SubCourtScheduleID subCourtScheduleID) {
        Optional<SubCourtSchedule> subCourtScheduleOpt = subCourtScheduleRepository.findById(subCourtScheduleID);
        System.out.println("SubCourtScheduleOpt: " + subCourtScheduleOpt);
        if (subCourtScheduleOpt.isEmpty()) {
            throw new RuntimeException("SubCourtSchedule not found with ID: " + subCourtScheduleID);
        }
        SubCourtSchedule entity = subCourtScheduleOpt.get();
        subCourtScheduleRepository.deleteById(subCourtScheduleID);
        return entity;
    }


    @Override
    public SubCourtSchedule update(SubCourtSchedule subCourtSchedule) {
        return subCourtScheduleRepository.save(subCourtSchedule);
    }

    // Kiem tra va cap nhat trang thai ham nay chaỵ liên tục
    @Scheduled(fixedRate = 60000) // mỗi phút
    @Transactional
    public void updateStatus() {
        LocalDate today = LocalDate.now();
        LocalTime now = LocalTime.now();
        System.out.println("Updating status of schedules..." +  today + "---" + Time.valueOf(now));
        subCourtScheduleRepository.expireSchedulesBefore(today, Time.valueOf(now));
    }

    public List<SubCourtSchedule> findBySubCourtIdAndDate(Long subCourtId, LocalDate date) {
        return subCourtScheduleRepository.findBySubCourtIdAndScheduleDate(subCourtId, date);
    }

}
