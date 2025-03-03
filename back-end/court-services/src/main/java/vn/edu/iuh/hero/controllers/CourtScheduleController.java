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
import vn.edu.iuh.hero.models.CourtSchedule;
import vn.edu.iuh.hero.services.impls.CourtScheduleImpl;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

@RestController
@CrossOrigin(origins = "http://localhost:3000")
@RequestMapping("/api/court-schedules")
public class CourtScheduleController {
    @Autowired
    private CourtScheduleImpl courtScheduleService;

    //Get all court schedules by court id
    @GetMapping("/get-schedules/{courtId}")
    public ResponseEntity<Map<LocalDate, List<CourtSchedule>>> getAllCourtSchedulesByCourtId(@PathVariable Long courtId , @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate) {
        return ResponseEntity.ok(courtScheduleService.findByCourtId(courtId, startDate));
    }
}
