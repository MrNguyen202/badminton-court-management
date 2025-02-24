package vn.edu.iuh.fit.userservices.controller;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import vn.edu.iuh.fit.userservices.dtos.UserDTO;
import vn.edu.iuh.fit.userservices.exceptions.EntityIdNotFoundException;
import vn.edu.iuh.fit.userservices.models.Response;
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
    public ResponseEntity<Map<String, Object>> login(@RequestBody UserDTO userDTO) {
        System.out.println("Nhận được yêu cầu đăng nhập từ username: " + userDTO.getEmail());

        Optional<User> user = userService.authenticateUser(userDTO.getEmail(), userDTO.getPassword());
        if (user.isPresent()) {
            System.out.println("Đăng nhập thành công với username: " + user.get().getUsername());

            Map<String, Object> response = new HashMap<>();
            response.put("status", "success");
            response.put("email", user.get().getEmail());
            response.put("username", user.get().getUsername());
            response.put("password", user.get().getPassword());
            response.put("role", user.get().getRole());

            return ResponseEntity.ok(response);
        }
        else {
            System.out.println("Đăng nhập thất bại cho username: " + userDTO.getEmail());
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
            System.out.println("Đăng nhập thành công với username: " + user.get().getUsername());

            Map<String, Object> response = new HashMap<>();
            response.put("status", "success");
            response.put("email", user.get().getEmail());
            response.put("username", user.get().getUsername());
            response.put("role", user.get().getRole());

            return ResponseEntity.ok(response);
        } else {
            System.out.println("Sai email hoặc password!");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("error", "Sai thông tin đăng nhập"));
        }
    }





}
