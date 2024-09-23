<?php

namespace App\Http\Controllers;

use App\Models\Exam;
use App\Models\ExamQuestion;
use App\Models\Question;
use App\Models\QuestionBank;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;

class ExamQuestionController extends Controller
{
    public function create($examId, Request $request)
    {
        $data = $request->data;
        $exam = Exam::find($examId);
        if (empty($exam)) {
            return response()->json(['message' => 'Exam Id not found',  'success' => false, "status" => 404], 404);
        }     
        $exam->examQuestions()->delete();

        $data = $this->validateExamQuestions($request->data,$exam);
        if (!empty($data['message'])) {
            return response()->json($data, 400);
        }

        $this->saveQuestionToExam($data,$exam);
        return response()->json(['message' => 'Questions added', 'success' => true, "status" => 200], 200);
    }

    public function validateExamQuestions($data,$exam){
        $validator = Validator::make($data, [
            '*.partId' => 'required|string',                     // Each section must have a partId that is a string
            '*.banks' => 'required|array',                       // banks is required and must be an array
            '*.banks.*.id' => 'nullable|integer|distinct|exists:question_banks,id', // ID is optional, but if present it must be an integer
            '*.banks.*.questionsIds' => 'nullable|array',        // questionsIds is required and must be an array (can be empty)
        ]);

        if ($validator->fails()) {
            return ['message' => $validator->errors()->all()[0], 'status' => 400, 'success' => false];
        }

        //Extract BankIds
        $bankIds = collect($data)->flatMap(function ($part) {
            return collect($part['banks'])->pluck('id');
        })->toArray();

        //Get All  Questions and group by BankIds
        $questionsByBank = Question::whereIn('question_bank_id', $bankIds)
                        ->get()
                        ->groupBy('question_bank_id')
                        ->map(function ($questions) {
                            return $questions->pluck('id')->toArray();
                        })->toArray();

        $questionToAdd = [];
        // Add custom validation to check if questions exist in the database
        foreach ($data as &$part) {
            foreach ($part['banks'] as &$bank) {
                $bankId = $bank['id'];
                // Check if the bank has any questions
                if (empty($questionsByBank[$bankId])) {
                    $validator->errors()->add(
                        'error',
                        'bankId ' . $bankId . ' does not contain any questions'
                    );
                    break; // Breaks out of the inner loop, but not the outer
                }
        
                // Validate question IDs if they are provided
                if (!empty($bank['questionsIds']) && !empty($bank['id'])) {
                    $questionsIds = $bank['questionsIds'];
                    $notExistedQuestions = array_diff($questionsIds, $questionsByBank[$bankId]);
        
                    // Check if the counts of question IDs match
                    if (count($questionsByBank[$bankId]) !== count($questionsIds)) {
                        $validator->errors()->add(
                            'banks.' . $bankId . '.questionsIds',
                            'Question IDs: ' . implode(', ', $notExistedQuestions) . " do not exist in question Bank ID: " . $bankId
                        );
                        break; // This breaks out of the inner loop
                    }
                    $questionToAdd[$part['partId']] =  $questionsIds;
                } else {
                    // Assign existing question IDs from the bank
                    $questionToAdd[$part['partId']] = $questionsByBank[$bankId];
                }
            }
        }
        

        if (!empty($validator->errors()->messages())) {
            return ['message' => $validator->errors()->all()[0], 'status' => 400, 'success' => false];
        }

        return $questionToAdd;   
    }

    public function saveQuestionToExam($questionsToAdd,$exam){
        $questionIds = []; // Collect all question IDs for one query
    
        // Collect all question IDs from the array
        foreach ($questionsToAdd as $questionIdsBySection) {
            $questionIds = array_merge($questionIds, $questionIdsBySection);
        }
    
        // Fetch all the questions in one query
        $questions = Question::whereIn('id', $questionIds)->get()->keyBy('id');
    
        $input = []; // This will store the batch insert data
        // Iterate through the sections and their respective question IDs
        foreach ($questionsToAdd as $partId => $questionIds) {
            foreach ($questionIds as $questionId) {
                // Check if the question exists in the fetched questions
                if (isset($questions[$questionId])) {
                    $question = $questions[$questionId]; // Get the question object
                    
                    $input[] = [
                        'question_id'       => $questionId,
                        'question_bank_id'  => $question->question_bank_id,  // From the pre-fetched question
                        'part_id'           => $partId ,  // Handle "default" section
                        'exam_id'           => $exam->id,  // Constant exam ID
                        'meta'              => json_encode($question->toArray()),  // Store the entire question data as JSON
                        // 'created_at'        => now(),  // Timestamp for creation
                        // 'updated_at'        => now(),  // Timestamp for update
                    ];
                }
            }
        }

        // Perform a batch insert with the prepared data
        ExamQuestion::insert($input);
    }

    public function delete($examId, Request $request)
    {
        $exam = Exam::find($examId)->first();
        if (empty($exam)) {
            return response()->json(['message' => "Exam Not Found", "success" => false, "status" => 404], 404);
        }
        $data = $request->data;
        $data['examId'] = $examId;

        $data = $this->validateExamQuestions($data);
        ExamQuestion::whereIn('question_id', $data['questionIds'])->delete();
        return response()->json(['message' => "Questions Removed", "success" => true, "status" => true], 200);
    }

    public function patch($examId, Request $request)
    {
        $data = $request->data;
        $data['examId'] = $examId;

        $data = $this->validateExamQuestions($request->data);
        if (!empty($data['message'])) {
            return response()->json($data, 400);
        }
        if (!empty($data['randomQuestions'])) {

            ExamQuestion::where('exam_id', $data['examId'])
                ->where('section', $data['section'])
                ->where('question_bank_id', $data['questionBankId'])->delete();

            $data['questionIds'] = QuestionBank::find($data['questionBankId'])
                ->questions()
                ->inRandomOrder()
                ->take($data['randomQuestions'])
                ->pluck('id');
            $this->saveQuestionToExam($data);
        } else {
            $existedQuestionIds = ExamQuestion::where('exam_id', $data['examId'])->pluck('question_id')->toArray();
            $questionToBeDeleted =  array_diff($existedQuestionIds, $data['questionIds']);
            $data['questionIds'] = array_diff($data['questionIds'], $existedQuestionIds);

            ExamQuestion::where('exam_id', $data['examId'])->whereIn('question_id', $questionToBeDeleted)->delete();
            $this->saveQuestionToExam($data);
        }

        return response()->json(['data' => $data, 'message' => 'Exam Paper Updated', 'hasError' => false]);
    }

    public function index($examId, Request $request)
    {

        $data = request()->query();
        extract($data);

        $size = $request->get('size') == 0 ? 25 : $request->get('size');
        $pageNo = $request->get('page', 1);
        $offset = ($pageNo - 1) * $size;
        $totalRecords = Question::where('question_bank_id',$questionBankId)->count();

        // Raw query using CASE statement to determine selection
        $questions = DB::table('questions')
        ->leftJoin('exam_questions', function ($join) use ($partId, $examId) {
            $join->on('questions.id', '=', 'exam_questions.question_id')
            ->where('exam_questions.part_id', $partId)
                ->where('exam_questions.exam_id', $examId);
        })
        ->select(
            'questions.id',
            'questions.question_bank_id As questionBankId',
            'questions.question',
            DB::raw('CASE WHEN exam_questions.question_id IS NOT NULL THEN true ELSE false END AS selected')
        )->where('questions.question_bank_id', $questionBankId)->orderBy('selected', 'desc')
        ->offset($offset)
        ->limit($size)
        ->get();

        $data = [
            "data" => empty($questions) ? [] : $questions,
            "totalRecords" => $totalRecords,
            "totalPages" => ceil($totalRecords / $size),
            "status" => 200,
            "success" => true
        ];
        return response()->json($data,200);
    }

    public function getQuestionIds(Request $request)
    {
        $data = $request->data;
        $validator = Validator::make($data, [
            'autoSelect'     => 'required|boolean|in:1',
            'totalQuestion'  => 'required|boolean',
            'questionCount'  => 'nullable|integer',
            'questionBankId' => 'required|exists:question_banks,id',
        ]);

        if ($validator->fails()) {
            return response()->json(["message" => $validator->errors()->all()[0], 'status' => 200, 'success' => false]);
        }

        $data = $validator->validated(); // Use validated() instead of validate()

        // Determine the query for question IDs based on totalQuestion
        $questionQuery = Question::where('question_bank_id', $data['questionBankId']);

        if ($data['totalQuestion']==false) {
            $questionIds = $questionQuery->inRandomOrder()->limit($data['questionCount'])->pluck('id');
        } else {
            $questionIds = $questionQuery->pluck('id');
        }
        return response()->json(["data" => $questionIds->toArray(), 'status' => 200, 'success' => true]);
    }
}
