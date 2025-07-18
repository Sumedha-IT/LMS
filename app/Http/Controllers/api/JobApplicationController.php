<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\JobApplication;
use Illuminate\Http\Request;

class JobApplicationController extends Controller
{
    public function __construct()
    {
        // Allow public access to all methods for testing
        $this->middleware('auth:sanctum')->except(['index', 'store', 'show', 'update', 'destroy']);
    }

    public function index()
    {
        try {
            // Test if job_applications table exists
            $tableExists = \Schema::hasTable('job_applications');
            \Log::info('Job applications table exists: ' . ($tableExists ? 'Yes' : 'No'));
            
            if ($tableExists) {
                $columns = \Schema::getColumnListing('job_applications');
                \Log::info('Job applications table columns:', $columns);
                return JobApplication::with('jobPosting', 'user')->get();
            } else {
                return response()->json(['error' => 'Job applications table does not exist'], 500);
            }
        } catch (\Exception $e) {
            \Log::error('Error in job applications index:', ['error' => $e->getMessage()]);
            return response()->json(['error' => $e->getMessage()], 500);
        }
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
} 