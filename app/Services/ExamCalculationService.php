<?php

namespace App\Services;

use App\Models\User;
use App\Models\ExamAttempt;
use Illuminate\Support\Facades\Log;

class ExamCalculationService
{
    /**
     * Get or calculate exam total marks for a student
     * Only recalculates if there are new exam attempts
     */
    public function getStudentExamTotalMarks($studentId)
    {
        $student = User::find($studentId);
        if (!$student) {
            return 0;
        }

        // Check if we need to recalculate
        if ($this->needsRecalculation($student)) {
            $this->calculateAndStoreExamMarks($student);
        }

        return $student->exam_total_marks ?? 0;
    }

    /**
     * Check if exam marks need to be recalculated
     */
    private function needsRecalculation($student)
    {
        // If never calculated before, needs calculation
        if (!$student->exam_last_calculated_at) {
            return true;
        }

        // Check if there are new exam attempts since last calculation
        $lastAttemptId = $student->exam_last_attempt_id ?? 0;
        $newAttemptsCount = ExamAttempt::where('student_id', $student->id)
            ->where('id', '>', $lastAttemptId)
            ->count();

        return $newAttemptsCount > 0;
    }

    /**
     * Calculate and store exam marks for a student
     */
    private function calculateAndStoreExamMarks($student)
    {
        // Get all exam attempts for the student
        $examAttempts = ExamAttempt::with('exam')
            ->where('student_id', $student->id)
            ->get();

        $totalMarks = 0;

        foreach ($examAttempts as $attempt) {
            $score = $attempt->score ? floatval($attempt->score) : 0;
            $totalMarks += $score; // Add all scores (positive and negative)
        }

        // Get the latest attempt ID for tracking
        $latestAttemptId = $examAttempts->max('id') ?? 0;

        // Update the student record
        $student->update([
            'exam_total_marks' => $totalMarks,
            'exam_last_calculated_at' => now(),
            'exam_last_attempt_id' => $latestAttemptId
        ]);
    }

    /**
     * Force recalculation for a student (useful for admin purposes)
     */
    public function forceRecalculateExamMarks($studentId)
    {
        $student = User::find($studentId);
        if (!$student) {
            return false;
        }

        $this->calculateAndStoreExamMarks($student);
        return true;
    }

    /**
     * Recalculate exam marks for all students (batch operation)
     */
    public function recalculateAllStudentsExamMarks()
    {
        $students = User::where('role_id', 6)->get(); // Assuming role_id 6 is for students
        
        foreach ($students as $student) {
            $this->calculateAndStoreExamMarks($student);
        }
    }
} 