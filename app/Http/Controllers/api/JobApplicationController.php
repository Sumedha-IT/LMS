<?php

namespace App\Http\Controllers\api;

use App\Http\Controllers\Controller;
use App\Models\JobApplication;
use App\Services\ProfileCompletionService;
use Illuminate\Http\Request;

class JobApplicationController extends Controller
{
    protected $profileCompletionService;

    public function __construct(ProfileCompletionService $profileCompletionService)
    {
        $this->profileCompletionService = $profileCompletionService;
        // Add authentication middleware for all methods
        $this->middleware('auth:sanctum');
    }

    public function index(Request $request)
    {
        try {
            $user = \Auth::user();
            
            // Check if user has admin/coordinator/placement coordinator permissions
            // OR if they are requesting their own applications (students)
            if (!$user->is_admin && !$user->is_coordinator && !$user->is_placement_coordinator) {
                // If it's a student, they can only view their own applications
                if ($request->filled('user_id') && $request->get('user_id') == $user->id) {
                    // Allow access to own applications
                } else {
                    return response()->json(['error' => 'Unauthorized'], 403);
                }
            }
            
            // Test if job_applications table exists
            $tableExists = \Schema::hasTable('job_applications');
            
            if (!$tableExists) {
                return response()->json(['error' => 'Job applications table does not exist'], 500);
            }

            // Start with base query
            $query = JobApplication::with(['jobPosting.company', 'jobPosting.course', 'user']);

            // Apply search filters
            $query = $this->applySearchFilters($query, $request);

            // Apply sorting
            $query = $this->applySorting($query, $request);

            // Apply pagination
            $perPage = $request->get('per_page', 15);
            $applications = $query->paginate($perPage);

            // Transform avatar URLs for users in applications
            $applications->getCollection()->transform(function ($application) {
                if ($application->user && $application->user->avatar_url) {
                    $application->user->avatar_url = $application->user->getFilamentAvatarUrl();
                }
                return $application;
            });

            return response()->json([
                'data' => $applications->items(),
                'pagination' => [
                    'current_page' => $applications->currentPage(),
                    'last_page' => $applications->lastPage(),
                    'per_page' => $applications->perPage(),
                    'total' => $applications->total(),
                    'from' => $applications->firstItem(),
                    'to' => $applications->lastItem(),
                ],
                'filters_applied' => $this->getAppliedFilters($request)
            ]);

        } catch (\Exception $e) {
            \Log::error('Error in job applications index:', ['error' => $e->getMessage()]);
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    /**
     * Apply search filters to the query
     */
    private function applySearchFilters($query, Request $request)
    {
        // Search by student name or email
        if ($request->filled('search')) {
            $searchTerm = $request->get('search');
            
            $query->whereHas('user', function ($q) use ($searchTerm) {
                $q->where(function($subQuery) use ($searchTerm) {
                    $subQuery->where('name', 'LIKE', "%{$searchTerm}%")
                             ->orWhere('email', 'LIKE', "%{$searchTerm}%");
                });
            });
        }

        // Filter by application status
        if ($request->filled('status')) {
            $status = $request->get('status');
            if (is_array($status)) {
                $query->whereIn('status', $status);
            } else {
                $query->where('status', $status);
            }
        }

        // Filter by job posting title
        if ($request->filled('job_title')) {
            $jobTitle = $request->get('job_title');
            $query->whereHas('jobPosting', function ($q) use ($jobTitle) {
                $q->where('title', 'LIKE', "%{$jobTitle}%");
            });
        }

        // Filter by company name
        if ($request->filled('company')) {
            $companyName = $request->get('company');
            $query->whereHas('jobPosting.company', function ($q) use ($companyName) {
                $q->where('name', 'LIKE', "%{$companyName}%");
            });
        }

        // Filter by course
        if ($request->filled('course')) {
            $courseId = $request->get('course');
            $query->whereHas('jobPosting', function ($q) use ($courseId) {
                $q->where('course_id', $courseId);
            });
        }

        // Filter by application date range
        if ($request->filled('date_from')) {
            $query->whereDate('application_date', '>=', $request->get('date_from'));
        }

        if ($request->filled('date_to')) {
            $query->whereDate('application_date', '<=', $request->get('date_to'));
        }

        // Filter by specific student
        if ($request->filled('user_id')) {
            $query->where('user_id', $request->get('user_id'));
        }

        // Filter by specific job posting
        if ($request->filled('job_posting_id')) {
            $query->where('job_posting_id', $request->get('job_posting_id'));
        }

        // Filter by interview date range
        if ($request->filled('interview_date_from')) {
            $query->whereDate('interview_date', '>=', $request->get('interview_date_from'));
        }

        if ($request->filled('interview_date_to')) {
            $query->whereDate('interview_date', '<=', $request->get('interview_date_to'));
        }

        return $query;
    }

    /**
     * Apply sorting to the query
     */
    private function applySorting($query, Request $request)
    {
        $sortBy = $request->get('sort_by', 'application_date');
        $sortOrder = $request->get('sort_order', 'desc');

        // Validate sort fields
        $allowedSortFields = [
            'application_date', 'status', 'interview_date', 'selection_date',
            'created_at', 'updated_at'
        ];

        if (!in_array($sortBy, $allowedSortFields)) {
            $sortBy = 'application_date';
        }

        $sortOrder = strtolower($sortOrder) === 'asc' ? 'asc' : 'desc';

        return $query->orderBy($sortBy, $sortOrder);
    }

    /**
     * Get applied filters for response
     */
    private function getAppliedFilters(Request $request)
    {
        $filters = [];
        
        if ($request->filled('search')) $filters['search'] = $request->get('search');
        if ($request->filled('status')) $filters['status'] = $request->get('status');
        if ($request->filled('job_title')) $filters['job_title'] = $request->get('job_title');
        if ($request->filled('company')) $filters['company'] = $request->get('company');
        if ($request->filled('course')) $filters['course'] = $request->get('course');
        if ($request->filled('date_from')) $filters['date_from'] = $request->get('date_from');
        if ($request->filled('date_to')) $filters['date_to'] = $request->get('date_to');
        if ($request->filled('user_id')) $filters['user_id'] = $request->get('user_id');
        if ($request->filled('job_posting_id')) $filters['job_posting_id'] = $request->get('job_posting_id');

        return $filters;
    }

    public function show($id)
    {
        try {
            $user = \Auth::user();
            $jobApplication = JobApplication::with('jobPosting', 'user')->findOrFail($id);
            
            // Check if user has admin/coordinator/placement coordinator permissions
            // OR if they are viewing their own application (students)
            if (!$user->is_admin && !$user->is_coordinator && !$user->is_placement_coordinator) {
                if ($jobApplication->user_id != $user->id) {
                    return response()->json(['error' => 'Unauthorized'], 403);
                }
            }
            
            // Transform avatar URL for user in application
            if ($jobApplication->user && $jobApplication->user->avatar_url) {
                $jobApplication->user->avatar_url = $jobApplication->user->getFilamentAvatarUrl();
            }
            
            return response()->json($jobApplication);
        } catch (\Exception $e) {
            \Log::error('Error in job application show:', ['error' => $e->getMessage()]);
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    public function store(Request $request)
    {
        try {
            
            // Get the authenticated user
            $user = auth()->user();
            if (!$user) {
                return response()->json(['error' => 'Authentication required'], 401);
            }

            // Check if user is a student
            if (!$user->is_student && !$user->is_placement_student) {
                return response()->json(['error' => 'Only students can apply for jobs'], 403);
            }

            // Validate profile completion before allowing application
            $profileValidation = $this->profileCompletionService->canApplyForPlacements($user);
            
            if (!$profileValidation['can_apply']) {
                return response()->json([
                    'error' => 'Profile completion requirement not met',
                    'message' => $profileValidation['message'],
                    'completion_percentage' => $profileValidation['completion_percentage'],
                    'missing_sections' => $profileValidation['missing_sections'],
                    'required_percentage' => 100
                ], 422);
            }

            // Check if user has already applied for this job
            $existingApplication = JobApplication::where('user_id', $user->id)
                ->where('job_posting_id', $request->job_posting_id)
                ->first();

            if ($existingApplication) {
                return response()->json([
                    'error' => 'You have already applied for this job',
                    'application_id' => $existingApplication->id
                ], 409);
            }

            // Create the job application
            $jobApplication = JobApplication::create([
                'job_posting_id' => $request->job_posting_id,
                'user_id' => $user->id,
                'status' => 'applied',
                'application_date' => now(),
            ]);

            return response()->json([
                'message' => 'Job application submitted successfully',
                'data' => $jobApplication
            ], 201);
            
        } catch (\Exception $e) {
            \Log::error('Error creating job application:', [
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
            $jobApplication = JobApplication::findOrFail($id);
            
            // Check if user has admin/coordinator/placement coordinator permissions
            // OR if they are updating their own application (students)
            if (!$user->is_admin && !$user->is_coordinator && !$user->is_placement_coordinator) {
                if ($jobApplication->user_id != $user->id) {
                    return response()->json(['error' => 'Unauthorized'], 403);
                }
            }
            
            $jobApplication->update($request->all());
            return response()->json($jobApplication);
        } catch (\Exception $e) {
            \Log::error('Error updating job application:', ['error' => $e->getMessage()]);
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    public function destroy($id)
    {
        try {
            $user = \Auth::user();
            $jobApplication = JobApplication::findOrFail($id);
            
            // Check if user has admin/coordinator/placement coordinator permissions
            // OR if they are deleting their own application (students)
            if (!$user->is_admin && !$user->is_coordinator && !$user->is_placement_coordinator) {
                if ($jobApplication->user_id != $user->id) {
                    return response()->json(['error' => 'Unauthorized'], 403);
                }
            }
            
            $jobApplication->delete();
            return response()->json(null, 204);
        } catch (\Exception $e) {
            \Log::error('Error deleting job application:', ['error' => $e->getMessage()]);
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    /**
     * Advanced search for job applications
     */
    public function search(Request $request)
    {
        try {
            $user = \Auth::user();
            
            // Check if user has admin/coordinator/placement coordinator permissions
            // OR if they are searching their own applications (students)
            if (!$user->is_admin && !$user->is_coordinator && !$user->is_placement_coordinator) {
                // If it's a student, they can only search their own applications
                if ($request->filled('user_id') && $request->get('user_id') == $user->id) {
                    // Allow access to own applications
                } else {
                    return response()->json(['error' => 'Unauthorized'], 403);
                }
            }
            
            $query = JobApplication::with(['jobPosting.company', 'jobPosting.course', 'user']);

            // Apply advanced search filters
            $query = $this->applyAdvancedSearchFilters($query, $request);

            // Apply sorting
            $query = $this->applySorting($query, $request);

            // Apply pagination
            $perPage = $request->get('per_page', 15);
            $applications = $query->paginate($perPage);

            return response()->json([
                'data' => $applications->items(),
                'pagination' => [
                    'current_page' => $applications->currentPage(),
                    'last_page' => $applications->lastPage(),
                    'per_page' => $applications->perPage(),
                    'total' => $applications->total(),
                    'from' => $applications->firstItem(),
                    'to' => $applications->lastItem(),
                ],
                'search_criteria' => $this->getSearchCriteria($request)
            ]);

        } catch (\Exception $e) {
            \Log::error('Error in job applications search:', ['error' => $e->getMessage()]);
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    /**
     * Apply advanced search filters
     */
    private function applyAdvancedSearchFilters($query, Request $request)
    {
        // Global search across multiple fields
        if ($request->filled('q')) {
            $searchTerm = $request->get('q');
            $query->where(function ($q) use ($searchTerm) {
                // Search in user details
                $q->whereHas('user', function ($userQuery) use ($searchTerm) {
                    $userQuery->where('name', 'LIKE', "%{$searchTerm}%")
                              ->orWhere('email', 'LIKE', "%{$searchTerm}%")
                              ->orWhere('phone', 'LIKE', "%{$searchTerm}%");
                })
                // Search in job posting details
                ->orWhereHas('jobPosting', function ($jobQuery) use ($searchTerm) {
                    $jobQuery->where('title', 'LIKE', "%{$searchTerm}%")
                             ->orWhere('description', 'LIKE', "%{$searchTerm}%");
                })
                // Search in company details
                ->orWhereHas('jobPosting.company', function ($companyQuery) use ($searchTerm) {
                    $companyQuery->where('name', 'LIKE', "%{$searchTerm}%")
                                 ->orWhere('location', 'LIKE', "%{$searchTerm}%");
                })
                // Search in application notes
                ->orWhere('notes', 'LIKE', "%{$searchTerm}%")
                ->orWhere('rejection_reason', 'LIKE', "%{$searchTerm}%");
            });
        }

        // Status filters
        if ($request->filled('statuses')) {
            $statuses = $request->get('statuses');
            if (is_array($statuses)) {
                $query->whereIn('status', $statuses);
            }
        }

        // Date range filters
        if ($request->filled('application_date_from')) {
            $query->whereDate('application_date', '>=', $request->get('application_date_from'));
        }

        if ($request->filled('application_date_to')) {
            $query->whereDate('application_date', '<=', $request->get('application_date_to'));
        }

        if ($request->filled('interview_date_from')) {
            $query->whereDate('interview_date', '>=', $request->get('interview_date_from'));
        }

        if ($request->filled('interview_date_to')) {
            $query->whereDate('interview_date', '<=', $request->get('interview_date_to'));
        }

        // Multiple user IDs
        if ($request->filled('user_ids')) {
            $userIds = $request->get('user_ids');
            if (is_array($userIds)) {
                $query->whereIn('user_id', $userIds);
            }
        }

        // Multiple job posting IDs
        if ($request->filled('job_posting_ids')) {
            $jobPostingIds = $request->get('job_posting_ids');
            if (is_array($jobPostingIds)) {
                $query->whereIn('job_posting_id', $jobPostingIds);
            }
        }

        // Course filters
        if ($request->filled('course_ids')) {
            $courseIds = $request->get('course_ids');
            if (is_array($courseIds)) {
                $query->whereHas('jobPosting', function ($q) use ($courseIds) {
                    $q->whereIn('course_id', $courseIds);
                });
            }
        }

        // Company filters
        if ($request->filled('company_ids')) {
            $companyIds = $request->get('company_ids');
            if (is_array($companyIds)) {
                $query->whereHas('jobPosting', function ($q) use ($companyIds) {
                    $q->whereIn('company_id', $companyIds);
                });
            }
        }

        // Has interview scheduled
        if ($request->filled('has_interview')) {
            if ($request->get('has_interview') === 'true') {
                $query->whereNotNull('interview_date');
            } else {
                $query->whereNull('interview_date');
            }
        }

        // Has rejection reason
        if ($request->filled('has_rejection_reason')) {
            if ($request->get('has_rejection_reason') === 'true') {
                $query->whereNotNull('rejection_reason');
            } else {
                $query->whereNull('rejection_reason');
            }
        }

        return $query;
    }

    /**
     * Get search criteria for response
     */
    private function getSearchCriteria(Request $request)
    {
        $criteria = [];
        
        if ($request->filled('q')) $criteria['global_search'] = $request->get('q');
        if ($request->filled('statuses')) $criteria['statuses'] = $request->get('statuses');
        if ($request->filled('application_date_from')) $criteria['application_date_from'] = $request->get('application_date_from');
        if ($request->filled('application_date_to')) $criteria['application_date_to'] = $request->get('application_date_to');
        if ($request->filled('interview_date_from')) $criteria['interview_date_from'] = $request->get('interview_date_from');
        if ($request->filled('interview_date_to')) $criteria['interview_date_to'] = $request->get('interview_date_to');
        if ($request->filled('user_ids')) $criteria['user_ids'] = $request->get('user_ids');
        if ($request->filled('job_posting_ids')) $criteria['job_posting_ids'] = $request->get('job_posting_ids');
        if ($request->filled('course_ids')) $criteria['course_ids'] = $request->get('course_ids');
        if ($request->filled('company_ids')) $criteria['company_ids'] = $request->get('company_ids');
        if ($request->filled('has_interview')) $criteria['has_interview'] = $request->get('has_interview');
        if ($request->filled('has_rejection_reason')) $criteria['has_rejection_reason'] = $request->get('has_rejection_reason');

        return $criteria;
    }

    /**
     * Get application statistics
     */
    public function getStatistics(Request $request)
    {
        try {
            $user = \Auth::user();
            
            // Only admin, coordinator, or placement coordinator can view statistics
            if (!$user->is_admin && !$user->is_coordinator && !$user->is_placement_coordinator) {
                return response()->json(['error' => 'Unauthorized'], 403);
            }
            
            // Create date filter conditions
            $dateConditions = [];
            if ($request->filled('date_from')) {
                $dateConditions[] = ['application_date', '>=', $request->get('date_from')];
            }
            if ($request->filled('date_to')) {
                $dateConditions[] = ['application_date', '<=', $request->get('date_to')];
            }

            // Get total applications
            $totalApplications = JobApplication::where($dateConditions)->count();

            // Get status counts
            $statusCounts = JobApplication::where($dateConditions)
                                         ->selectRaw('status, COUNT(*) as count')
                                         ->groupBy('status')
                                         ->pluck('count', 'status')
                                         ->toArray();

            // Get applications by course
            $applicationsByCourse = JobApplication::where($dateConditions)
                                                 ->join('job_postings', 'job_applications.job_posting_id', '=', 'job_postings.id')
                                                 ->join('courses', 'job_postings.course_id', '=', 'courses.id')
                                                 ->selectRaw('courses.name as course_name, COUNT(*) as course_count')
                                                 ->groupBy('courses.id', 'courses.name')
                                                 ->pluck('course_count', 'course_name')
                                                 ->toArray();

            // Get applications by company
            $applicationsByCompany = JobApplication::where($dateConditions)
                                                  ->join('job_postings', 'job_applications.job_posting_id', '=', 'job_postings.id')
                                                  ->join('companies', 'job_postings.company_id', '=', 'companies.id')
                                                  ->selectRaw('companies.name as company_name, COUNT(*) as company_count')
                                                  ->groupBy('companies.id', 'companies.name')
                                                  ->pluck('company_count', 'company_name')
                                                  ->toArray();

            return response()->json([
                'total_applications' => $totalApplications,
                'status_breakdown' => $statusCounts,
                'applications_by_course' => $applicationsByCourse,
                'applications_by_company' => $applicationsByCompany,
                'date_range' => [
                    'from' => $request->get('date_from'),
                    'to' => $request->get('date_to')
                ]
            ]);

        } catch (\Exception $e) {
            \Log::error('Error getting job application statistics:', ['error' => $e->getMessage()]);
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    /**
     * Filter job applications by job posting ID and search by company name or date range
     */
    public function filterByJobPostingAndSearch(Request $request, $job_posting_id)
    {
        try {
            $user = \Auth::user();
            
            // Only admin, coordinator, or placement coordinator can filter applications
            if (!$user->is_admin && !$user->is_coordinator && !$user->is_placement_coordinator) {
                return response()->json(['error' => 'Unauthorized'], 403);
            }
            
            // Validate request parameters
            $validated = $request->validate([
                'company_name' => 'nullable|string|max:255',
                'start_date' => 'nullable|date',
                'end_date' => 'nullable|date|after_or_equal:start_date',
                'per_page' => 'nullable|integer|min:1|max:100',
                'sort_by' => 'nullable|string|in:created_at,application_date,status,user.name',
                'sort_order' => 'nullable|string|in:asc,desc'
            ]);

            // Start with base query - filter by job posting ID
            $query = JobApplication::with(['jobPosting.company', 'jobPosting.course', 'user'])
                                  ->where('job_posting_id', $job_posting_id);

            // Filter by company name
            if (!empty($validated['company_name'])) {
                $query->whereHas('jobPosting.company', function($q) use ($validated) {
                    $q->where('name', 'LIKE', '%' . $validated['company_name'] . '%');
                });
            }

            // Filter by application date range
            if (!empty($validated['start_date'])) {
                $query->where('application_date', '>=', $validated['start_date']);
            }

            if (!empty($validated['end_date'])) {
                $query->where('application_date', '<=', $validated['end_date'] . ' 23:59:59');
            }

            // Apply sorting
            $sortBy = $validated['sort_by'] ?? 'created_at';
            $sortOrder = $validated['sort_order'] ?? 'desc';
            
            // Handle special sorting for user name
            if ($sortBy === 'user.name') {
                $query->join('users', 'job_applications.user_id', '=', 'users.id')
                      ->orderBy('users.name', $sortOrder)
                      ->select('job_applications.*');
            } else {
                $query->orderBy($sortBy, $sortOrder);
            }

            // Apply pagination
            $perPage = $validated['per_page'] ?? 10;
            $applications = $query->paginate($perPage);

            // Transform avatar URLs for users in applications
            $applications->getCollection()->transform(function ($application) {
                if ($application->user && $application->user->avatar_url) {
                    $application->user->avatar_url = $application->user->getFilamentAvatarUrl();
                }
                return $application;
            });

            // Get applied filters for response
            $appliedFilters = ['job_posting_id' => $job_posting_id];
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
                'message' => 'Job applications filtered successfully',
                'job_posting_id' => $job_posting_id,
                'data' => $applications->items(),
                'pagination' => [
                    'current_page' => $applications->currentPage(),
                    'last_page' => $applications->lastPage(),
                    'per_page' => $applications->perPage(),
                    'total' => $applications->total(),
                    'from' => $applications->firstItem(),
                    'to' => $applications->lastItem(),
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
            \Log::error('Error in filterByJobPostingAndSearch:', [
                'job_posting_id' => $job_posting_id,
                'error' => $e->getMessage()
            ]);
            return response()->json([
                'success' => false,
                'message' => 'An error occurred while filtering job applications',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Bulk update job application statuses
     */
    public function bulkUpdate(Request $request)
    {
        try {
            $user = \Auth::user();
            
            // Check if user has admin/coordinator/placement coordinator permissions
            if (!$user->is_admin && !$user->is_coordinator && !$user->is_placement_coordinator) {
                return response()->json(['error' => 'Unauthorized'], 403);
            }
            
            // Validate request
            $request->validate([
                'application_ids' => 'required|array',
                'application_ids.*' => 'required|integer|exists:job_applications,id',
                'status' => 'required|string|in:applied,shortlisted,interview_scheduled,interviewed,selected,selected_not_joined,rejected,withdrawn',
                'job_posting_id' => 'required|integer|exists:job_postings,id',
                'rejection_reason' => 'nullable|string|max:1000'
            ]);

            $applicationIds = $request->application_ids;
            $newStatus = $request->status;
            $jobPostingId = $request->job_posting_id;
            $rejectionReason = $request->rejection_reason;

            // Get the applications to update
            $applications = JobApplication::whereIn('id', $applicationIds)
                ->where('job_posting_id', $jobPostingId)
                ->with(['user', 'jobPosting.company'])
                ->get();

            if ($applications->isEmpty()) {
                return response()->json([
                    'success' => false,
                    'message' => 'No valid applications found to update'
                ], 404);
            }

            // Store previous statuses for undo functionality
            $previousStatuses = [];
            $updatedCount = 0;
            $emailData = [];

            foreach ($applications as $application) {
                $oldStatus = $application->status;
                
                // Store previous status for undo
                $previousStatuses[$application->id] = [
                    'status' => $oldStatus,
                    'shortlisted_date' => $application->shortlisted_date,
                    'interview_date' => $application->interview_date,
                    'selection_date' => $application->selection_date,
                    'rejection_reason' => $application->rejection_reason
                ];
                
                // Update the application status
                $updateData = ['status' => $newStatus];
                
                // Add rejection reason if status is rejected
                if ($newStatus === 'rejected' && $rejectionReason) {
                    $updateData['rejection_reason'] = $rejectionReason;
                }
                
                // Update relevant dates based on status
                switch ($newStatus) {
                    case 'shortlisted':
                        $updateData['shortlisted_date'] = now();
                        break;
                    case 'interview_scheduled':
                        $updateData['interview_date'] = now();
                        break;
                    case 'selected':
                        $updateData['selection_date'] = now();
                        break;
                }

                $application->update($updateData);
                $updatedCount++;



                // Prepare email data
                $emailData[] = [
                    'user' => $application->user,
                    'jobPosting' => $application->jobPosting,
                    'oldStatus' => $oldStatus,
                    'newStatus' => $newStatus,
                    'application' => $application
                ];
            }

            // Store undo data in session or cache for later use
            $undoKey = 'bulk_update_' . time() . '_' . $jobPostingId;
            \Cache::put($undoKey, [
                'application_ids' => $applicationIds,
                'previous_statuses' => $previousStatuses,
                'new_status' => $newStatus,
                'job_posting_id' => $jobPostingId,
                'updated_at' => now(),
                'updated_count' => $updatedCount
            ], now()->addDays(30)); // Keep undo data for 30 days

            // Store the undo key in a list for this job posting
            $cacheKeyList = 'bulk_update_keys_' . $jobPostingId;
            $existingKeys = \Cache::get($cacheKeyList, []);
            $existingKeys[] = $undoKey;
            \Cache::put($cacheKeyList, $existingKeys, now()->addDays(30));

            // Send email notifications
            $this->sendBulkStatusUpdateEmails($emailData);

            return response()->json([
                'success' => true,
                'message' => "Successfully updated {$updatedCount} application(s) to {$newStatus}",
                'updated_count' => $updatedCount,
                'status' => $newStatus,
                'undo_key' => $undoKey,
                'can_undo' => true
            ]);

        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $e->errors()
            ], 422);
        } catch (\Exception $e) {
            \Log::error('Bulk update error:', ['error' => $e->getMessage()]);
            return response()->json([
                'success' => false,
                'message' => 'Failed to update applications: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Undo bulk status update
     */
    public function undoBulkUpdate(Request $request)
    {
        try {
            $user = \Auth::user();
            
            // Check if user has admin/coordinator/placement coordinator permissions
            if (!$user->is_admin && !$user->is_coordinator && !$user->is_placement_coordinator) {
                return response()->json(['error' => 'Unauthorized'], 403);
            }
            
            // Validate request
            $request->validate([
                'undo_key' => 'required|string'
            ]);

            $undoKey = $request->undo_key;
            $undoData = \Cache::get($undoKey);

            if (!$undoData) {
                return response()->json([
                    'success' => false,
                    'message' => 'Undo data not found or expired'
                ], 404);
            }

            $applicationIds = $undoData['application_ids'];
            $previousStatuses = $undoData['previous_statuses'];
            $jobPostingId = $undoData['job_posting_id'];

            // Get the applications to revert
            $applications = JobApplication::whereIn('id', $applicationIds)
                ->where('job_posting_id', $jobPostingId)
                ->with(['user', 'jobPosting.company'])
                ->get();

            if ($applications->isEmpty()) {
                return response()->json([
                    'success' => false,
                    'message' => 'No applications found to revert'
                ], 404);
            }

            $revertedCount = 0;
            $emailData = [];

            foreach ($applications as $application) {
                if (isset($previousStatuses[$application->id])) {
                    $previousData = $previousStatuses[$application->id];
                    $currentStatus = $application->status;
                    
                    // Revert to previous status and dates
                    $updateData = [
                        'status' => $previousData['status'],
                        'shortlisted_date' => $previousData['shortlisted_date'],
                        'interview_date' => $previousData['interview_date'],
                        'selection_date' => $previousData['selection_date']
                    ];

                    $application->update($updateData);
                    $revertedCount++;



                    // Prepare email data for reversion notification
                    $emailData[] = [
                        'user' => $application->user,
                        'jobPosting' => $application->jobPosting,
                        'oldStatus' => $currentStatus,
                        'newStatus' => $previousData['status'],
                        'application' => $application
                    ];
                }
            }

            // Remove undo data from cache
            \Cache::forget($undoKey);

            // Remove the key from the list
            $cacheKeyList = 'bulk_update_keys_' . $jobPostingId;
            $existingKeys = \Cache::get($cacheKeyList, []);
            $existingKeys = array_filter($existingKeys, function($key) use ($undoKey) {
                return $key !== $undoKey;
            });
            \Cache::put($cacheKeyList, $existingKeys, now()->addDays(30));

            // Send email notifications for reversion
            $this->sendBulkStatusUpdateEmails($emailData);

            return response()->json([
                'success' => true,
                'message' => "Successfully reverted {$revertedCount} application(s) to previous status",
                'reverted_count' => $revertedCount,
                'previous_status' => $undoData['new_status']
            ]);

        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $e->errors()
            ], 422);
        } catch (\Exception $e) {
            \Log::error('Undo bulk update error:', ['error' => $e->getMessage()]);
            return response()->json([
                'success' => false,
                'message' => 'Failed to revert applications: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get available undo operations for a job posting
     */
    public function getUndoOperations(Request $request, $job_posting_id)
    {
        try {
            $user = \Auth::user();
            
            // Check if user has admin/coordinator/placement coordinator permissions
            if (!$user->is_admin && !$user->is_coordinator && !$user->is_placement_coordinator) {
                return response()->json(['error' => 'Unauthorized'], 403);
            }
            
            $undoOperations = [];
            
            // Get all cache keys that match the pattern for this job posting
            $cacheKeys = \Cache::get('bulk_update_keys_' . $job_posting_id, []);
            
            foreach ($cacheKeys as $undoKey) {
                $undoData = \Cache::get($undoKey);
                if ($undoData && $undoData['job_posting_id'] == $job_posting_id) {
                    $undoOperations[] = [
                        'undo_key' => $undoKey,
                        'new_status' => $undoData['new_status'],
                        'updated_count' => $undoData['updated_count'],
                        'updated_at' => $undoData['updated_at'],
                        'can_undo' => true
                    ];
                }
            }

            return response()->json([
                'success' => true,
                'undo_operations' => $undoOperations
            ]);

        } catch (\Exception $e) {
            \Log::error('Get undo operations error:', ['error' => $e->getMessage()]);
            return response()->json([
                'success' => false,
                'message' => 'Failed to get undo operations: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Send email notifications for bulk status updates
     */
    private function sendBulkStatusUpdateEmails($emailData)
    {
        try {
            foreach ($emailData as $data) {
                $user = $data['user'];
                $jobPosting = $data['jobPosting'];
                $oldStatus = $data['oldStatus'];
                $newStatus = $data['newStatus'];

                // Prepare email content based on status
                $subject = "Job Application Status Update - {$jobPosting->title}";
                $message = $this->getStatusUpdateEmailContent($user, $jobPosting, $oldStatus, $newStatus);

                // Send email (you can use Laravel's Mail facade here)

                // TODO: Implement actual email sending
                // Mail::to($user->email)->send(new JobApplicationStatusUpdate($user, $jobPosting, $oldStatus, $newStatus));
            }
        } catch (\Exception $e) {
            \Log::error('Error sending bulk status update emails:', ['error' => $e->getMessage()]);
        }
    }



    /**
     * Get email content for status updates
     */
    private function getStatusUpdateEmailContent($user, $jobPosting, $oldStatus, $newStatus)
    {
        $companyName = $jobPosting->company->name ?? 'the company';
        $jobTitle = $jobPosting->title;

        switch ($newStatus) {
            case 'selected':
                return "Dear {$user->name},\n\nCongratulations! Your application for the position of {$jobTitle} at {$companyName} has been selected. We will contact you soon with further details.\n\nBest regards,\nPlacement Team";
            
            case 'rejected':
                return "Dear {$user->name},\n\nThank you for your interest in the position of {$jobTitle} at {$companyName}. After careful consideration, we regret to inform you that we are unable to move forward with your application at this time.\n\nWe encourage you to continue applying for other opportunities.\n\nBest regards,\nPlacement Team";
            
            case 'shortlisted':
                return "Dear {$user->name},\n\nGreat news! Your application for the position of {$jobTitle} at {$companyName} has been shortlisted. We will contact you soon with next steps.\n\nBest regards,\nPlacement Team";
            
            case 'interview_scheduled':
                return "Dear {$user->name},\n\nYour application for the position of {$jobTitle} at {$companyName} has been selected for an interview. We will contact you soon with interview details.\n\nBest regards,\nPlacement Team";
            
            case 'interviewed':
                return "Dear {$user->name},\n\nThank you for attending the interview for the position of {$jobTitle} at {$companyName}. We will review your interview performance and get back to you soon.\n\nBest regards,\nPlacement Team";
            
            case 'withdrawn':
                return "Dear {$user->name},\n\nYour application for the position of {$jobTitle} at {$companyName} has been withdrawn as requested.\n\nBest regards,\nPlacement Team";
            
            default:
                return "Dear {$user->name},\n\nYour application status for the position of {$jobTitle} at {$companyName} has been updated to {$newStatus}.\n\nBest regards,\nPlacement Team";
        }
    }
} 