<?php

namespace App\Http\Controllers;

use App\Models\Batch;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;

class StudentJourneyController extends Controller
{
    public function journey(Request $request)
    {
        // Ensure the user is authenticated
        $user = $request->user();
        // if (!$user || $user->role !== 'student') {
        //     return response()->json(['message' => 'Unauthorized'], 401);
        // }

        // Get the batch_id from the batch_user pivot table
        $batchUser = $user->batches()->first();
        if (!$batchUser) {
            return response()->json(['message' => 'No batch assigned to user'], 404);
        }

        // Fetch batch with eager-loaded relationships
        $batch = Batch::with([
            'curriculums.curriculum',
            'curriculums.tutor',
            'curriculums.topics.topic',
            'curriculums.topics.assignments' => function ($query) use ($user) {
                $query->with(['teachingMaterialStatuses' => function ($statusQuery) use ($user) {
                    $statusQuery->where('user_id', $user->id);
                }]);
            },
            'course_package'
        ])->findOrFail($batchUser->id);

        // Prepare the response
        $journey = [
            'batch' => [
                'id' => $batch->id,
                'name' => $batch->name,
                'created_at' => $batch->created_at,
                'updated_at' => $batch->updated_at,
                'course' => [
                    'id' => $batch->course_package->id,
                    'name' => $batch->course_package->name,
                ],
            ],
            'curriculums' => [],
        ];

        // Build curriculum data
        foreach ($batch->curriculums as $curriculum) {
            $curriculumData = [
                'id' => $curriculum->id,
                'curriculum' => [
                    'id' => $curriculum->curriculum->id,
                    'name' => $curriculum->curriculum->name,
                ],
                'tutor' => $curriculum->tutor ? [
                    'id' => $curriculum->tutor->id,
                    'name' => $curriculum->tutor->name,
                ] : null,
                'topics' => [],
            ];

            // Build topic data
            foreach ($curriculum->topics as $topic) {
                $topicData = [
                    'id' => $topic->id,
                    'topic_id' => $topic->topic_id,
                    'topic_name' => $topic->topic->name,
                    'is_topic_completed' => $topic->is_topic_completed,
                    'topic_completed_at' => $topic->topic_completed_at,
                    'teaching_materials' => $topic->assignments->map(function ($material) use ($user) {
                        return [
                            'id' => $material->id,
                            'name' => $material->name,
                            'description' => $material->description,
                            'file' => asset('storage/' . $material->file),
                            'is_submitted' => $material->teachingMaterialStatuses->isNotEmpty(),
                        ];
                    })->all(),
                ];

                $curriculumData['topics'][] = $topicData;
            }

            $journey['curriculums'][] = $curriculumData;
        }

        return response()->json($journey, 200);
    }
}