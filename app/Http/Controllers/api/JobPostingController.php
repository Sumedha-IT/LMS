<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\JobPosting;
use Illuminate\Http\Request;

class JobPostingController extends Controller
{
    public function __construct()
    {
        // Allow public access to all methods for testing
        $this->middleware('auth:sanctum')->except(['index', 'store', 'show', 'update', 'destroy']);
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
} 