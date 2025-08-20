<?php

namespace App\Http\Controllers\api;

use App\Http\Controllers\Controller;
use App\Models\BatchCurriculum;
use App\Models\Curriculum;
use App\Models\Course;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Validator;
use App\Models\CourseStudent;
use App\Models\Topic;

class MyCourseController extends Controller
{
    public function index(Request $request, $id)
    {
        try {
            // Validate the ID parameter
            $validator = Validator::make(['id' => $id], [
                'id' => 'required|integer'
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'message' => 'Invalid user ID',
                    'errors' => $validator->errors()
                ], 422);
            }

            // Log the incoming request headers for debugging
            Log::info('Request headers:', [
                'Authorization' => $request->header('Authorization'),
                'Accept' => $request->header('Accept'),
                'Content-Type' => $request->header('Content-Type'),
                'user_id' => $id
            ]);

            $user = Auth::user();

            if (!$user) {
                Log::error('User not authenticated in MyCourseController');
                return response()->json(['message' => 'User not authenticated'], 401);
            }

            // Verify that the authenticated user matches the requested ID
            if ($user->id != $id) {
                Log::error('User ID mismatch', [
                    'auth_user_id' => $user->id,
                    'requested_id' => $id
                ]);
                return response()->json(['message' => 'Unauthorized access'], 403);
            }



            // Get the user's assigned batches and their courses
            $courses = Course::select('courses.*')
                ->leftJoin('batches as course_batches', function($join) {
                    $join->on('courses.id', '=', 'course_batches.course_package_id')
                        ->orOn('courses.id', '=', 'course_batches.course_id');
                })
                ->leftJoin('batch_user as student_enrollments', function($join) {
                    $join->on('course_batches.id', '=', 'student_enrollments.batch_id');
                })
                ->where(function($query) use ($user) {
                    $query->where('student_enrollments.user_id', $user->id)
                        // ->where('student_enrollments.role_id', 6) // Commented out due to missing column. Fix this condition according to your database schema for student role check.
                        ->whereNotNull('student_enrollments.batch_id');
                })
                ->orWhere(function($query) {
                    $query->whereNull('course_batches.course_package_id')
                        ->whereNull('course_batches.course_id');
                })
                ->distinct()
                ->get();

            if ($courses->isEmpty()) {
                Log::info('No courses found for user: ' . $user->id);
                return response()->json([
                    'message' => 'No courses found',
                    'courses' => []
                ], 200);
            }

            // Transform the data into the required format
            $formattedCourses = $courses->map(function ($course) {
                $curriculums = BatchCurriculum::whereHas('batch', function($query) use ($course) {
                    $query->where('course_package_id', $course->id)
                        ->orWhere('course_id', $course->id);
                })
                ->with(['curriculum', 'tutor'])
                ->get()
                ->map(function ($batchCurriculum) {
                    // Check if curriculum exists before accessing its properties
                    if (!$batchCurriculum->curriculum) {
                        Log::warning('BatchCurriculum has no curriculum', [
                            'batch_curriculum_id' => $batchCurriculum->id,
                            'curriculum_id' => $batchCurriculum->curriculum_id
                        ]);
                        return null; // Skip this curriculum
                    }
                    
                    return [
                        'id' => $batchCurriculum->curriculum->id,
                        'name' => $batchCurriculum->curriculum->name,
                        'image' => $batchCurriculum->curriculum->image ? asset('storage/' . $batchCurriculum->curriculum->image) : null,
                        'tutor' => $batchCurriculum->tutor ? [
                            'id' => $batchCurriculum->tutor->id,
                            'name' => $batchCurriculum->tutor->name
                        ] : null,
                        'topics' => []
                    ];
                })
                ->filter(function ($curriculum) {
                    return $curriculum !== null; // Remove null entries
                });

                return [
                    'id' => $course->id,
                    'name' => $course->name,
                    'is_live_course' => true,
                    'progress' => 0,
                    'curriculums' => $curriculums
                ];
            });

            Log::info('Successfully retrieved ' . $formattedCourses->count() . ' courses for user: ' . $user->id);

            return response()->json([
                'courses' => $formattedCourses,
                'total' => $formattedCourses->count()
            ]);

        } catch (\Exception $e) {
            Log::error('Error in MyCourseController: ' . $e->getMessage(), [
                'exception' => $e,
                'user_id' => $id,
                'request' => $request->all(),
                'headers' => $request->headers->all()
            ]);
            return response()->json(['message' => 'Failed to fetch courses'], 500);
        }
    }

    public function getTopics(Request $request)
    {
        try {
            $curriculumId = $request->query('curriculum_id');

            if (!$curriculumId) {
                return response()->json(['message' => 'Curriculum ID is required'], 400);
            }

            $topics = Topic::where('curriculum_id', $curriculumId)
                ->select('id', 'name', 'created_at', 'updated_at')
                ->get()
                ->map(function ($topic) {
                    return [
                        'id' => $topic->id,
                        'name' => $topic->name,
                        'is_completed' => false // You can add logic here to check if topic is completed
                    ];
                });

            return response()->json($topics);

        } catch (\Exception $e) {
            Log::error('Error in getTopics: ' . $e->getMessage());
            return response()->json(['message' => 'Failed to fetch topics'], 500);
        }
    }
}
