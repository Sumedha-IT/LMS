<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\StudentAttendance;
use Carbon\Carbon;
use Symfony\Component\HttpFoundation\Response;

class CheckStudentAttendance
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        // Only apply this middleware to student users
        if (Auth::check() && Auth::user()->is_student) {
            // Check if the user is already on the attendance page or login page
            if ($request->is('student-attendance') || $request->is('administrator/login')) {
                return $next($request);
            }

            // Check if the user has checked in today
            $todayAttendance = StudentAttendance::where('user_id', Auth::id())
                ->whereDate('check_in_datetime', Carbon::today())
                ->first();

            // If no attendance record found, redirect to attendance page
            if (!$todayAttendance) {
                // Store the intended URL to redirect back after check-in
                session(['attendance_redirect_url' => $request->url()]);
                
                // Redirect to attendance page with a message
                return redirect()->route('student.attendance')
                    ->with('message', 'Please check in for attendance before accessing the LMS.');
            }
        }

        return $next($request);
    }
}
