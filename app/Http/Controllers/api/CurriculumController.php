<?php

namespace App\Http\Controllers\api;

use App\Http\Controllers\Controller;
use App\Models\Curriculum;
use App\Models\BatchCurriculum;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;

class CurriculumController extends Controller
{
    public function index()
    {
        try {
            $user = Auth::user();
            $userBatches = $user->batches()->pluck('batches.id');
            
            $curriculums = BatchCurriculum::whereIn('batch_id', $userBatches)
                ->with(['curriculum', 'tutor'])
                ->get()
                ->map(function ($batchCurriculum) {
                    return [
                        'id' => $batchCurriculum->curriculum->id,
                        'name' => $batchCurriculum->curriculum->name,
                        'tutor' => $batchCurriculum->tutor ? [
                            'id' => $batchCurriculum->tutor->id,
                            'name' => $batchCurriculum->tutor->name
                        ] : null,
                        'batch_id' => $batchCurriculum->batch_id
                    ];
                });
            
            return response()->json([
                'curriculums' => $curriculums,
                'total' => $curriculums->count()
            ]);
        } catch (\Exception $e) {
            Log::error('Error fetching curriculums: ' . $e->getMessage());
            return response()->json(['error' => 'Failed to fetch curriculums'], 500);
        }
    }

    public function show($id)
    {
        try {
            $user = Auth::user();
            $userBatches = $user->batches()->pluck('batches.id');
            
            $curriculum = BatchCurriculum::whereIn('batch_id', $userBatches)
                ->where('curriculum_id', $id)
                ->with(['curriculum', 'tutor', 'topics.topic'])
                ->firstOrFail();
            
            return response()->json([
                'curriculum' => [
                    'id' => $curriculum->curriculum->id,
                    'name' => $curriculum->curriculum->name,
                    'tutor' => $curriculum->tutor ? [
                        'id' => $curriculum->tutor->id,
                        'name' => $curriculum->tutor->name
                    ] : null,
                    'batch_id' => $curriculum->batch_id,
                    'topics' => $curriculum->topics->map(function ($topic) {
                        return [
                            'id' => $topic->topic->id,
                            'name' => $topic->topic->name,
                            'is_started' => $topic->is_topic_started ?? false,
                            'is_completed' => $topic->is_topic_completed ?? false,
                            'started_at' => $topic->topic_started_at,
                            'completed_at' => $topic->topic_completed_at
                        ];
                    })
                ]
            ]);
        } catch (\Exception $e) {
            Log::error('Error fetching curriculum: ' . $e->getMessage());
            return response()->json(['error' => 'Failed to fetch curriculum'], 500);
        }
    }

    public function getTopics($id)
    {
        try {
            $user = Auth::user();
            $userBatches = $user->batches()->pluck('batches.id');
            
            $curriculum = BatchCurriculum::whereIn('batch_id', $userBatches)
                ->where('curriculum_id', $id)
                ->with(['topics.topic'])
                ->firstOrFail();
            
            $topics = $curriculum->topics->map(function ($topic) {
                return [
                    'id' => $topic->topic->id,
                    'name' => $topic->topic->name,
                    'is_started' => $topic->is_topic_started ?? false,
                    'is_completed' => $topic->is_topic_completed ?? false,
                    'started_at' => $topic->topic_started_at,
                    'completed_at' => $topic->topic_completed_at
                ];
            });
            
            return response()->json([
                'topics' => $topics,
                'total' => $topics->count()
            ]);
        } catch (\Exception $e) {
            Log::error('Error fetching topics: ' . $e->getMessage());
            return response()->json(['error' => 'Failed to fetch topics'], 500);
        }
    }
} 