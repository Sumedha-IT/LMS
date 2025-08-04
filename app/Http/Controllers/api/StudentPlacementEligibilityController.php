<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\StudentPlacementEligibility;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class StudentPlacementEligibilityController extends Controller
{
    public function __construct()
    {
        // Allow public access to all methods for testing
        $this->middleware('auth:sanctum')->except(['index', 'store', 'show', 'update', 'destroy']);
    }

    public function index()
    {
        try {
            return response()->json(StudentPlacementEligibility::with('user')->get());
        } catch (\Exception $e) {
            \Log::error('Error in student placement eligibility index:', ['error' => $e->getMessage()]);
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    public function show($id)
    {
        try {
            $eligibility = StudentPlacementEligibility::with('user')->findOrFail($id);
            return response()->json($eligibility);
        } catch (\Exception $e) {
            \Log::error('Error in student placement eligibility show:', ['error' => $e->getMessage()]);
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    public function store(Request $request)
    {
        try {
            \Log::info('Student placement eligibility store request received:', $request->all());
            
            $validated = $request->validate([
                'user_id' => 'required|exists:users,id',
                'is_eligible' => 'boolean',
                'eligibility_reasons' => 'nullable|string',
                'profile_completion_percentage' => 'nullable|numeric|min:0|max:100',
                'course_completion_status' => 'boolean',
                'exam_standards_met' => 'boolean',
                'attendance_percentage' => 'nullable|numeric|min:0|max:100',
                'fees_payment_status' => 'boolean',
                'lab_test_cases_completed' => 'boolean',
                'assignments_completed' => 'boolean',
                'is_placed' => 'boolean',
                'placement_date' => 'nullable|date',
                'placement_salary' => 'nullable|numeric|min:0',
                'placement_company' => 'nullable|string|max:255',
                'is_pap_student' => 'boolean',
                'remaining_fee_amount' => 'nullable|numeric|min:0',
                'google_review_status' => 'nullable|in:pending,completed,declined',
                'google_review_link' => 'nullable|url|max:500',
            ]);

            $eligibility = StudentPlacementEligibility::create($validated);
            \Log::info('Student placement eligibility created successfully:', $eligibility->toArray());
            return response()->json($eligibility, 201);
        } catch (\Exception $e) {
            \Log::error('Error creating student placement eligibility:', [
                'message' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    public function update(Request $request, $id)
    {
        try {
            $eligibility = StudentPlacementEligibility::findOrFail($id);
            
            $validated = $request->validate([
                'user_id' => 'sometimes|required|exists:users,id',
                'is_eligible' => 'boolean',
                'eligibility_reasons' => 'nullable|string',
                'profile_completion_percentage' => 'nullable|numeric|min:0|max:100',
                'course_completion_status' => 'boolean',
                'exam_standards_met' => 'boolean',
                'attendance_percentage' => 'nullable|numeric|min:0|max:100',
                'fees_payment_status' => 'boolean',
                'lab_test_cases_completed' => 'boolean',
                'assignments_completed' => 'boolean',
                'is_placed' => 'boolean',
                'placement_date' => 'nullable|date',
                'placement_salary' => 'nullable|numeric|min:0',
                'placement_company' => 'nullable|string|max:255',
                'is_pap_student' => 'boolean',
                'remaining_fee_amount' => 'nullable|numeric|min:0',
                'google_review_status' => 'nullable|in:pending,completed,declined',
                'google_review_link' => 'nullable|url|max:500',
            ]);

            $eligibility->update($validated);
            return response()->json([
                'message' => 'Student placement eligibility updated successfully',
                'data' => $eligibility
            ]);
        } catch (\Exception $e) {
            \Log::error('Error updating student placement eligibility:', ['error' => $e->getMessage()]);
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    public function destroy($id)
    {
        try {
            $eligibility = StudentPlacementEligibility::findOrFail($id);
            $eligibility->delete();
            return response()->json([
                'message' => 'Student placement eligibility deleted successfully'
            ], 204);
        } catch (\Exception $e) {
            \Log::error('Error deleting student placement eligibility:', ['error' => $e->getMessage()]);
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }
} 