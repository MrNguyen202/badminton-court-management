package vn.edu.iuh.hero.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import vn.edu.iuh.hero.models.SubCourt;

public interface SubCourtRepository extends JpaRepository<SubCourt, Long> {
    Iterable<SubCourt> findAllByCourt_Id(Long courtId);
}