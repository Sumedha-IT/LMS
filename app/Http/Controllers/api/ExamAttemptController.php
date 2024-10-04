<?php

namespace App\Http\Controllers\api;

use App\Http\Controllers\Controller;
use App\Http\Resources\ExamAttemptResource;
use App\Models\Exam;
use App\Models\ExamAttempt;
use App\Models\User;
use Illuminate\Http\Request;
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
            $input =[
                'student_id' =>$data['id'],
                'exam_id' => $data['exam']->id,
                'attempt_count' => 1,
                'status' => "started",
                'ends_at'=> $data['ends_at']

            ];
            $data['examAttemptLog'] = ExamAttempt::create($input);
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
        $examAttemptLog = ExamAttempt::where('exam_id',$data['examId'])->where('student_id',$data['id'])->first();

        $data['user']= User::find($data['id']);

        if (!empty($examAttemptLog)) {
            $data['examAttemptLog'] = $examAttemptLog;
            if ($examAttemptLog->attempt_count >= 100)
                return ['message' => "Maximum Retry Limit Exceeded", 'status' => 400, 'success' => false];
        }

        $exam = Exam::find($data['examId']);
        date_default_timezone_set('Asia/Kolkata');

        // Get the current date and time in the desired format
        $currentTime = date('Y-m-d H:i:s');
        $examStartsAt = date('Y-m-d') . ' ' . $exam->starts_at . ':00';
        $examStartsAtPlus15Mins = date('Y-m-d H:i:s', strtotime($examStartsAt . ' +2000 minutes'));
        if ($currentTime > $examStartsAtPlus15Mins)
            return ['message' => "Start Time Expired ! Please Contact Invigilator", 'status' => 400, 'success' => false];

        if ($currentTime < $examStartsAt)
            return ['message' => "Exam is not started yet", 'status' => 400, 'success' => false];

        $data['exam'] = $exam;
        $data['ends_at'] =date('Y-m-d') . ' '.$exam->ends_at.':00';

        return $data;

    }
 
}
