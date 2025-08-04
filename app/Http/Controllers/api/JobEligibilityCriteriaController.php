<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\JobEligibilityCriteria;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class JobEligibilityCriteriaController extends Controller
{
    public function __construct()
    {
        // Allow public access to all methods for testing
        $this->middleware('auth:sanctum')->except(['index', 'store', 'show', 'update', 'destroy']);
    }

    public function index()
    {
        try {
            return response()->json(JobEligibilityCriteria::with('jobPosting')->get());
        } catch (\Exception $e) {
            \Log::error('Error in job eligibility criteria index:', ['error' => $e->getMessage()]);
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    public function show($id)
    {
        try {
            $criteria = JobEligibilityCriteria::with('jobPosting')->findOrFail($id);
            return response()->json($criteria);
        } catch (\Exception $e) {
            \Log::error('Error in job eligibility criteria show:', ['error' => $e->getMessage()]);
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    public function store(Request $request)
    {
        try {
            \Log::info('Job eligibility criteria store request received:', $request->all());
            
            $validated = $request->validate([
                'job_posting_id' => 'required|exists:job_postings,id',
                'btech_year_of_passout_min' => 'nullable|integer|min:1900|max:2100',
                'btech_year_of_passout_max' => 'nullable|integer|min:1900|max:2100',
                'mtech_year_of_passout_min' => 'nullable|integer|min:1900|max:2100',
                'mtech_year_of_passout_max' => 'nullable|integer|min:1900|max:2100',
                'btech_percentage_min' => 'nullable|numeric|min:0|max:100',
                'mtech_percentage_min' => 'nullable|numeric|min:0|max:100',
                'skills_required' => 'nullable|array',
                'additional_criteria' => 'nullable|string',
            ]);

            $criteria = JobEligibilityCriteria::create($validated);
            \Log::info('Job eligibility criteria created successfully:', $criteria->toArray());
            return response()->json($criteria, 201);
        } catch (\Exception $e) {
            \Log::error('Error creating job eligibility criteria:', [
                'message' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    public function update(Request $request, $id)
    {
        try {
            $criteria = JobEligibilityCriteria::findOrFail($id);
            
            $validated = $request->validate([
                'job_posting_id' => 'sometimes|required|exists:job_postings,id',
                'btech_year_of_passout_min' => 'nullable|integer|min:1900|max:2100',
                'btech_year_of_passout_max' => 'nullable|integer|min:1900|max:2100',
                'mtech_year_of_passout_min' => 'nullable|integer|min:1900|max:2100',
                'mtech_year_of_passout_max' => 'nullable|integer|min:1900|max:2100',
                'btech_percentage_min' => 'nullable|numeric|min:0|max:100',
                'mtech_percentage_min' => 'nullable|numeric|min:0|max:100',
                'skills_required' => 'nullable|array',
                'additional_criteria' => 'nullable|string',
            ]);

            $criteria->update($validated);
            return response()->json([
                'message' => 'Job eligibility criteria updated successfully',
                'data' => $criteria
            ]);
        } catch (\Exception $e) {
            \Log::error('Error updating job eligibility criteria:', ['error' => $e->getMessage()]);
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    public function destroy($id)
    {
        try {
            $criteria = JobEligibilityCriteria::findOrFail($id);
            $criteria->delete();
            return response()->json([
                'message' => 'Job eligibility criteria deleted successfully'
            ], 204);
        } catch (\Exception $e) {
            \Log::error('Error deleting job eligibility criteria:', ['error' => $e->getMessage()]);
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }
} 