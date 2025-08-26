<?php

namespace App\Http\Controllers\api;

use App\Http\Controllers\Controller;
use App\Services\ProfileCompletionService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class ProfileCompletionController extends Controller
{
    protected $profileCompletionService;

    public function __construct(ProfileCompletionService $profileCompletionService)
    {
        $this->profileCompletionService = $profileCompletionService;
        $this->middleware('auth:sanctum');
    }

    /**
     * Get profile completion status for the authenticated user
     *
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function index(Request $request)
    {
        try {
            $user = Auth::user();
            
            if (!$user) {
                return response()->json(['error' => 'Authentication required'], 401);
            }

            // Check if user is a student
            if (!$user->is_student && !$user->is_placement_student) {
                return response()->json(['error' => 'Only students can access profile completion'], 403);
            }

            $completion = $this->profileCompletionService->calculateProfileCompletion($user);
            
            return response()->json([
                'success' => true,
                'data' => $completion
            ]);

        } catch (\Exception $e) {
            \Log::error('Error getting profile completion:', [
                'user_id' => Auth::id(),
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);

            return response()->json([
                'success' => false,
                'error' => 'Failed to get profile completion status',
                'message' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Check if user can apply for placements
     *
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function canApply(Request $request)
    {
        try {
            $user = Auth::user();
            
            if (!$user) {
                return response()->json(['error' => 'Authentication required'], 401);
            }

            // Check if user is a student
            if (!$user->is_student && !$user->is_placement_student) {
                return response()->json(['error' => 'Only students can check placement eligibility'], 403);
            }

            $eligibility = $this->profileCompletionService->canApplyForPlacements($user);
            
            return response()->json([
                'success' => true,
                'data' => $eligibility
            ]);

        } catch (\Exception $e) {
            \Log::error('Error checking placement eligibility:', [
                'user_id' => Auth::id(),
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);

            return response()->json([
                'success' => false,
                'error' => 'Failed to check placement eligibility',
                'message' => $e->getMessage()
            ], 500);
        }
    }
}
