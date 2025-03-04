/*
 * @ (#) CourtScheduleController.java    1.0    3/2/2025
 *
 *
 */

package vn.edu.iuh.hero.controllers;
/*
 * @Description:
 * @Author: Nguyen Thanh Thuan
 * @Date: 3/2/2025
 * @Version: 1.0
 *
 */

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import vn.edu.iuh.hero.dtos.ScheduleDTO;
import vn.edu.iuh.hero.models.Court;
import vn.edu.iuh.hero.models.CourtSchedule;
import vn.edu.iuh.hero.services.impls.CourtScheduleImpl;
import vn.edu.iuh.hero.services.impls.CourtServiceImpl;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@CrossOrigin(origins = "http://localhost:3000")
@RequestMapping("/api/court-schedules")
public class CourtScheduleController {
    @Autowired
    private CourtScheduleImpl courtScheduleService;
    @Autowired
    private CourtServiceImpl courtService;

    //Get all court schedules by court id
    @GetMapping("/get-schedules/{courtId}")
    public ResponseEntity<Map<Integer, Map<LocalDate, List<CourtSchedule>>>> getAllCourtSchedulesByCourtId(@PathVariable Long courtId , @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate) {
        return ResponseEntity.ok(courtScheduleService.findByCourtId(courtId, startDate));
    }

    //Create court schedule
    @PostMapping("/create-schedule")
    public ResponseEntity<?> createCourtSchedule(@RequestBody ScheduleDTO scheduleDTO) {
        try {
            Optional<Court> court = courtService.findById(scheduleDTO.getCourtId());
            if (court.isPresent()) {
                CourtSchedule courtSchedule = new CourtSchedule();
                courtSchedule.setCourt(court.get());
                courtSchedule.setFromHour(scheduleDTO.getFromHour());
                courtSchedule.setToHour(scheduleDTO.getToHour());
                courtSchedule.setDate(scheduleDTO.getDate());
                courtSchedule.setIndexCourt(scheduleDTO.getIndexCourt());
                courtSchedule.setPrice(scheduleDTO.getPrice());
                courtSchedule.setStatus(scheduleDTO.getStatus());
                courtScheduleService.save(courtSchedule);
                return ResponseEntity.ok("Create court schedule successfully");
            } else {
                return ResponseEntity.ok("Court not found");
            }
        } catch (Exception e) {
            return ResponseEntity.ok("Create court schedule failed");
        }
    }
}
