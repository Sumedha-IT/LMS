<?php

namespace App\Http\Controllers\api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class PlacementStudentsController extends Controller
{
    public function __construct()
    {
        // Require authentication for all methods
        $this->middleware('auth:sanctum');
    }

    /**
     * Get all placement students with their education details
     */
    public function index(Request $request)
    {
        try {
            $user = Auth::user();
            
            // Check if user has permission to view placement students
            if (!$user->is_admin && !$user->is_coordinator && !$user->is_placement_coordinator) {
                return response()->json(['error' => 'Unauthorized access'], 403);
            }

            // Start with base query for placement students
            $query = User::with([
                'role',
                'batches' => function($query) {
                    // Use the withoutStudentScope method to bypass the global scope
                    $query->withoutGlobalScope('limited');
                },
                'batches.course_package',
                'studentEducation.degreeType',
                'studentEducation.specialization'
            ])->whereHas('role', function($query) {
                // Include both regular students and placement students
                $query->whereIn('name', ['Student', 'Placement Student']);
            });
            


            // Apply search filters
            if ($request->has('search') && $request->search) {
                $search = $request->search;
                $query->where(function($q) use ($search) {
                    $q->where('name', 'like', "%{$search}%")
                      ->orWhere('email', 'like', "%{$search}%")
                      ->orWhere('phone', 'like', "%{$search}%")
                      ->orWhereHas('batches.course_package', function($courseQuery) use ($search) {
                           $courseQuery->where('name', 'like', "%{$search}%");
                       });
                });
            }

            // Apply course filter
            if ($request->has('course_id') && $request->course_id) {
                $query->whereHas('batches', function($batchQuery) use ($request) {
                    $batchQuery->where('course_package_id', $request->course_id);
                });
            }



            // Apply UG/BTech year range filter
            if ($request->has('ug_year_from') || $request->has('ug_year_to')) {
                $query->whereHas('studentEducation', function($eduQuery) use ($request) {
                    if ($request->has('ug_year_from') && $request->ug_year_from) {
                        $eduQuery->whereYear('duration_to', '>=', $request->ug_year_from);
                    }
                    if ($request->has('ug_year_to') && $request->ug_year_to) {
                        $eduQuery->whereYear('duration_to', '<=', $request->ug_year_to);
                    }
                    $eduQuery->whereHas('degreeType', function($degreeQuery) {
                        $degreeQuery->whereRaw('LOWER(name) LIKE ?', ['%btech%'])
                            ->orWhereRaw('LOWER(name) LIKE ?', ['%bachelor%'])
                            ->orWhereRaw('LOWER(name) LIKE ?', ['%ug%']);
                    });
                });
            }

            // Apply PG/MTech year range filter
            if ($request->has('pg_year_from') || $request->has('pg_year_to')) {
                $query->whereHas('studentEducation', function($eduQuery) use ($request) {
                    if ($request->has('pg_year_from') && $request->pg_year_from) {
                        $eduQuery->whereYear('duration_to', '>=', $request->pg_year_from);
                    }
                    if ($request->has('pg_year_to') && $request->pg_year_to) {
                        $eduQuery->whereYear('duration_to', '<=', $request->pg_year_to);
                    }
                    $eduQuery->whereHas('degreeType', function($degreeQuery) {
                        $degreeQuery->whereRaw('LOWER(name) LIKE ?', ['%mtech%'])
                            ->orWhereRaw('LOWER(name) LIKE ?', ['%master%'])
                            ->orWhereRaw('LOWER(name) LIKE ?', ['%pg%']);
                    });
                });
            }

            // Apply UG/BTech percentage filter
            if ($request->has('ug_percentage') && $request->ug_percentage !== '') {
                $ugPercentage = floatval($request->ug_percentage);
                $query->whereHas('studentEducation', function($eduQuery) use ($ugPercentage) {
                    $eduQuery->where('percentage_cgpa', '>=', $ugPercentage)
                        ->whereHas('degreeType', function($degreeQuery) {
                            $degreeQuery->whereRaw('LOWER(name) LIKE ?', ['%btech%'])
                                ->orWhereRaw('LOWER(name) LIKE ?', ['%bachelor%'])
                                ->orWhereRaw('LOWER(name) LIKE ?', ['%ug%']);
                        });
                });
            }

            // Apply PG/MTech percentage filter
            if ($request->has('pg_percentage') && $request->pg_percentage !== '') {
                $pgPercentage = floatval($request->pg_percentage);
                $query->whereHas('studentEducation', function($eduQuery) use ($pgPercentage) {
                    $eduQuery->where('percentage_cgpa', '>=', $pgPercentage)
                        ->whereHas('degreeType', function($degreeQuery) {
                            $degreeQuery->whereRaw('LOWER(name) LIKE ?', ['%mtech%'])
                                ->orWhereRaw('LOWER(name) LIKE ?', ['%master%'])
                                ->orWhereRaw('LOWER(name) LIKE ?', ['%pg%']);
                        });
                });
            }

            // Apply traditional page-based pagination
            $perPage = min($request->get('per_page', 10), 100); // Cap at 100 to prevent abuse
            $page = $request->get('page', 1);
            
            // Order by id for consistent pagination
            $query->orderBy('users.id', 'asc');
            
            // Optimize query by selecting only necessary fields
            $query->select([
                'users.id',
                'users.name', 
                'users.email',
                'users.phone',
                'users.avatar_url',
                'users.role_id',
                'users.created_at',
                'users.updated_at'
            ]);
            
            // Apply pagination
            $students = $query->paginate($perPage, ['*'], 'page', $page);

            // Transform the data to include calculated fields
            $students->getCollection()->transform(function ($student) {
                // Transform avatar URL to full URL
                if ($student->avatar_url) {
                    $student->avatar_url = $student->getFilamentAvatarUrl();
                }

                // Get course from first batch (load relationship efficiently)
                $student->load(['batches' => function($query) {
                    $query->withoutGlobalScope('limited')->with('course_package');
                }]);
                
                $firstBatch = $student->batches->first();
                if ($firstBatch && $firstBatch->course_package_id) {
                    $course = \App\Models\Course::find($firstBatch->course_package_id);
                    $student->course = $course;
                } else {
                    $student->course = null;
                }

                // Load education data efficiently
                $student->load(['studentEducation.degreeType', 'studentEducation.specialization']);
                
                // Add calculated education summary
                $student->education_summary = $this->getEducationSummary($student);
                
                return $student;
            });

            return response()->json([
                'data' => $students->items(),
                'pagination' => [
                    'current_page' => $students->currentPage(),
                    'last_page' => $students->lastPage(),
                    'per_page' => $students->perPage(),
                    'total' => $students->total(),
                    'from' => $students->firstItem(),
                    'to' => $students->lastItem(),
                    'has_more_pages' => $students->hasMorePages(),
                    'prev_page_url' => $students->previousPageUrl(),
                    'next_page_url' => $students->nextPageUrl()
                ]
            ]);

        } catch (\Exception $e) {
            \Log::error('Error fetching placement students:', [
                'user_id' => Auth::id(),
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);

            return response()->json([
                'success' => false,
                'error' => 'Failed to fetch placement students',
                'message' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get education summary for a student
     */
    private function getEducationSummary($student)
    {
        $summary = [
            'ug_percentage' => null,
            'ug_passout_year' => null,
            'pg_percentage' => null,
            'pg_passout_year' => null,
            'highest_degree' => null
        ];

        if ($student->studentEducation) {
            foreach ($student->studentEducation as $education) {
                $degreeType = strtolower($education->degreeType->name ?? '');
                
                if (str_contains($degreeType, 'btech') || str_contains($degreeType, 'bachelor') || str_contains($degreeType, 'bachelors')) {
                    $summary['ug_percentage'] = $education->percentage_cgpa;
                    $summary['ug_passout_year'] = $education->duration_to ? date('Y', strtotime($education->duration_to)) : null;
                } elseif (str_contains($degreeType, 'mtech') || str_contains($degreeType, 'master') || str_contains($degreeType, 'masters')) {
                    $summary['pg_percentage'] = $education->percentage_cgpa;
                    $summary['pg_passout_year'] = $education->duration_to ? date('Y', strtotime($education->duration_to)) : null;
                }
            }

            // Determine highest degree
            if ($summary['pg_percentage']) {
                $summary['highest_degree'] = 'PG/MTech';
            } elseif ($summary['ug_percentage']) {
                $summary['highest_degree'] = 'UG/BTech';
            }
        }

        return $summary;
    }

    /**
     * Get a specific placement student
     */
    public function show($id)
    {
        try {
            $user = Auth::user();
            
            // Check if user has permission
            if (!$user->is_admin && !$user->is_coordinator && !$user->is_placement_coordinator) {
                return response()->json(['error' => 'Unauthorized access'], 403);
            }

            $student = User::with([
                'role',
                'batches' => function($query) {
                    // Use the withoutStudentScope method to bypass the global scope
                    $query->withoutGlobalScope('limited');
                },
                'batches.course_package',
                'studentEducation.degreeType',
                'studentEducation.specialization'
            ])->whereHas('role', function($query) {
                $query->whereIn('name', ['Student', 'Placement Student']);
            })->find($id);

            if (!$student) {
                return response()->json(['error' => 'Student not found'], 404);
            }

            // Get course from first batch
            $firstBatch = $student->batches->first();
            if ($firstBatch && $firstBatch->course_package_id) {
                $student->course = \App\Models\Course::find($firstBatch->course_package_id);
            } else {
                $student->course = null;
            }

            // Transform avatar URL to full URL
            if ($student->avatar_url) {
                $student->avatar_url = $student->getFilamentAvatarUrl();
            }

            // Add education summary
            $student->education_summary = $this->getEducationSummary($student);

            return response()->json([
                'success' => true,
                'data' => $student
            ]);

        } catch (\Exception $e) {
            \Log::error('Error fetching placement student:', [
                'user_id' => Auth::id(),
                'student_id' => $id,
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);

            return response()->json([
                'success' => false,
                'error' => 'Failed to fetch placement student',
                'message' => $e->getMessage()
            ], 500);
        }
    }
}
