/*
 * @ (#) SubCourtServiceImpl.java    1.0    3/5/2025
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
import vn.edu.iuh.hero.models.SubCourt;
import vn.edu.iuh.hero.repositories.SubCourtRepository;
import vn.edu.iuh.hero.services.IServices;

import java.util.Optional;

@Service
public class SubCourtServiceImpl implements IServices<SubCourt, Long > {

    @Autowired
    private SubCourtRepository subCourtRepository;

    @Override
    public Iterable<SubCourt> findAll() {
        return null;
    }

    @Override
    public Optional<SubCourt> findById(Long aLong) {
        return subCourtRepository.findById(aLong);
    }

    @Override
    public SubCourt save(SubCourt subCourt) {
        return subCourtRepository.save(subCourt);
    }

    @Override
    public SubCourt delete(Long aLong) {
        return null;
    }

    @Override
    public SubCourt update(SubCourt subCourt) {
        return null;
    }

    public Iterable<SubCourt> findAllByCourtId(Long courtId) {
        return subCourtRepository.findAllByCourt_Id(courtId);
    }
}
