/*
 * @ (#) SubCourtScheduleController.java    1.0    3/5/2025
 *
 *
 */

package vn.edu.iuh.hero.controllers;
/*
 * @Description:
 * @Author: Nguyen Thanh Thuan
 * @Date: 3/5/2025
 * @Version: 1.0
 *
 */

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import vn.edu.iuh.hero.dtos.SubCourtScheduleDTO;
import vn.edu.iuh.hero.dtos.SubCourtScheduleRequestDTO;
import vn.edu.iuh.hero.enums.Status;
import vn.edu.iuh.hero.models.Schedule;
import vn.edu.iuh.hero.models.SubCourt;
import vn.edu.iuh.hero.models.SubCourtSchedule;
import vn.edu.iuh.hero.services.impls.ScheduleServiceImpl;
import vn.edu.iuh.hero.services.impls.SubCourtScheduleServiceImpl;
import vn.edu.iuh.hero.services.impls.SubCourtServiceImpl;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@CrossOrigin(origins = "http://localhost:3000")
@RequestMapping("/api/sub-court-schedules")
public class SubCourtScheduleController {

    @Autowired
    private SubCourtScheduleServiceImpl subCourtScheduleService;

    @Autowired
    private SubCourtServiceImpl subCourtServiceImpl;

    @Autowired
    private ScheduleServiceImpl scheduleServiceImpl;

    @GetMapping("/by-sub-court/{subCourtId}")
    public ResponseEntity<Map<Long, Map<LocalDate, List<SubCourtScheduleDTO>>>> getSchedulesBySubCourt(
            @PathVariable Long subCourtId,
            @RequestParam(required = false) LocalDate startDate) {
        return ResponseEntity.ok(subCourtScheduleService.findBySubCourtId(subCourtId, startDate));
    }


    @PostMapping("/create")
    public ResponseEntity<?> create(@RequestBody SubCourtScheduleRequestDTO subCourtScheduleRequestDTO) {
        try {
            //Kiểm tra SubCourt có tồn tại không
            Optional<SubCourt> subCourtOpt = subCourtServiceImpl.findById(subCourtScheduleRequestDTO.getSubCourtId());
            if (!subCourtOpt.isPresent()) {
                return ResponseEntity.badRequest().body("Sub court not found");
            }
            SubCourt subCourt = subCourtOpt.get();

            //Kiểm tra Schedule có tồn tại không
            Schedule schedule = scheduleServiceImpl
                    .findByDateAndFromHourAndToHour(
                            subCourtScheduleRequestDTO.getDate(),
                            subCourtScheduleRequestDTO.getFromHour(),
                            subCourtScheduleRequestDTO.getToHour()
                    )
                    .orElseGet(() -> {
                        Schedule newSchedule = new Schedule();
                        newSchedule.setDate(subCourtScheduleRequestDTO.getDate());
                        newSchedule.setFromHour(subCourtScheduleRequestDTO.getFromHour());
                        newSchedule.setToHour(subCourtScheduleRequestDTO.getToHour());
                        return scheduleServiceImpl.save(newSchedule);
                    });

            // Tạo SubCourtSchedule với constructor mới
            SubCourtSchedule subCourtSchedule = new SubCourtSchedule(
                    subCourt,
                    schedule,
                    subCourtScheduleRequestDTO.getPrice(),
                    Status.AVAILABLE
            );

            //Lưu vào database
            subCourtScheduleService.save(subCourtSchedule);

            return ResponseEntity.ok("Create success");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

}
