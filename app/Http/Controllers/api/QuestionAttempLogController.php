<?php

namespace App\Http\Controllers\api;

use App\Http\Controllers\Controller;
use App\Models\ExamAttempt;
use App\Models\ExamQuestion;
use App\Models\QuestionAttemptLog;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rule;

class QuestionAttempLogController extends Controller
{
    public function getQuestions(Request $request){
        $data = request()->query();

        $size = $request->get('size') == 0 ? 25 : $request->get('size');
        $pageNo = $request->get('page', 1);
        $offset = ($pageNo - 1) * $size;

        $data = $this->validateExamEnv($data);

        if (!empty($data['message'])) {
            return response()->json($data, $data['status']);
        }
        $partIds = ExamQuestion::where('exam_id', $data['examAttemptLog']->exam_id) ->distinct()->pluck('part_id')->toArray();
        $partId = $request->get('partId') ? $request->get('partId') :  reset($partIds);

        $totalRecords = ExamQuestion::with('questionAttempts') // Eager load related question attempts
        ->where('exam_id', $data['examAttemptLog']->exam_id)
        ->where('part_id', $partId)->count();
    
        $mergedData = ExamQuestion::with(['questionAttempts' => function($query) use ($data) {
            // Filter attempts based on the examAttemptLog's exam_id
            $query->where('exam_attempt_id', $data['examAttemptLog']->id);
            
        }])
        ->where('exam_id', $data['examAttemptLog']->exam_id)
        ->where('part_id', $partId)
        ->offset($offset)
        ->limit($size)
        ->get()
        ->map(function ($examQuestion) {
            $questionAttempts = $examQuestion->questionAttempts->first();
            return [
                'id' => $examQuestion->id,
                'question' => $examQuestion->question,
                'question_id' => $examQuestion->question_id,
                'meta' =>    array_map(function ($option) {
                    return [
                        'id' => $option['id'],
                        'option' => $option['option'],
                    ];
                }, $examQuestion->meta['options']),
                'answer' => $questionAttempts->answer ?? null,
                'statusCode' => $questionAttempts->stage ?? "5",
                'score' => $examQuestion->score,
                'negativeScore' => $examQuestion->negative_score,
                'saved' => empty($questionAttempts) ? false : true 
            ];
        });

        $data = [
            "data" => empty($mergedData) ? [] : $mergedData,
            "totalRecords" => $totalRecords,
            "totalPages" => ceil($totalRecords / $size),
            "partIds" => $partIds
        ];

        return response()->json($data);


    }    

    public function attemptQuestion(Request $req){
        $data = $req->data;
        $data = $this->validateExamEnv($data);

        if (!empty($data['message'])) {
            return response()->json($data, 400);
        }

        $question = ExamQuestion::where('exam_id',$data['examAttemptLog']->exam_id)->where('question_id',$data['questionId'])->first();
        if (empty($question)) {
            return response()->json(['message' =>"Question not found", 'status' => 404,'success' =>false],404);
        }
        $optionIds = collect($question->meta['options'])->pluck('id')->toArray();

            // 1 =>  'Answered',
            // 2 =>  'Not_Answered',
            // 3 =>  'Answered_and_Mark_for_review',
            // 4 =>  'Mark_for_review'
            $validator = Validator::make($data, [
                'statusCode' => 'required|integer|in:1,2,3,4',
                'answerId' => ['nullable', 'integer', Rule::in(($optionIds)),'required_if:statusCode,1,3'],
            ]);
            
            if (!empty($validator->errors()->messages())) {
                return response()->json(['message' => $validator->errors()->all()[0], 'status' => 400,'success' =>false],400);
            }

            $validatedData = $validator->validate();


        $score = (float)(($question->meta['correctOption'] == $data['answerId']) ? $question->score : ((-1)*(float)$question->negative_score));
        
        if(!in_array($data['statusCode'], [3, 1])){
            $answer = null;
            $score = 0.0;
        }else{
            $answer = ["selectedOption" => $validatedData['answerId']];
        }
        
        $input = [
            'exam_attempt_id' => $data['examAttemptId'],
            'exam_id' => $data['examAttemptLog']->exam_id,
            'answer' => $answer,
            'stage' => $validatedData['statusCode'],
            'score' => $score,
            'exam_question_id' => $data['questionId']
        ];
        
        // Find the existing record or create a new one
        $questionAttemptLog = QuestionAttemptLog::firstOrNew([
            'exam_question_id' => $data['questionId'],
            'exam_attempt_id' => $data['examAttemptId']
        ]);
        
        // Update the remaining fields
        $questionAttemptLog->fill($input);
        $questionAttemptLog->save();
        $data =[
           'answer' => $questionAttemptLog->answer,
           'statusCode'  => $questionAttemptLog->stage,
           'questionId' => $questionAttemptLog->exam_question_id
        ];
        return response()->json(['data' => $data, 'status' => 200, 'success' => true], 200);
    }

    public function validateExamEnv($data){
        $examAttemptLog = ExamAttempt::where('id',$data['examAttemptId'] ?? null);
        $examAttemptLog = $examAttemptLog->first();

        if(empty($examAttemptLog))
            return ['message' => "Invalid Attempt Id", 'status' => 404,'success' =>false];
        if($examAttemptLog->ends_at < date('Y-m-d H:i:s')){
            // Api check Exam ended
            // Create report here
            $examAttemptLog->status = 'completed';
            $examAttemptLog->save();
            return ['message' => "Exam Time over !!!", 'status' => 400,'success' =>false];
        }
        // Api Check
        if($examAttemptLog->status == 'completed')
            return ['message' => "Exam Already Submitted", 'status' => 400,'success' =>false];

        $data['examAttemptLog'] = $examAttemptLog;
        return $data;
    }
}
