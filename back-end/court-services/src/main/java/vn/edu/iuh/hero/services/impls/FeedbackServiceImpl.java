/*
 * @ (#) FeedbackServiceImpl.java    1.0    5/15/2025
 *
 *
 */

package vn.edu.iuh.hero.services.impls;
/*
 * @Description:
 * @Author: Nguyen Thanh Thuan
 * @Date: 5/15/2025
 * @Version: 1.0
 *
 */

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import vn.edu.iuh.hero.models.Feedback;
import vn.edu.iuh.hero.repositories.FeedbackRepository;
import vn.edu.iuh.hero.services.IServices;

import java.util.Optional;

@Service
public class FeedbackServiceImpl implements IServices<Feedback, Long> {

    @Autowired
    private FeedbackRepository feedbackRepository;

    @Override
    public Iterable<Feedback> findAll() {
        return feedbackRepository.findAll();
    }

    @Override
    public Optional<Feedback> findById(Long aLong) {
        return feedbackRepository.findById(aLong);
    }

    @Override
    public Feedback save(Feedback feedback) {
        return feedbackRepository.save(feedback);
    }

    @Override
    public Feedback delete(Long aLong) {
        Optional<Feedback> feedback = feedbackRepository.findById(aLong);
        if (feedback.isPresent()) {
            feedbackRepository.delete(feedback.get());
            return feedback.get();
        } else {
            return null;
        }
    }

    @Override
    public Feedback update(Feedback feedback) {
        return null;
    }

    // Get all feedback by court id
    public Iterable<Feedback> findAllByCourtId(Long courtId) {
        return feedbackRepository.findAllByCourt_Id(courtId);
    }

    // Get average star rating by court id
    public Double getAverageStarRatingByCourtId(Long courtId) {
        return feedbackRepository.getAverageStarByCourtId(courtId);
    }
}
