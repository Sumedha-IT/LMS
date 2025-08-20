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

    private function formatQuestionContent($content)
    {
        if (empty($content)) {
            return $content;
        }

        // Check if the content contains code patterns
        $codePatterns = [
            '/class\s+\w+/i',
            '/function\s+\w+/i',
            '/if\s*\(/i',
            '/for\s*\(/i',
            '/while\s*\(/i',
            '/switch\s*\(/i',
            '/try\s*\{/i',
            '/catch\s*\(/i',
            '/import\s+/i',
            '/export\s+/i',
            '/const\s+/i',
            '/let\s+/i',
            '/var\s+/i',
            '/public\s+/i',
            '/private\s+/i',
            '/protected\s+/i',
            '/static\s+/i',
            '/final\s+/i',
            '/abstract\s+/i',
            '/interface\s+/i',
            '/extends\s+/i',
            '/implements\s+/i',
            '/new\s+/i',
            '/return\s+/i',
            '/break\s+/i',
            '/continue\s+/i',
            '/throw\s+/i',
            '/throws\s+/i',
            '/package\s+/i',
            '/namespace\s+/i',
            '/using\s+/i',
            '/include\s+/i',
            '/require\s+/i',
            '/def\s+/i',
            '/end\s+/i',
            '/begin\s+/i',
            '/initial\s+/i',
            '/always\s+/i',
            '/module\s+/i',
            '/endmodule\s+/i',
            '/wire\s+/i',
            '/reg\s+/i',
            '/input\s+/i',
            '/output\s+/i',
            '/inout\s+/i',
            '/parameter\s+/i',
            '/localparam\s+/i',
            '/assign\s+/i',
            '/always_comb\s+/i',
            '/always_ff\s+/i',
            '/always_latch\s+/i',
            '/posedge\s+/i',
            '/negedge\s+/i',
            '/\$display\s*\(/i',
            '/\$finish\s*\(/i',
            '/\$stop\s*\(/i'
        ];

        $hasCodePattern = false;
        foreach ($codePatterns as $pattern) {
            if (preg_match($pattern, $content)) {
                $hasCodePattern = true;
                break;
            }
        }

        if ($hasCodePattern) {
            // Check if the entire content looks like a code block (has multiple lines with code patterns)
            $lines = explode("\n", $content);
            $codeLineCount = 0;
            $totalLines = count($lines);
            
            foreach ($lines as $line) {
                $trimmedLine = trim($line);
                if (!empty($trimmedLine)) {
                    foreach ($codePatterns as $pattern) {
                        if (preg_match($pattern, $trimmedLine)) {
                            $codeLineCount++;
                            break;
                        }
                    }
                }
            }
            
            // If more than 50% of non-empty lines contain code patterns, treat as a complete code block
            if ($codeLineCount > 0 && ($codeLineCount / max(1, $totalLines)) > 0.3) {
                // Format as a complete code block
                return '<pre style="background-color: #f8f9fa; padding: 16px; border-radius: 8px; font-family: monospace; font-size: 14px; border: 1px solid #e9ecef; overflow-x: auto; white-space: pre-wrap; word-wrap: break-word; margin: 8px 0; line-height: 1.4;">' . htmlspecialchars($content) . '</pre>';
            } else {
                // Format individual lines as before
                $formattedLines = [];
                
                foreach ($lines as $line) {
                    $trimmedLine = trim($line);
                    if (!empty($trimmedLine)) {
                        // Check if this line contains code patterns
                        $isCodeLine = false;
                        foreach ($codePatterns as $pattern) {
                            if (preg_match($pattern, $trimmedLine)) {
                                $isCodeLine = true;
                                break;
                            }
                        }
                        
                        if ($isCodeLine) {
                            $formattedLines[] = '<div style="background-color: #f8f9fa; padding: 12px; border-radius: 6px; font-family: monospace; font-size: 14px; margin: 4px 0; border: 1px solid #e9ecef; overflow-x: auto; white-space: pre-wrap; word-wrap: break-word;">' . htmlspecialchars($line) . '</div>';
                        } else {
                            $formattedLines[] = '<div style="margin: 4px 0; word-wrap: break-word; overflow-wrap: break-word;">' . htmlspecialchars($line) . '</div>';
                        }
                    } else {
                        $formattedLines[] = '<div style="margin: 2px 0;">&nbsp;</div>';
                    }
                }
                
                return implode('', $formattedLines);
            }
        }

        return $content;
    }

    public function validateExamQuestions($data){
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
        $hasSelectedQuestions = false; // Flag to track if any questions are selected
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

                    // Check if there is not Existed Question
                    if (!empty($notExistedQuestions)) {
                        $validator->errors()->add(
                            'banks.' . $bankId . '.questionsIds',
                            'Question IDs: ' . implode(', ', $notExistedQuestions) . " do not exist in question Bank ID: " . $bankId
                        );
                        break; // This breaks out of the inner loop
                    }
 
                    $existedQuestionIds =  $questionToAdd[$part['partId']] ?? [];
                    $questionToAdd[$part['partId']] =  array_merge($questionsIds,$existedQuestionIds);
                    $hasSelectedQuestions = true; // Questions were selected

                } else {
                    // Assign existing question IDs from the bank
                    $questionToAdd[$part['partId']] =  array_merge($questionToAdd[$part['partId']] ?? [],$questionsByBank[$bankId]);
                    $hasSelectedQuestions = true; // Questions were selected
                }
                
            }
        }
        
        // Check if any questions were selected
        if (!$hasSelectedQuestions) {
            return ['message' => 'At least one question must be selected for the exam', 'status' => 400, 'success' => false];
        }

        if (!empty($validator->errors()->messages())) {
            return ['message' => $validator->errors()->all()[0], 'status' => 400, 'success' => false];
        }

        return $questionToAdd;   
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

    public function index($examId, Request $request)
    {
        $data = request()->query();
        $validator = Validator::make($data, [
            'questionBankId' => 'required|integer|exists:question_banks,id', 
            'partId' => 'required|string',                                     
        ]);

        if ($validator->fails())
            return ['message' => $validator->errors()->all()[0], 'status' => 400, 'success' => false];

        $questionIds = ExamQuestion::where('exam_id', $examId)->where('question_bank_id', $data['questionBankId'])->where('part_id', $data['partId'])->get()->pluck('question_id')
        ->toArray();

        //If Ids not found return all 
        if (count($questionIds) == 0)
            $questionIds = Question::where('question_bank_id', $data['questionBankId'])->get()->pluck('id')->toArray();

        $data = [
            "data" => empty($questionIds) ? [] : ($questionIds),
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

    public function saveQuestionToExam($questionsToAdd,$exam){
        $questionIds = []; // Collect all question IDs for one query
    
        // Collect all question IDs from the array
        foreach ($questionsToAdd as $questionIdsBySection) {
            $questionIds = array_merge($questionIds, $questionIdsBySection);
        }
    
        // Fetch all the questions in one query
        $questions = Question::with('questions_options')->whereIn('id', $questionIds)->get()->keyBy('id');
    
        $input = []; // This will store the batch insert data
        // Iterate through the sections and their respective question IDs
        $totalMarks = 0;
        foreach ($questionsToAdd as $partId => $questionIds) {
            foreach ($questionIds as $questionId) {
                // Check if the question exists in the fetched questions
                if (isset($questions[$questionId])) {
                    $question = $questions[$questionId]; // Get the question object
                    $options =  $question->questions_options;
                    
                    // Get the original question content (not pre-formatted)
                    $originalQuestion = $question->question;
                    
                    $input[] = [
                        'question_id'       => $questionId,
                        'question_bank_id'  => $question->question_bank_id,  // From the pre-fetched question
                        'part_id'           => $partId ,  // Handle "default" section
                        'exam_id'           => $exam->id,  // Constant exam ID
                        'question'          => $this->formatQuestionContent($originalQuestion),
                        'meta'              => json_encode([
                                                'options' => $options,
                                                'correctOption' => collect($options)->where('is_correct',1)->pluck('id')->first(),
                                                'questionMeta' => [
                                                    'audioFile' => $question->audio_file,
                                                    'paragraph' => $question->paragraph,
                                                    'hint' => $question->hint,
                                                    'explanation' => $question->explanation,
                                                    'image' => $question->image,
                                                ]
                                               ]),
                        'score'             => $question->marks,
                        'negative_score'    => $question->negative_marks,
                        'created_at'        => date('Y m d H:i:s'),
                        'updated_at'        => date('Y m d H:i:s')
                    ];
                    $totalMarks+=  $question->marks; 
                }
            }
        }
        
        // Perform a batch insert with the prepared data
        $exam->total_marks =  $totalMarks;
        $exam->save();
        ExamQuestion::insert($input);
    }

    /**
     * Re-process existing exam questions with new formatting
     */
    public function reprocessExamQuestions($examId)
    {
        $exam = Exam::find($examId);
        if (empty($exam)) {
            return response()->json(['message' => 'Exam not found', 'success' => false, 'status' => 404], 404);
        }

        // Get all exam questions for this exam
        $examQuestions = ExamQuestion::where('exam_id', $examId)->get();
        
        foreach ($examQuestions as $examQuestion) {
            // Get the original question from the questions table
            $originalQuestion = Question::find($examQuestion->question_id);
            if ($originalQuestion) {
                // Re-format the question content
                $examQuestion->question = $this->formatQuestionContent($originalQuestion->question);
                $examQuestion->save();
            }
        }

        return response()->json(['message' => 'Exam questions re-processed successfully', 'success' => true, 'status' => 200], 200);
    }
}
