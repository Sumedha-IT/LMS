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
        ['start' => '10.20.0.1', 'end' => '10.20.255.254'],
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
                'latitude' => 'nullable|numeric',
                'longitude' => 'nullable|numeric',
                'accuracy' => 'nullable|numeric',
                'ip_address' => 'nullable|string'
            ]);

            if ($validator->fails()) {
                $errorResponse = [
                    'message' => 'Invalid data provided',
                    'errors' => $validator->errors(),
                    'status' => 'error'
                ];
                return response()->json($errorResponse, 400);
            }

            $ipAddress = $request->ip_address ?: $request->ip();

            // Minimal logging to improve performance
            \Log::info('Verifying campus network connection', [
                'user_id' => auth()->id(),
                'ip_address' => $ipAddress
            ]);

            // Check if connected to campus network
            $isOnCampusNetwork = $this->isIpInCampusRange($ipAddress);

            // Prepare the verification response
            $verification = [
                'network' => $isOnCampusNetwork,
                'location' => $isOnCampusNetwork, // Since we're using WiFi, location is same as network
                'distance' => null,
                'distance_to_center' => null,
                'accuracy' => null
            ];

            // Prepare the response based on verification results
            if (!$isOnCampusNetwork) {
                $response = [
                    'message' => 'You must be connected to the campus WiFi network to check in',
                    'status' => 'error',
                    'verification' => $verification
                ];
                return response()->json($response, 403);
            }

            // If check passes, return success
            $response = [
                'message' => 'Connected to campus WiFi successfully',
                'status' => 'success',
                'verification' => $verification
            ];

            // Minimal logging for successful verification
            \Log::info('Campus network connection verified successfully', [
                'user_id' => auth()->id()
            ]);

            return response()->json($response);
        } catch (\Exception $e) {
            \Log::error('Error verifying campus network connection', [
                'error' => $e->getMessage(),
                'user_id' => auth()->id()
            ]);

            return response()->json([
                'message' => 'Error verifying network connection: ' . $e->getMessage(),
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
    public function isIpInCampusRange($ipAddress)
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
}
