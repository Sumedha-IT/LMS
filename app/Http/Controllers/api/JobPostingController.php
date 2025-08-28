<?php

namespace App\Http\Controllers\api;

use App\Http\Controllers\Controller;
use App\Models\JobPosting;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class JobPostingController extends Controller
{
    public function __construct()
    {
        // Require authentication for all methods
        $this->middleware('auth:sanctum');
    }

    /**
     * Get all available job postings for students
     */
    public function index(Request $request)
    {
        try {
            $user = \Auth::user();
            
            // Start with base query - show all jobs for admin/coordinator/placement coordinator
            // For students, show only open jobs
            $query = JobPosting::with(['company', 'course', 'postedBy']);
            
            // If user is not admin/coordinator/placement coordinator, filter to show only open jobs
            if (!$user->is_admin && !$user->is_coordinator && !$user->is_placement_coordinator) {
                $query->where('status', 'open');
            }

            // Apply search filters
            $query = $this->applySearchFilters($query, $request);

            // Apply sorting
            $query = $this->applySorting($query, $request);

            // Apply pagination
            $perPage = $request->get('per_page', 10);
            $jobPostings = $query->paginate($perPage);

            return response()->json([
                'data' => $jobPostings->items(),
                'pagination' => [
                    'current_page' => $jobPostings->currentPage(),
                    'last_page' => $jobPostings->lastPage(),
                    'per_page' => $jobPostings->perPage(),
                    'total' => $jobPostings->total(),
                    'from' => $jobPostings->firstItem(),
                    'to' => $jobPostings->lastItem(),
                ],
                'filters_applied' => $this->getAppliedFilters($request)
            ]);

        } catch (\Exception $e) {
            \Log::error('Error in job postings index:', ['error' => $e->getMessage()]);
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    /**
     * Advanced search for job postings
     */
    public function search(Request $request)
    {
        try {
            $query = JobPosting::with(['company', 'course', 'postedBy']);

            // Apply advanced search filters
            $query = $this->applyAdvancedSearchFilters($query, $request);

            // Apply sorting
            $query = $this->applySorting($query, $request);

            // Apply pagination
            $perPage = $request->get('per_page', 10);
            $jobPostings = $query->paginate($perPage);

            return response()->json([
                'data' => $jobPostings->items(),
                'pagination' => [
                    'current_page' => $jobPostings->currentPage(),
                    'last_page' => $jobPostings->lastPage(),
                    'per_page' => $jobPostings->perPage(),
                    'total' => $jobPostings->total(),
                    'from' => $jobPostings->firstItem(),
                    'to' => $jobPostings->lastItem(),
                ],
                'search_criteria' => $this->getSearchCriteria($request)
            ]);

        } catch (\Exception $e) {
            \Log::error('Error in job postings search:', ['error' => $e->getMessage()]);
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    /**
     * Get job posting statistics
     */
    public function getStatistics(Request $request)
    {
        try {
            $query = JobPosting::where('status', 'open');

            // Apply date range filter if provided
            if ($request->filled('date_from')) {
                $query->whereDate('created_at', '>=', $request->get('date_from'));
            }
            if ($request->filled('date_to')) {
                $query->whereDate('created_at', '<=', $request->get('date_to'));
            }

            $totalJobs = $query->count();
            
            // Jobs by course
            $jobsByCourse = $query->with('course')
                                 ->get()
                                 ->groupBy('course.name')
                                 ->map(function ($jobs) {
                                     return $jobs->count();
                                 });

            // Jobs by location
            $jobsByLocation = $query->selectRaw('location, COUNT(*) as count')
                                   ->groupBy('location')
                                   ->pluck('count', 'location');

            // Jobs by experience level
            $jobsByExperience = $query->selectRaw('experience_required, COUNT(*) as count')
                                     ->groupBy('experience_required')
                                     ->pluck('count', 'experience_required');

            return response()->json([
                'total_jobs' => $totalJobs,
                'jobs_by_course' => $jobsByCourse,
                'jobs_by_location' => $jobsByLocation,
                'jobs_by_experience' => $jobsByExperience
            ]);

        } catch (\Exception $e) {
            \Log::error('Error in job postings statistics:', ['error' => $e->getMessage()]);
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    public function show($id)
    {
        try {
            $jobPosting = JobPosting::with(['company', 'course', 'postedBy'])
                                   ->findOrFail($id);
            
            return response()->json([
                'data' => $jobPosting
            ]);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Job posting not found'], 404);
        }
    }

    /**
     * Apply search filters to the query
     */
    private function applySearchFilters($query, Request $request)
    {
        
        // Search by job title or description
        if ($request->filled('search')) {
            $searchTerm = $request->get('search');
            $query->where(function($q) use ($searchTerm) {
                $q->where('title', 'LIKE', "%{$searchTerm}%")
                  ->orWhere('description', 'LIKE', "%{$searchTerm}%")
                  ->orWhere('requirements', 'LIKE', "%{$searchTerm}%");
            });
        }

        // Filter by job type
        if ($request->filled('job_type')) {
            $jobType = $request->get('job_type');
            if (is_array($jobType)) {
                $query->whereIn('job_type', $jobType);
            } else {
                $query->where('job_type', $jobType);
            }
        }

        // Filter by status
        if ($request->filled('status')) {
            $status = $request->get('status');
            $query->where('status', $status);
        }

        // Filter by location
        if ($request->filled('location')) {
            $location = $request->get('location');
            $query->where('location', 'LIKE', "%{$location}%");
        }

        // Filter by course
        if ($request->filled('course_id')) {
            $courseId = $request->get('course_id');
            $query->where('course_id', $courseId);
        }

        // Filter by company
        if ($request->filled('company_id')) {
            $companyId = $request->get('company_id');
            $query->where('company_id', $companyId);
        }

        // Filter by salary range
        if ($request->filled('salary_min')) {
            $query->where('salary_max', '>=', $request->get('salary_min'));
        }

        if ($request->filled('salary_max')) {
            $query->where('salary_min', '<=', $request->get('salary_max'));
        }

        // Filter by experience level
        if ($request->filled('experience_required')) {
            $experience = $request->get('experience_required');
            $query->where('experience_required', 'LIKE', "%{$experience}%");
        }

        // Filter by vacancies
        if ($request->filled('has_vacancies')) {
            $query->where('vacancies', '>', 0);
        }

        return $query;
    }

    /**
     * Apply advanced search filters
     */
    private function applyAdvancedSearchFilters($query, Request $request)
    {
        // Global search
        if ($request->filled('q')) {
            $searchTerm = $request->get('q');
            $query->where(function($q) use ($searchTerm) {
                $q->where('title', 'LIKE', "%{$searchTerm}%")
                  ->orWhere('description', 'LIKE', "%{$searchTerm}%")
                  ->orWhere('requirements', 'LIKE', "%{$searchTerm}%")
                  ->orWhere('location', 'LIKE', "%{$searchTerm}%")
                  ->orWhereHas('company', function($companyQuery) use ($searchTerm) {
                      $companyQuery->where('name', 'LIKE', "%{$searchTerm}%");
                  })
                  ->orWhereHas('course', function($courseQuery) use ($searchTerm) {
                      $courseQuery->where('name', 'LIKE', "%{$searchTerm}%");
                  });
            });
        }

        // Multiple filters
        if ($request->filled('job_types')) {
            $query->whereIn('job_type', $request->get('job_types'));
        }

        if ($request->filled('locations')) {
            $query->whereIn('location', $request->get('locations'));
        }

        if ($request->filled('course_ids')) {
            $query->whereIn('course_id', $request->get('course_ids'));
        }

        if ($request->filled('company_ids')) {
            $query->whereIn('company_id', $request->get('company_ids'));
        }

        // Date range filters
        if ($request->filled('posted_date_from')) {
            $query->whereDate('created_at', '>=', $request->get('posted_date_from'));
        }

        if ($request->filled('posted_date_to')) {
            $query->whereDate('created_at', '<=', $request->get('posted_date_to'));
        }

        if ($request->filled('deadline_from')) {
            $query->whereDate('application_deadline', '>=', $request->get('deadline_from'));
        }

        if ($request->filled('deadline_to')) {
            $query->whereDate('application_deadline', '<=', $request->get('deadline_to'));
        }

        return $query;
    }

    /**
     * Apply sorting to the query
     */
    private function applySorting($query, Request $request)
    {
        $sortBy = $request->get('sort_by', 'created_at');
        $sortOrder = $request->get('sort_order', 'desc');

        // Validate sort fields
        $allowedSortFields = [
            'created_at', 'title', 'location', 'salary_min', 'salary_max', 
            'experience_required', 'application_deadline', 'vacancies'
        ];

        if (in_array($sortBy, $allowedSortFields)) {
            $query->orderBy($sortBy, $sortOrder);
        } else {
            $query->orderBy('created_at', 'desc');
        }

        return $query;
    }

    /**
     * Get applied filters for response
     */
    private function getAppliedFilters(Request $request)
    {
        $filters = [];
        
        if ($request->filled('search')) $filters['search'] = $request->get('search');
        if ($request->filled('job_type')) $filters['job_type'] = $request->get('job_type');
        if ($request->filled('location')) $filters['location'] = $request->get('location');
        if ($request->filled('course_id')) $filters['course_id'] = $request->get('course_id');
        if ($request->filled('company_id')) $filters['company_id'] = $request->get('company_id');
        if ($request->filled('salary_min')) $filters['salary_min'] = $request->get('salary_min');
        if ($request->filled('salary_max')) $filters['salary_max'] = $request->get('salary_max');
        if ($request->filled('experience_required')) $filters['experience_required'] = $request->get('experience_required');
        if ($request->filled('sort_by')) $filters['sort_by'] = $request->get('sort_by');
        if ($request->filled('sort_order')) $filters['sort_order'] = $request->get('sort_order');

        return $filters;
    }

    /**
     * Get search criteria for response
     */
    private function getSearchCriteria(Request $request)
    {
        $criteria = [];
        
        if ($request->filled('q')) $criteria['q'] = $request->get('q');
        if ($request->filled('job_types')) $criteria['job_types'] = $request->get('job_types');
        if ($request->filled('locations')) $criteria['locations'] = $request->get('locations');
        if ($request->filled('course_ids')) $criteria['course_ids'] = $request->get('course_ids');
        if ($request->filled('company_ids')) $criteria['company_ids'] = $request->get('company_ids');
        if ($request->filled('posted_date_from')) $criteria['posted_date_from'] = $request->get('posted_date_from');
        if ($request->filled('posted_date_to')) $criteria['posted_date_to'] = $request->get('posted_date_to');
        if ($request->filled('deadline_from')) $criteria['deadline_from'] = $request->get('deadline_from');
        if ($request->filled('deadline_to')) $criteria['deadline_to'] = $request->get('deadline_to');
        if ($request->filled('sort_by')) $criteria['sort_by'] = $request->get('sort_by');
        if ($request->filled('sort_order')) $criteria['sort_order'] = $request->get('sort_order');

        return $criteria;
    }

    public function store(Request $request)
    {
        try {
            $user = \Auth::user();
            
            // Only admin, coordinator, or placement coordinator can create job postings
            if (!$user->is_admin && !$user->is_coordinator && !$user->is_placement_coordinator) {
                return response()->json(['error' => 'Unauthorized'], 403);
            }
            
            \Log::info('Job posting store request received:', $request->all());
            
            // All job posting data including eligibility criteria fields
            $jobPostingData = $request->only([
                'company_id', 'posted_by', 'title', 'course_id', 'description', 'requirements', 
                'responsibilities', 'job_type', 'location', 'salary_min', 'salary_max', 
                'experience_required', 'vacancies', 'status', 'application_deadline',
                // New fields added to job_postings table
                'eligible_courses', 'specializations', 'backlogs_allowed', 'training_period_stipend',
                'bond_service_agreement', 'mandatory_original_documents', 'recruitment_process_steps',
                'mode_of_recruitment', 'interview_date', 'interview_mode', 'venue_link',
                // Eligibility criteria fields now in main table
                'btech_year_of_passout_min', 'btech_year_of_passout_max',
                'mtech_year_of_passout_min', 'mtech_year_of_passout_max',
                'btech_percentage_min', 'mtech_percentage_min',
                'skills_required', 'additional_criteria'
            ]);
            
            // Handle posted_by field - extract ID if it's an object
            if (isset($jobPostingData['posted_by']) && is_array($jobPostingData['posted_by'])) {
                $jobPostingData['posted_by'] = $jobPostingData['posted_by']['id'] ?? 1;
            }
            
            // Handle application_deadline date format
            if (isset($jobPostingData['application_deadline']) && !empty($jobPostingData['application_deadline'])) {
                try {
                    $date = \Carbon\Carbon::parse($jobPostingData['application_deadline']);
                    $jobPostingData['application_deadline'] = $date->format('Y-m-d H:i:s');
                } catch (\Exception $e) {
                    \Log::warning('Invalid application_deadline format:', ['value' => $jobPostingData['application_deadline']]);
                    unset($jobPostingData['application_deadline']);
                }
            }
            
            // Set default posted_by if not provided (for testing)
            if (!isset($jobPostingData['posted_by'])) {
                $jobPostingData['posted_by'] = 1; // Default user ID
            }
            
            // Convert arrays to JSON strings for JSON fields
            if (isset($jobPostingData['eligible_courses']) && is_array($jobPostingData['eligible_courses'])) {
                // Convert course IDs to course names
                $courseIds = $jobPostingData['eligible_courses'];
                $courses = \App\Models\Course::whereIn('id', $courseIds)->pluck('name')->toArray();
                $jobPostingData['eligible_courses'] = json_encode($courses);
            }
            
            if (isset($jobPostingData['specializations']) && is_array($jobPostingData['specializations'])) {
                $jobPostingData['specializations'] = json_encode($jobPostingData['specializations']);
            }
            
            // Convert skills_required array to JSON if it's an array
            if (isset($jobPostingData['skills_required']) && is_array($jobPostingData['skills_required'])) {
                $jobPostingData['skills_required'] = json_encode($jobPostingData['skills_required']);
            }
            
            // Create job posting with all fields
            $jobPosting = JobPosting::create($jobPostingData);
            
            \Log::info('Job posting created successfully:', $jobPosting->toArray());
            return response()->json($jobPosting, 201);
        } catch (\Exception $e) {
            \Log::error('Error creating job posting:', [
                'message' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    public function update(Request $request, $id)
    {
        try {
            $user = \Auth::user();
            
            // Only admin, coordinator, or placement coordinator can update job postings
            if (!$user->is_admin && !$user->is_coordinator && !$user->is_placement_coordinator) {
                return response()->json(['error' => 'Unauthorized'], 403);
            }
            
            $jobPosting = JobPosting::findOrFail($id);
            
            // All job posting data including eligibility criteria fields
            $jobPostingData = $request->only([
                'company_id', 'posted_by', 'title', 'course_id', 'description', 'requirements', 
                'responsibilities', 'job_type', 'location', 'salary_min', 'salary_max', 
                'experience_required', 'vacancies', 'status', 'application_deadline',
                // New fields added to job_postings table
                'eligible_courses', 'specializations', 'backlogs_allowed', 'training_period_stipend',
                'bond_service_agreement', 'mandatory_original_documents', 'recruitment_process_steps',
                'mode_of_recruitment', 'interview_date', 'interview_mode', 'venue_link',
                // Eligibility criteria fields now in main table
                'btech_year_of_passout_min', 'btech_year_of_passout_max',
                'mtech_year_of_passout_min', 'mtech_year_of_passout_max',
                'btech_percentage_min', 'mtech_percentage_min',
                'skills_required', 'additional_criteria'
            ]);
            
            // Handle posted_by field - extract ID if it's an object
            if (isset($jobPostingData['posted_by']) && is_array($jobPostingData['posted_by'])) {
                $jobPostingData['posted_by'] = $jobPostingData['posted_by']['id'] ?? 1;
            }
            
            // Handle application_deadline date format
            if (isset($jobPostingData['application_deadline']) && !empty($jobPostingData['application_deadline'])) {
                try {
                    $date = \Carbon\Carbon::parse($jobPostingData['application_deadline']);
                    $jobPostingData['application_deadline'] = $date->format('Y-m-d H:i:s');
                } catch (\Exception $e) {
                    \Log::warning('Invalid application_deadline format:', ['value' => $jobPostingData['application_deadline']]);
                    unset($jobPostingData['application_deadline']);
                }
            }
            
            // Convert arrays to JSON strings for JSON fields
            if (isset($jobPostingData['eligible_courses']) && is_array($jobPostingData['eligible_courses'])) {
                // Convert course IDs to course names
                $courseIds = $jobPostingData['eligible_courses'];
                $courses = \App\Models\Course::whereIn('id', $courseIds)->pluck('name')->toArray();
                $jobPostingData['eligible_courses'] = json_encode($courses);
            }
            
            if (isset($jobPostingData['specializations']) && is_array($jobPostingData['specializations'])) {
                $jobPostingData['specializations'] = json_encode($jobPostingData['specializations']);
            }
            
            // Convert skills_required array to JSON if it's an array
            if (isset($jobPostingData['skills_required']) && is_array($jobPostingData['skills_required'])) {
                $jobPostingData['skills_required'] = json_encode($jobPostingData['skills_required']);
            }
            
            // Update job posting with all fields
            $jobPosting->update($jobPostingData);
            
            return response()->json($jobPosting);
        } catch (\Exception $e) {
            \Log::error('Error updating job posting:', [
                'message' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    public function destroy($id)
    {
        try {
            $user = \Auth::user();
            
            // Only admin, coordinator, or placement coordinator can delete job postings
            if (!$user->is_admin && !$user->is_coordinator && !$user->is_placement_coordinator) {
                return response()->json(['error' => 'Unauthorized'], 403);
            }
            
            \Log::info('Attempting to delete job posting', ['id' => $id]);
            
            $jobPosting = JobPosting::with(['applications'])->findOrFail($id);
            
            // Delete related applications first
            if ($jobPosting->applications && $jobPosting->applications->count() > 0) {
                \Log::info('Deleting related applications', ['count' => $jobPosting->applications->count()]);
                $jobPosting->applications()->delete();
            }
            
            // Delete the job posting
            $jobPosting->delete();
            
            \Log::info('Job posting deleted successfully', ['id' => $id]);
            return response()->json(['message' => 'Job posting deleted successfully'], 200);
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            \Log::warning('Job posting not found for deletion', ['id' => $id]);
            return response()->json(['error' => 'Job posting not found'], 404);
        } catch (\Exception $e) {
            \Log::error('Error deleting job posting', [
                'id' => $id,
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            return response()->json(['error' => 'Failed to delete job posting: ' . $e->getMessage()], 500);
        }
    }

    /**
     * Filter job postings by company name and date range
     */
    public function filterByCompanyAndDate(Request $request)
    {
        try {
            // Validate request parameters
            $validated = $request->validate([
                'company_name' => 'nullable|string|max:255',
                'start_date' => 'nullable|date',
                'end_date' => 'nullable|date|after_or_equal:start_date',
                'per_page' => 'nullable|integer|min:1|max:100',
                'sort_by' => 'nullable|string|in:created_at,title,salary_min,salary_max,application_deadline',
                'sort_order' => 'nullable|string|in:asc,desc'
            ]);

            // Start with base query - show all jobs for admin
            $query = JobPosting::with(['company', 'course', 'postedBy']);

            // Filter by company name
            if (!empty($validated['company_name'])) {
                $query->whereHas('company', function($q) use ($validated) {
                    $q->where('name', 'LIKE', '%' . $validated['company_name'] . '%');
                });
            }

            // Filter by date range
            if (!empty($validated['start_date'])) {
                $query->where('created_at', '>=', $validated['start_date']);
            }

            if (!empty($validated['end_date'])) {
                $query->where('created_at', '<=', $validated['end_date'] . ' 23:59:59');
            }

            // Apply sorting
            $sortBy = $validated['sort_by'] ?? 'created_at';
            $sortOrder = $validated['sort_order'] ?? 'desc';
            $query->orderBy($sortBy, $sortOrder);

            // Apply pagination
            $perPage = $validated['per_page'] ?? 10;
            $jobPostings = $query->paginate($perPage);

            // Get applied filters for response
            $appliedFilters = [];
            if (!empty($validated['company_name'])) {
                $appliedFilters['company_name'] = $validated['company_name'];
            }
            if (!empty($validated['start_date'])) {
                $appliedFilters['start_date'] = $validated['start_date'];
            }
            if (!empty($validated['end_date'])) {
                $appliedFilters['end_date'] = $validated['end_date'];
            }

            return response()->json([
                'success' => true,
                'message' => 'Job postings filtered successfully',
                'data' => $jobPostings->items(),
                'pagination' => [
                    'current_page' => $jobPostings->currentPage(),
                    'last_page' => $jobPostings->lastPage(),
                    'per_page' => $jobPostings->perPage(),
                    'total' => $jobPostings->total(),
                    'from' => $jobPostings->firstItem(),
                    'to' => $jobPostings->lastItem(),
                ],
                'filters_applied' => $appliedFilters,
                'sorting' => [
                    'sort_by' => $sortBy,
                    'sort_order' => $sortOrder
                ]
            ]);

        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $e->errors()
            ], 422);
        } catch (\Exception $e) {
            \Log::error('Error in filterByCompanyAndDate:', ['error' => $e->getMessage()]);
            return response()->json([
                'success' => false,
                'message' => 'An error occurred while filtering job postings',
                'error' => $e->getMessage()
            ], 500);
        }
    }
} 