<?php

namespace App\Http\Controllers\api;

use App\Http\Controllers\Controller;
use App\Http\Resources\QuestionResource;
use App\Models\Question;
use App\Models\QuestionBank;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use PhpParser\Node\Expr\FuncCall;

class QuestionController extends Controller
{
    public function index(Request $req){
        $validator = Validator::make(['questionBankId' => $req->questionBankId], [
            'questionBankId' => 'integer'
        ]);

        if ($validator->fails()) {
            return response()->json(['message' => 'Question Id must be Integer','hasError'=>true], 400);
            return response()->json(['message' =>  'Question Id must be Integer', 'success' => true, "status" => 400], 400);

        }

        $data = $validator->validated();
        // Fetch the QuestionBank by ID and immediately load the related questions
        $questionBank = QuestionBank::with('questions')->find($data['questionBankId']);

        if (!$questionBank) {
            return response()->json(['message' =>  'Question Bank not found', 'success' => false, "status" => 404], 404);

        }

        // Access the questions relationship
        $questions = $questionBank->questions;

        if ($questions->isEmpty()) {
            return response()->json(['message' => 'Questions not found', 'success' => true, "status" => 200], 200);

        }
        return QuestionResource::collection($questions);
    }

    public function show(Request $req)
    {
        $validator = Validator::make(['questionBankId' => $req->questionBankId, 'questionId' => $req->question_id], [
            'questionBankId' => 'integer',
            'questionId' => 'integer'
        ]);

        if ($validator->fails()) {
            return response()->json(['message' => 'Question Id must be Integer', 'hasError'=>true], 400);
        }
        $data = $validator->validated();
        $question = QuestionBank::with('questions')->find($data['questionBankId'])->questions->where("id",$data['questionId'])->first();
        if (empty($question)) {
            return response()->json(['message' => 'Question not found', 'hasError' => false], 404);
        }
        return new QuestionResource($question);
    }

    public function create(Request $req)
    {
        $data = $req->data;
        $data = $this->validateQuestion($data);
        if (!empty($data['message'])) {
            return response()->json($data, 400);
        }
        Question::create($data);
        return response()->json(['message' => "Question Created","hasError"=>false], 200);

    }

    public function update($id,Request $request){

        $data = $request->data;
        $question =Question::find($id);

        if (empty($question)) {
            return response()->json(['message' => "Question Not Found","hasError"=>false], 404);
        }

        $data = $this->validateQuestion($data);
        $question->update($data);

        if (!empty($data['message'])) {
            return response()->json($data, 400);
        }

        return response()->json(['message' => "Question Updated"], 200);
    }

    public function validateQuestion($data){
        $validator = Validator::make($data, [
            'questionBankId' => 'required|integer|exists:question_banks,id',
            'audioFile' => 'nullable|string', // Assuming audio file will be a path or URL as string
            'paragraph' => 'nullable|string',
            'question' => 'required|string',
            'questionTypeId' => 'required|integer|exists:question_bank_types,id', // Example: Assuming 1, 2, 3 are valid types
            'difficulty' => 'nullable|string', // Modify if difficulty is an integer or a specific enum
            'topic' => 'nullable|string',
            'marks' => 'required|numeric|min:0', // Assuming marks is numeric
            'negativeMarks' => 'nullable|numeric|min:0',
            'checkCapitalisation' => 'nullable|boolean', // Assuming it's a boolean flag
            'checkPunctuation' => 'nullable|boolean', // Assuming it's a boolean flag
        ]);
        if ($validator->fails()) {
            return ['message' => $validator->errors()->all()[0], 'hasError' => true];
        }
        
        $data = $validator->validate();

        $data = [
            "question_bank_id" => $data['questionBankId'],
            "audio_file" => $data['audioFile'] ?? null,
            "paragraph" => $data['paragraph'] ?? null,
            "question" => $data['question'],
            "question_type" => $data['questionTypeId'],
            "difficulty" => $data['difficulty'] ?? null,
            "topic" => $data['topic'] ?? null,
            "marks" => $data['marks'] ?? 0,
            "negative_marks" => $data['negativeMarks'] ?? 0,
            "check_capitalization" => $data['checkCapitalisation'] ?? null,
            "check_punctuation" => $data['checkPunctuation'] ?? null,
        ];

        return $data;
    }

    public function delete($id){
        $question = Question::find($id);
        if ($question) {
            $question->delete();
            return response()->json(['message' => 'Question deleted successfully',"hasError"=>false], 200);
        }
        return response()->json(['message' => 'Question not found',"hasError"=>false], 404);
    }
}
