<?php

namespace App\Http\Controllers\api;

use App\Http\Controllers\Controller;
use App\Http\Resources\QuestionResource;
use App\Models\Question;
use App\Models\QuestionBank;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class QuestionController extends Controller
{
    public function index(Request $req){
        $validator = Validator::make(['questionBankId' => $req->questionBankId], [
            'questionBankId' => 'integer'
        ]);

        if ($validator->fails()) {
            return response()->json(['message' => 'Question Id must be Integer','hasError'=>true], 400);
        }

        $data = $validator->validated();

        // Fetch the QuestionBank by ID and immediately load the related questions
        $questionBank = QuestionBank::with('questions')->find($data['questionBankId']);

        if (!$questionBank) {
            return response()->json(['message' => 'Question Bank not found', 'hasError'=>false], 404);
        }

        // Access the questions relationship
        $questions = $questionBank->questions;

        if ($questions->isEmpty()) {
            return response()->json(['message' => 'Questions not found'], 404);
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
        $validator = Validator::make(['questionBankId' => $req->questionBankId], [
            'questionBankId' => 'integer',
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
}
