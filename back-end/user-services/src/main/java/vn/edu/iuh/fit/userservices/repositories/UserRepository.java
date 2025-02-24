package vn.edu.iuh.fit.userservices.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import vn.edu.iuh.fit.userservices.models.User;

import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);
    Optional<User> findByEmailAndPassword(String email, String password);
}