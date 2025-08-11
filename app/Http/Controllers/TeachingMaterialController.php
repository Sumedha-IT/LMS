<?php


namespace App\Http\Controllers;

use App\Http\Resources\TeachingMaterialResource;
use App\Models\TeachingMaterial;
use App\Models\BatchTeachingMaterial;
use App\Models\BatchUser;
use App\Models\TeachingMaterialStatus;
use Illuminate\Http\Request;

class TeachingMaterialController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();
        $topic_id = $request->query('topic_id');
        $batch_id = $request->query('batch_id');

        if (!$batch_id) {
            // Get the first batch the user is enrolled in
            $batch = $user->batches()->first();
            if (!$batch) {
                return response()->json(['message' => 'No batch found for user.'], 404);
            }
            $batch_id = $batch->id;
        }

        $materials = TeachingMaterial::select('teaching_materials.*')
            ->join('sections', 'sections.id', '=', 'teaching_materials.section_id')
            ->join('batch_section', 'sections.id', '=', 'batch_section.section_id')
            ->join('batch_teaching_materials', 'teaching_materials.id', '=', 'batch_teaching_materials.teaching_material_id')
            ->where('batch_section.batch_id', $batch_id)
            ->where('batch_teaching_materials.batch_id', $batch_id)
            ->when($topic_id, function ($q) use ($topic_id) {
                $q->where('teaching_materials.topic_id', $topic_id);
            })
            ->get();

        if ($materials->isEmpty()) {
            return response()->json(['message' => 'No records found.'], 200);
        }

        return TeachingMaterialResource::collection($materials);
    }

    public function store(Request $request)
    {
        try {
            $user = $request->user();
            
            // Check if user has admin/coordinator permissions
            if (!$user->is_admin && !$user->is_coordinator) {
                return response()->json(['error' => 'Unauthorized'], 403);
            }

            // Log the request data for debugging
            \Log::info('Teaching material creation request', [
                'request_data' => $request->all(),
                'files' => $request->hasFile('file') ? 'Has file' : 'No file',
                'user_id' => $user->id
            ]);

            $validator = \Illuminate\Support\Facades\Validator::make($request->all(), [
                'topic_id' => 'required|exists:topics,id',
                'name' => 'required|string|max:255',
                'description' => 'nullable|string',
                'file' => 'required|file|max:10240', // 10MB Max
                'doc_type' => 'required|integer|in:1,2', // 1 for teaching material, 2 for assignment
            ]);

            if ($validator->fails()) {
                \Log::error('Validation failed for teaching material creation', [
                    'errors' => $validator->errors(),
                    'request_data' => $request->all()
                ]);
                return response()->json(['errors' => $validator->errors()], 422);
            }

            // Store the file
            $filePath = $request->file('file')->store('teaching-materials', 'public');

            // Create the teaching material without requiring a section
            $teachingMaterial = TeachingMaterial::create([
                'topic_id' => $request->topic_id,
                'section_id' => null, // Set to null since we're not using sections
                'name' => $request->name,
                'description' => $request->description,
                'material_source' => 'other', // Default to 'other' for file uploads
                'file' => $filePath,
                'doc_type' => $request->doc_type,
                'published' => true,
                'sort' => 1, // Default sort order
            ]);

            \Log::info('Teaching material created successfully', [
                'teaching_material_id' => $teachingMaterial->id,
                'name' => $teachingMaterial->name,
                'topic_id' => $teachingMaterial->topic_id
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Teaching material created successfully',
                'teaching_material' => $teachingMaterial
            ], 201);

        } catch (\Exception $e) {
            \Log::error('Error creating teaching material: ' . $e->getMessage());
            return response()->json(['error' => 'Failed to create teaching material'], 500);
        }
    }
    
    public function getPendingAssignments(Request $request)
    {
        $validatedData = $request->validate([
            'batch_id' => 'required|exists:batches,id',
        ]);
    
        $user = $request->user();
        $userId = $user->id;
        $batchId = $validatedData['batch_id'];
    
        $assignments = TeachingMaterial::where('doc_type', 2)
            ->whereHas('batchTeachingMaterials', function ($query) use ($batchId) {
                $query->where('batch_id', $batchId);
            })
            ->with(['teachingMaterialStatuses' => function ($query) use ($userId, $batchId) {
                $query->where('user_id', $userId)
                    ->where('batch_id', $batchId);
            }])
            ->get()
            ->map(function ($assignment) use ($batchId, $userId) {
                $status = $assignment->teachingMaterialStatuses->first();
                $isSubmitted = $status !== null;
                
                return [
                    'id' => $assignment->id,
                    'title' => $assignment->name,
                    'description' => $assignment->description,
                    'batch_id' => $batchId,
                    'start_submission' => $assignment->start_submission, // Make sure these fields are included
                    'stop_submission' => $assignment->stop_submission,   // in the response
                    'file_url' => $assignment->file ? url("storage/" . $assignment->file) : null,
                    'is_submitted' => $isSubmitted,
                    'grade' => $isSubmitted ? $status->obtained_marks : null,
                ];
            });
    
        return response()->json([
            'assignments' => $assignments,
        ]);
    }
    
    public function submitAssignment(Request $request)
    {
        $validatedData = $request->validate([
            'teaching_material_id' => 'required|exists:teaching_materials,id',
            'batch_id' => 'required|exists:batches,id',
            'file' => 'required|file|max:10240', // 10MB Max
        ]);

        $user = $request->user();
        $userId = $user->id;

        // Get the teaching material to check submission dates
        $teachingMaterial = TeachingMaterial::findOrFail($validatedData['teaching_material_id']);
        
        // Check if submission window is open
        $now = now();
        if ($teachingMaterial->start_submission && $now < $teachingMaterial->start_submission) {
            return response()->json([
                'message' => 'Submission window has not opened yet.',
                'start_date' => $teachingMaterial->start_submission
            ], 422);
        }
        
        if ($teachingMaterial->stop_submission && $now > $teachingMaterial->stop_submission) {
            return response()->json([
                'message' => 'Submission deadline has passed.',
                'end_date' => $teachingMaterial->stop_submission
            ], 422);
        }

        // Check if the assignment has already been submitted
        $existingSubmission = TeachingMaterialStatus::where([
            'user_id' => $userId,
            'teaching_material_id' => $validatedData['teaching_material_id'],
            'batch_id' => $validatedData['batch_id'],
        ])->first();

        if ($existingSubmission) {
            return response()->json([
                'message' => 'Assignment has already been submitted.',
            ], 400);
        }

        // Store the file
        $path = $request->file('file')->store('uploads', 'public');

        // Create new submission
        $submission = TeachingMaterialStatus::create([
            'user_id' => $userId,
            'teaching_material_id' => $validatedData['teaching_material_id'],
            'batch_id' => $validatedData['batch_id'],
            'file' => $path,
            // 'obtained_marks' is not set here as per your requirement
        ]);

        return response()->json([
            'message' => 'Assignment submitted successfully.',
            'submission' => $submission,
        ], 201);
    }

    public function getChartData(Request $request)
    {
        $data = $this->getAssignmentData($request->user());
        return response()->json($data);
    }

    protected function getAssignmentData($user)
    {

        $formattedData = [];

        $assignmentStatuses = TeachingMaterialStatus::where('user_id', $user->id)->get();

        foreach ($assignmentStatuses as $assignmentStatus) {
            $teachingMaterial = TeachingMaterial::find($assignmentStatus->teaching_material_id);

            if ($teachingMaterial) {
                $formattedData[] = [
                    'assignment_name' => $teachingMaterial->name,
                    'obtained_marks' => $assignmentStatus->obtained_marks,
                    // 'max_marks'=>$teachingMaterial->maximum_marks
                ];
            }
        }

        return $formattedData;
    }

    public function getByTopic($topic_id)
    {
        $batch_id = request()->query('batch_id');
        $materials = TeachingMaterial::where('topic_id', $topic_id)
            ->orderBy('sort', 'asc')
            ->get();

        \Log::info('getByTopic called', [
            'topic_id' => $topic_id,
            'batch_id' => $batch_id,
            'materials_count' => $materials->count(),
        ]);

        if ($materials->isEmpty()) {
            return response()->json(['message' => 'No materials found for this topic.'], 200);
        }

        return TeachingMaterialResource::collection($materials);
    }

    public function show($topicId)
    {
        try {
            $materials = TeachingMaterial::where('topic_id', $topicId)
                ->select([
                    'id',
                    'topic_id',
                    'section_id',
                    'name as material_name',
                    'description',
                    'material_source',
                    'content',
                    'file',
                    'doc_type',
                    'start_submission',
                    'stop_submission'
                ])
                ->get()
                ->map(function ($material) {
                    // Format dates properly
                    $material->start_submission = $material->start_submission ? date('Y-m-d H:i:s', strtotime($material->start_submission)) : null;
                    $material->stop_submission = $material->stop_submission ? date('Y-m-d H:i:s', strtotime($material->stop_submission)) : null;
                    return $material;
                });

            // Debug log
            \Log::info('Teaching materials for topic ' . $topicId, [
                'materials' => $materials->toArray()
            ]);

            return response()->json([
                'success' => true,
                'data' => $materials,
                'message' => 'Teaching materials retrieved successfully'
            ]);
        } catch (\Exception $e) {
            \Log::error('Error fetching teaching materials: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Error retrieving teaching materials',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function destroy($id)
    {
        try {
            $user = request()->user();
            
            // Check if user has admin/coordinator permissions
            if (!$user->is_admin && !$user->is_coordinator) {
                return response()->json(['error' => 'Unauthorized'], 403);
            }

            $teachingMaterial = TeachingMaterial::findOrFail($id);

            // Delete the file from storage if it exists
            if ($teachingMaterial->file && \Storage::disk('public')->exists($teachingMaterial->file)) {
                \Storage::disk('public')->delete($teachingMaterial->file);
            }

            // Delete the teaching material
            $teachingMaterial->delete();

            \Log::info('Teaching material deleted successfully', [
                'teaching_material_id' => $id,
                'user_id' => $user->id
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Teaching material deleted successfully'
            ]);

        } catch (\Exception $e) {
            \Log::error('Error deleting teaching material: ' . $e->getMessage());
            return response()->json(['error' => 'Failed to delete teaching material'], 500);
        }
    }

    /**
     * Get the submission status for a specific assignment for the current user.
     */
    public function getAssignmentSubmission(Request $request, $assignmentId)
    {
        $user = $request->user();
        $userId = $user ? $user->id : null;
        $batchId = $request->query('batch_id');
        
        \Log::info('getAssignmentSubmission called', [
            'user_id' => $userId,
            'assignment_id' => $assignmentId,
            'batch_id' => $batchId
        ]);

        $query = TeachingMaterialStatus::where('teaching_material_id', $assignmentId)
            ->where('user_id', $userId);
        if ($batchId) {
            $query->where('batch_id', $batchId);
        }
        $submission = $query->first();

        \Log::info('Submission found:', [
            'submission' => $submission
        ]);

        if ($submission) {
            return response()->json([
                'submission' => [
                    ...$submission->toArray(),
                    'file' => $submission->file ? url('storage/' . $submission->file) : null,
                ]
            ]);
        } else {
            return response()->json(['message' => 'No submission found.'], 404);
        }
    }
}
