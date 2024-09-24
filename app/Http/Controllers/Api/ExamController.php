<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\ExamResource;
use App\Models\Exam;
use App\Models\ExamQuestion;
use App\Models\Question;
use App\Models\QuestionBank;
use Illuminate\Database\QueryException;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class ExamController extends Controller
{
    public function show($id){
        $validator = Validator::make(['id' => $id], [
            'id' => 'required|integer'
        ]);

        if ($validator->fails()) {
            return response()->json(['message' => 'Exam Id must be Integer', 'success' => false, 'status' => 404], 404);
        }
        $exam = Exam::find($id);

        if (empty($exam)) {
            return response()->json(['message' => 'Exam Id not found',  'success' => false, 'status' => 404], 404);
        }             

        $examQuestions = ExamQuestion::where('exam_id', $exam->id)
            ->select('id', 'part_id', 'question_id', 'question_bank_id') // Select only the required fields
            ->get()
            ->groupBy('part_id'); 
            // Group by 'section'

        // Prepare the response structure
        $data = [];
        
        foreach ($examQuestions as $section => $questions) {
            // Prepare section data
            $data[$section] = [
                'questionBanks' => $questions->groupBy('question_bank_id')->map(function ($group) {
                    return $group->count(); // Count how many questions per question_bank_id
                })
            ];
            

            $qbIds = $data[$section]['questionBanks']->keys();
            $qbNames = QuestionBank::select('name','id')->whereIn('id',$qbIds)->groupBy('id')->get();
            $qbConfig = Question::selectRaw('question_bank_id, COUNT(*) as question_count')
                        ->whereIn('question_bank_id', $qbIds)->groupBy('question_bank_id')->get();

            foreach ($data[$section]['questionBanks'] as $qbId => $counts) {
                $data[$section][$qbId] = [
                    "name" => $qbNames->where('id',$qbId)->pluck('name')->first(),
                    "totalQuestions" =>$qbConfig->where('question_bank_id', $qbId)->pluck('question_count')->first(),
                    "usedQuestions" => $counts,
                    "id" => $qbId
                ];
            }
            unset($data[$section]['questionBanks']);
        }

        $exam->meta = $data;
        return new ExamResource($exam);
    }

    public function index(Request $request){
        $data = request()->query();

        $size = $request->get('size') == 0 ? 25 : $request->get('size');
        $pageNo = $request->get('page', 1);
        $offset = ($pageNo - 1) * $size;
        $totalRecords = Exam::count();

        $exams = Exam::with('batch')
        // Apply batchId filter only if it exists
        ->when(!empty($data['batchId']), function ($query) use ($data) {
            return $query->where('batch_id', $data['batchId']);
        })
        // Apply date filter based on the criteria ('past' or 'upcoming')
        ->when(isset($data['dateCriteria']) && in_array($data['dateCriteria'], ['past', 'upcoming']), function ($query) use ($data) {
            $operator = $data['dateCriteria'] === 'past' ? '<' : '>';
            return $query->where('exam_date', $operator, now());
        })
        // Order by 'created_by' either ascending or descending based on the direction provided
        ->when(!empty($data['sortOrder']), function ($query) use ($data) {
            $direction = $data['sortOrder'] === 'desc' ? 'desc' : 'asc';
            return $query->orderBy('created_at', $direction);
        })
        // Apply pagination logic
        ->offset($offset)
        ->limit($size)
        ->get();

        $data = [
            "data" => empty($exams) ? [] : ExamResource::collection($exams),
            "totalRecords" => $totalRecords,
            "totalPages" => ceil($totalRecords / $size)
        ];
        return response()->json($data,200);
    }

    public function create(Request $request){
        $data = $request->data;
        $data = $this->validateExam($data);

        if (!empty($data['message'])) {
            return response()->json($data, 400);
        }

        try {
            $exam =  Exam::create($data);
            $data =  new ExamResource($exam);
        } catch (QueryException $e) {
            if ($e->getCode() === '23000') {
                return response()->json([
                    'message' => 'Duplicate entry for name and batch_id combination',
                    'success' => false,
                    'status' =>  409
                ], 409); // 409 Conflict
            }
        }
        return response()->json(["data" => $data, 'message' => "Exam Created", "success" => true,'status' => 200], 200);
    }

    public function validateExam($data){

        $validator = Validator::make($data, [
            'id' => 'nullable|integer',
            'batchId' => 'required|integer|exists:batches,id',
            'subjectId' => 'required|integer|exists:subjects,id',
            'title' => ['required','string','max:255'],
            'instructions' => 'nullable|string|max:1000',
            'startsAt' => 'required|date_format:H:i',
            'endsAt' => 'required|date_format:H:i|after:startsAt',
            'examDate' => 'required|date_format:Y-m-d|after:today',
            'immediateResult' => 'boolean',
            'maxAttempts' => 'integer|max:10',
            'invigilators' => 'array',
            'invigilators.*.name' => 'required|string|max:255', 
            'invigilators.*.id' => 'required|integer|exists:users,id',
            'invigilators.*.phone' => 'required|string',
            'invigilators.*.email' => 'nullable|email',
        ]);
        
        if (!empty($validator->errors()->messages())) {
            return ['message' => $validator->errors()->all()[0], 'status' => 400,'success' =>false];
        }

        $data = $validator->validate();
        $data["starts_at"] = $data['startsAt'];
        $data['ends_at'] = $data['endsAt'];
        $data['max_attempts'] = $data['maxAttempts'] ?? 1;
        $data['batch_id'] = $data['batchId'];
        $data['subject_id'] = $data['subjectId'];
        
        $data['immediate_result'] = $data['immediateResult'] ?? 0;
        $data['exam_date'] =$data['examDate'];
        return $data;   
    }

    public function delete($id){

        $exam = Exam::find($id);
        if ($exam) {
            $exam->delete();
            return response()->json(['message' => 'Exam deleted successfully',"hasError"=>false], 200);
        }
        return response()->json(['message' => 'Exam not found',"hasError"=>false], 404);
        

    }

    public function update($id,Request $request){
        $data = $request->data;
        if (empty($data)) {
            return response()->json(['message' => "Data key required", "hasError" => true], 400);
        }

        $exam =Exam::find($id);
        if (empty($exam)) {
            return response()->json(['message' => "Exam Not Found","hasError"=>false], 404);
        }

        $data = $this->validateExam($data);

        if (!empty($data['message'])) {
            return response()->json($data, 400);
        }

        if($exam->name == $data['title']){
            unset($data['title']);
        }

        try {
            $exam->update($data);
        } catch (QueryException $e) {
            if ($e->getCode() === '23000') {
                return response()->json([
                    'message' => 'Duplicate entry for name and batch_id combination',
                    'hasError' => true
                ], 409); // 409 Conflict
            }
        }

        return response()->json(['message' => "Exam Updated","hasError"=>false], 200);
    }

}
