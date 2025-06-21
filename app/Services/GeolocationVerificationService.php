<?php

namespace App\Services;

use Illuminate\Support\Facades\Log;

class GeolocationVerificationService
{
    protected $campusLocations = [
        [
            'latitude' => 13.0230084,
            'longitude' => 77.5733936
        ],
        [
            'latitude' => 17.43846691975648,
            'longitude' => 78.37940404327698
        ]
    ];

    protected $allowedRadius = 0.4; // 100 meters radius

    /**
     * Verify if the user's location is within the allowed campus radius
     * 
     * @param float $latitude User's latitude
     * @param float $longitude User's longitude
     * @param float $accuracy Location accuracy in meters
     * @return bool True if the location is within the allowed radius of any campus location, false otherwise
     */
    public function verifyLocation(float $latitude, float $longitude, ?float $accuracy = null): bool
    {
        // If accuracy is provided and it's too low, reject
        if ($accuracy !== null && $accuracy > 100) {
            return false;
        }

        // Check distance from all campus locations
        foreach ($this->campusLocations as $campusLocation) {
            $distance = $this->calculateDistance(
                $latitude,
                $longitude,
                $campusLocation['latitude'],
                $campusLocation['longitude']
            );

            // If within allowed radius of any campus location, return true
            if ($distance <= $this->allowedRadius) {
                return true;
            }
        }

        // If not within radius of any campus location, return false
        return false;
    }

    /**
     * Calculate distance between two points using the Haversine formula
     * 
     * @param float $lat1 Latitude of first point
     * @param float $lon1 Longitude of first point
     * @param float $lat2 Latitude of second point
     * @param float $lon2 Longitude of second point
     * @return float Distance in kilometers
     */
    protected function calculateDistance($lat1, $lon1, $lat2, $lon2)
    {
        $earthRadius = 6371; // Radius of the earth in km

        $latDelta = deg2rad($lat2 - $lat1);
        $lonDelta = deg2rad($lon2 - $lon1);

        $a = sin($latDelta/2) * sin($latDelta/2) +
            cos(deg2rad($lat1)) * cos(deg2rad($lat2)) *
            sin($lonDelta/2) * sin($lonDelta/2);
            
        $c = 2 * atan2(sqrt($a), sqrt(1-$a));
        $distance = $earthRadius * $c;

        return $distance;
    }
} 