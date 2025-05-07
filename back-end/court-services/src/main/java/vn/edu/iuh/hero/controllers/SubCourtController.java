/*
 * @ (#) SubCourtController.java    1.0    3/5/2025
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
import vn.edu.iuh.hero.services.impls.SubCourtServiceImpl;

@RestController
@RequestMapping("/api/sub-courts")
public class SubCourtController {
    @Autowired
    private SubCourtServiceImpl subCourtService;

    //Get all sub courts by court id
    @GetMapping("/get-sub-courts/{courtId}")
    public ResponseEntity<?> getSubCourtsByCourtId(@PathVariable Long courtId) {
        return ResponseEntity.ok(subCourtService.findAllByCourtId(courtId));
    }

    //Get a sub court by id
    @GetMapping("/get-sub-court-by-id/{id}")
    public ResponseEntity<?> getSubCourtById(@PathVariable Long id) {
        return ResponseEntity.ok(subCourtService.findById(id));
    }
}
