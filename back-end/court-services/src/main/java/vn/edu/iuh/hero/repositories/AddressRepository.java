package vn.edu.iuh.hero.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import vn.edu.iuh.hero.models.Address;

public interface AddressRepository extends JpaRepository<Address, Long> {
}