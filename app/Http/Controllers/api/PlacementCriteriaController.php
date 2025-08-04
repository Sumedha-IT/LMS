<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\PlacementCriteria;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class PlacementCriteriaController extends Controller
{
    public function __construct()
    {
        // Allow public access to all methods for testing
        $this->middleware('auth:sanctum')->except(['index', 'store', 'show', 'update', 'destroy']);
    }

    public function index()
    {
        try {
            return response()->json(PlacementCriteria::all());
        } catch (\Exception $e) {
            \Log::error('Error in placement criteria index:', ['error' => $e->getMessage()]);
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    public function show($id)
    {
        try {
            $criteria = PlacementCriteria::findOrFail($id);
            return response()->json($criteria);
        } catch (\Exception $e) {
            \Log::error('Error in placement criteria show:', ['error' => $e->getMessage()]);
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    public function store(Request $request)
    {
        try {
            \Log::info('Placement criteria store request received:', $request->all());
            
            $validated = $request->validate([
                'name' => 'required|string|max:255',
                'profile_completion_percentage' => 'nullable|numeric|min:0|max:100',
                'course_completion_required' => 'boolean',
                'exam_standards_required' => 'boolean',
                'attendance_percentage' => 'nullable|numeric|min:0|max:100',
                'fees_payment_required' => 'boolean',
                'lab_test_cases_required' => 'boolean',
                'assignments_required' => 'boolean',
                'is_active' => 'boolean',
            ]);

            $criteria = PlacementCriteria::create($validated);
            \Log::info('Placement criteria created successfully:', $criteria->toArray());
            return response()->json($criteria, 201);
        } catch (\Exception $e) {
            \Log::error('Error creating placement criteria:', [
                'message' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    public function update(Request $request, $id)
    {
        try {
            $criteria = PlacementCriteria::findOrFail($id);
            
            $validated = $request->validate([
                'name' => 'sometimes|required|string|max:255',
                'profile_completion_percentage' => 'nullable|numeric|min:0|max:100',
                'course_completion_required' => 'boolean',
                'exam_standards_required' => 'boolean',
                'attendance_percentage' => 'nullable|numeric|min:0|max:100',
                'fees_payment_required' => 'boolean',
                'lab_test_cases_required' => 'boolean',
                'assignments_required' => 'boolean',
                'is_active' => 'boolean',
            ]);

            $criteria->update($validated);
            return response()->json([
                'message' => 'Placement criteria updated successfully',
                'data' => $criteria
            ]);
        } catch (\Exception $e) {
            \Log::error('Error updating placement criteria:', ['error' => $e->getMessage()]);
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    public function destroy($id)
    {
        try {
            $criteria = PlacementCriteria::findOrFail($id);
            $criteria->delete();
            return response()->json([
                'message' => 'Placement criteria deleted successfully'
            ], 204);
        } catch (\Exception $e) {
            \Log::error('Error deleting placement criteria:', ['error' => $e->getMessage()]);
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }
} 