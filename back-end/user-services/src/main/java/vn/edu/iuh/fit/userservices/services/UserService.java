package vn.edu.iuh.fit.userservices.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import vn.edu.iuh.fit.userservices.dtos.UserDTO;
import vn.edu.iuh.fit.userservices.exceptions.EntityIdNotFoundException;
import vn.edu.iuh.fit.userservices.models.User;
import vn.edu.iuh.fit.userservices.repositories.UserRepository;

import java.util.Iterator;
import java.util.Optional;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;
    @Autowired
    private PasswordEncoder passwordEncoder;

    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public User registerUser(UserDTO userDTO) {

        if (userRepository.findByEmail(userDTO.getEmail()).isPresent()) {
            throw new RuntimeException("Name hoặc Email đã tồn tại!");
        }

        User user = new User();
        user.setName(userDTO.getName());
        user.setEmail(userDTO.getEmail());
        user.setPassword(passwordEncoder.encode(userDTO.getPassword()));
        user.setPhone(userDTO.getPhone());
        user.setAddress(userDTO.getAddress());

        return userRepository.save(user);
    }

    public Optional<User> authenticateUser(String email, String password) {
        Optional<User> userOpt = userRepository.findByEmail(email);

        if (userOpt.isPresent()) {
            User user = userOpt.get();

            if (passwordEncoder.matches(password, user.getPassword())) {
                return Optional.of(user);
            }
        }

        return Optional.empty();
    }

    public Optional<User> getById(Long id) throws EntityIdNotFoundException {
        return Optional.of(userRepository.findById(id).orElseThrow(() -> new EntityIdNotFoundException(id + "")));
    }

    public Iterator<User> getAll() {
        return userRepository.findAll().iterator();
    }

    public User updateUser(UserDTO userDTO) throws EntityIdNotFoundException {
        Optional<User> existingUser = userRepository.findByEmail(userDTO.getEmail());

        if (existingUser.isPresent()) {
            User user = existingUser.get();
            user.setName(userDTO.getName());
            user.setPhone(userDTO.getPhone());
            user.setAddress(userDTO.getAddress());
            user.setRole(userDTO.getRole());
            return userRepository.save(user);
        } else {
            throw new EntityIdNotFoundException("User không tồn tại");
        }
    }

    public User updateRole(UserDTO userDTO) throws EntityIdNotFoundException {
        Optional<User> existingUser = userRepository.findByEmail(userDTO.getEmail());

        if (existingUser.isPresent()) {
            User user = existingUser.get();
            user.setName(userDTO.getName());
            user.setPhone(userDTO.getPhone());
            user.setAddress(userDTO.getAddress());
            user.setRole("ADMIN");

            return userRepository.save(user);
        } else {
            throw new EntityIdNotFoundException("User không tồn tại");
        }
    }

    public User updatePassword(String email, String currentPassword, String newPassword) throws EntityIdNotFoundException {
        Optional<User> existingUser = userRepository.findByEmail(email);

        if (existingUser.isPresent()) {
            User user = existingUser.get();

            // Kiểm tra xem mật khẩu hiện tại có đúng không
            if (!passwordEncoder.matches(currentPassword, user.getPassword())) {
                throw new RuntimeException("Mật khẩu hiện tại không đúng!");
            }

            // Cập nhật mật khẩu mới
            user.setPassword(passwordEncoder.encode(newPassword));
            return userRepository.save(user);
        } else {
            throw new EntityIdNotFoundException("User không tồn tại");
        }
    }
}