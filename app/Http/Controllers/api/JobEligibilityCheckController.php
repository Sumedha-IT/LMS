<?php

namespace App\Http\Controllers\api;

use App\Http\Controllers\Controller;
use App\Models\JobPosting;
use App\Models\StudentPlacementEligibility;
use App\Models\User;
use App\Models\ExamAttempt;
use App\Models\StudentAttendance;
use App\Services\ExamCalculationService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class JobEligibilityCheckController extends Controller
{
    public function __construct()
    {
        // Temporarily removed authentication for testing
        // $this->middleware('auth:sanctum');
        $this->examCalculationService = new ExamCalculationService();
    }

    /**
     * Check if a student meets the criteria for a specific job posting
     * 
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function checkEligibility(Request $request)
    {
        try {
            \Log::info('Job eligibility check request received:', $request->all());
            
            $validated = $request->validate([
                'user_id' => 'required|exists:users,id',
                'job_posting_id' => 'required|exists:job_postings,id',
            ]);

            $userId = $validated['user_id'];
            $jobPostingId = $validated['job_posting_id'];

            // Get the job posting
            $jobPosting = JobPosting::with('company', 'course')->findOrFail($jobPostingId);
            
            // Get the student
            $student = User::with('course')->findOrFail($userId);
            
            // Get student placement eligibility record
            $eligibility = StudentPlacementEligibility::where('user_id', $userId)->first();
            
            if (!$eligibility) {
                return response()->json([
                    'eligible' => false,
                    'message' => 'Student placement eligibility record not found',
                    'details' => [
                        'attendance_percentage' => 0,
                        'exam_marks' => 0,
                        'criteria_met' => []
                    ]
                ]);
            }

            // Check attendance percentage
            $attendancePercentage = $this->calculateAttendancePercentage($userId);
            
            // Check exam marks
            $examMarks = $this->calculateExamMarks($userId);
            
            // Define criteria thresholds (you can make these configurable)
            $attendanceThreshold = 75.0; // 75% minimum attendance
            $examMarksThreshold = 60.0;  // 60% minimum exam marks
            
            // Check if criteria are met
            $attendanceMet = $attendancePercentage >= $attendanceThreshold;
            $examMarksMet = $examMarks >= $examMarksThreshold;
            
            // Check course match
            $courseMatch = $this->checkCourseMatch($student, $jobPosting);
            
            $overallEligible = $attendanceMet && $examMarksMet && $courseMatch['match'];
            
            // Update the eligibility record
            $eligibility->update([
                'attendance_percentage' => $attendancePercentage,
                'exam_standards_met' => $examMarksMet,
                'is_eligible' => $overallEligible,
                'eligibility_reasons' => $this->generateEligibilityReasons($attendanceMet, $examMarksMet, $attendancePercentage, $examMarks),
                'last_eligibility_check' => now(),
            ]);

            return response()->json([
                'eligible' => $overallEligible,
                'message' => $overallEligible ? 'Student meets job posting criteria' : 'Student does not meet job posting criteria',
                'student' => [
                    'id' => $student->id,
                    'name' => $student->name,
                    'email' => $student->email,
                    'course_id' => $student->course_id,
                    'course_name' => $student->course->name ?? 'N/A',
                ],
                'job_posting' => [
                    'id' => $jobPosting->id,
                    'title' => $jobPosting->title,
                    'company' => $jobPosting->company->name ?? 'N/A',
                    'course_id' => $jobPosting->course_id,
                    'course_name' => $jobPosting->course->name ?? 'N/A',
                ],
                'criteria_check' => [
                    'attendance_percentage' => round($attendancePercentage, 2),
                    'attendance_threshold' => $attendanceThreshold,
                    'attendance_met' => $attendanceMet,
                    'exam_marks' => round($examMarks, 2),
                    'exam_threshold' => $examMarksThreshold,
                    'exam_marks_met' => $examMarksMet,
                    'course_match' => $courseMatch['match'],
                    'course_match_reason' => $courseMatch['reason'],
                ],
                'overall_eligible' => $overallEligible,
                'eligibility_reasons' => $eligibility->eligibility_reasons,
            ]);

        } catch (\Exception $e) {
            \Log::error('Error checking job eligibility:', [
                'message' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    /**
     * Calculate attendance percentage for a student (using fast API logic)
     */
    private function calculateAttendancePercentage($userId)
    {
        try {
            \Log::info("Calculating attendance percentage for user_id: {$userId}");
            
            // Get the student's batch
            $userBatch = \App\Models\BatchUser::where('user_id', $userId)->first();
            
            if (!$userBatch) {
                \Log::info("No batch found for user_id: {$userId}");
                return 0;
            }
            
            // Get batch details
            $batch = \App\Models\Batch::find($userBatch->batch_id);
            
            if (!$batch) {
                \Log::info("Batch not found for user_id: {$userId}");
                return 0;
            }
            
            // Use the same logic as the fast attendance API
            $batchStartDate = Carbon::parse($batch->start_date)->startOfDay();
            $endDate = Carbon::now()->endOfDay();
            
            // Get attendance records for the student
            $attendanceRecords = StudentAttendance::where('user_id', $userId)
                ->whereBetween('check_in_datetime', [$batchStartDate, $endDate])
                ->orderBy('check_in_datetime', 'desc')
                ->get();
            
            $totalDays = 0;
            $presentDays = 0;
            
            foreach ($attendanceRecords as $record) {
                $totalDays++;
                if ($record->check_out_datetime) {
                    $duration = Carbon::parse($record->check_out_datetime)->diffInMinutes(Carbon::parse($record->check_in_datetime));
                    if ($duration >= 180) { // 3 hours minimum
                        $presentDays++;
                    }
                }
            }
            
            $percentage = $totalDays > 0 ? ($presentDays / $totalDays) * 100 : 0;
            
            \Log::info("Fast attendance calculation summary for user_id {$userId}:");
            \Log::info("- Total days: {$totalDays}");
            \Log::info("- Present days: {$presentDays}");
            \Log::info("- Attendance percentage: " . round($percentage, 2) . "%");
            
            return round($percentage, 2);
            
        } catch (\Exception $e) {
            \Log::error('Error calculating attendance percentage:', [
                'user_id' => $userId,
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            return 0;
        }
    }

    /**
     * Calculate average exam marks for a student (from user table)
     * Uses stored exam_total_marks from user table
     */
    private function calculateExamMarks($userId)
    {
        try {
            $student = User::find($userId);
            if (!$student) {
                return 0;
            }

            // Get stored exam total marks from user table
            $totalMarks = $student->exam_total_marks ?? 0;
            
            // If no stored marks, calculate and store them
            if ($totalMarks == 0 && !$student->exam_last_calculated_at) {
                $this->examCalculationService->getStudentExamTotalMarks($userId);
                $student->refresh();
                $totalMarks = $student->exam_total_marks ?? 0;
            }
            
            return $totalMarks;
            
        } catch (\Exception $e) {
            \Log::error('Error getting exam marks from user table:', [
                'user_id' => $userId,
                'error' => $e->getMessage()
            ]);
            return 0;
        }
    }

    /**
     * Generate eligibility reasons
     */
    private function generateEligibilityReasons($attendanceMet, $examMarksMet, $attendancePercentage, $examMarks)
    {
        $reasons = [];
        
        if (!$attendanceMet) {
            $reasons[] = "Attendance percentage ({$attendancePercentage}%) is below required threshold (75%)";
        }
        
        if (!$examMarksMet) {
            $reasons[] = "Exam marks ({$examMarks}%) are below required threshold (60%)";
        }
        
        if ($attendanceMet && $examMarksMet) {
            $reasons[] = "All criteria met - Student is eligible for placement";
        }
        
        return implode('; ', $reasons);
    }

    /**
     * Get eligibility status for all students for a specific job posting
     */
    public function getJobEligibilityList(Request $request, $job_posting_id)
    {
        try {
            \Log::info("Getting job eligibility list for job posting ID: {$job_posting_id}");
            
            // Validate that the job posting exists
            $jobPosting = JobPosting::with('company', 'course')->findOrFail($job_posting_id);
            $jobPostingId = $job_posting_id;

            \Log::info("Job posting found: {$jobPosting->title} (Course: " . ($jobPosting->course ? $jobPosting->course->name : 'None') . ")");

            // Get all students with their eligibility status
            $students = User::where('role_id', 6) // Assuming role_id 6 is for students
                ->where('is_active', 1)
                ->with('course', 'placementEligibility', 'batches.course_package')
                ->get();
                
            \Log::info("Found {$students->count()} active students");

            $processedStudents = $students->map(function ($student) use ($jobPosting) {
                \Log::info("Processing student: {$student->name} (ID: {$student->id})");
                
                // Check basic eligibility for this student
                $basicEligibility = $this->checkStudentEligibility($student->id);
                
                // Check course match
                $courseMatch = $this->checkCourseMatch($student, $jobPosting);
                
                // Overall eligibility includes course match
                $overallEligible = $basicEligibility['overall_eligible'] && $courseMatch['match'];
                
                // Get batch information for debugging
                $batchInfo = $student->batches->map(function($batch) {
                    return [
                        'batch_id' => $batch->id,
                        'batch_name' => $batch->name,
                        'course_package_id' => $batch->course_package_id,
                        'course_package_name' => $batch->course_package ? $batch->course_package->name : 'N/A'
                    ];
                });
                
                return array_merge([
                    'student_id' => $student->id,
                    'student_name' => $student->name,
                    'student_email' => $student->email,
                    'course_id' => $student->course_id,
                    'course_name' => $student->course ? $student->course->name : 'No Course Assigned',
                    'enrolled_batches' => $batchInfo,
                    'course_match' => $courseMatch['match'],
                    'course_match_reason' => $courseMatch['reason'],
                ], $basicEligibility, [
                    'overall_eligible' => $overallEligible,
                ]);
            });

            // Filter for eligible students only
            $eligibleStudents = $processedStudents->where('overall_eligible', true);
            
            \Log::info("Eligibility summary: {$processedStudents->count()} total students, {$eligibleStudents->count()} eligible");

            return response()->json([
                'job_posting' => [
                    'id' => $jobPosting->id,
                    'title' => $jobPosting->title,
                    'company' => $jobPosting->company->name ?? 'N/A',
                    'course_id' => $jobPosting->course_id,
                    'course_name' => $jobPosting->course->name ?? 'N/A',
                ],
                'total_students' => $processedStudents->count(),
                'eligible_students' => $eligibleStudents->count(),
                'students' => $eligibleStudents->values() // Only eligible students
            ]);
        } catch (\Exception $e) {
            \Log::error('Error in getJobEligibilityList:', [
                'job_posting_id' => $job_posting_id,
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    /**
     * Get exam marks for a specific student (from user table)
     * 
     * @param Request $request
     * @param int $studentId
     * @return \Illuminate\Http\JsonResponse
     */
    public function getStudentExamMarks(Request $request, $studentId)
    {
        try {
            // Check if student exists
            $student = User::find($studentId);
            if (!$student) {
                return response()->json([
                    'error' => 'Student not found',
                    'message' => 'Student with ID ' . $studentId . ' not found'
                ], 404);
            }

            // Get exam marks directly from user table
            $totalMarks = $student->exam_total_marks ?? 0;
            $hasNegativeScores = $totalMarks < 0;

            return response()->json([
                'success' => true,
                'student' => [
                    'id' => $student->id,
                    'name' => $student->name,
                    'email' => $student->email
                ],
                'exam_summary' => [
                    'total_marks' => $totalMarks,
                    'last_calculated_at' => $student->exam_last_calculated_at,
                    'has_negative_scores' => $hasNegativeScores
                ],
                'message' => 'Exam marks retrieved successfully'
            ]);

        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    /**
     * Check if a student meets the criteria for a specific job posting
     * Updated to check through batch system instead of direct course assignment
     */
    private function checkCourseMatch($student, $jobPosting)
    {
        \Log::info("Checking course match for student {$student->id} and job posting {$jobPosting->id}");
        
        // If job posting doesn't have course requirement, all students match
        if (!$jobPosting->course_id) {
            \Log::info("Job posting {$jobPosting->id} has no course requirement - all students eligible");
            return [
                'match' => true,
                'reason' => 'No course requirement for this job posting'
            ];
        }

        // Get the job posting course
        $jobPostingCourse = $jobPosting->course;
        if (!$jobPostingCourse) {
            \Log::warning("Job posting {$jobPosting->id} has course_id {$jobPosting->course_id} but course not found");
            return [
                'match' => false,
                'reason' => 'Job posting course not found'
            ];
        }

        \Log::info("Job posting requires course: {$jobPostingCourse->name} (ID: {$jobPosting->course_id})");

        // Check if student is enrolled in any batch that has this course
        $studentBatches = $student->batches()->with('course', 'course_package')->get();
        
        \Log::info("Student {$student->id} is enrolled in {$studentBatches->count()} batches");
        
        foreach ($studentBatches as $batch) {
            \Log::info("Checking batch {$batch->id} ({$batch->name})");
            \Log::info("- Batch course_package_id: {$batch->course_package_id}");
            
            // Check if batch has the required course (using course_package_id)
            if ($batch->course_package_id == $jobPosting->course_id) {
                \Log::info("✓ Course match found in batch {$batch->id} (course_package_id: {$batch->course_package_id})");
                return [
                    'match' => true,
                    'reason' => "Student enrolled in batch '{$batch->name}' with required course '{$jobPostingCourse->name}'"
                ];
            }
            
            // Also check if the batch has the course through the courses relationship
            if ($batch->courses) {
                foreach ($batch->courses as $batchCourse) {
                    \Log::info("- Batch course: {$batchCourse->name} (ID: {$batchCourse->id})");
                    if ($batchCourse->id == $jobPosting->course_id) {
                        \Log::info("✓ Course match found through batch courses relationship");
                        return [
                            'match' => true,
                            'reason' => "Student enrolled in batch '{$batch->name}' with required course '{$jobPostingCourse->name}'"
                        ];
                    }
                }
            }
        }

        // Fallback: Check direct course assignment (for backward compatibility)
        if ($student->course_id == $jobPosting->course_id) {
            \Log::info("✓ Course match found through direct course assignment (fallback)");
            return [
                'match' => true,
                'reason' => 'Course matches job requirement (direct assignment)'
            ];
        }

        \Log::info("✗ No course match found for student {$student->id}");
        return [
            'match' => false,
            'reason' => "Student not enrolled in any batch with required course '{$jobPostingCourse->name}'"
        ];
    }

    /**
     * Check eligibility for a specific student (helper method)
     */
    private function checkStudentEligibility($userId)
    {
        $attendancePercentage = $this->calculateAttendancePercentage($userId);
        $examMarks = $this->calculateExamMarks($userId);
        
        $attendanceThreshold = 75.0;
        $examMarksThreshold = 60.0;
        
        $attendanceMet = $attendancePercentage >= $attendanceThreshold;
        $examMarksMet = $examMarks >= $examMarksThreshold;
        
        $overallEligible = $attendanceMet && $examMarksMet;
        
        $reasons = [];
        if (!$attendanceMet) {
            $reasons[] = "Attendance: {$attendancePercentage}% (Required: {$attendanceThreshold}%)";
        }
        if (!$examMarksMet) {
            $reasons[] = "Exam Marks: {$examMarks}% (Required: {$examMarksThreshold}%)";
        }
        if ($overallEligible) {
            $reasons[] = "All criteria met";
        }
        
        return [
            'eligible' => $overallEligible,
            'overall_eligible' => $overallEligible,
            'attendance_percentage' => round($attendancePercentage, 2),
            'exam_marks' => round($examMarks, 2),
            'reasons' => implode('; ', $reasons),
        ];
    }
} 