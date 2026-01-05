package com.jayesh.openfeast.entity;

import com.jayesh.openfeast.model.SpotStatus;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Table(name = "food_spots")
public class FoodSpot {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;
    private String description;

    // --- Location Data (The Core) ---
    private Double latitude;
    private Double longitude;

    // --- Image Data (For Sprint 3) ---
    // We store the Cloudinary URL here later
    private String imageUrl;

    // --- The "Trust" Layer (New Additions) ---

    @Enumerated(EnumType.STRING) // Stores "ACTIVE" as text in DB, not a number
    @Builder.Default // Ensures the builder uses this default value
    private SpotStatus status = SpotStatus.ACTIVE;

    @CreationTimestamp // MAGIC: Spring automatically fills this when you save!
    @Column(updatable = false) // Creation time never changes
    private LocalDateTime createdAt;

    @Builder.Default
    private Integer verificationCount = 0; // Starts at 0, increases as people vote "Finished"
}
