<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\StudentAttendance;
use App\Models\Assignment;
use App\Models\ExamAttempt;
use App\Models\Batch;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class StudentExportController extends Controller
{
    public function getAttendance($studentId)
    {
        $student = User::whereHas('role', function($query) {
            $query->where('name', 'Student');
        })->findOrFail($studentId);
        
        // Check if the user has permission to view this student's data
        // (You may want to adjust/remove this for now if you have no policy)
        // if (!Auth::user()->can('view', $student)) {
        //     return response()->json(['message' => 'Unauthorized'], 403);
        // }

        $attendance = StudentAttendance::where('user_id', $studentId)
            ->get()
            ->map(function ($record) {
                return [
                    'id' => $record->id,
                    'date' => $record->check_in_datetime,
                    'status' => strtolower($record->status), // Convert to lowercase for frontend
                    'check_in_datetime' => $record->check_in_datetime,
                    'check_out_datetime' => $record->check_out_datetime,
                    'remarks' => '', // Add if you have remarks
                    'class_name' => '', // Add if you have class relationship
                    'subject_name' => '' // Add if you have subject relationship
                ];
            });

        return response()->json(['data' => $attendance]);
    }

    public function getAssignments($studentId)
    {
        $student = User::findOrFail($studentId);

        // Get the student's first batch
        $batchUser = $student->batches()->first();
        if (!$batchUser) {
            return response()->json(['data' => []]);
        }

        $batch = Batch::with([
            'curriculums.curriculum',
            'curriculums.topics.topic',
            'curriculums.topics.assignments' => function ($query) use ($student) {
                $query->with(['teachingMaterialStatuses' => function ($statusQuery) use ($student) {
                    $statusQuery->where('user_id', $student->id);
                }]);
            }
        ])->findOrFail($batchUser->id);

        $exportAssignments = [];
        foreach ($batch->curriculums as $curriculum) {
            foreach ($curriculum->topics as $topic) {
                foreach ($topic->assignments as $assignment) {
                    $status = $assignment->teachingMaterialStatuses->first();
                    $exportAssignments[] = [
                        'Curriculum Name' => $curriculum->curriculum->name ?? '',
                        'Topic Name' => $topic->topic->name ?? '',
                        'Assignment Title' => $assignment->name ?? '',
                        'Description' => $assignment->description ?? '',
                        'Status' => $status ? 'submitted' : 'pending',
                        'Grade' => $status ? $status->obtained_marks : '',
                        'Total Marks' => $assignment->maximum_marks ?? '',
                        'File URL' => $assignment->file ? asset('storage/' . $assignment->file) : '',
                        'Submission Date' => $status ? $status->updated_at : '',
                    ];
                }
            }
        }

        return response()->json(['data' => $exportAssignments]);
    }

    public function getExamResults($studentId)
    {
        $student = User::whereHas('role', function($query) {
            $query->where('name', 'Student');
        })->findOrFail($studentId);
        
        // Check if the user has permission to view this student's data
        // if (!Auth::user()->can('view', $student)) {
        //     return response()->json(['message' => 'Unauthorized'], 403);
        // }

        $examResults = ExamAttempt::where('student_id', $studentId)
            ->with(['exam', 'subject'])
            ->get()
            ->map(function ($result) {
                return [
                    'exam_name' => $result->exam ? $result->exam->name : '',
                    'subject' => $result->subject ? $result->subject->name : '',
                    'exam_date' => $result->ends_at ?? '',
                    'score' => $result->score ?? '',
                    'status' => $result->status ?? '',
                ];
            });

        return response()->json(['data' => $examResults]);
    }
} 