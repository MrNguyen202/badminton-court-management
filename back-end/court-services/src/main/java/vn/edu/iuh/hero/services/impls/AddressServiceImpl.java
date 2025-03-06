/*
 * @ (#) AddressServiceImpl.java    1.0    3/5/2025
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
import vn.edu.iuh.hero.models.Address;
import vn.edu.iuh.hero.repositories.AddressRepository;
import vn.edu.iuh.hero.services.IServices;

import java.util.Optional;

@Service
public class AddressServiceImpl implements IServices<Address, Long> {

    @Autowired
    private AddressRepository addressRepository;

    @Override
    public Iterable<Address> findAll() {
        return null;
    }

    @Override
    public Optional<Address> findById(Long aLong) {
        return Optional.empty();
    }

    @Override
    public Address save(Address address) {
        return addressRepository.save(address);
    }

    @Override
    public Address delete(Long aLong) {
        return null;
    }

    @Override
    public Address update(Address address) {
        return null;
    }
}
