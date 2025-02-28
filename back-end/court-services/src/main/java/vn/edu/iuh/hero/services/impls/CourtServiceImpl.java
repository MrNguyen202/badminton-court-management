/*
 * @ (#) CourtServiceImpl.java    1.0    2/24/2025
 *
 *
 */

package vn.edu.iuh.hero.services.impls;
/*
 * @Description:
 * @Author: Nguyen Thanh Thuan
 * @Date: 2/24/2025
 * @Version: 1.0
 *
 */

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import vn.edu.iuh.hero.enums.CourtStatus;
import vn.edu.iuh.hero.models.Court;
import vn.edu.iuh.hero.repositories.CourtRepository;
import vn.edu.iuh.hero.services.IServices;

import java.util.Collections;
import java.util.Optional;
import java.util.stream.StreamSupport;

@Service
public class CourtServiceImpl implements IServices<Court, Long> {

    @Autowired
    private CourtRepository courtRepository;

    @Override
    public Iterable<Court> findAll() {
        return courtRepository.findAll().stream().filter(court -> court.getStatus() == CourtStatus.OPEN).toList();
    }

    @Override
    public Optional<Court> findById(Long aLong) {
        return courtRepository.findById(aLong).or(() -> Optional.empty());
    }

    @Override
    public Court save(Court court) {
        return courtRepository.save(court);
    }

    @Override
    public Court delete(Long aLong) {
        Court court = courtRepository.findById(aLong).get();
        if (court != null) {
            court.setStatus(CourtStatus.CLOSE);
            return courtRepository.save(court);
        } else {
            return null;
        }
    }

    @Override
    public Court update(Court court) {
        return courtRepository.save(court);
    }


    public Iterable<Court> getCourtByUserID(Long aLong) {
        Iterable<Court> courts = courtRepository.getCourtByUserID(aLong);
        if (courts == null) {
            return Collections.emptyList();
        }
        return StreamSupport.stream(courts.spliterator(), false)
                .filter(court -> court.getStatus() == CourtStatus.OPEN)
                .toList();
    }

}
