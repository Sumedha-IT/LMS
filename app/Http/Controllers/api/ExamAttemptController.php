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

    public function submitExam(Request $request){
        
        $examAttempLog = ExamAttempt::find($request->attemptId);
        if(empty($examAttempLog))
            return response()->json(['message' => 'Attempt Id not found', 'data' => $examAttempLog->report, 'status' => 404, 'success' => false], 200);

        if($examAttempLog->status == 'completed')
            return response()->json(['message' => 'Exam Already Submitted', 'data' => $examAttempLog->report, 'status' => 400, 'success' => false], 200);

        $examAttempLog->report = (array)$this->generateReport($examAttempLog);
        $examAttempLog->status = 'completed';
        $examAttempLog->save();
        return response()->json(['message' => 'Exam submitted succesfully', 'data' => $examAttempLog->report, 'status' => 200, 'success' => true], 200);
    }

    public function generateReport($examAttempLog){

        $timeTaken = $this->subtractTime($examAttempLog->created_at->format('H:i:s'),date('H:i:s'));
        $report = $this->getReport($examAttempLog,true);
        
        $partWiseReport = collect($report);
        $result['timeTaken'] = $timeTaken;
        
        // Combine all totals into a single array
        $totalData = [
            'totalMarksObtained' => $partWiseReport->sum(function ($item) {  
                return $item->marksObtained ?? 0; // Use object property access here
            }),
            'totalQuestions' => $partWiseReport->sum(function ($item) { 
                return $item->totalQuestions ?? 0; 
            }),
            'maxMarks' => $partWiseReport->sum(function ($item) { 
                return (float)$item->maxMarksForSection ?? 0; 
            }),
            'totalAttemptedCount' => $partWiseReport->sum(function ($item) { 
                return $item->totalAttempedCount ?? 0; 
            }),
            'notAnswered' => $partWiseReport->sum(function ($item) { 
                return $item->notAnswered ?? 0; 
            }),
            'answeredAndMarkForReview' => $partWiseReport->sum(function ($item) { 
                return $item->answeredAndMarkForReview ?? 0; 
            }),
            'markForReview' => $partWiseReport->sum(function ($item) { 
                return $item->markForReview ?? 0; 
            }),
            'wrong' => $partWiseReport->sum(function ($item) { 
                return $item->wrong ?? 0; 
            }),
            'correct' => $partWiseReport->sum(function ($item) { 
                return $item->correct ?? 0; 
            }),
            'skippedQuestions' => $partWiseReport->sum(function ($item) { 
                return $item->skippedQuestions ?? 0; 
            }),
        ];
        $result = [
            "aggregateReport" => $totalData,
            "partWiseReport" => $partWiseReport->toArray(),
            "timeTaken"     => $timeTaken
        ];

        $result['aggregateReport']['accuracy'] = ($result['aggregateReport']['correct'] / $result['aggregateReport']['totalQuestions']) * 100;
        $result['aggregateReport']['percentage'] = ($result['aggregateReport']['totalMarksObtained'] / $result['aggregateReport']['maxMarks']) * 100;
        $result['aggregateReport']['grade'] = $this->assignGrade($result['aggregateReport']['percentage']);
            
        return $result;
    } 

    public function subtractTime($timeA , $timeB){

        // Convert both times to timestamps
        $timeA = strtotime($timeA);
        $timeB = strtotime($timeB);
        
        // Calculate the difference in seconds
        $diffInSeconds = $timeB - $timeA;
        
        // Convert the difference into hours and minutes
        $hours = floor($diffInSeconds / 3600); // Get hours
        $minutes = floor(($diffInSeconds % 3600) / 60); // Get minutes
        
        // Format hours and minutes as HH:MM
        return  sprintf('%02d:%02d', $hours, $minutes);
    }
 
    public function assignGrade($percentage) {
        switch (true) {
            case ($percentage >= 90):
                return 'A';
            case ($percentage >= 80):
                return 'B';
            case ($percentage >= 70):
                return 'C';
            case ($percentage >= 60):
                return 'D';
            case ($percentage >= 50):
                return 'E';
            default:
                return 'F';
        }
    }

    public function reviewExam(Request $request,$id,$examId) {

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

    public function getExamStat(Request $request){
        $examAttempLog = ExamAttempt::find($request->attemptId);
        if(empty($examAttempLog))
            return response()->json(['message' => 'Attempt Id not found', 'data' => $examAttempLog->report, 'status' => 200, 'success' => false], 404);

        if($examAttempLog->status == 'completed')
            return response()->json(['message' => 'Exam Already Submitted', 'data' => $examAttempLog->report, 'status' => 200, 'success' => false], 400);

        $examAttempLog->report = $this->getReport($examAttempLog);
        return response()->json(['message' => 'Exam Statistics', 'data' => $examAttempLog->report, 'status' => 200, 'success' => true], 200);
    }

    public function getExamReport($id,$examId){
        //Add api check for exam Submitted or not
        $examAttempLog = ExamAttempt::where('exam_id',$examId)->where('student_id',$id)->first();

        if(empty($examAttempLog))
            return response()->json(['message' => 'Exam not attempted', 'data' => $examAttempLog->report, 'status' => 400, 'success' => false], 200);

        $examAttempLog->report = (array)$this->generateReport($examAttempLog);
        return response()->json(['message' => 'Exam Report', 'data' => $examAttempLog->report, 'status' => 200, 'success' => true], 200);
    }

    public function getReport($examAttempLog,$review = false){
        if($review){
            return  DB::select("
                        SELECT 
                            eq.part_id AS partId, 
                            COALESCE(SUM(qal.score), 0) AS marksObtained, 
                            COALESCE(COUNT(*), 0) AS totalQuestions, 
                            COALESCE(CAST(SUM(eq.score) AS FLOAT), 0) AS maxMarksForSection,
                            COALESCE(COUNT(qal.answer), 0) AS totalAttempedCount,
                            COALESCE(COUNT(CASE WHEN qal.stage = 2 THEN 1 END), 0) AS notAnswered,
                            COALESCE(COUNT(CASE WHEN qal.stage = 3 THEN 1 END), 0) AS answeredAndMarkForReview,
                            COALESCE(COUNT(CASE WHEN qal.stage = 4 THEN 1 END), 0) AS markForReview,
                            COALESCE(COUNT(CASE WHEN qal.score < 0 THEN 1 END), 0) AS wrong,
                            COALESCE(COUNT(CASE WHEN qal.score > 0 THEN 1 END), 0) AS correct,
                            COALESCE(COUNT(CASE WHEN qal.exam_question_id IS NULL THEN 1 END), 0) AS skippedQuestions
                        FROM 
                            lms.exam_questions AS eq
                        LEFT JOIN 
                            lms.question_attempt_logs AS qal 
                        ON 
                            eq.question_id = qal.exam_question_id 
                            AND qal.exam_attempt_id = ".$examAttempLog->id."
                        WHERE 
                            eq.exam_id = ".$examAttempLog->exam_id."
                        GROUP BY 
                            eq.part_id
            ");
        }else{
            return  DB::select("
                SELECT 
                    eq.part_id AS partId, 
                    COALESCE(COUNT(*), 0) AS noOfQuestions, 
                    COALESCE(COUNT(CASE WHEN qal.stage = 1 THEN 1 END), 0) AS answered,
                    COALESCE(COUNT(CASE WHEN qal.stage = 2 THEN 1 END), 0) AS notAnswered,
                    COALESCE(COUNT(CASE WHEN qal.stage = 3 THEN 1 END), 0) AS answeredAndMarkForReview,
                    COALESCE(COUNT(CASE WHEN qal.stage = 4 THEN 1 END), 0) AS markForReview,
                    COALESCE(COUNT(CASE WHEN qal.exam_question_id IS NULL THEN 1 END), 0) AS notVisited
                FROM 
                    lms.exam_questions AS eq
                LEFT JOIN 
                    lms.question_attempt_logs AS qal 
                ON 
                    eq.question_id = qal.exam_question_id 
                    AND qal.exam_attempt_id = ".$examAttempLog->id."
                WHERE 
                    eq.exam_id = ".$examAttempLog->exam_id."
                GROUP BY 
                    eq.part_id
            ");
        }
    }
}