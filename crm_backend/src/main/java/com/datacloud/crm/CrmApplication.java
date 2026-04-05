package com.datacloud.crm;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@SpringBootApplication
@RestController
public class CrmApplication {

    public static void main(String[] args) {
        SpringApplication.run(CrmApplication.class, args);
    }

    @GetMapping("/")
    public String home() {
        return "Java CRM Backend Active (Spring Boot)";
    }

    @GetMapping("/api/health")
    public String health() {
        return "OK";
    }
}
