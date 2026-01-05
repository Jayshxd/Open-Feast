package com.jayesh.openfeast;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class OpenFeastApplication {

    public static void main(String[] args) {
        SpringApplication.run(OpenFeastApplication.class, args);
    }

}
