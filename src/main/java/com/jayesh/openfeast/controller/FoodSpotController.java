package com.jayesh.openfeast.controller;
 // Import the Calculator
import com.jayesh.openfeast.dto.FoodSpotRequest;
import com.jayesh.openfeast.entity.FoodSpot;
import com.jayesh.openfeast.model.SpotStatus;
import com.jayesh.openfeast.repo.FoodSpotRepository;
import com.jayesh.openfeast.service.ImageService;
import com.jayesh.openfeast.util.DistanceCalculator;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;

@RestController
@RequestMapping("/api/food-spots")
@RequiredArgsConstructor
public class FoodSpotController {

    private final ImageService imageService;
    private final FoodSpotRepository repository;
    private final DistanceCalculator distanceCalculator; // Inject the calculator
    @GetMapping
    public ResponseEntity<java.util.List<FoodSpot>> getAllSpots() {
        // Sort by newest first (optional but nice)
        return ResponseEntity.ok(repository.findAll());
    }

    @PostMapping(consumes = "multipart/form-data") // <--- Crucial!
    public ResponseEntity<?> createFoodSpot(@ModelAttribute FoodSpotRequest request) {

        try {
            // 1. Calculate distance between Device and Pin
            double distance = distanceCalculator.calculateDistance(
                    request.getDeviceLatitude(), request.getDeviceLongitude(),
                    request.getLatitude(), request.getLongitude()
            );

            // 2. The Verification Check (e.g., must be within 100 meters)
            if (distance > 100) {
                return ResponseEntity.badRequest()
                        .body("Error: You are too far away! You must be within 100m of the food spot.");
            }

            // 2. Upload Image to Cloudinary (NEW STEP)
            String imageUrl = "https://placeholder.com/no-food.jpg"; // Default
            if (request.getImage() != null && !request.getImage().isEmpty()) {
                imageUrl = imageService.uploadImage(request.getImage());
            }

            // 3. If passed, convert Request to Entity and Save
            FoodSpot newSpot = FoodSpot.builder()
                    .title(request.getTitle())
                    .description(request.getDescription())
                    .latitude(request.getLatitude())
                    .longitude(request.getLongitude())
                    .imageUrl(imageUrl)
                    .build();
            // Status, createdAt, etc. are handled by Defaults/@CreationTimestamp

            FoodSpot savedSpot = repository.save(newSpot);

            return ResponseEntity.ok(savedSpot);
        }catch (IOException e){
            return ResponseEntity.internalServerError().body("Image upload failed");
        }
    }




    @PostMapping("/{id}/vote-finished")
    public ResponseEntity<?> voteFinished(@PathVariable Long id) {

        // 1. Find the spot
        return repository.findById(id).map(spot -> {

            // 2. If already finished, do nothing
            if (spot.getStatus() != SpotStatus.ACTIVE) {
                return ResponseEntity.badRequest().body("Spot is already closed.");
            }

            // 3. Increment the counter
            spot.setVerificationCount(spot.getVerificationCount() + 1);

            // 4. Check the threshold (3 votes = finished)
            if (spot.getVerificationCount() >= 3) {
                spot.setStatus(SpotStatus.FINISHED);
            }

            repository.save(spot);
            return ResponseEntity.ok("Vote registered. Current votes: " + spot.getVerificationCount());

        }).orElse(ResponseEntity.notFound().build());
    }
}
