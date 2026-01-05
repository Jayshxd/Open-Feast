package com.jayesh.openfeast.dto;
//package com.example.openfeast.dto;

import lombok.Data;
import org.springframework.web.multipart.MultipartFile;

@Data
public class FoodSpotRequest {
    private MultipartFile image;
    private String title;
    private String description;

    // Where the user placed the pin on the map
    private Double latitude;
    private Double longitude;

    // Where the user is standing right now (from GPS)
    private Double deviceLatitude;
    private Double deviceLongitude;
}
