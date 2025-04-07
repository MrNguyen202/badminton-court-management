package vn.edu.iuh.hero;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class CourtServicesApplication {

    public static void main(String[] args) {
        SpringApplication.run(CourtServicesApplication.class, args);
    }

}
