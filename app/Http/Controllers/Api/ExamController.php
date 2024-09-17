<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\exam\CreateExamRequest;
use App\Http\Resources\ExamResource;
use App\Models\Exam;
use App\Models\ExamQuestion;
use Illuminate\Database\QueryException;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Symfony\Component\CssSelector\Node\FunctionNode;

class ExamController extends Controller
{
    public function show($id){
        $validator = Validator::make(['id' => $id], [
            'id' => 'required|integer'
        ]);

        if ($validator->fails()) {
            return response()->json(['message' => 'Exam Id must be Integer', 'hasError'=>true], 404);
        }
        $exam = Exam::find($id);

        if (empty($exam)) {
            return response()->json(['message' => 'Exam Id not found', 'hasError'=>false], 404);
        }            
        return new ExamResource($exam);
    }

    public function index(Request $request){
        $size = $request->get('size') == 0 ? 25 : $request->get('size');
        $pageNo = $request->get('page', 1);
        $offset = ($pageNo - 1) * $size;
        $totalRecords = Exam::count();

        // Fetch the records for the current page
        $exams = Exam::offset($offset)->limit($size)->get();

        //  Fetch distinct sections for each exam
        $exams->each(function ($exam) {
            $sections = ExamQuestion::where('exam_id', $exam->id)
                ->distinct('section')
                ->pluck('section')
                ->toArray();
            
            // Add sections to the meta column
            $exam->meta = [
                'sections' => $sections
            ];
        });

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
            Exam::create($data);
        } catch (QueryException $e) {
            if ($e->getCode() === '23000') {
                return response()->json([
                    'message' => 'Duplicate entry for name and batch_id combination',
                    'hasError' => true
                ], 409); // 409 Conflict
            }
        }
        return response()->json(['message' => "Exam Created"], 200);
    }

    public function validateExam($data){

        $validator = Validator::make($data, [
            'id' => 'nullable|integer',
            'batchId' => 'required|integer|exists:batches,id',
            'name' => ['required','string','max:255'],
            'instructions' => 'nullable|string|max:1000',
            'startsAt' => 'required|date_format:Y-m-d H:i:s',
            'endsAt' => 'required|date_format:Y-m-d H:i:s|after:startsAt',
            'duration' => 'required|date_format:H:i',
            'immediateResult' => 'required|boolean',
            'maxAttempts' => 'integer|max:10',
        ]);

        if(!empty($validator->errors()->messages())){
            return ['message' => "Invalid data",'hasError'=>true];
        }

        

        $data = $validator->validate();
        $data["starts_at"] = $data['startsAt'];
        $data['"ends_at"'] = $data['endsAt'];
        $data['max_attempts'] = $data['maxAttempts'];
        $data['batch_id'] = $data['batchId'];
        $data['immediate_result'] = $data['immediateResult'];

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
        $exam =Exam::find($id);

        if (empty($exam)) {
            return response()->json(['message' => "Exam Not Found","hasError"=>false], 404);
        }

        $data = $request->data;
        $data = $this->validateExam($data);

        if (!empty($data['message'])) {
            return response()->json($data, 400);
        }

        if($exam->name == $data['name']){
            unset($data['name']);
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
        return response()->json(['message' => "Exam Updated"], 200);
    }

}
