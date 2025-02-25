/*
 * @ (#) CourtController.java    1.0    2/24/2025
 *
 *
 */

package vn.edu.iuh.hero.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import vn.edu.iuh.hero.models.Court;
import vn.edu.iuh.hero.services.impls.CourtServiceImpl;

/*
 * @Description:
 * @Author: Nguyen Thanh Thuan
 * @Date: 2/24/2025
 * @Version: 1.0
 *
 */
@RestController
@CrossOrigin(origins = "http://localhost:3000")
@RequestMapping("/api/courts")
public class CourtController {
    @Autowired
    private CourtServiceImpl courtService;

    @GetMapping("/all")
    public ResponseEntity<?> getAllCourts() {
        return ResponseEntity.ok(courtService.findAll());
    }

    @PostMapping("/create")
    public ResponseEntity<Court> createCourt(@RequestBody Court court) {
        return ResponseEntity.ok(courtService.save(court));
    }

    @PutMapping("/update")
    public ResponseEntity<Court> updateCourt(@RequestBody Court court) {
        return ResponseEntity.ok(courtService.save(court));
    }
}
