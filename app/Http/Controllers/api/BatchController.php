<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Batch;
use App\Models\BatchCurriculum;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;

class BatchController extends Controller
{
    public function index()
    {
        try {
            $user = Auth::user();
            \Log::info('BatchController@index called', [
                'user_id' => $user ? $user->id : null,
                'user_email' => $user ? $user->email : null,
                'user_role_id' => $user ? $user->role_id : null,
                'user_roles' => $user ? $user->getRoleNames() : null,
            ]);
            $batches = $user->batches()->with('course_package')->get();
            
            return response()->json([
                'batches' => $batches,
                'total' => $batches->count()
            ]);
        } catch (\Exception $e) {
            Log::error('Error fetching batches: ' . $e->getMessage());
            return response()->json(['error' => 'Failed to fetch batches'], 500);
        }
    }

    public function show($id)
    {
        try {
            $user = Auth::user();
            $batch = $user->batches()->with('course_package')->findOrFail($id);
            
            return response()->json([
                'batch' => $batch
            ]);
        } catch (\Exception $e) {
            Log::error('Error fetching batch: ' . $e->getMessage());
            return response()->json(['error' => 'Failed to fetch batch'], 500);
        }
    }

    public function getCurriculums($id)
    {
        try {
            $user = Auth::user();
            $batch = $user->batches()->findOrFail($id);
            
            $curriculums = BatchCurriculum::where('batch_id', $id)
                ->with(['curriculum', 'tutor', 'topics.topic'])
                ->get();

            return response()->json([
                'curriculums' => $curriculums,
                'total' => $curriculums->count()
            ]);
        } catch (\Exception $e) {
            Log::error('Error fetching curriculums: ' . $e->getMessage());
            return response()->json(['error' => 'Failed to fetch curriculums'], 500);
        }
    }
} 