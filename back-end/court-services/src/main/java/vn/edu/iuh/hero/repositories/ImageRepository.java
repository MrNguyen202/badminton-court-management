package vn.edu.iuh.hero.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import vn.edu.iuh.hero.models.Image;

public interface ImageRepository extends JpaRepository<Image, Long> {
}