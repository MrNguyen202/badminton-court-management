package vn.edu.iuh.fit.userservices.resources;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import vn.edu.iuh.fit.userservices.exceptions.EntityIdNotFoundException;
import vn.edu.iuh.fit.userservices.models.Response;
import vn.edu.iuh.fit.userservices.models.User;
import vn.edu.iuh.fit.userservices.services.UserService;

import java.util.Optional;

@RestController
@RequestMapping("/api/users")
@Slf4j
public class UserResources {

    @Autowired
    private UserService userService;

    @PostMapping("login")
    public ResponseEntity<Response> checkLoginAccount(@RequestBody User user) {
        log.info("Calling check login account");
        String getEmail = user.getEmail();
        String getPassword = user.getPassword();

        try {
            User output = userService.checkLoginAccount(getEmail, getPassword);
            if (output != null) {
                log.info("Check login account successfully");
                return ResponseEntity.ok(new Response(
                        HttpStatus.OK.value(),
                        "Check login account successfully",
                        output
                ));
            } else {
                log.warn("Check login account failed for the email or password is incorrect!");
                return ResponseEntity.ok(new Response(
                        HttpStatus.NO_CONTENT.value(),
                        "The email or password is incorrect!",
                        null
                ));
            }
        } catch (Exception e) {
            log.error("Check login account failed");
            log.error("Error: ", e);
            return ResponseEntity.ok(new Response(
                    HttpStatus.OK.value(),
                    "Check login account failed!",
                    null
            ));
        }
    }


    @GetMapping("/{id}")
    public ResponseEntity<Response> getById(@PathVariable("id") Long aLong) {
        try {
            Optional<User> userOptional = userService.getById(aLong);
            return ResponseEntity.ok(new Response(
                    HttpStatus.OK.value(),
                    "Get candidate successfully",
                    userOptional.get()
            ));
        } catch (EntityIdNotFoundException e) {
            return ResponseEntity.ok(new Response(
                    HttpStatus.NO_CONTENT.value(),
                    "The candidate id = " + aLong + " was not found!",
                    null
            ));
        } catch (Exception e) {
            log.error("Get candidate failed");
            log.error("Error: ", e);
            return ResponseEntity.ok(new Response(
                    HttpStatus.OK.value(),
                    "Get candidate failed!",
                    null
            ));
        }
    }


    @GetMapping
    public ResponseEntity<Response> getAll() {
        return ResponseEntity.ok(new Response(
                HttpStatus.OK.value(),
                "Get all candidates successfully",
                userService.getAll()
        ));
    }
}
