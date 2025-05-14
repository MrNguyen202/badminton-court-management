/*
 * @ (#) FeedbackController.java    1.0    5/15/2025
 *
 *
 */

package vn.edu.iuh.hero.controllers;
/*
 * @Description:
 * @Author: Nguyen Thanh Thuan
 * @Date: 5/15/2025
 * @Version: 1.0
 *
 */

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import vn.edu.iuh.hero.dtos.FeedbackDTO;
import vn.edu.iuh.hero.models.Court;
import vn.edu.iuh.hero.models.Feedback;
import vn.edu.iuh.hero.services.impls.CourtServiceImpl;
import vn.edu.iuh.hero.services.impls.FeedbackServiceImpl;

import java.time.LocalDate;
import java.util.Optional;

@RestController
@RequestMapping("/api/feedbacks")
public class FeedbackController {

    @Autowired
    private FeedbackServiceImpl feedbackService;

    @Autowired
    private CourtServiceImpl courtService;

    //Get all feedbacks
    @GetMapping("/get-feedbacks")
    public ResponseEntity<?> getAllFeedbacks() {
        return ResponseEntity.ok(feedbackService.findAll());
    }

    //Get all feedback by court id
    @GetMapping("/get-feedbacks-by-court-id/{courtId}")
    public ResponseEntity<?> getFeedbacksByCourtId(@PathVariable Long courtId) {
        return ResponseEntity.ok(feedbackService.findAllByCourtId(courtId));
    }

    // Add feedback
    @PostMapping("/add-feedback")
    public ResponseEntity<?> addFeedback(@RequestBody FeedbackDTO feedbackDTO) {
        // kiểm tra court có tồn tại không
        System.out.println(feedbackDTO);
        Optional<Court> court = courtService.findById(feedbackDTO.getCourtId());
        System.out.println(court);
        if (court.isPresent()) {
            Feedback feedback = new Feedback();
            feedback.setContent(feedbackDTO.getContent());
            feedback.setNumberStar(feedbackDTO.getNumberStar());
            feedback.setUserId(feedbackDTO.getUserId());
            feedback.setUserName(feedbackDTO.getUserName());
            feedback.setDate(LocalDate.now());
            feedback.setCourt(court.get());
            return ResponseEntity.ok(feedbackService.save(feedback));
        } else {
            return ResponseEntity.badRequest().body("Court not found");
        }
    }
}
