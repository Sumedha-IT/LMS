<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\JobPosting;
use Illuminate\Http\Request;

class JobPostingController extends Controller
{
    public function __construct()
    {
        // Temporarily removed authentication for testing
        // $this->middleware('auth:sanctum')->except(['index', 'show', 'search', 'getStatistics']);
    }

    /**
     * Get all available job postings for students
     */
    public function index(Request $request)
    {
        try {
            // Start with base query - only open jobs
            $query = JobPosting::with(['company', 'domain', 'postedBy'])
                              ->where('status', 'open')
                              ->where('application_deadline', '>', now());

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
            $query = JobPosting::with(['company', 'domain', 'postedBy'])
                              ->where('status', 'open')
                              ->where('application_deadline', '>', now());

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
            $query = JobPosting::where('status', 'open')
                              ->where('application_deadline', '>', now());

            // Apply date range filter if provided
            if ($request->filled('date_from')) {
                $query->whereDate('created_at', '>=', $request->get('date_from'));
            }
            if ($request->filled('date_to')) {
                $query->whereDate('created_at', '<=', $request->get('date_to'));
            }

            $totalJobs = $query->count();
            
            // Jobs by domain
            $jobsByDomain = $query->with('domain')
                                 ->get()
                                 ->groupBy('domain.name')
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
                'jobs_by_domain' => $jobsByDomain,
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
            $jobPosting = JobPosting::with(['company', 'domain', 'postedBy'])
                                   ->where('status', 'open')
                                   ->where('application_deadline', '>', now())
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

        // Filter by location
        if ($request->filled('location')) {
            $location = $request->get('location');
            $query->where('location', 'LIKE', "%{$location}%");
        }

        // Filter by domain
        if ($request->filled('domain_id')) {
            $domainId = $request->get('domain_id');
            $query->where('domain_id', $domainId);
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
                  ->orWhereHas('domain', function($domainQuery) use ($searchTerm) {
                      $domainQuery->where('name', 'LIKE', "%{$searchTerm}%");
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

        if ($request->filled('domain_ids')) {
            $query->whereIn('domain_id', $request->get('domain_ids'));
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
        if ($request->filled('domain_id')) $filters['domain_id'] = $request->get('domain_id');
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
        if ($request->filled('domain_ids')) $criteria['domain_ids'] = $request->get('domain_ids');
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
            \Log::info('Job posting store request received:', $request->all());
            
        $jobPosting = JobPosting::create($request->all());
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
        $jobPosting = JobPosting::findOrFail($id);
        $jobPosting->update($request->all());
        return response()->json($jobPosting);
    }

    public function destroy($id)
    {
        $jobPosting = JobPosting::findOrFail($id);
        $jobPosting->delete();
        return response()->json(null, 204);
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

            // Start with base query - only open jobs
            $query = JobPosting::with(['company', 'course', 'postedBy'])
                              ->where('status', 'open')
                              ->where('application_deadline', '>', now());

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