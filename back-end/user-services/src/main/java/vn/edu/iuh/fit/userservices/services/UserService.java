package vn.edu.iuh.fit.userservices.services;

import org.springframework.beans.factory.annotation.Autowired;
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

    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public User registerUser(UserDTO userDTO) {

        if (userRepository.findByEmail(userDTO.getEmail()).isPresent()) {
            throw new RuntimeException("Username hoặc Email đã tồn tại!");
        }

        User user = new User();
        user.setFirstName(userDTO.getFirstName());
        user.setLastName(userDTO.getLastName());
        user.setEmail(userDTO.getEmail());
        user.setPassword(userDTO.getPassword());
        user.setPhone(userDTO.getPhone());
        user.setAddress(userDTO.getAddress());

        return userRepository.save(user);
    }

    public Optional<User> authenticateUser(String email, String password) {
        Optional<User> user = userRepository.findByEmailAndPassword(email, password);
        if (user.isPresent()) {
            return user;
        }
        return Optional.empty();
    }

    public Optional<User> getById(Long id) throws EntityIdNotFoundException {
        return Optional.of(userRepository.findById(id).orElseThrow(() -> new EntityIdNotFoundException(id + "")));
    }

    public Iterator<User> getAll() {
        return userRepository.findAll().iterator();
    }

    public User updateUser(UserDTO userDTO) {
        if (userRepository.findByEmail(userDTO.getEmail()).isPresent()) {
            User user = new User();
            user.setFirstName(userDTO.getFirstName());
            user.setLastName(userDTO.getLastName());
            user.setEmail(userDTO.getEmail());
            user.setPassword(userDTO.getPassword());
            user.setPhone(userDTO.getPhone());
            user.setAddress(userDTO.getAddress());

            return userRepository.save(user);
        }
        return null;
    }
}
