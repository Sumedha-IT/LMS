<?php

namespace App\Http\Controllers;


use App\Http\Resources\QuestionBankResource;
use App\Models\QuestionBank;
use App\Models\QuestionBankDifficulty;
use App\Models\QuestionBankType;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class QuestionBankController extends Controller
{

    public function show($id){
        $validator = Validator::make(['id' => $id], [
            'id' => 'nullable|integer'
        ]);

        if ($validator->fails()) {
            return response()->json(['message' => 'Question Bank Id must be Integer', 'hasError'=>true], 400);
        }
        $questionBank = QuestionBank::find($id);

        if (empty($questionBank)) {
            return response()->json(['message' => 'Question bank not found', 'hasError'=>false], 404);
        }            
        return new QuestionBankResource($questionBank);
    }

    public function index(Request $req)
    {
        $size = $req->get('size') == 0 ? 25 : $req->get('size');
        $pageNo = $req->get('page', 1);
        $offset = ($pageNo - 1) * $size;

        $totalRecords = QuestionBank::count();

        // Fetch the records for the current page
        $questionBanks =  QuestionBank::withCount('questions')->offset($offset)->limit($size);

        $data = [
            "data" => ($questionBanks->count() == 0) ? [] : QuestionBankResource::collection($questionBanks->get()),
            "totalRecords" => $totalRecords,
            "totalPages" => ceil($totalRecords / $size)
        ];
        return response()->json($data, 200);
    }

    public function create(Request $req)
    {
        $data = $req->data;
        $data = $this->validateQuestionBank($data);
        if (!empty($data['message'])) {
            return response()->json($data, 400);
        }
        
        QuestionBank::create($data);
        return response()->json(['message' => "Question Bank Created","hasError"=>false], 200);
    }

    public function update($id,Request $request){

        $data = $request->data;
        $questionBank =QuestionBank::find($id);

        if (empty($questionBank)) {
            return response()->json(['message' => "Question Bank Not Found","hasError"=>false], 404);
        }

        $data = $this->validateQuestionBank($data);
        $questionBank->update($data);

        if (!empty($data['message'])) {
            return response()->json($data, 400);
        }

        return response()->json(['message' => "Question Bank Updated"], 200);
    }

    public function validateQuestionBank($data)
    {
        
        $validator = Validator::make($data, [
            'name' => 'nullable|string',
            'questionBankSubjectId' => 'required|integer|exists:question_bank_subjects,id',
            'questionBankChapter' => 'nullable|string',
            'questionBankDifficultyId' => 'nullable|integer|exists:question_bank_difficulties,id',
            'questionBankTypeId' => 'nullable|integer|exists:users,id',
            'description' => 'nullable|string|max:255'
        ]);

        if (!empty($validator->errors()->messages())) {
            return ['message' => $validator->errors()->all()[0], 'status' => 400,'success' =>false];
        }
        $data = $validator->validate();
        $data = [
            "name" => $data['name'],
            "question_bank_subject_id" => $data['questionBankSubjectId'],
            "question_bank_chapter" => $data['questionBankChapter'] ?? 1,   //Hard code coursePackageID
            "question_bank_difficulty_id" => $data['questionBankDifficultyId'] ?? null,
            "manager_id" => $data['questionBankTypeId'] ?? null,
            "description" => $data['description'] ?? null,
        ];

        return $data;
    }

    public function delete($id){
        $questionBank = QuestionBank::find($id);
        if ($questionBank) {
            $questionBank->delete();
            return response()->json(['message' => 'Question bank deleted successfully',"hasError"=>false], 200);
        }
        return response()->json(['message' => 'Question bank not found',"hasError"=>false], 404);
    }

    public function getQuestionBankTypes(){
        return response()->json(QuestionBankType::all(),200);
    }

    public function getQuestionBankDifficulties(){
        return response()->json(QuestionBankDifficulty::all());
    }
}