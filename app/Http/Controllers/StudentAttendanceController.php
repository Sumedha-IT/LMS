<?php

namespace App\Http\Controllers;

use App\Models\StudentAttendance;
use App\Models\AttendanceCheckinStandard;
use App\Models\BatchUser;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\StudentDeviceRegistration;
use App\Services\IpVerificationService;
use App\Services\GeolocationVerificationService;
use Illuminate\Support\Facades\Log;

class StudentAttendanceController extends Controller
{
    protected $ipVerificationService;
    protected $geolocationVerificationService;

    public function __construct(
        IpVerificationService $ipVerificationService,
        GeolocationVerificationService $geolocationVerificationService
    ) {
        $this->ipVerificationService = $ipVerificationService;
        $this->geolocationVerificationService = $geolocationVerificationService;
    }

    public function registerDevice(Request $request)
    {
        try {
            $user = auth()->user();
            $deviceFingerprint = $request->device_fingerprint;
            $deviceInfo = $request->device_info ?? null;

            // Use the IP verification service
            $ipVerification = $this->ipVerificationService->verifyIp('register device');
            if (!$ipVerification['success']) {
                return response()->json([
                    'success' => false,
                    'message' => $ipVerification['message'],
                    'show_dialog' => true,
                    'dialog_title' => 'Campus Network Required',
                    'dialog_message' => 'Please connect to the campus WiFi network to register your device.'
                ], 403);
            }

            // Check if device is already registered for any user
            $existingDevice = StudentDeviceRegistration::where('device_fingerprint', $deviceFingerprint)
                ->where('is_active', true)
                ->first();

            if ($existingDevice) {
                return response()->json([
                    'success' => false,
                    'message' => 'This device is already registered to another user',
                    'show_dialog' => true,
                    'dialog_title' => 'Device Already Registered',
                    'dialog_message' => 'This device is already registered to another user. Please use your registered device.'
                ], 403);
            }

            // Register the new device
            $deviceRegistration = StudentDeviceRegistration::create([
                'user_id' => $user->id,
                'device_fingerprint' => $deviceFingerprint,
                'device_info' => $deviceInfo,
                'device_type' => $request->device_type ?? 'Unknown',
                'device_name' => $request->device_name ?? 'Unknown Device',
                'is_active' => true,
                'last_used_at' => now()
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Device registered successfully',
                'data' => $deviceRegistration
            ]);

        } catch (\Exception $e) {
            \Log::error('Device registration error', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            return response()->json([
                'success' => false,
                'message' => 'Device registration failed: ' . $e->getMessage()
            ], 500);
        }
    }

    public function checkIn(Request $request)
    {
        try {
            $student = auth()->user();
            $ipAddress = $request->ip();
            $deviceFingerprint = $request->input('device_fingerprint');
            $deviceInfo = $request->input('device_info');
            $deviceType = $request->input('device_type');
            $deviceName = $request->input('device_name');
            $latitude = $request->input('latitude');
            $longitude = $request->input('longitude');
            $accuracy = $request->input('accuracy');

            // Check if already checked in today
            $today = now()->format('Y-m-d');
            $existingAttendance = StudentAttendance::where('user_id', $student->id)
                ->whereDate('check_in_datetime', $today)
                ->first();

            if ($existingAttendance) {
                return response()->json([
                    'success' => false,
                    'message' => 'You have already checked in today'
                ], 400);
            }

            // Verify IP first
            $ipVerification = $this->ipVerificationService->verifyIp('check in');
            
            // Only check location if IP verification fails
            $locationVerification = false;
            if (!$ipVerification['success'] && $latitude && $longitude) {
                $locationVerification = $this->geolocationVerificationService->verifyLocation($latitude, $longitude, $accuracy);
            }

            // Allow if either IP or location verification passes
            if (!$ipVerification['success'] && !$locationVerification) {
                return response()->json([
                    'success' => false,
                    'message' => 'You must be on campus to check in. Please connect to the campus network or enable location services.',
                    'show_dialog' => true,
                    'dialog_title' => 'Location Verification Failed',
                    'dialog_message' => 'You must be on campus to check in. Please connect to the campus network or enable location services.'
                ], 403);
            }

            // Enforce device registration: user must always use their registered device
            $registeredDevice = \App\Models\StudentDeviceRegistration::where('user_id', $student->id)
                ->where('is_active', true)
                ->first();

            // If user has a registered device, they must use it
            if ($registeredDevice) {
                if ($registeredDevice->device_fingerprint !== $deviceFingerprint) {
                    return response()->json([
                        'success' => false,
                        'message' => 'You must use your registered device to check in.',
                        'show_dialog' => true,
                        'dialog_title' => 'Device Not Registered',
                        'dialog_message' => 'Please use your registered device to check in.'
                    ], 403);
                }
            } else {
                // If no device registered, check if this device is already registered to another user
                $existingDevice = \App\Models\StudentDeviceRegistration::where('device_fingerprint', $deviceFingerprint)
                    ->where('is_active', true)
                    ->first();
                if ($existingDevice) {
                    return response()->json([
                        'success' => false,
                        'message' => 'This device is already registered to another user.',
                        'show_dialog' => true,
                        'dialog_title' => 'Device Already Registered',
                        'dialog_message' => 'This device is already registered to another user. Please use your registered device.'
                    ], 403);
                }
                // Register this device for the user
                \App\Models\StudentDeviceRegistration::create([
                    'user_id' => $student->id,
                    'device_fingerprint' => $deviceFingerprint,
                    'device_info' => $deviceInfo,
                    'device_type' => $deviceType,
                    'device_name' => $deviceName,
                    'is_active' => true,
                    'last_used_at' => now()
                ]);
            }

            // Create attendance record
            $attendance = StudentAttendance::create([
                'user_id' => $student->id,
                'check_in_datetime' => now(),
                'check_out_datetime' => null,
                'status' => 'Present',
                'ip_address' => $ipAddress,
                'device_fingerprint' => $deviceFingerprint,
                'device_info' => $deviceInfo,
                'device_type' => $deviceType,
                'device_name' => $deviceName
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Successfully checked in',
                'data' => $attendance
            ]);

        } catch (\Exception $e) {
            Log::error('Attendance check-in failed', [
                'error' => $e->getMessage(),
                'student_id' => auth()->id()
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Failed to check in. Please try again.'
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

        // Calculate duration in hours
        $checkInTime = Carbon::parse($attendance->check_in_datetime);
        $checkOutTime = Carbon::now();
        $duration = $checkOutTime->diffInHours($checkInTime);
        
        // Update check-out time and status based on duration
        $attendance->update([
            'check_out_datetime' => $checkOutTime,
            'status' => $duration >= 3 ? 'Present' : 'Absent'
        ]);

        return response()->json([
            'message' => 'Check-out successful',
            'data' => $attendance,
            'status' => 'success',
            'duration' => $duration,
            'attendance_status' => $duration >= 3 ? 'Present' : 'Absent'
        ]);
    }

    public function getAttendanceReport(Request $request)
    {
        try {
            $user = Auth::user();

            // Allow admin, tutor, or coordinator to use student_id, else use own ID
            $studentId = ($request->has('student_id') && $user && ($user->is_admin || $user->is_tutor || $user->is_coordinator))
                ? $request->input('student_id')
                : $user->id;

            // If tutor, check that the student is in a batch assigned to the tutor
            if ($user->is_tutor && $studentId != $user->id) {
                $studentBatch = \App\Models\BatchUser::where('user_id', $studentId)->first();
                if (!$studentBatch) {
                    return response()->json([
                        'total_days' => 0,
                        'present_days' => 0,
                        'complete_days' => 0,
                        'absent_days' => 0,
                        'attendance_details' => []
                    ]);
                }
                $tutorBatchIds = \App\Models\BatchCurriculum::where('tutor_id', $user->id)->pluck('batch_id')->toArray();
                if (!in_array($studentBatch->batch_id, $tutorBatchIds)) {
                    return response()->json(['message' => 'Unauthorized: Student not in your batch'], 403);
                }
            }

            // Get filter parameters
            $filterType = $request->filter_type ?? 'all'; // 'all', 'week', 'month'

            // Get the student's batch
            $userBatch = \App\Models\BatchUser::where('user_id', $studentId)->first();

            if (!$userBatch) {
                // Return empty report instead of error for new users
                return response()->json([
                    'total_days' => 0,
                    'present_days' => 0,
                    'complete_days' => 0,
                    'absent_days' => 0,
                    'attendance_details' => []
                ]);
            }

            // Get the batch details
            $batch = \App\Models\Batch::find($userBatch->batch_id);

            if (!$batch) {
                // Return empty report instead of error
                return response()->json([
                    'total_days' => 0,
                    'present_days' => 0,
                    'complete_days' => 0,
                    'absent_days' => 0,
                    'attendance_details' => []
                ]);
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

            // Get attendance records for the student within the date range using chunking
            $totalDays = 0;
            $presentDays = 0;
            $completeDays = 0;
            $attendanceDetails = collect();

            // Process attendance records in chunks to avoid memory issues
            StudentAttendance::where('user_id', $studentId)
                ->when($filterType !== 'all', function($query) use ($startDate, $endDate) {
                    return $query->whereBetween('check_in_datetime', [$startDate, $endDate]);
                })
                ->orderBy('check_in_datetime', 'desc')
                ->chunk(100, function($records) use (&$totalDays, &$presentDays, &$completeDays, &$attendanceDetails) {
                    foreach ($records as $record) {
                        $totalDays++;
                        $duration = null;
                        $status = 'Absent';
                        if ($record->check_out_datetime) {
                            $duration = Carbon::parse($record->check_out_datetime)->diffInMinutes(Carbon::parse($record->check_in_datetime));
                            if ($duration >= 180) {
                                $presentDays++;
                                $completeDays++;
                                $status = 'Present';
                            } else {
                                $status = 'Absent';
                            }
                        }
                        $attendanceDetails->push([
                            'date' => $record->check_in_datetime->format('Y-m-d'),
                            'check_in' => $record->check_in_datetime->format('H:i:s'),
                            'check_out' => $record->check_out_datetime ? $record->check_out_datetime->format('H:i:s') : null,
                            'duration' => $duration,
                            'status' => $status
                        ]);
                    }
                });

            // If no attendance records found, return empty report
            if ($totalDays === 0) {
                return response()->json([
                    'total_days' => 0,
                    'present_days' => 0,
                    'complete_days' => 0,
                    'absent_days' => 0,
                    'attendance_details' => []
                ]);
            }

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

            // Add absent days for dates without attendance records
            $existingDates = $attendanceDetails->pluck('date')->toArray();
            $absentDays = $dateRange->filter(function($date) use ($existingDates) {
                return !in_array($date, $existingDates);
            })->map(function($date) {
                return [
                    'date' => $date,
                    'check_in' => null,
                    'check_out' => null,
                    'duration' => null,
                    'status' => 'Absent'
                ];
            });

            // Merge attendance details with absent days
            $allDaysDetails = $attendanceDetails->concat($absentDays)->sortByDesc('date')->values();

            $report = [
                'total_days' => $totalDays,
                'present_days' => $presentDays,
                'complete_days' => $completeDays,
                'absent_days' => $totalDays - $presentDays,
                'attendance_details' => $allDaysDetails
            ];

            return response()->json($report);

        } catch (\Exception $e) {
            \Log::error('Attendance report error', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
                'user_id' => Auth::id()
            ]);
            
            // Return empty report instead of error
            return response()->json([
                'total_days' => 0,
                'present_days' => 0,
                'complete_days' => 0,
                'absent_days' => 0,
                'attendance_details' => []
            ]);
        }
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
            'duration' => null,
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
                $status['duration'] = Carbon::parse($todayAttendance->check_out_datetime)
                    ->diffInHours(Carbon::parse($todayAttendance->check_in_datetime));
            } else {
                // Calculate current duration if not checked out
                $status['duration'] = Carbon::now()
                    ->diffInHours(Carbon::parse($todayAttendance->check_in_datetime));
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

    // Add new method to manage device registrations
    public function getRegisteredDevices()
    {
        $user = Auth::user();
        
        $devices = \App\Models\StudentDeviceRegistration::where('user_id', $user->id)
            ->where('is_active', true)
            ->select('id', 'device_name', 'device_type', 'last_used_at', 'created_at')
            ->get();

        return response()->json($devices);
    }

    public function deactivateDevice($deviceId)
    {
        $user = Auth::user();
        
        $device = \App\Models\StudentDeviceRegistration::where('id', $deviceId)
            ->where('user_id', $user->id)
            ->first();

        if (!$device) {
            return response()->json([
                'message' => 'Device not found',
                'status' => 'error'
            ], 404);
        }

        $device->update(['is_active' => false]);

        return response()->json([
            'message' => 'Device deactivated successfully',
            'status' => 'success'
        ]);
    }
}