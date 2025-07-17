<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\BatchCurriculum;
use App\Models\BatchCurriculumTopic;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;

class TopicController extends Controller
{
    public function index()
    {
        try {
            $user = Auth::user();
            $userBatches = $user->batches()->pluck('batches.id');
            
            $topics = BatchCurriculumTopic::whereHas('batch_curriculum', function ($query) use ($userBatches) {
                $query->whereIn('batch_id', $userBatches);
            })
            ->with(['topic', 'batch_curriculum.curriculum'])
            ->get()
            ->map(function ($batchTopic) {
                return [
                    'id' => $batchTopic->topic->id,
                    'name' => $batchTopic->topic->name,
                    'curriculum_name' => $batchTopic->batch_curriculum->curriculum->name,
                    'curriculum_id' => $batchTopic->batch_curriculum->curriculum->id,
                    'is_started' => $batchTopic->is_topic_started ?? false,
                    'is_completed' => $batchTopic->is_topic_completed ?? false,
                    'started_at' => $batchTopic->topic_started_at,
                    'completed_at' => $batchTopic->topic_completed_at
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

    public function show($id)
    {
        try {
            $user = Auth::user();
            $userBatches = $user->batches()->pluck('batches.id');
            
            $topic = BatchCurriculumTopic::whereHas('batch_curriculum', function ($query) use ($userBatches) {
                $query->whereIn('batch_id', $userBatches);
            })
            ->where('topic_id', $id)
            ->with(['topic', 'batch_curriculum.curriculum'])
            ->firstOrFail();
            
            return response()->json([
                'topic' => [
                    'id' => $topic->topic->id,
                    'name' => $topic->topic->name,
                    'curriculum_name' => $topic->batch_curriculum->curriculum->name,
                    'curriculum_id' => $topic->batch_curriculum->curriculum->id,
                    'is_started' => $topic->is_topic_started ?? false,
                    'is_completed' => $topic->is_topic_completed ?? false,
                    'started_at' => $topic->topic_started_at,
                    'completed_at' => $topic->topic_completed_at
                ]
            ]);
        } catch (\Exception $e) {
            Log::error('Error fetching topic: ' . $e->getMessage());
            return response()->json(['error' => 'Failed to fetch topic'], 500);
        }
    }

    public function startTopic($id)
    {
        try {
            $user = Auth::user();
            $userBatches = $user->batches()->pluck('batches.id');
            
            $topic = BatchCurriculumTopic::whereHas('batch_curriculum', function ($query) use ($userBatches) {
                $query->whereIn('batch_id', $userBatches);
            })
            ->where('topic_id', $id)
            ->firstOrFail();
            
            $topic->startTopic();
            
            return response()->json([
                'message' => 'Topic started successfully',
                'topic' => [
                    'id' => $topic->topic->id,
                    'name' => $topic->topic->name,
                    'is_started' => true,
                    'started_at' => $topic->topic_started_at
                ]
            ]);
        } catch (\Exception $e) {
            Log::error('Error starting topic: ' . $e->getMessage());
            return response()->json(['error' => 'Failed to start topic'], 500);
        }
    }

    public function markAsCompleted($id)
    {
        try {
            $user = Auth::user();
            $userBatches = $user->batches()->pluck('batches.id');
            
            $topic = BatchCurriculumTopic::whereHas('batch_curriculum', function ($query) use ($userBatches) {
                $query->whereIn('batch_id', $userBatches);
            })
            ->where('topic_id', $id)
            ->firstOrFail();
            
            $topic->completeTopic();
            
            return response()->json([
                'message' => 'Topic marked as completed',
                'topic' => [
                    'id' => $topic->topic->id,
                    'name' => $topic->topic->name,
                    'is_completed' => true,
                    'completed_at' => $topic->topic_completed_at
                ]
            ]);
        } catch (\Exception $e) {
            Log::error('Error marking topic as completed: ' . $e->getMessage());
            return response()->json(['error' => 'Failed to mark topic as completed'], 500);
        }
    }
} 