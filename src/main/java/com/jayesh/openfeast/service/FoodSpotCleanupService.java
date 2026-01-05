package com.jayesh.openfeast.service;

import com.jayesh.openfeast.entity.FoodSpot;
import com.jayesh.openfeast.model.SpotStatus;
import com.jayesh.openfeast.repo.FoodSpotRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class FoodSpotCleanupService {

    private final FoodSpotRepository repository;

    // Runs every 30 minutes
    // cron = "sec min hour day month day-of-week"
    @Scheduled(cron = "0 */30 * * * *")
    public void expireOldSpots() {

        // 1. Calculate the cutoff time (3 hours ago)
        LocalDateTime threeHoursAgo = LocalDateTime.now().minusHours(3);

        // 2. Find spots that are OLD and still ACTIVE
        List<FoodSpot> expiredSpots = repository.findByStatusAndCreatedAtBefore(
                SpotStatus.ACTIVE,
                threeHoursAgo
        );

        // 3. Mark them as EXPIRED and save
        if (!expiredSpots.isEmpty()) {
            for (FoodSpot spot : expiredSpots) {
                spot.setStatus(SpotStatus.EXPIRED);
            }
            repository.saveAll(expiredSpots);
            System.out.println("Cleaned up " + expiredSpots.size() + " expired spots.");
        }
    }
}