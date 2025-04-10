<?php

namespace App\Http\Controllers;

use App\Models\Batch;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Models\BatchCurriculumTopic;

class StudentJourneyController extends Controller
{
    public function journey(Request $request)
    {
        // Ensure the user is authenticated
        $user = $request->user();
        // if (!$user || $user->role !== 'student') {
        //     return response()->json(['message' => 'Unauthorized'], 401);
        // }

        // Get the batch_id from the batch_user table
        $batchUser = $user->batches()->first();
        if (!$batchUser) {
            return response()->json(['message' => 'No batch assigned to user'], 404);
        }
        $batchId = $batchUser->id;

        // Fetch batch details with eager-loaded curriculums
        $batch = Batch::with('curriculums.curriculum', 'curriculums.tutor', 'curriculums.topics.topic','course_package')
            ->findOrFail($batchId);

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

        // Fetch curriculum and tutor details from batch_curriculum
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

            // Topics are already eager-loaded, so use them directly
            foreach ($curriculum->topics as $topic) {
                $curriculumData['topics'][] = [
                    'id' => $topic->id,
                    'topic_id' => $topic->topic_id,
                    'topic_name' => $topic->topic->name,
                    'is_topic_completed' => $topic->is_topic_completed,
                    'topic_completed_at' => $topic->topic_completed_at,
                ];
            }

            $journey['curriculums'][] = $curriculumData;
        }

        return response()->json($journey, 200);
    }
}
