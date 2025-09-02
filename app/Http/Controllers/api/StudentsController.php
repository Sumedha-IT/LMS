<?php

namespace App\Http\Controllers\api;

use App\Http\Controllers\Controller;
use App\Http\Resources\StudentResource;
use App\Models\User;
use App\Models\Attendance;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class StudentsController extends Controller
{
    public function index(Request $req){
        $size = $req->get('size') == 0 ? 25 : $req->get('size');
        $pageNo = $req->get('page', 1);
        $offset = ($pageNo - 1) * $size;



        $students = User::with(['role', 'batches' => function($query) {
            // Use the withoutStudentScope method to bypass the global scope
            $query->withoutGlobalScope('limited');
        }, 'batches.course_package'])->whereHas('role', function($query) {
            $query->where('name', 'Student');
        })->offset($offset)->limit($size)->get();



        return StudentResource::collection($students);
    }

    public function show($id)
    {
        $validator = Validator::make(['id' => $id], [
            'id' => 'integer'
        ]);

        if ($validator->fails()) {
            return response()->json(['message' => 'Student Id must be Integer','hasError'=>true], 400);
        }

        $input = $validator->validated();
        $student = User::with(['role', 'batches' => function($query) {
            // Use the withoutStudentScope method to bypass the global scope
            $query->withoutGlobalScope('limited');
        }, 'batches.course_package'])->whereHas('role', function($query) {
            $query->where('name', 'Student');
        })->where("id",$input['id'])->first();

        if(empty($student)){
            return response()->json(['message' => 'Student not found','hasError'=>false], 404);
        }
        return new StudentResource($student);

    }

    /**
     * Get attendance for a specific student
     */
    public function getAttendance($studentId)
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

            // Get attendance records for the student
            $attendanceRecords = Attendance::where('user_id', $studentId)
                ->orderBy('created_at', 'desc')
                ->get();

            // Calculate attendance percentage
            $totalRecords = $attendanceRecords->count();
            $presentRecords = $attendanceRecords->where('status', 'present')->count();
            $absentRecords = $attendanceRecords->where('status', 'absent')->count();
            $lateRecords = $attendanceRecords->where('status', 'late')->count();

            $attendancePercentage = $totalRecords > 0 ? round(($presentRecords / $totalRecords) * 100, 2) : 0;

            return response()->json([
                'success' => true,
                'data' => $attendanceRecords,
                'summary' => [
                    'total_records' => $totalRecords,
                    'present_records' => $presentRecords,
                    'absent_records' => $absentRecords,
                    'late_records' => $lateRecords,
                    'attendance_percentage' => $attendancePercentage
                ],
                'message' => 'Attendance retrieved successfully'
            ]);

        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    
}
