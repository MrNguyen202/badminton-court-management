/*
 * @ (#) CourtServiceImpl.java    1.0    3/5/2025
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

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import vn.edu.iuh.hero.enums.CourtStatus;
import vn.edu.iuh.hero.models.Address;
import vn.edu.iuh.hero.models.Court;
import vn.edu.iuh.hero.repositories.AddressRepository;
import vn.edu.iuh.hero.repositories.CourtRepository;
import vn.edu.iuh.hero.repositories.ImageRepository;
import vn.edu.iuh.hero.repositories.SubCourtRepository;
import vn.edu.iuh.hero.services.IServices;

import java.util.Collections;
import java.util.Optional;
import java.util.stream.StreamSupport;

import static java.util.Arrays.stream;

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
        return courtRepository.findById(aLong);
    }

    @Override
    public Court save(Court court) {
        return courtRepository.save(court);
    }

    @Override
    public Court delete(Long aLong) {
        Court court = courtRepository.findById(aLong).get();
        court.setStatus(CourtStatus.CLOSE);
        return courtRepository.save(court);
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

    public Iterable<Court> getNotApprovedCourts(Long id) {
        return StreamSupport.stream(courtRepository.findAllByUserIDNot(id).spliterator(), false)
                .filter(court -> court.getStatus() == CourtStatus.OPEN)
                .toList();
    }
}
