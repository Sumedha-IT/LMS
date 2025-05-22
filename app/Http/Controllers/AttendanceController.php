<?php

namespace App\Http\Controllers;

use App\Models\Calendar;
use App\Models\BatchUser;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Auth;
use App\Models\StudentAttendance;
use Illuminate\Http\Request;

class AttendanceController extends Controller
{
    // Campus IP address ranges (used to verify if connected to campus network)
    protected $campusIpRanges = [
        // Example IP ranges - replace with your actual campus IP ranges
        ['start' => '10.0.0.0', 'end' => '10.255.255.255'],     // Private IP range
        ['start' => '172.16.0.0', 'end' => '172.31.255.255'],   // Private IP range
        ['start' => '192.168.0.0', 'end' => '192.168.255.255'], // Private IP range
    ];

    // Campus geolocation boundaries based on provided coordinates (Lat: 17.4384856, Lng: 78.3794686)
    protected $campusGeoBoundaries = [
        // Campus center point
        'center_lat' => 13.0226992,
        'center_lng' => 77.5733937,

        // Rectangular boundary (approximately 100m in each direction from center)
        'lat_min' => 13.0126992,  // About 100m south of center
        'lat_max' => 13.0326992,  // About 100m north of center
        'lng_min' => 77.5633937,  // About 100m west of center
        'lng_max' => 77.5833937,  // About 100m east of center

        // Accuracy settings
        'max_distance' => 100,  // Maximum allowed distance from campus in meters (100m radius)
        'accuracy_threshold' => 100  // Maximum acceptable GPS accuracy error in meters
    ];

    public function index(Request $request)
    {
        $user = $request->user();

        // Get all attendance records for the user
        $attendances_count = StudentAttendance::where('user_id', $user->id)
            ->count();

        // Get today's attendance record
        $todayAttendance = StudentAttendance::where('user_id', $user->id)
            ->whereDate('check_in_datetime', Carbon::today())
            ->first();

        // Calculate attendance percentage
        $attendancePercentage = 0;

        // Get the total number of calendar days
        $totalClasses = Calendar::count();

        // If there are calendar days and attendance records, calculate percentage
        if ($attendances_count > 0 && $totalClasses > 0) {
            $attendancePercentage = round(($attendances_count / $totalClasses) * 100);
        }

        // If the percentage is 0 but there's an attendance record for today, set it to at least 1%
        if ($attendancePercentage == 0 && $todayAttendance) {
            $attendancePercentage = 1;
        }

        return [
            'Attendance_count' => $attendances_count,
            'Attendance_percentage' => $attendancePercentage,
            'has_checked_in_today' => $todayAttendance ? true : false
        ];
    }

    public function getChartData(Request $request)
    {
        $scheduleData = $this->getMonthlyScheduleData();
        $attendanceData = $this->getMonthlyAttendanceData();

        $months = [
            'January', 'February', 'March', 'April', 'May', 'June',
            'July', 'August', 'September', 'October', 'November', 'December'
        ];

        return response()->json([
            'datasets' => [
                [
                    'label' => 'Scheduled Classes',
                    'data' => $scheduleData,
                ],
                [
                    'label' => 'Attendance',
                    'data' => $attendanceData,
                ],
            ],
            'labels' => $months,
        ]);
    }

    protected function getMonthlyScheduleData()
    {
        $schedules = Calendar::select(
                DB::raw('MONTH(start_time) as month'),
                DB::raw('COUNT(*) as total')
            )
            ->groupBy('month')
            ->get()
            ->pluck('total', 'month')
            ->toArray();

        return $this->formatDataForChart($schedules);
    }

    protected function getMonthlyAttendanceData()
    {
        $userId = Auth::id();

        $attendances = StudentAttendance::where('user_id', $userId)->select(
                DB::raw('MONTH(check_in_datetime) as month'),
                DB::raw('COUNT(*) as total')
            )
            ->groupBy('month')
            ->get()
            ->pluck('total', 'month')
            ->toArray();

        return $this->formatDataForChart($attendances);
    }

    protected function formatDataForChart($data)
    {
        $formattedData = array_fill(0, 12, 0);

        foreach ($data as $month => $total) {
            $formattedData[$month - 1] = $total;
        }

        return $formattedData;
    }

    public function getAttendanceReport(Request $request)
    {
        $user = $request->user();

        // Get user's batch
        $batchId = BatchUser::where('user_id', $user->id)->value('batch_id');

        if (!$batchId) {
            return response()->json(['message' => 'User not assigned to any batch'], 404);
        }

        // Get all calendar entries for the user's batch, using the global scope
        $calendarEntries = Calendar::select('calendars.*')
            ->where('calendars.batch_id', $batchId)
            ->get();

        if ($calendarEntries->isEmpty()) {
            return response()->json(['message' => 'No calendar entries found for this user'], 404);
        }

        // Get all attendance records for the user
        $attendanceRecords = StudentAttendance::where('user_id', $user->id)->get();

        $report = [];

        foreach ($calendarEntries as $calendarEntry) {
            $calendarStart = Carbon::parse($calendarEntry->start_time);
            $calendarEnd = Carbon::parse($calendarEntry->end_time);

            $attendanceRecord = $attendanceRecords->first(function ($attendance) use ($calendarStart, $calendarEnd) {
                $attendanceDate = Carbon::parse($attendance->check_in_datetime);

                return $attendanceDate->isSameDay($calendarStart) ||
                       $attendanceDate->isSameDay($calendarEnd) ||
                       $attendanceDate->between($calendarStart, $calendarEnd);
            });

            $report[] = [
                'date' => $calendarStart->toDateString(),
                'start_time' => $calendarStart->format('H:i'),
                'end_time' => $calendarEnd->format('H:i'),
                'status' => $attendanceRecord ? 'Present' : 'Absent',
            ];
        }

        return response()->json($report);
    }

    /**
     * Verify if the user is within campus premises using geofencing
     *
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function verifyCampusLocation(Request $request)
    {
        try {
            // Validate request data
            $validator = \Illuminate\Support\Facades\Validator::make($request->all(), [
                'latitude' => 'required|numeric',
                'longitude' => 'required|numeric',
                'accuracy' => 'nullable|numeric',
                'ip_address' => 'nullable|string'
            ]);

            if ($validator->fails()) {
                $errorResponse = [
                    'message' => 'Invalid location data provided',
                    'errors' => $validator->errors(),
                    'status' => 'error'
                ];
                return response()->json($errorResponse, 400);
            }

            $latitude = $request->latitude;
            $longitude = $request->longitude;
            $accuracy = $request->accuracy ?? 0; // GPS accuracy in meters (lower is better)
            $ipAddress = $request->ip_address ?: $request->ip();

            // Minimal logging to improve performance
            \Log::info('Verifying campus location', [
                'user_id' => auth()->id(),
                'latitude' => $latitude,
                'longitude' => $longitude
            ]);

            // Check if within campus geolocation boundaries (without caching)
            $locationVerification = $this->verifyGeolocation($latitude, $longitude, $accuracy);
            $isWithinCampus = $locationVerification['within_campus'];
            $distanceFromCampus = $locationVerification['distance'] ?? null;
            $locationMessage = $locationVerification['message'] ?? '';
            $distanceToCenter = $locationVerification['distance_to_center'] ?? null;

            // Only check IP if location verification passes (to save processing time)
            $isOnCampusNetwork = $isWithinCampus ? $this->isIpInCampusRange($ipAddress) : false;

            // Log the verification result for debugging
            \Log::info('Location verification result', [
                'user_id' => auth()->id(),
                'latitude' => $latitude,
                'longitude' => $longitude,
                'campus_center_lat' => $this->campusGeoBoundaries['center_lat'],
                'campus_center_lng' => $this->campusGeoBoundaries['center_lng'],
                'distance_to_center' => $distanceToCenter,
                'is_within_campus' => $isWithinCampus
            ]);

            // Prepare the verification response
            $verification = [
                'network' => $isOnCampusNetwork,
                'location' => $isWithinCampus,
                'distance' => $distanceFromCampus,
                'distance_to_center' => $distanceToCenter,
                'accuracy' => $accuracy
            ];

            // Prepare the response based on verification results
            if (!$isWithinCampus) {
                $response = [
                    'message' => 'Out of the campus. Not able to check in. Please be present within campus boundaries.',
                    'status' => 'error',
                    'verification' => $verification
                ];
                return response()->json($response, 403);
            }

            // Only enforce network verification in production environment
            if (!$isOnCampusNetwork && !app()->environment('local')) {
                $response = [
                    'message' => 'You must be connected to the campus network to check in',
                    'status' => 'error',
                    'verification' => $verification
                ];
                return response()->json($response, 403);
            }

            // If both checks pass, return success
            $response = [
                'message' => 'Location verified successfully',
                'status' => 'success',
                'verification' => $verification
            ];

            // Minimal logging for successful verification
            \Log::info('Campus location verified successfully', [
                'user_id' => auth()->id()
            ]);

            return response()->json($response);
        } catch (\Exception $e) {
            \Log::error('Error verifying campus location', [
                'error' => $e->getMessage(),
                'user_id' => auth()->id()
            ]);

            return response()->json([
                'message' => 'Error verifying location: ' . $e->getMessage(),
                'status' => 'error'
            ], 500);
        }
    }

    /**
     * Check if an IP address is within the campus network range
     * This method is optimized with caching to improve performance
     *
     * @param string $ipAddress
     * @return bool
     */
    protected function isIpInCampusRange($ipAddress)
    {
        // Cache key for IP check
        $cacheKey = "ip_check_" . str_replace('.', '_', $ipAddress);

        // Check if we have a cached result
        if (($cachedResult = \Cache::get($cacheKey)) !== null) {
            return $cachedResult;
        }

        // Convert IP to long integer for comparison
        $ip = ip2long($ipAddress);

        // If IP conversion fails, cache and return false
        if ($ip === false) {
            \Cache::put($cacheKey, false, 3600); // Cache for 1 hour
            return false;
        }

        // Check if IP is in any of the campus ranges
        foreach ($this->campusIpRanges as $range) {
            $rangeStart = ip2long($range['start']);
            $rangeEnd = ip2long($range['end']);

            if ($ip >= $rangeStart && $ip <= $rangeEnd) {
                \Cache::put($cacheKey, true, 3600); // Cache for 1 hour
                return true;
            }
        }

        \Cache::put($cacheKey, false, 3600); // Cache for 1 hour
        return false;
    }

    /**
     * Verify if the given coordinates are within campus boundaries
     *
     * @param float $latitude
     * @param float $longitude
     * @param float $accuracy
     * @return array
     */
    protected function verifyGeolocation($latitude, $longitude, $accuracy = 0)
    {
        // Don't use cached results to ensure fresh verification each time

        // Calculate distance to campus center
        $distanceToCenter = $this->calculateDistance(
            $latitude, $longitude,
            $this->campusGeoBoundaries['center_lat'],
            $this->campusGeoBoundaries['center_lng']
        );

        // Simple rectangular boundary check first (faster)
        $isWithinRectangle =
            $latitude >= $this->campusGeoBoundaries['lat_min'] &&
            $latitude <= $this->campusGeoBoundaries['lat_max'] &&
            $longitude >= $this->campusGeoBoundaries['lng_min'] &&
            $longitude <= $this->campusGeoBoundaries['lng_max'];

        // If within rectangle, return success immediately without further calculations
        if ($isWithinRectangle) {
            $result = [
                'within_campus' => true,
                'distance' => 0,
                'distance_to_center' => $distanceToCenter,
                'message' => 'Location verified (within campus boundaries)'
            ];

            return $result;
        }

        // If accuracy is worse than our threshold, we might need to be more lenient
        $accuracyIssue = $accuracy > $this->campusGeoBoundaries['accuracy_threshold'];

        // Find closest point on the rectangle (for boundary distance calculation)
        $closestLat = max($this->campusGeoBoundaries['lat_min'],
                      min($latitude, $this->campusGeoBoundaries['lat_max']));
        $closestLng = max($this->campusGeoBoundaries['lng_min'],
                      min($longitude, $this->campusGeoBoundaries['lng_max']));

        // Calculate distance to boundary
        $distanceToBoundary = $this->calculateDistance(
            $latitude, $longitude,
            $closestLat, $closestLng
        );

        // Check if within allowed distance from campus center (more reliable than boundary)
        $isWithinAllowedDistanceFromCenter = $distanceToCenter <= $this->campusGeoBoundaries['max_distance'];

        // Also check distance from boundary as a fallback
        $isWithinAllowedDistanceFromBoundary = $distanceToBoundary <= $this->campusGeoBoundaries['max_distance'];

        // Use either center distance or boundary distance, whichever is more favorable
        $isWithinAllowedDistance = $isWithinAllowedDistanceFromCenter || $isWithinAllowedDistanceFromBoundary;

        // Determine verification result based on conditions
        // Be more lenient with accuracy issues
        $isWithinCampus = $isWithinAllowedDistance;

        // If accuracy is poor but we're close to campus, still allow check-in
        if ($accuracyIssue && $distanceToCenter <= ($this->campusGeoBoundaries['max_distance'] * 1.5)) {
            $isWithinCampus = true;
        }

        $message = $accuracyIssue && $isWithinCampus
            ? 'Location verified (within allowed distance from campus)'
            : ($isWithinCampus
                ? 'Location verified (near campus boundary)'
                : "Out of the campus. You are approximately {$distanceToCenter}m away from campus center. Please be present within campus boundaries.");

        $result = [
            'within_campus' => $isWithinCampus,
            'distance' => $distanceToBoundary,
            'distance_to_center' => $distanceToCenter,
            'message' => $message
        ];

        return $result;
    }

    /**
     * Calculate distance between two coordinates using a simplified formula
     * This is an optimized version that's faster but still accurate enough for our needs
     *
     * @param float $lat1
     * @param float $lng1
     * @param float $lat2
     * @param float $lng2
     * @return float Distance in meters
     */
    protected function calculateDistance($lat1, $lng1, $lat2, $lng2)
    {
        // If coordinates are very close, return 0 to avoid unnecessary calculations
        if (abs($lat1 - $lat2) < 0.0001 && abs($lng1 - $lng2) < 0.0001) {
            return 0;
        }

        // Earth's radius in meters
        $earthRadius = 6371000;

        // Convert degrees to radians
        $lat1 = deg2rad($lat1);
        $lng1 = deg2rad($lng1);
        $lat2 = deg2rad($lat2);
        $lng2 = deg2rad($lng2);

        // Haversine formula
        $latDelta = $lat2 - $lat1;
        $lngDelta = $lng2 - $lng1;
        $a = sin($latDelta/2) * sin($latDelta/2) +
             cos($lat1) * cos($lat2) *
             sin($lngDelta/2) * sin($lngDelta/2);
        $c = 2 * atan2(sqrt($a), sqrt(1-$a));
        $distance = $earthRadius * $c;

        // Round the result
        $roundedDistance = round($distance);

        return $roundedDistance;
    }
}
