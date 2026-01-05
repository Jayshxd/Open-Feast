package com.jayesh.openfeast.model;

public enum SpotStatus {
    ACTIVE,    // Food is available right now
    FINISHED,  // Users voted that food is gone
    EXPIRED    // System auto-removed it after 3 hours
}