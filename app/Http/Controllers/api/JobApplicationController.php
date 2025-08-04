<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\JobApplication;
use Illuminate\Http\Request;

class JobApplicationController extends Controller
{
    public function __construct()
    {
        // Temporarily removed authentication for testing
        // $this->middleware('auth:sanctum')->except(['index', 'store', 'show', 'update', 'destroy']);
    }

    public function index(Request $request)
    {
        try {
            // Test if job_applications table exists
            $tableExists = \Schema::hasTable('job_applications');
            \Log::info('Job applications table exists: ' . ($tableExists ? 'Yes' : 'No'));
            
            if (!$tableExists) {
                return response()->json(['error' => 'Job applications table does not exist'], 500);
            }

            // Start with base query
            $query = JobApplication::with(['jobPosting.company', 'jobPosting.domain', 'user']);

            // Apply search filters
            $query = $this->applySearchFilters($query, $request);

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
            \Log::info('Search term: ' . $searchTerm);
            
            $query->whereHas('user', function ($q) use ($searchTerm) {
                $q->where(function($subQuery) use ($searchTerm) {
                    $subQuery->where('name', 'LIKE', "%{$searchTerm}%")
                             ->orWhere('email', 'LIKE', "%{$searchTerm}%");
                });
            });
            
            \Log::info('Query SQL: ' . $query->toSql());
            \Log::info('Query bindings: ' . json_encode($query->getBindings()));
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

        // Filter by domain
        if ($request->filled('domain')) {
            $domainId = $request->get('domain');
            $query->whereHas('jobPosting', function ($q) use ($domainId) {
                $q->where('domain_id', $domainId);
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
        if ($request->filled('domain')) $filters['domain'] = $request->get('domain');
        if ($request->filled('date_from')) $filters['date_from'] = $request->get('date_from');
        if ($request->filled('date_to')) $filters['date_to'] = $request->get('date_to');
        if ($request->filled('user_id')) $filters['user_id'] = $request->get('user_id');
        if ($request->filled('job_posting_id')) $filters['job_posting_id'] = $request->get('job_posting_id');

        return $filters;
    }

    public function show($id)
    {
        return JobApplication::with('jobPosting', 'user')->findOrFail($id);
    }

    public function store(Request $request)
    {
        try {
            \Log::info('Job application store request received:', $request->all());
            
        $jobApplication = JobApplication::create($request->all());
            \Log::info('Job application created successfully:', $jobApplication->toArray());
        return response()->json($jobApplication, 201);
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
        $jobApplication = JobApplication::findOrFail($id);
        $jobApplication->update($request->all());
        return response()->json($jobApplication);
    }

    public function destroy($id)
    {
        $jobApplication = JobApplication::findOrFail($id);
        $jobApplication->delete();
        return response()->json(null, 204);
    }

    /**
     * Advanced search for job applications
     */
    public function search(Request $request)
    {
        try {
            $query = JobApplication::with(['jobPosting.company', 'jobPosting.domain', 'user']);

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

        // Domain filters
        if ($request->filled('domain_ids')) {
            $domainIds = $request->get('domain_ids');
            if (is_array($domainIds)) {
                $query->whereHas('jobPosting', function ($q) use ($domainIds) {
                    $query->whereIn('domain_id', $domainIds);
                });
            }
        }

        // Company filters
        if ($request->filled('company_ids')) {
            $companyIds = $request->get('company_ids');
            if (is_array($companyIds)) {
                $query->whereHas('jobPosting', function ($q) use ($companyIds) {
                    $query->whereIn('company_id', $companyIds);
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
        if ($request->filled('domain_ids')) $criteria['domain_ids'] = $request->get('domain_ids');
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

            // Get applications by domain
            $applicationsByDomain = JobApplication::where($dateConditions)
                                                 ->join('job_postings', 'job_applications.job_posting_id', '=', 'job_postings.id')
                                                 ->join('domains', 'job_postings.domain_id', '=', 'domains.id')
                                                 ->selectRaw('domains.name as domain_name, COUNT(*) as domain_count')
                                                 ->groupBy('domains.id', 'domains.name')
                                                 ->pluck('domain_count', 'domain_name')
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
                'applications_by_domain' => $applicationsByDomain,
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
} 