<?php

namespace App\Http\Controllers;

use App\Models\StudentAttendance;
use App\Models\AttendanceCheckinStandard;
use App\Models\BatchUser;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class StudentAttendanceController extends Controller
{
    public function checkIn(Request $request)
    {
        try {
            $user = Auth::user();
            $ipAddress = $request->ip(); // Get IP address from the request

            // Only log minimal information to improve performance
            \Log::info('Check-in attempt', [
                'user_id' => $user->id,
                'ip_address' => $ipAddress
            ]);

            // Verify campus location and WiFi if location data is provided
            if ($request->has('location_verified') && $request->location_verified !== true) {
                // If location_verified is explicitly set to false, return error
                return response()->json([
                    'message' => 'You must be on campus and connected to campus WiFi to check in',
                    'status' => 'error',
                    'require_verification' => true
                ], 403);
            }

            // Always enforce location verification, even in local environment
            if (!$request->has('location_verified')) {
                // Location verification is required but not provided
                return response()->json([
                    'message' => 'Location verification is required',
                    'status' => 'error',
                    'require_verification' => true
                ], 403);
            }

            // Prevent check-in if another user has already checked in today with the same IP and laptop_id
            $duplicateCheck = StudentAttendance::where('ip_address', $ipAddress)
                ->where('laptop_id', $request->laptop_id)
                ->whereDate('check_in_datetime', Carbon::today())
                ->where('user_id', '!=', $user->id)
                ->first();

            if ($duplicateCheck) {
                \Log::info('Duplicate device check-in attempt', [
                    'user_id' => $user->id,
                    'ip_address' => $request->ip_address,
                    'laptop_id' => $request->laptop_id
                ]);
                return response()->json([
                    'message' => 'This device has already been used to check in by another user today. Please use your own device to check in.',
                    'status' => 'error'
                ], 400);
            }

            // Check if already checked in today (regardless of checkout status)
            $existingCheckIn = StudentAttendance::where('user_id', $user->id)
                ->whereDate('check_in_datetime', Carbon::today())
                ->first();

            if ($existingCheckIn) {
                \Log::info('User already checked in today', ['user_id' => $user->id]);
                return response()->json([
                    'message' => 'You have already checked in today at ' . $existingCheckIn->check_in_datetime->format('h:i A'),
                    'status' => 'error'
                ], 400);
            }

            // Create check-in record
            $attendance = StudentAttendance::create([
                'user_id' => $user->id,
                'laptop_id' => $request->laptop_id,
                'ip_address' => $ipAddress, // Use the IP address from the request
                'check_in_datetime' => Carbon::now()
            ]);

            \Log::info('Check-in successful', [
                'user_id' => $user->id,
                'attendance_id' => $attendance->id
            ]);

            return response()->json([
                'message' => 'Check-in successful',
                'data' => $attendance,
                'status' => 'success'
            ]);
        } catch (\Exception $e) {
            \Log::error('Check-in error', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);

            return response()->json([
                'message' => 'An error occurred during check-in: ' . $e->getMessage(),
                'status' => 'error'
            ], 500);
        }
    }

    public function checkOut(Request $request)
    {
        $user = Auth::user();

        // Find today's check-in record
        $attendance = StudentAttendance::where('user_id', $user->id)
            ->whereDate('check_in_datetime', Carbon::today())
            ->whereNull('check_out_datetime')
            ->first();

        if (!$attendance) {
            return response()->json([
                'message' => 'No active check-in found for today',
                'status' => 'error'
            ], 400);
        }

        $attendance->update([
            'check_out_datetime' => Carbon::now()
        ]);

        return response()->json([
            'message' => 'Check-out successful',
            'data' => $attendance,
            'status' => 'success'
        ]);
    }

    public function getAttendanceReport(Request $request)
    {
        $user = Auth::user();

        // Get filter parameters
        $filterType = $request->filter_type ?? 'all'; // 'all', 'week', 'month'

        // Get the user's batch
        $userBatch = \App\Models\BatchUser::where('user_id', $user->id)->first();

        if (!$userBatch) {
            return response()->json([
                'message' => 'User not assigned to any batch',
                'status' => 'error'
            ], 404);
        }

        // Get the batch details
        $batch = \App\Models\Batch::find($userBatch->batch_id);

        if (!$batch) {
            return response()->json([
                'message' => 'Batch not found',
                'status' => 'error'
            ], 404);
        }

        // Use batch start date as the default start date for 'all' filter
        $batchStartDate = Carbon::parse($batch->start_date)->startOfDay();

        // Determine date range based on filter type
        $startDate = null;
        $endDate = Carbon::now()->endOfDay();

        switch ($filterType) {
            case 'week':
                $startDate = Carbon::now()->startOfWeek();
                break;
            case 'month':
                $startDate = Carbon::now()->startOfMonth();
                break;
            case 'custom':
                $startDate = $request->start_date ? Carbon::parse($request->start_date)->startOfDay() : Carbon::now()->subDays(30)->startOfDay();
                $endDate = $request->end_date ? Carbon::parse($request->end_date)->endOfDay() : Carbon::now()->endOfDay();
                break;
            default:
                // For 'all', use the batch start date
                $startDate = $batchStartDate;
                break;
        }

        // Ensure start date is not before batch start date
        if ($startDate->lt($batchStartDate)) {
            $startDate = $batchStartDate;
        }

        // Get attendance records for the user within the date range
        $query = StudentAttendance::where('user_id', $user->id);

        // Apply date range filter if not 'all'
        if ($filterType !== 'all') {
            $query->whereBetween('check_in_datetime', [$startDate, $endDate]);
        }

        $attendance = $query->orderBy('check_in_datetime', 'desc')->get();

        // Generate a collection of all dates in the range (excluding weekends)
        $dateRange = collect();
        $currentDate = clone $startDate;

        while ($currentDate <= $endDate) {
            // Skip weekends (Saturday = 6, Sunday = 0)
            $dayOfWeek = $currentDate->dayOfWeek;
            if ($dayOfWeek !== 0 && $dayOfWeek !== 6) {
                $dateRange->push($currentDate->format('Y-m-d'));
            }
            $currentDate->addDay();
        }

        // Create a map of dates with attendance records
        $attendanceDates = $attendance->pluck('check_in_datetime')
            ->map(function ($datetime) {
                return Carbon::parse($datetime)->format('Y-m-d');
            })
            ->flip()
            ->map(function ($_, $date) use ($attendance) {
                $record = $attendance->first(function ($item) use ($date) {
                    return Carbon::parse($item->check_in_datetime)->format('Y-m-d') === $date;
                });

                return [
                    'date' => $date,
                    'check_in' => $record->check_in_datetime->format('H:i:s'),
                    'check_out' => $record->check_out_datetime ? $record->check_out_datetime->format('H:i:s') : null,
                    'status' => $record->check_out_datetime ? 'Complete' : 'Incomplete'
                ];
            });

        // Add absent days (days without check-in records)
        $allDaysDetails = $dateRange->map(function ($date) use ($attendanceDates) {
            if (isset($attendanceDates[$date])) {
                return $attendanceDates[$date];
            }

            // Check if the date is a weekend
            $dayDate = Carbon::parse($date);
            $dayOfWeek = $dayDate->dayOfWeek;

            // If it's a weekend, don't mark as absent
            if ($dayOfWeek === 0 || $dayOfWeek === 6) {
                return null;
            }

            return [
                'date' => $date,
                'check_in' => null,
                'check_out' => null,
                'status' => 'Absent'
            ];
        })
        ->filter() // Remove null values (weekends)
        ->values();

        // Calculate statistics
        $totalDays = $allDaysDetails->count();
        $presentDays = $allDaysDetails->where('status', '!=', 'Absent')->count();
        $completeDays = $allDaysDetails->where('status', '==', 'Complete')->count();

        $report = [
            'total_days' => $totalDays,
            'present_days' => $presentDays,
            'complete_days' => $completeDays,
            'absent_days' => $totalDays - $presentDays,
            'attendance_details' => $allDaysDetails
        ];

        return response()->json($report);
    }

    public function getAdminReport(Request $request)
    {
        // Only admin can access this
        $user = Auth::user();
        if (!$user || !$user->is_admin) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $startDate = $request->start_date ? Carbon::parse($request->start_date) : Carbon::now()->startOfMonth();
        $endDate = $request->end_date ? Carbon::parse($request->end_date) : Carbon::now()->endOfMonth();
        $batchId = $request->batch_id;
        $studentName = $request->student_name;

        \Log::info('Admin attendance report request', [
            'start_date' => $startDate->toDateString(),
            'end_date' => $endDate->toDateString(),
            'batch_id' => $batchId,
            'student_name' => $studentName,
            'user_id' => Auth::id()
        ]);

        // Start with the base query
        $query = StudentAttendance::with(['user' => function($q) {
            $q->with('batches');
        }])
        ->whereBetween('check_in_datetime', [$startDate->startOfDay(), $endDate->endOfDay()]);

        // If batch_id is provided, filter by students in that batch
        if ($batchId) {
            // Convert to string for consistent comparison
            $batchIdStr = (string) $batchId;

            // Log the batch ID for debugging
            \Log::info('Filtering by batch ID', [
                'batch_id' => $batchId,
                'batch_id_str' => $batchIdStr,
                'batch_id_type' => gettype($batchId)
            ]);

            // Get all user IDs from the specified batch
            $userIds = BatchUser::where('batch_id', $batchId)->pluck('user_id')->toArray();

            if (empty($userIds)) {
                \Log::warning('No users found in batch', ['batch_id' => $batchId]);
                return response()->json([]);
            }

            \Log::info('Found users in batch', [
                'batch_id' => $batchId,
                'user_count' => count($userIds),
                'user_ids' => $userIds
            ]);

            $query->whereIn('user_id', $userIds);

            // Get the batch information for later use
            $selectedBatch = \App\Models\Batch::find($batchId);
            if (!$selectedBatch) {
                \Log::warning('Batch not found in database', ['batch_id' => $batchId]);
                return response()->json([]);
            }

            \Log::info('Found batch information', [
                'batch_id' => $selectedBatch->id,
                'batch_name' => $selectedBatch->name
            ]);
        }

        $attendance = $query->get();

        if ($attendance->isEmpty()) {
            \Log::info('No attendance records found for the date range and filters');
            return response()->json([]);
        }

        $groupedAttendance = $attendance->groupBy('user_id');

        // Initialize $selectedBatch variable if it's not set
        $selectedBatch = $selectedBatch ?? null;

        $report = $groupedAttendance->map(function ($records, $userId) use ($batchId, $selectedBatch) {
            $user = $records->first()->user;

            // Get the user's batch information
            $userBatch = null;
            $userBatchName = 'No Batch';
            $userBatchId = null;

            // If a specific batch ID was requested and we have the batch information
            if ($batchId && isset($selectedBatch)) {
                // Use the batch information we already retrieved
                $userBatchId = $selectedBatch->id;
                $userBatchName = $selectedBatch->name;

                \Log::info('Using selected batch for user', [
                    'user_id' => $userId,
                    'user_name' => $user->name,
                    'batch_id' => $userBatchId,
                    'batch_name' => $userBatchName
                ]);
            }
            // Otherwise, try to get batch information from the user's batches
            else if ($user->batches && $user->batches->isNotEmpty()) {
                // If a specific batch ID was requested but we don't have the batch information
                if ($batchId) {
                    // Convert batch ID to string for comparison if needed
                    $batchIdToCompare = (string) $batchId;

                    // Find the batch by ID in the user's batches
                    $specificBatch = $user->batches->first(function ($batch) use ($batchIdToCompare) {
                        return (string) $batch->id === $batchIdToCompare;
                    });

                    if ($specificBatch) {
                        $userBatch = $specificBatch;
                        $userBatchId = $userBatch->id;
                        $userBatchName = $userBatch->name;

                        \Log::info('Found matching batch for user in their batches', [
                            'user_id' => $userId,
                            'batch_id' => $userBatchId,
                            'batch_name' => $userBatchName
                        ]);
                    }
                } else {
                    // If no specific batch was requested, use the first batch for the user
                    $userBatch = $user->batches->first();
                    if ($userBatch) {
                        $userBatchId = $userBatch->id;
                        $userBatchName = $userBatch->name;
                    }
                }
            }

            return [
                'user_id' => $userId,
                'name' => $user->name,
                'email' => $user->email,
                'batch_id' => $userBatchId,
                'batch_name' => $userBatchName,
                'total_days' => $records->count(),
                'present_days' => $records->whereNotNull('check_out_datetime')->count(),
                'attendance_percentage' => $records->count() > 0
                    ? round(($records->whereNotNull('check_out_datetime')->count() / $records->count()) * 100, 2)
                    : 0
            ];
        })->values();

        // If student name is provided, filter the report
        if ($studentName) {
            $report = $report->filter(function ($item) use ($studentName) {
                return stripos($item['name'], $studentName) !== false;
            })->values();
        }

        \Log::info('Admin attendance report response', [
            'record_count' => $report->count(),
            'batch_id_filter' => $batchId,
            'first_record_batch_id' => $report->isNotEmpty() ? $report->first()['batch_id'] : null,
            'first_record_batch_name' => $report->isNotEmpty() ? $report->first()['batch_name'] : null
        ]);

        return response()->json($report);
    }

    public function getAttendanceStatus()
    {
        $user = Auth::user();

        // Get today's attendance record for the user
        $todayAttendance = StudentAttendance::where('user_id', $user->id)
            ->whereDate('check_in_datetime', Carbon::today())
            ->orderBy('check_in_datetime', 'desc')
            ->first();

        $status = [
            'is_checked_in' => false,
            'is_checked_out' => false,
            'check_in_time' => null,
            'check_out_time' => null,
            'can_check_in' => true,
            'check_in_deadline' => '-',
            'check_in_start' => '-'
        ];

        if ($todayAttendance) {
            $status['is_checked_in'] = true;
            $status['check_in_time'] = $todayAttendance->check_in_datetime->format('H:i:s');
            if ($todayAttendance->check_out_datetime) {
                $status['is_checked_out'] = true;
                $status['check_out_time'] = $todayAttendance->check_out_datetime->format('H:i:s');
            }
        }

        \Log::info('Attendance status for user', [
            'user_id' => $user->id,
            'status' => $status
        ]);

        return response()->json($status);
    }

    public function getBatches()
    {
        // Allow both admin and tutors to access this
        $user = Auth::user();
        if (!$user || (!$user->is_admin && !$user->is_tutor)) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        // For tutors, only show batches they are assigned to
        if ($user->is_tutor) {
            $batches = \App\Models\Batch::select('batches.id', 'batches.name')
                ->join('batch_curriculum', 'batches.id', '=', 'batch_curriculum.batch_id')
                ->where('batch_curriculum.tutor_id', $user->id)
                ->orderBy('batches.name')
                ->distinct()
                ->get();
        } else {
            // For admins, show all batches
            $batches = \App\Models\Batch::select('id', 'name')
                ->orderBy('name')
                ->get();
        }

        return response()->json($batches);
    }

    public function getTutorReport(Request $request)
    {
        // Only tutors can access this
        $user = Auth::user();
        if (!$user || !$user->is_tutor) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $startDate = $request->start_date ? Carbon::parse($request->start_date) : Carbon::now()->startOfMonth();
        $endDate = $request->end_date ? Carbon::parse($request->end_date) : Carbon::now()->endOfMonth();
        $batchId = $request->batch_id;
        $studentName = $request->student_name;

        \Log::info('Tutor attendance report request', [
            'start_date' => $startDate->toDateString(),
            'end_date' => $endDate->toDateString(),
            'batch_id' => $batchId,
            'student_name' => $studentName,
            'tutor_id' => Auth::id()
        ]);

        // Start with the base query
        $query = StudentAttendance::with(['user' => function($q) {
            $q->with('batches');
        }])
        ->whereBetween('check_in_datetime', [$startDate->startOfDay(), $endDate->endOfDay()]);

        // Get batches assigned to this tutor
        $tutorBatchIds = \App\Models\BatchCurriculum::where('tutor_id', $user->id)
            ->pluck('batch_id')
            ->toArray();

        if (empty($tutorBatchIds)) {
            \Log::warning('No batches assigned to tutor', ['tutor_id' => $user->id]);
            return response()->json([]);
        }

        // If batch_id is provided, check if it's one of the tutor's batches
        if ($batchId) {
            if (!in_array($batchId, $tutorBatchIds)) {
                \Log::warning('Tutor tried to access unauthorized batch', [
                    'tutor_id' => $user->id,
                    'requested_batch_id' => $batchId,
                    'authorized_batches' => $tutorBatchIds
                ]);
                return response()->json(['message' => 'Unauthorized batch access'], 403);
            }

            // Get all user IDs from the specified batch
            $userIds = BatchUser::where('batch_id', $batchId)->pluck('user_id')->toArray();

            if (empty($userIds)) {
                \Log::warning('No users found in batch', ['batch_id' => $batchId]);
                return response()->json([]);
            }

            $query->whereIn('user_id', $userIds);

            // Get the batch information for later use
            $selectedBatch = \App\Models\Batch::find($batchId);
        } else {
            // If no specific batch is requested, get all students from all of the tutor's batches
            $userIds = BatchUser::whereIn('batch_id', $tutorBatchIds)
                ->pluck('user_id')
                ->toArray();

            if (empty($userIds)) {
                \Log::warning('No users found in tutor batches', ['tutor_id' => $user->id]);
                return response()->json([]);
            }

            $query->whereIn('user_id', $userIds);
        }

        $attendance = $query->get();

        if ($attendance->isEmpty()) {
            \Log::info('No attendance records found for the date range and filters');
            return response()->json([]);
        }

        $groupedAttendance = $attendance->groupBy('user_id');

        // Initialize $selectedBatch variable if it's not set
        $selectedBatch = $selectedBatch ?? null;

        $report = $groupedAttendance->map(function ($records, $userId) use ($batchId, $selectedBatch) {
            $user = $records->first()->user;

            // Get the user's batch information
            $userBatch = null;
            $userBatchName = 'No Batch';
            $userBatchId = null;

            // If a specific batch ID was requested and we have the batch information
            if ($batchId && isset($selectedBatch)) {
                // Use the batch information we already retrieved
                $userBatchId = $selectedBatch->id;
                $userBatchName = $selectedBatch->name;
            }
            // Otherwise, try to get batch information from the user's batches
            else if ($user->batches && $user->batches->isNotEmpty()) {
                // If a specific batch ID was requested but we don't have the batch information
                if ($batchId) {
                    // Convert batch ID to string for comparison if needed
                    $batchIdToCompare = (string) $batchId;

                    // Find the batch by ID in the user's batches
                    $specificBatch = $user->batches->first(function ($batch) use ($batchIdToCompare) {
                        return (string) $batch->id === $batchIdToCompare;
                    });

                    if ($specificBatch) {
                        $userBatch = $specificBatch;
                        $userBatchId = $userBatch->id;
                        $userBatchName = $userBatch->name;
                    }
                } else {
                    // If no specific batch was requested, use the first batch for the user
                    $userBatch = $user->batches->first();
                    if ($userBatch) {
                        $userBatchId = $userBatch->id;
                        $userBatchName = $userBatch->name;
                    }
                }
            }

            return [
                'user_id' => $userId,
                'name' => $user->name,
                'email' => $user->email,
                'batch_id' => $userBatchId,
                'batch_name' => $userBatchName,
                'total_days' => $records->count(),
                'present_days' => $records->whereNotNull('check_out_datetime')->count(),
                'attendance_percentage' => $records->count() > 0
                    ? round(($records->whereNotNull('check_out_datetime')->count() / $records->count()) * 100, 2)
                    : 0
            ];
        })->values();

        // If student name is provided, filter the report
        if ($studentName) {
            $report = $report->filter(function ($item) use ($studentName) {
                return stripos($item['name'], $studentName) !== false;
            })->values();
        }

        \Log::info('Tutor attendance report response', [
            'record_count' => $report->count(),
            'batch_id_filter' => $batchId,
            'first_record_batch_id' => $report->isNotEmpty() ? $report->first()['batch_id'] : null,
            'first_record_batch_name' => $report->isNotEmpty() ? $report->first()['batch_name'] : null
        ]);

        return response()->json($report);
    }
}