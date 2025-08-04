<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\JobPosting;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class JobPostingController extends Controller
{
    public function __construct()
    {
        // Require authentication for store method, allow public access to others for testing
        $this->middleware('auth:sanctum')->only(['store']);
    }

    public function index()
    {
        try {
            // Test if job_postings table exists
            $tableExists = \Schema::hasTable('job_postings');
            \Log::info('Job postings table exists: ' . ($tableExists ? 'Yes' : 'No'));
            
            if ($tableExists) {
                $columns = \Schema::getColumnListing('job_postings');
                \Log::info('Job postings table columns:', $columns);
                return JobPosting::with('company', 'postedBy')->get();
            } else {
                return response()->json(['error' => 'Job postings table does not exist'], 500);
            }
        } catch (\Exception $e) {
            \Log::error('Error in job postings index:', ['error' => $e->getMessage()]);
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    public function show($id)
    {
        return JobPosting::with('company', 'postedBy')->findOrFail($id);
    }

    public function store(Request $request)
    {
        try {
            \Log::info('Job posting store request received:', $request->all());
            
            // Validate the request data
            $validator = Validator::make($request->all(), [
                'company_id' => 'required|exists:companies,id',
                'title' => 'required|string|max:255',
                'description' => 'required|string',
                'requirements' => 'nullable|string',
                'responsibilities' => 'nullable|string',
                'job_type' => 'required|in:full_time,part_time,contract,internship',
                'location' => 'required|string|max:255',
                'salary_min' => 'nullable|numeric|min:0',
                'salary_max' => 'nullable|numeric|min:0|gte:salary_min',
                'experience_required' => 'nullable|string|max:100',
                'vacancies' => 'required|integer|min:1',
                'status' => 'required|in:draft,open,closed,expired',
                'application_deadline' => 'nullable|date|after:today',
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'error' => 'Validation failed',
                    'details' => $validator->errors()
                ], 422);
            }

            // Get the authenticated user
            $user = $request->user();
            if (!$user) {
                return response()->json(['error' => 'Authentication required'], 401);
            }

            // Add the posted_by field to the validated data
            $data = $validator->validated();
            $data['posted_by'] = $user->id;
            
            $jobPosting = JobPosting::create($data);
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
} 