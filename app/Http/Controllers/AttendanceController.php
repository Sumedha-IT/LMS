<?php

namespace App\Http\Controllers;

use App\Models\Calendar;
use App\Models\BatchUser;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Auth;
use App\Models\Attendance;
use Illuminate\Http\Request;
use App\Http\Resources\AttendanceResource;

class AttendanceController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();

        $attendances_count = Attendance::where('user_id', $user->id)
            ->count();

        $attendancePercentage = 0;

        $totalClasses = Calendar::count();

        if ($attendances_count && $totalClasses) {
            $attendancePercentage = round(($attendances_count / $totalClasses) * 100);
        }
        return [
            'Attendance_count' => $attendances_count,
            'Attendance_percentage' => $attendancePercentage,
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
    $userId = Auth::id(); // Get the logged-in user's ID


    $attendances = Attendance::where('user_id', $userId)->select(
            DB::raw('MONTH(date) as month'),
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
    $attendanceRecords = Attendance::where('user_id', $user->id)->get();

    $report = [];

    foreach ($calendarEntries as $calendarEntry) {
        $calendarStart = Carbon::parse($calendarEntry->start_time);
        $calendarEnd = Carbon::parse($calendarEntry->end_time);

        $attendanceRecord = $attendanceRecords->first(function ($attendance) use ($calendarStart, $calendarEnd) {
            $attendanceDate = Carbon::parse($attendance->date);

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
 * Mark attendance for a student
 *
 * @param Request $request
 * @return \Illuminate\Http\JsonResponse
 */
public function markAttendance(Request $request)
{
    $request->validate([
        'calendar_id' => 'required|exists:calendars,id',
        'date' => 'required|date',
    ]);

    $user = $request->user();

    // Check if attendance already exists for this user and date
    $existingAttendance = Attendance::where('user_id', $user->id)
        ->whereDate('date', $request->date)
        ->first();

    if ($existingAttendance) {
        return response()->json([
            'message' => 'Attendance already marked for today',
            'attendance' => $existingAttendance
        ], 200);
    }

    // Get the calendar entry to verify it's for the user's batch
    $calendar = Calendar::findOrFail($request->calendar_id);

    // Get user's batch
    $userBatch = BatchUser::where('user_id', $user->id)->value('batch_id');

    // Verify the calendar entry is for the user's batch
    if ($calendar->batch_id != $userBatch) {
        return response()->json([
            'message' => 'This class is not for your batch'
        ], 403);
    }

    // Verify the calendar entry is for today
    $calendarDate = Carbon::parse($calendar->start_time)->toDateString();
    $requestDate = Carbon::parse($request->date)->toDateString();

    if ($calendarDate !== $requestDate) {
        return response()->json([
            'message' => 'Calendar entry date does not match the requested date'
        ], 400);
    }

    // Verify the current time is within the class time
    $now = Carbon::now();
    $classStart = Carbon::parse($calendar->start_time);
    $classEnd = Carbon::parse($calendar->end_time);

    if ($now->lt($classStart) || $now->gt($classEnd)) {
        return response()->json([
            'message' => 'Attendance can only be marked during class hours'
        ], 400);
    }

    // Create attendance record
    $attendance = new Attendance([
        'user_id' => $user->id,
        'date' => $request->date,
        'attendance_by' => $user->id, // Self-marked attendance
        'team_id' => $user->current_team_id
    ]);

    $attendance->save();

    return response()->json([
        'message' => 'Attendance marked successfully',
        'attendance' => $attendance
    ], 201);
}

}
