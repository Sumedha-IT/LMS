<?php

namespace App\Http\Controllers;

use App\Models\ExamQuestion;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class ExamQuestionController extends Controller
{
    public function create($examId, Request $request)
    {
        $data = $request->data;
        $data['examId'] = $examId;

        $data = $this->validateExamQuestions($data);
        if (!empty($data['message'])) {
            return response()->json($data, 400);
        }

        $questions = ExamQuestion::where('exam_id', $data['examId'])->whereIn('question_id', $data['questionIds'])->get();
        if (!$questions->isEmpty()) {
            $questionIds = $questions->pluck('question_id')->toArray();
            $data = [
                "message" => " Error ! Questions already exist in Exam i.e. " . implode(', ', $questionIds),
                "hasError" => true
            ];
            return $data;
        }

        $this->saveQuestionToExam($data);
        return response()->json(['message' => 'Questions added', 'hasError' => false], 200);
    }

    public function patch($examId, Request $request)
    {
        $data = $request->data;
        $data['examId'] = $examId;

        $data = $this->validateExamQuestions($request->data);
        if (!empty($data['message'])) {
            return response()->json($data, 400);
        }

        $existedQuestionIds = ExamQuestion::where('exam_id', $data['examId'])->pluck('question_id')->toArray();
        $questionToBeDeleted =  array_diff($existedQuestionIds, $data['questionIds']);
        $data['questionIds'] = array_diff($data['questionIds'], $existedQuestionIds);

        ExamQuestion::where('exam_id', $data['examId'])->whereIn('question_id', $questionToBeDeleted)->delete();
        $this->saveQuestionToExam($data);
        return response()->json(['message' => 'Exam Paper Updated', 'hasError' => false]);
    }

    public function index($examId, Request $request) {

        // Build the query
        $query = ExamQuestion::where('exam_id', $examId)
        ->with('questions'); // Eager load the related questions

        // Conditionally add the section filter
        if (!empty($request->section)) {
             $query->where('section', $request->section);
        }

        $questions = $query->get();
        dd($questions);
    
    }
    public function validateExamQuestions($data)
    {

        $validator = Validator::make($data, [
            "questionBankId" => "required|integer",
            "questionIds" => "required|array",
            "examId" => "required|integer|exists:exams,id",
            "section" => "required|string"
        ]);

        if (!empty($validator->errors()->messages())) {
            dd($validator->errors()->messages());
            return ['message' => "Invalid data", 'hasError' => true];
        }

        $data = $validator->validate();

        return $data;
    }

    public function saveQuestionToExam($data)
    {
        $input = [];
        foreach ($data['questionIds'] as $questionId) {
            $input[] = [
                'question_id' => $questionId,
                'question_bank_id' => $data['questionBankId'],
                'section' => $data['section'],
                'exam_id' => $data['examId']
            ];
        }
        ExamQuestion::insert($input);
    }
}
