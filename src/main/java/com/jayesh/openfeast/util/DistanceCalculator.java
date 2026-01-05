package com.jayesh.openfeast.util;

import org.springframework.stereotype.Component;

@Component // Makes this class available to be injected into your Controller
public class DistanceCalculator {

    private static final int EARTH_RADIUS_METERS = 6371000; // Earth's radius in meters

    /**
     * Calculates distance between two points in meters.
     * Uses the Haversine formula.
     */
    public double calculateDistance(double lat1, double lon1, double lat2, double lon2) {

        // Convert degrees to radians (Math needs radians)
        double latDistance = Math.toRadians(lat2 - lat1);
        double lonDistance = Math.toRadians(lon2 - lon1);

        // The Haversine Formula (Don't worry, it's just geometry!)
        double a = Math.sin(latDistance / 2) * Math.sin(latDistance / 2)
                + Math.cos(Math.toRadians(lat1)) * Math.cos(Math.toRadians(lat2))
                * Math.sin(lonDistance / 2) * Math.sin(lonDistance / 2);

        double c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

        return EARTH_RADIUS_METERS * c; // Returns distance in meters
    }
}
