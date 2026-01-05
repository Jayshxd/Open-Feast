package com.jayesh.openfeast.repo;

import com.jayesh.openfeast.entity.FoodSpot;
import com.jayesh.openfeast.model.SpotStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface FoodSpotRepository extends JpaRepository<FoodSpot, Long> {

    // Find all spots that are ACTIVE and older than the cutoff time
    List<FoodSpot> findByStatusAndCreatedAtBefore(SpotStatus status, LocalDateTime cutoffTime);

}
