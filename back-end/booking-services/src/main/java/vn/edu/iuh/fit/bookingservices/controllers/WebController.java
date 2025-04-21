package vn.edu.iuh.fit.bookingservices.controllers;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/paypal")

public class WebController {

    @GetMapping("/")
    public String home() {
        return "payment";

    }

 /* @GetMapping("/success")
    public String success (){
        return "payment successful";

    }*/


    @GetMapping("/cancel")
    public String cancel() {
        return "payment canceled";

    }
}