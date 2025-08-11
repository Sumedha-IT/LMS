<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Http\Resources\BatchResource;
use App\Http\Resources\CurriculumResource;
use App\Models\Batch;
use App\Models\Curriculum;
use Illuminate\Support\Facades\Validator;

class BatchController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();

        // Allow admin and academic coordinator to see all batches
        if (
            (isset($user->role) && ($user->role === 'admin' || $user->is_admin ?? false)) ||
            ($user->role && ($user->role->name === 'Academic Coordinator' || $user->is_coordinator ?? false))
        ) {
            // Return all batches for admin and academic coordinator
            $batches = Batch::with('course_package')->get();
        } else {
            // Return only assigned batches for others
            $batches = $user->batches()->with('course_package')->get();
        }

        return BatchResource::collection($batches);
    }

    public function view($id, Request $request)
    {
        $user = $request->user();
        $batches = $user->batches()
            ->with('course_package')
            ->find($id);
        return new BatchResource($batches);
    }

    public function show($id, Request $request){
        $validator = Validator::make(['id' => $id], [
            'id' => 'required|integer'
        ]);

        if ($validator->fails()) {
            return response()->json(['message' => 'Batch Id must be Integer', 'hasError'=>true], 404);
        }

        $user = $request->user();
        
        // Add logging for debugging
        \Log::info('Batch show method called', [
            'user_id' => $user->id,
            'user_role' => $user->role->name ?? 'unknown',
            'batch_id' => $id,
            'is_tutor' => $user->is_tutor,
            'is_admin' => $user->is_admin,
            'is_coordinator' => $user->is_coordinator
        ]);

        // If tutor, check if assigned to this batch
        if ($user->is_tutor) {
            $assigned = \App\Models\BatchCurriculum::where('batch_id', $id)
                ->where('tutor_id', $user->id)
                ->exists();
            if (!$assigned) {
                return response()->json(['message' => 'Unauthorized batch access', 'hasError'=>true], 403);
            }
        }

        $batch = Batch::with(['students', 'students.batches.course_package'])->find($id);

        if (empty($batch)) {
            \Log::warning('Batch not found', ['batch_id' => $id]);
            return response()->json(['message' => 'Batch id not found', 'hasError'=>false], 404);
        }

        // Log the batch data being returned
        \Log::info('Batch data being returned', [
            'batch_id' => $batch->id,
            'batch_name' => $batch->name,
            'student_count' => $batch->students->count(),
            'students' => $batch->students->map(function($student) {
                return [
                    'id' => $student->id,
                    'name' => $student->name
                ];
            })
        ]);
            
        return new BatchResource($batch);
    }

    public function getBatches(Request $req)
    {
        $size = $req->get('size') == 0 ? 25 : $req->get('size');
        $pageNo = $req->get('page', 1);
        $offset = ($pageNo - 1) * $size;
        $totalRecords = Batch::count();

        // Fetch the records for the current page
        $batches = Batch::offset($offset)->limit($size)->get();
        $data = [
            "data" => empty($batches) ? [] : BatchResource::collection($batches),
            "totalRecords" => $totalRecords,
            "totalPages" => ceil($totalRecords / $size)
        ];
        return response()->json($data,200);
    }

    public function create(Request $request)
    {

        $data = $request->data;
        $data = $this->validateBatch($data);
        if (!empty($data['message'])) {
            return response()->json($data, 400);
        }
        $batch = Batch::create($data);
        return response()->json(['message' => "Batch Created","data"=>$batch,"hasError"=>false], 200);
    }

    public function update($id,Request $request){

        $data = $request->data;
        $batch =Batch::find($id);

        if (empty($batch)) {
            return response()->json(['message' => "Batch Not Found","hasError"=>false], 404);
        }

        $data = $this->validateBatch($data);
        if (!empty($data['message'])) {
            return response()->json($data, 400);
        }

        $batch = $batch->update($data);
        if (!empty($data['message'])) {
            return response()->json($data, 400);
        }

        return response()->json(['message' => "Batch Updated","batch"=>$batch], 200);
    }

    public function delete($id){
        $batch = Batch::find($id);
        if ($batch) {
            $batch->delete();
            return response()->json(['message' => 'Batch deleted successfully',"hasError"=>false], 200);
        }
        return response()->json(['message' => 'Batch not found',"hasError"=>false], 404);
    }

    public function validateBatch($data){
        $validator = Validator::make($data, [
            'teamId' => 'nullable|integer|exists:teams,id',
            'branchId' => 'nullable|integer|exists:branches,id',
            'coursePackageId' => 'required|integer',
            'courseId' => 'nullable|integer|exists:courses,id',
            'managerId' => 'required|integer|exists:users,id',
            'batchName' => 'required|string|max:255',
            'attendenceSetting' => 'nullable|integer',
            'startDate' => 'required|date',
            'endDate' => 'required|date|after:startDate',
            'allowEditClassDate' => 'nullable|boolean',
            'allowEditClassTIme' => 'nullable|boolean',
            'curriculumData' => 'nullable|json',
        ]);

        if (!empty($validator->errors()->messages())) {
            return ['message' => $validator->errors()->all()[0], 'status' => 400, 'success' => false];
        }
        $data = $validator->validate();
        $data = [
            "team_id" => $data['teamId'] ,
            "branch_id" => $data['branchId'] ,
            "course_package_id" => $data['coursePackageId'] ?? 1,   //Hard code coursePackageID
            "course_id" => $data['courseId'] ?? null,
            "manager_id" => $data['managerId'] ?? null,
            "name" => $data['batchName'] ?? null,
            "attendance_setting" => $data['attendenceSetting'] ?? null,
            "start_date" => $data['startDate'] ?? null,
            "end_date" => $data['endDate'] ?? null,
            "allow_edit_class_date" => $data['allowEditClassDate'] ?? null,
            "curriculum_data" => $data['curriculumData'] ?? null
        ];

        return $data;
    }

 

    public function getCurriculams(Request $req)
    {
        $size = $req->get('size') == 0 ? 25 : $req->get('size');
        $pageNo = $req->get('page', 1);
        $offset = ($pageNo - 1) * $size;
        $totalRecords = Curriculum::count();

        // Fetch the records for the current page
        $batches = Curriculum::offset($offset)->limit($size)->get();
        $data = [
            "data" => empty($batches) ? [] : CurriculumResource::collection($batches),
            "totalRecords" => $totalRecords,
            "totalPages" => ceil($totalRecords / $size)
        ];
        return response()->json($data,200);
    }
}
