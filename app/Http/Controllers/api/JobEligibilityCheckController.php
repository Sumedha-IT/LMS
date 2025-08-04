<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\JobPosting;
use App\Models\StudentPlacementEligibility;
use App\Models\User;
use App\Models\ExamAttempt;
use App\Models\StudentAttendance;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\DB;

class JobEligibilityCheckController extends Controller
{
    public function __construct()
    {
        // Temporarily removed authentication for testing
        // $this->middleware('auth:sanctum');
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
     * Calculate attendance percentage for a student
     */
    private function calculateAttendancePercentage($userId)
    {
        try {
            \Log::info("Calculating attendance percentage for user_id: {$userId}");
            
            // Get total attendance records for the student
            $totalAttendance = StudentAttendance::where('user_id', $userId)->count();
            
            if ($totalAttendance === 0) {
                \Log::info("No attendance records found for user_id: {$userId}");
                return 0;
            }
            
            // Get present attendance records
            $presentAttendance = StudentAttendance::where('user_id', $userId)
                ->where('status', 'Present')
                ->count();
            
            // Get other status counts for detailed logging
            $absentAttendance = StudentAttendance::where('user_id', $userId)
                ->where('status', 'Absent')
                ->count();
            
            $lateAttendance = StudentAttendance::where('user_id', $userId)
                ->where('status', 'Late')
                ->count();
            
            $percentage = ($presentAttendance / $totalAttendance) * 100;
            
            \Log::info("Attendance calculation summary for user_id {$userId}:");
            \Log::info("- Total attendance records: {$totalAttendance}");
            \Log::info("- Present: {$presentAttendance}");
            \Log::info("- Absent: {$absentAttendance}");
            \Log::info("- Late: {$lateAttendance}");
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
     * Calculate average exam marks for a student
     * Uses the exam table and total_marks field for accurate calculation
     * 
     * Data Flow: Student → Batch → Exam → ExamAttempt
     */
    private function calculateExamMarks($userId)
    {
        try {
            \Log::info("Calculating exam marks for user_id: {$userId}");
            
            // Get all exam attempts for the student with exam details
            $examAttempts = ExamAttempt::with('exam')
                ->where('student_id', $userId)
                ->whereNotNull('score')
                ->where('score', '!=', '')
                ->where('status', 'completed')
                ->get();
            
            if ($examAttempts->isEmpty()) {
                \Log::info('No completed exam attempts found for user_id: ' . $userId);
                return 0;
            }
            
            \Log::info("Found {$examAttempts->count()} completed exam attempts for user_id: {$userId}");
            
            // Debug: Log all exam attempts for this student
            foreach ($examAttempts as $attempt) {
                \Log::info("Exam attempt details - ID: {$attempt->id}, Exam ID: {$attempt->exam_id}, Score: {$attempt->score}, Status: {$attempt->status}");
            }
            
            $totalScore = 0;
            $totalPossibleScore = 0;
            $validAttempts = 0;
            $skippedAttempts = 0;
            
            foreach ($examAttempts as $attempt) {
                // Convert score to float (it's stored as string)
                $score = floatval($attempt->score);
                
                // Get total marks from the exam table using the total_marks field
                $maxMarks = $attempt->exam ? $attempt->exam->total_marks : 0;
                
                // If exam doesn't exist or total_marks is 0, skip this attempt
                if (!$attempt->exam) {
                    \Log::warning("Skipping exam attempt {$attempt->id}: Exam not found");
                    $skippedAttempts++;
                    continue;
                }
                
                if ($maxMarks <= 0) {
                    \Log::warning("Skipping exam attempt {$attempt->id}: Invalid total_marks ({$maxMarks}) for exam '{$attempt->exam->title}'");
                    $skippedAttempts++;
                    continue;
                }
                
                // Validate score is not negative
                if ($score < 0) {
                    \Log::warning("Skipping exam attempt {$attempt->id}: Negative score ({$score})");
                    $skippedAttempts++;
                    continue;
                }
                
                // Calculate percentage from raw score (scores are stored as raw marks)
                $percentageScore = ($score / $maxMarks) * 100;
                \Log::info("Exam attempt {$attempt->id} (Exam: {$attempt->exam->title}): Raw score = {$score}, MaxMarks = {$maxMarks}, Calculated percentage = " . round($percentageScore, 2) . "%");
                
                // Cap percentage at 100%
                if ($percentageScore > 100) {
                    \Log::warning("Exam attempt {$attempt->id}: Percentage ({$percentageScore}%) exceeds 100%, capping at 100%");
                    $percentageScore = 100;
                }
                
                $totalScore += $score; // Add raw score
                $totalPossibleScore += $maxMarks; // Add max marks
                $validAttempts++;
            }
            
            if ($totalPossibleScore === 0) {
                \Log::warning("Total possible score is 0 for user_id: {$userId}. Valid attempts: {$validAttempts}, Skipped attempts: {$skippedAttempts}");
                return 0;
            }
            
            // Calculate weighted average percentage across all exams
            $percentage = ($totalScore / $totalPossibleScore) * 100;
            
            \Log::info("Exam calculation summary for user_id {$userId}:");
            \Log::info("- Valid attempts: {$validAttempts}");
            \Log::info("- Skipped attempts: {$skippedAttempts}");
            \Log::info("- Total score: {$totalScore}");
            \Log::info("- Total possible score: {$totalPossibleScore}");
            \Log::info("- Final percentage: " . round($percentage, 2) . "%");
            
            return round($percentage, 2);
            
        } catch (\Exception $e) {
            \Log::error('Error calculating exam marks:', [
                'user_id' => $userId,
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
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
                'students' => $eligibleStudents->values(), // Only eligible students
                'data_flow_info' => [
                    'message' => 'For proper eligibility checking, ensure: 1) Course exists, 2) Batch created with course, 3) Students enrolled in batch, 4) Job posting has same course_id',
                    'required_steps' => [
                        'Create course in courses table',
                        'Create batch linked to course (course_id or course_package_id)',
                        'Enroll students in batch via batch_user table',
                        'Create job posting with matching course_id'
                    ]
                ]
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
     * Check course match between student and job posting
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