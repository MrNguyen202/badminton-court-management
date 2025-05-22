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

import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import vn.edu.iuh.hero.dtos.SubCourtScheduleBulkRequestDTO;
import vn.edu.iuh.hero.dtos.SubCourtScheduleDTO;
import vn.edu.iuh.hero.dtos.SubCourtScheduleRequestDTO;
import vn.edu.iuh.hero.enums.StatusSchedule;
import vn.edu.iuh.hero.ids.SubCourtScheduleID;
import vn.edu.iuh.hero.models.Schedule;
import vn.edu.iuh.hero.models.SubCourt;
import vn.edu.iuh.hero.models.SubCourtSchedule;
import vn.edu.iuh.hero.services.impls.ScheduleServiceImpl;
import vn.edu.iuh.hero.services.impls.SubCourtScheduleServiceImpl;
import vn.edu.iuh.hero.services.impls.SubCourtServiceImpl;

import java.sql.Time;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
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

    @PostMapping("/bulk-create")
    @Transactional
    public ResponseEntity<?> createBulk(@RequestBody SubCourtScheduleBulkRequestDTO bulkDto) {
        try {
            List<SubCourtScheduleRequestDTO> schedules = bulkDto.getSchedules();
            List<SubCourtSchedule> newSchedules = new ArrayList<>();
            List<SubCourtSchedule> schedulesToDelete = new ArrayList<>();

            // 1. Kiểm tra và xử lý từng lịch
            for (SubCourtScheduleRequestDTO dto : schedules) {
                // Kiểm tra sân con
                Optional<SubCourt> subCourtOpt = subCourtServiceImpl.findById(dto.getSubCourtId());
                if (subCourtOpt.isEmpty()) {
                    return ResponseEntity.badRequest().body("Sub court not found for ID: " + dto.getSubCourtId());
                }
                SubCourt subCourt = subCourtOpt.get();

                // Validate thời gian
                LocalDate date = dto.getDate();
                Time fromHour = dto.getFromHour();
                Time toHour = dto.getToHour();
                double price = dto.getPrice();

                if (!fromHour.before(toHour)) {
                    return ResponseEntity.badRequest().body("fromHour must be before toHour for schedule on " + date);
                }

                // Lấy lịch đã tồn tại
                List<SubCourtSchedule> existingSchedules = subCourtScheduleService
                        .findBySubCourtIdAndDate(dto.getSubCourtId(), date);

                for (SubCourtSchedule existing : existingSchedules) {
                    Schedule existingSchedule = existing.getSchedule();
                    Time existingFrom = existingSchedule.getFromHour();
                    Time existingTo = existingSchedule.getToHour();
                    double existingPrice = existing.getPrice();

                    boolean isOverlap = fromHour.before(existingTo) && toHour.after(existingFrom);

                    if (isOverlap) {
                        if (fromHour.equals(existingFrom) && toHour.equals(existingTo)) {
                            if (existing.getStatus() == StatusSchedule.AVAILABLE) {
                                // Cập nhật giá nếu cần
                                if (price != existingPrice) {
                                    existing.setPrice(price);
                                    subCourtScheduleService.update(existing);
                                }
                            }
                        } else {
                            // Xóa lịch AVAILABLE nếu overlap
                            if (existing.getStatus() == StatusSchedule.AVAILABLE) {
                                schedulesToDelete.add(existing);
                            }
                        }
                    }
                }

                // Tạo hoặc lấy Schedule
                Schedule schedule = scheduleServiceImpl
                        .findByDateAndFromHourAndToHour(date, fromHour, toHour)
                        .orElseGet(() -> {
                            Schedule newSchedule = new Schedule();
                            newSchedule.setDate(date);
                            newSchedule.setFromHour(fromHour);
                            newSchedule.setToHour(toHour);
                            return scheduleServiceImpl.save(newSchedule);
                        });

                // Tạo lịch mới
                SubCourtSchedule newSchedule = new SubCourtSchedule(
                        subCourt,
                        schedule,
                        price,
                        StatusSchedule.AVAILABLE
                );
                newSchedules.add(newSchedule);
            }

            // 2. Xóa các lịch bị overlap mà vẫn AVAILABLE
            for (SubCourtSchedule toDelete : schedulesToDelete) {
                subCourtScheduleService.delete(toDelete.getSubCourtScheduleID());
            }

            // 3. Lưu hàng loạt lịch mới
            subCourtScheduleService.saveAll(newSchedules);

            return ResponseEntity.ok("Bulk create success");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error: " + e.getMessage());
        }
    }


    @PostMapping("/create")
    @Transactional
    public ResponseEntity<?> create(@RequestBody SubCourtScheduleRequestDTO dto) {
        try {
            // 1. Kiểm tra sân con
            Optional<SubCourt> subCourtOpt = subCourtServiceImpl.findById(dto.getSubCourtId());
            if (subCourtOpt.isEmpty()) {
                return ResponseEntity.badRequest().body("Sub court not found");
            }
            SubCourt subCourt = subCourtOpt.get();

            // 2. Validate thời gian
            LocalDate date = dto.getDate();
            Time fromHour = dto.getFromHour();
            Time toHour = dto.getToHour();
            double price = dto.getPrice();

            if (!fromHour.before(toHour)) {
                return ResponseEntity.badRequest().body("fromHour must be before toHour");
            }

            // 3. Lấy lịch đã tồn tại cho sân con trong ngày
            List<SubCourtSchedule> existingSchedules = subCourtScheduleService
                    .findBySubCourtIdAndDate(dto.getSubCourtId(), date);

            List<SubCourtSchedule> schedulesToDelete = new ArrayList<>();

            for (SubCourtSchedule existing : existingSchedules) {
                Schedule existingSchedule = existing.getSchedule();
                Time existingFrom = existingSchedule.getFromHour();
                Time existingTo = existingSchedule.getToHour();
                double existingPrice = existing.getPrice();

                boolean isOverlap = fromHour.before(existingTo) && toHour.after(existingFrom);

                if (isOverlap) {
                    if (fromHour.equals(existingFrom) && toHour.equals(existingTo)) {
                        if (existing.getStatus() == StatusSchedule.AVAILABLE) {
                            // Nếu chỉ khác giá → cập nhật giá
                            if (price != existingPrice) {
                                existing.setPrice(price);
                                subCourtScheduleService.update(existing);
                            }
                            return ResponseEntity.ok("Create success");
                        }else{
                            return ResponseEntity.ok("Create success");
                        }
                    } else {
                        // Nếu không trùng exact thời gian nhưng overlap & AVAILABLE → xóa
                        if (existing.getStatus() == StatusSchedule.AVAILABLE) {
                            schedulesToDelete.add(existing);
                        } else {
                            return ResponseEntity.ok("Create success");
                        }
                    }
                }
            }

            // 4. Xoá các lịch bị overlap mà vẫn AVAILABLE
            for (SubCourtSchedule toDelete : schedulesToDelete) {
                subCourtScheduleService.delete(toDelete.getSubCourtScheduleID());
            }

            // 5. Tạo hoặc lấy Schedule
            Schedule schedule = scheduleServiceImpl
                    .findByDateAndFromHourAndToHour(date, fromHour, toHour)
                    .orElseGet(() -> {
                        Schedule newSchedule = new Schedule();
                        newSchedule.setDate(date);
                        newSchedule.setFromHour(fromHour);
                        newSchedule.setToHour(toHour);
                        return scheduleServiceImpl.save(newSchedule);
                    });

            // 6. Tạo lịch mới
            SubCourtSchedule newSchedule = new SubCourtSchedule(
                    subCourt,
                    schedule,
                    price,
                    StatusSchedule.AVAILABLE
            );
            subCourtScheduleService.save(newSchedule);

            return ResponseEntity.ok("Create success");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error: " + e.getMessage());
        }
    }


    //Update status of sub court schedule
    @PutMapping("/update-status/{subCourtScheduleId}/{subCourtId}")
    public ResponseEntity<?> updateStatus(@PathVariable("subCourtScheduleId") Long subCourtScheduleId, @PathVariable("subCourtId") Long subCourtId, @RequestBody Map<String, String> statusPayload) {
        try {
            SubCourtScheduleID id = new SubCourtScheduleID(subCourtId, subCourtScheduleId);
            Optional<SubCourtSchedule> subCourtScheduleOpt = subCourtScheduleService.findById(id);
            if (!subCourtScheduleOpt.isPresent()) {
                return ResponseEntity.badRequest().body("Sub court schedule not found");
            } else {
                SubCourtSchedule subCourtSchedule = subCourtScheduleOpt.get();
                String status = statusPayload.get("status");

                StatusSchedule newStatus = switch (status) {
                    case "AVAILABLE" -> StatusSchedule.AVAILABLE;
                    case "BOOKED" -> StatusSchedule.BOOKED;
                    case "EXPIRED" -> StatusSchedule.EXPIRED;
                    default -> StatusSchedule.MAINTENANCE;
                };
                subCourtSchedule.setStatus(newStatus);
                subCourtScheduleService.update(subCourtSchedule);
                return ResponseEntity.ok("Update success");
            }
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @DeleteMapping("/delete/{scheduleId}/{subCourtId}")
    @Transactional
    public ResponseEntity<?> delete(@PathVariable Long scheduleId, @PathVariable Long subCourtId) {
        System.out.println("Delete scheduleId: " + scheduleId + ", subCourtId: " + subCourtId);
        try {
            SubCourtScheduleID id = new SubCourtScheduleID(subCourtId, scheduleId);
            System.out.println("SubCourtScheduleID: " + id);
            Optional<SubCourtSchedule> subCourtScheduleOpt = subCourtScheduleService.findById(id);
            if (subCourtScheduleOpt.isEmpty()) {
                return ResponseEntity.badRequest().body("Sub court schedule not found");
            }
            subCourtScheduleService.delete(id);
            return ResponseEntity.ok("Delete success");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}
