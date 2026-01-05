export interface FoodSpot {
    id: number;
    title: string;
    description: string;
    latitude: number;
    longitude: number;
    imageUrl: string;
    status: 'ACTIVE' | 'FINISHED' | 'EXPIRED';
    verificationCount: number;
    createdAt: string;
}

// What we send to the backend
export interface FoodSpotRequest {
    title: string;
    description: string;
    latitude: number;
    longitude: number;
    deviceLatitude: number;
    deviceLongitude: number;
    image: File | null;
}