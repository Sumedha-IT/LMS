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
    public function index($batch_id, $curriculum_id = null, $section_id = null)
    {

        $user = \request()->user();

        $batch = $user->batches()->where('batches.id', $batch_id)->count();

        if ($batch) {

            $sections = TeachingMaterial::select('teaching_materials.*')
                ->join('sections', 'sections.id', '=', 'teaching_materials.section_id')
                ->join('batch_section', 'sections.id', '=', 'batch_section.section_id')
                ->join('batch_teaching_materials', 'teaching_materials.id', '=', 'batch_teaching_materials.teaching_material_id')
                ->where('batch_section.batch_id', $batch_id)
                ->where('batch_teaching_materials.batch_id', $batch_id)
                ->when($curriculum_id, function ($q) use ($curriculum_id) {
                    $q->where('sections.curriculum_id', $curriculum_id);
                })
                ->when($section_id, function ($q) use ($section_id) {
                    $q->where('teaching_materials.section_id', $section_id);
                })
                ->get();

            if ($sections->isEmpty()) {
                return response()->json(['message' => 'No records found.'], 200);
            }

            return TeachingMaterialResource::collection($sections);
        } else {
            return response()->json(['message' => 'No records found.'], 200);
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
                    'start_submission' => $assignment->start_submission,
                    'end_submission' => $assignment->stop_submission,
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
    $path = $request->file('file')->store('uploads');

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
}
