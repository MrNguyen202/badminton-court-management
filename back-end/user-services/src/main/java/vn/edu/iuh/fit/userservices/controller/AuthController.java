package vn.edu.iuh.fit.userservices.controller;

import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import vn.edu.iuh.fit.userservices.dtos.UserDTO;
import vn.edu.iuh.fit.userservices.exceptions.EntityIdNotFoundException;
import vn.edu.iuh.fit.userservices.models.User;
import vn.edu.iuh.fit.userservices.repositories.UserRepository;
import vn.edu.iuh.fit.userservices.services.JwtService;
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
    @Autowired
    private PasswordEncoder passwordEncoder;
    @Autowired
    private final JwtService jwtService;
    @Autowired
    private final UserRepository userRepository;

    public AuthController(JwtService jwtService, UserRepository userRepository) {
        this.jwtService = jwtService;
        this.userRepository = userRepository;
    }

    @PostMapping("/register")
    public ResponseEntity<String> register(@RequestBody UserDTO userDTO) {
        System.out.println("Nhận yêu cầu đăng ký từ email: " + userDTO.toString());
        userService.registerUser(userDTO);
        return ResponseEntity.ok("Đăng ký thành công!");
    }

    @PostMapping("/login")
    public ResponseEntity<Map<String, Object>> login(@RequestBody User user) {
        System.out.println("Nhận được yêu cầu đăng nhập từ email: " + user.getEmail());
        System.out.println("Password: " + user.getPassword());

        Optional<User> checkUser = userService.authenticateUser(user.getEmail(), user.getPassword());
        if (checkUser.isPresent()) {
            System.out.println("Đăng nhập thành công với email: " + checkUser.get().getEmail());
            String token = jwtService.generateToken(user); // Tạo token
            Map<String, Object> response = new HashMap<>();
            response.put("status", "success");
            response.put("token", token);
            response.put("id", checkUser.get().getId());
            response.put("name", checkUser.get().getName());
            response.put("email", checkUser.get().getEmail());
            response.put("address", checkUser.get().getAddress());
            response.put("role", checkUser.get().getRole());

            return ResponseEntity.ok(response);
        } else {
            System.out.println("Đăng nhập thất bại cho email: " + user.getEmail());
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
    }

    @GetMapping("/me")
    public ResponseEntity<Object> getUserDetails(HttpServletRequest request) {
        String authHeader = request.getHeader("Authorization");
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            return ResponseEntity.status(401).body("Unauthorized");
        }

        String token = authHeader.substring(7); // Bỏ "Bearer "
        String email = jwtService.extractUsername(token);

        return userRepository.findByEmail(email)
                .map(user -> ResponseEntity.ok().body((Object) user))
                .orElseGet(() -> ResponseEntity.status(404).body("User not found"));
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
            response.put("name", user.get().getName());
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
    public ResponseEntity<?> updateUser(@RequestBody UserDTO userDTO) {
        try {
            User updatedUser = userService.updateUser(userDTO);
            Map<String, Object> response = new HashMap<>();
            response.put("status", "success");
            response.put("name", updatedUser.getName());
            response.put("email", updatedUser.getEmail());
            response.put("phone", updatedUser.getPhone());
            response.put("address", updatedUser.getAddress());
            response.put("role", updatedUser.getRole());
            return ResponseEntity.ok(response);
        } catch (EntityIdNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of("error", "Có lỗi xảy ra khi cập nhật user"));
        }
    }

    @PostMapping("/update-password")
    public ResponseEntity<?> updatePassword(@RequestBody Map<String, String> request) {
        String email = request.get("email");
        String currentPassword = request.get("currentPassword");
        String newPassword = request.get("newPassword");

        try {
            User updatedUser = userService.updatePassword(email, currentPassword, newPassword);

            Map<String, Object> response = new HashMap<>();
            response.put("status", "success");
            response.put("name", updatedUser.getName());
            response.put("email", updatedUser.getEmail());
            response.put("phone", updatedUser.getPhone());
            response.put("address", updatedUser.getAddress());
            response.put("role", updatedUser.getRole());

            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("error", e.getMessage()));
        } catch (EntityIdNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("error", e.getMessage()));
        }
    }


    @GetMapping("/get-user")
    public ResponseEntity<Map<String, Object>> getUser(@RequestParam Long id) throws EntityIdNotFoundException {
        Optional<User> user = userService.getById(id);
        if (user.isPresent()) {
            Map<String, Object> response = new HashMap<>();
            response.put("status", "success");
            response.put("id", user.get().getId());
            response.put("name", user.get().getName());
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
