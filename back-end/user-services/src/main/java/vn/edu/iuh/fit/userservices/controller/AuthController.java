package vn.edu.iuh.fit.userservices.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import vn.edu.iuh.fit.userservices.dtos.UserDTO;
import vn.edu.iuh.fit.userservices.exceptions.EntityIdNotFoundException;
import vn.edu.iuh.fit.userservices.models.User;
import vn.edu.iuh.fit.userservices.services.UserService;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@CrossOrigin(origins = "http://localhost:3000") // Chỉ định domain frontend
@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private UserService userService;

    @PostMapping("/register")
    public ResponseEntity<String> register(@RequestBody UserDTO userDTO) {
        userService.registerUser(userDTO);
        return ResponseEntity.ok("Đăng ký thành công!");
    }

    @PostMapping("/login")
    public ResponseEntity<Map<String, Object>> login(@RequestBody User user) {
        System.out.println("Nhận được yêu cầu đăng nhập từ email: " + user.getEmail());

        Optional<User> checkUser = userService.authenticateUser(user.getEmail(), user.getPassword());
        if (checkUser.isPresent()) {
            System.out.println("Đăng nhập thành công với email: " + checkUser.get().getEmail());

            Map<String, Object> response = new HashMap<>();
            response.put("status", "success");
            response.put("id", checkUser.get().getId());
            response.put("firstName", checkUser.get().getFirstName());
            response.put("lastName", checkUser.get().getLastName());
            response.put("email", checkUser.get().getEmail());
            response.put("password", checkUser.get().getPassword());
            response.put("phone", checkUser.get().getPhone());
            response.put("address", checkUser.get().getAddress());
            response.put("role", checkUser.get().getRole());

            return ResponseEntity.ok(response);
        } else {
            System.out.println("Đăng nhập thất bại cho email: " + user.getEmail());
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
    }

    @GetMapping("/login")
    public ResponseEntity<Map<String, Object>> login(
            @RequestParam String email,
            @RequestParam String password) {

        System.out.println("Nhận yêu cầu đăng nhập với email: " + email + " và password: " + password);

        Optional<User> user = userService.authenticateUser(email, password);
        if (user.isPresent()) {

            Map<String, Object> response = new HashMap<>();
            response.put("status", "success");
            response.put("id", user.get().getId());
            response.put("firstName", user.get().getFirstName());
            response.put("lastName", user.get().getLastName());
            response.put("email", user.get().getEmail());
            response.put("password", user.get().getPassword());
            response.put("phone", user.get().getPhone());
            response.put("address", user.get().getAddress());
            response.put("role", user.get().getRole());

            return ResponseEntity.ok(response);
        } else {
            System.out.println("Sai email hoặc password!");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("error", "Sai thông tin đăng nhập"));
        }
    }

    @PostMapping("/update-user")
    public ResponseEntity<Map<String, Object>> updateUser(@RequestBody UserDTO userDTO) {
        User user = userService.updateUser(userDTO);
        System.out.println("Cập nhật thông tin người dùng thành công!"+user);
        Map<String, Object> response = new HashMap<>();
        response.put("status", "success");
        response.put("firstName", user.getFirstName());
        response.put("lastName", user.getLastName());
        response.put("email", user.getEmail());
        response.put("password", user.getPassword());
        response.put("phone", user.getPhone());
        response.put("address", user.getAddress());
        response.put("role", user.getRole());
        return ResponseEntity.ok(response);
    }

    @GetMapping("/get-user")
    public ResponseEntity<Map<String, Object>> getUser(@RequestParam Long id) throws EntityIdNotFoundException {
        Optional<User> user = userService.getById(id);
        if (user.isPresent()) {
            Map<String, Object> response = new HashMap<>();
            response.put("status", "success");
            response.put("id", user.get().getId());
            response.put("firstName", user.get().getFirstName());
            response.put("lastName", user.get().getLastName());
            response.put("email", user.get().getEmail());
            response.put("password", user.get().getPassword());
            response.put("phone", user.get().getPhone());
            response.put("address", user.get().getAddress());
            response.put("role", user.get().getRole());
            return ResponseEntity.ok(response);
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("error", "Không tìm thấy người dùng"));
        }
    }

}
