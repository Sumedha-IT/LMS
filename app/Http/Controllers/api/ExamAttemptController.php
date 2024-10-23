<?php

namespace App\Http\Controllers\api;

use App\Http\Controllers\Controller;
use App\Http\Resources\ExamAttemptResource;
use App\Models\Exam;
use App\Models\ExamAttempt;
use App\Models\ExamQuestion;
use App\Models\QuestionAttemptLog;
use App\Models\QuestionBankType;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;
use App\Services\ExamService;
class ExamAttemptController extends Controller
{
    public function startExam(Request $request){
        $data=$request->data;
        $data['id'] = $request->id;
        $data['examId'] = $request->examId;
        $data = $this->validateExamAttempt($data);

        if (!empty($data['message'])) {
            return response()->json($data, 400);
        }

        if(empty($data['examAttemptLog'])){
            $data['examAttemptLog'] = ExamAttempt::create([
                'student_id' => $data['id'],
                'exam_id' => $data['exam']->id,
                'attempt_count' => 1,
                'status' => "started",
                'ends_at' => $data['ends_at']
            ]);
        }else{
            $data['examAttemptLog']->update([
                'attempt_count' => $data['examAttemptLog']->attempt_count + 1,
            ]);
        }

        return response()->json(
            [
                "data" => new ExamAttemptResource($data), 
                'message' => "Exam Initiated Successfully", 
                "success" => true, 
                'status' => 200
            ], 200);
    
    }

    public function validateExamAttempt($data){

        $validator = Validator::make($data, [
            'id' => 'nullable|integer|exists:users,id',
            'examId' => 'required|integer|exists:exams,id',
        ]);        

        if (!empty($validator->errors()->messages())) {
            return ['message' => $validator->errors()->all()[0], 'status' => 400,'success' =>false];
        }
        $data = $validator->validate();

        
        // Check if the user belongs to that particular exam or not.
        $data['user']= User::find($data['id']);
        $batchIds = $data['user']->batches()->get()->pluck('id')->toArray();
        $exam = Exam::with('subject')->whereIn('batch_id', $batchIds)->where('id',$data['examId'])->first();

        if(empty($exam))
            return ['message' => "Invalid Exam", 'status' => 400, 'success' => false];

        $currentTime = date('Y-m-d H:i:s');
        $examStartsAt = date('Y-m-d') . ' ' . $exam->starts_at . ':00';
        $examEndsAt = date('Y-m-d') . ' ' . $exam->ends_at . ':00';

        if ($currentTime < $examStartsAt)
            return ['message' => "Exam is not started yet", 'status' => 400, 'success' => false];

        if ($currentTime > $examEndsAt)
            return ['message' => "Exam is already ended ", 'status' => 400, 'success' => false];

        $examAttemptLog = ExamAttempt::where('exam_id',$data['examId'])->where('student_id',$data['id'])->first();

        if (!empty($examAttemptLog)) {
            $data['examAttemptLog'] = $examAttemptLog;
            if ($examAttemptLog->attempt_count >= 10)
                return ['message' => "Maximum Retry Limit Exceeded", 'status' => 400, 'success' => false];
            if ($examAttemptLog->status == 'completed')
                return ['message' => "Exam Already Submitted", 'status' => 400, 'success' => false];
        }else{
            date_default_timezone_set('Asia/Kolkata');

            //Check if user is not late for the Exam
            $examStartsAtPlus15Mins = date('Y-m-d H:i:s', strtotime($examStartsAt . ' +15 minutes'));
            if ($currentTime > $examStartsAtPlus15Mins)
                return ['message' => "You're late ! Please Contact Invigilator", 'status' => 400, 'success' => false];
        }

        $data['exam'] = $exam;
        $data['ends_at'] =date('Y-m-d') . ' '.$exam->ends_at.':00';

        return $data;
    }

    public function submitExam(Request $request,ExamService $es){
        
        $examAttempLog = ExamAttempt::find($request->attemptId);
        if(empty($examAttempLog))
            return response()->json(['message' => 'Attempt Id not found', 'data' => $examAttempLog->report, 'status' => 404, 'success' => false], 200);

        if($examAttempLog->status == 'completed')
            return response()->json(['message' => 'Exam Already Submitted', 'data' => $examAttempLog->report, 'status' => 400, 'success' => false], 200);

        $examAttempLog->report = (array)$es->generateReport($examAttempLog);
        $examAttempLog->status = 'completed';
        $examAttempLog->save();
        return response()->json(['message' => 'Exam submitted succesfully', 'data' => $examAttempLog->report, 'status' => 200, 'success' => true], 200);
    }

    public function reviewExam($id,$examId,Request $request) {

        $size = $request->get('size') == 0 ? 25 : $request->get('size');
        $pageNo = $request->get('page', 1);
        $offset = ($pageNo - 1) * $size;
        $review = filter_var($request->review, FILTER_VALIDATE_BOOLEAN, FILTER_NULL_ON_FAILURE);


        $data = [
            'id' => $id,
            'examId' => $examId,
            'partId' => $request->partId,
        ];

        $validator = Validator::make($data, [
            'id' => 'required|integer|exists:users,id',
            'examId' => 'required|integer|exists:exams,id',
        ]);

        if (!empty($validator->errors()->messages())) {
            return response()->json(['message' => $validator->errors()->all()[0], 'status' => 404, 'success' => false], 404);
        }
        $examAttempLog = ExamAttempt::where('exam_id',$examId)->where('student_id',$id)->first();
        if($examAttempLog->status != 'completed')
            return response()->json(['message' => "Kindly please submit the exam", 'status' => 404, 'success' => false], 400);

        $totalRecords = ExamQuestion::with([
            'questionAttempts' => function ($query) use ($examAttempLog) {
                $query->where('exam_attempt_id', $examAttempLog->id);
            },
            'questionBank.question_bank_type'  // Include the question bank type in the eager loading
        ])
        ->where('exam_id', $examAttempLog->exam_id)
        ->when($data['partId'], function ($query, $partId) {
            return $query->where('part_id', $partId);
        })->count();

        $meta = [
            'Correct' => 0,
            'Incorrect'   => 0,
            'Not Attempted' => 0
        ];
        $mergedData = ExamQuestion::with([
            'questionAttempts' => function($query) use ($examAttempLog) {
                $query->where('exam_attempt_id', $examAttempLog->id);
            },
            'questionBank.question_bank_type'  // Include the question bank type in the eager loading
        ])->where('exam_id', $examAttempLog->exam_id)->when($data['partId'], function ($query, $partId) {
            return $query->where('part_id', $partId);
        })->offset($offset)->limit($size)->get()->map(function ($examQuestion) use($review,&$meta) {

            $questionAttempts = $examQuestion->questionAttempts->first();
            $questionType = $examQuestion->questionBank->question_bank_type->name ?? null; 
            
            $data =  [
                'id' => $examQuestion->id,
                'question_id' => $examQuestion->question_id,
                'type' => $questionType,
                'partId' => $examQuestion->part_id,
                'maxMarks' => $examQuestion->score,
                'statusCode' => null,
                'obtainedMarks' => null,
                'questionStatus' =>  "Not Attempted"
            ];

            if(!empty($questionAttempts)){
                $data['statusCode'] = $questionAttempts->stage ?? null;
                $data['obtainedMarks'] = $questionAttempts->score ?? null;
                $data['questionStatus'] = empty($questionAttempts->answer) ? "Not Attempted" : ($questionAttempts->score > 0 ? "Correct" : "Incorrect");
            }

           
            $meta[$data['questionStatus']]+= 1;
            if($review){
                $data['question'] = $examQuestion->question;
                $data['meta'] =  array_map(function ($option) {
                    return [
                        'id' => $option['id'],
                        'option' => $option['option'],
                        
                    ];
                }, $examQuestion->meta['options']);

                $data['correctOption'] = $examQuestion->meta['correctOption'];
                $data['answer'] = $questionAttempts->answer ?? null;
                $data['statusCode'] = $questionAttempts->stage ?? null;
                $data['score'] = $examQuestion->score;
                $data['negativeScore'] = $examQuestion->negative_score;

            }

            return $data;
        });

        $partIds = ExamQuestion::where('exam_id', $examAttempLog->exam_id) ->distinct()->pluck('part_id')->toArray();
        $data = [
            "data" => empty($mergedData) ? [] : $mergedData,
            "totalRecords" => $totalRecords,
            "totalPages" => ceil($totalRecords / $size),
            "meta" => $meta,
            "partIds" => $partIds ?? [],
            "status" => 200,
            "success" => true,

        ];

        return response()->json($data,200);
    }

    public function getExamStat(Request $request,ExamService $es){
        $examAttempLog = ExamAttempt::find($request->attemptId);
        if(empty($examAttempLog))
            return response()->json(['message' => 'Attempt Id not found', 'data' => $examAttempLog->report, 'status' => 200, 'success' => false], 404);

        if($examAttempLog->status == 'completed')
            return response()->json(['message' => 'Exam Already Submitted', 'data' => $examAttempLog->report, 'status' => 200, 'success' => false], 400);

        $examAttempLog->report = $es->getReport($examAttempLog);
        return response()->json(['message' => 'Exam Statistics', 'data' => $examAttempLog->report, 'status' => 200, 'success' => true], 200);
    }

    public function getExamReport($id, $examId, ExamService $es){

        $examAttempLog = ExamAttempt::where('exam_id',$examId)->where('student_id',$id)->first();

        if(empty($examAttempLog))
            return response()->json(['message' => 'Exam not attempted','status' => 404, 'success' => false], 404);

        if($examAttempLog->status != 'completed' )
            return response()->json(['message' => 'Exam not completed','status' => 400, 'success' => false], 400);
        
        if(empty($examAttempLog->report))
            $examAttempLog->report = $es->generateReport($examAttempLog);
            $examAttempLog->save();

        return response()->json(['message' => 'Exam Report', 'data' => $examAttempLog->report, 'status' => 200, 'success' => true], 200);
    }
}