<?php

namespace App\Http\Controllers\api;

use Carbon\Carbon;
use App\Models\Exam;
use App\Models\User;
use App\Models\Batch;
use App\Models\Question;
use App\Models\Curriculum;
use App\Models\ExamAttempt;
use App\Models\ExamQuestion;
use App\Models\QuestionBank;
use Illuminate\Http\Request;
use App\Services\ExamService;
use Illuminate\Support\Facades\DB;
use App\Http\Controllers\Controller;
use App\Http\Resources\ExamResource;
use Illuminate\Database\QueryException;
use Illuminate\Support\Facades\Validator;
use App\Http\Resources\StudentExamResource;

class ExamController extends Controller
{
    public function show($id){
        // Validate the ID
        $validator = Validator::make(['id' => $id], [
            'id' => 'required|integer'
        ]);
    
        if ($validator->fails()) {
            return response()->json(['message' => 'Exam Id must be Integer', 'success' => false, 'status' => 404], 404);
        }
    
        // Find the exam by ID
        $exam = Exam::find($id);
        if (empty($exam)) {
            return response()->json(['message' => 'Exam Id not found',  'success' => false, 'status' => 404], 404);
        }
    
        // Fetch exam questions grouped by part_id
        $examQuestions = ExamQuestion::where('exam_id', $exam->id)
            ->select('part_id', 'question_bank_id', DB::raw('COUNT(*) as used_questions')) // Use DB::raw to count questions
            ->groupBy('part_id', 'question_bank_id')
            ->get()
            ->groupBy('part_id'); // Group by 'part_id'
    
        // Collect all unique question_bank_ids across all sections
        $questionBankIds = $examQuestions->flatten(1)->pluck('question_bank_id')->unique();
    
        // Fetch related QuestionBank and Question data in one go
        $questionBanks = QuestionBank::whereIn('id', $questionBankIds)
            ->select('id', 'name', 'description', 'question_bank_chapter', 'question_bank_difficulty_id')
            ->get()
            ->keyBy('id'); // Key by question_bank_id for easy access later
    
        $questionCounts = Question::whereIn('question_bank_id', $questionBankIds)
            ->select('question_bank_id', DB::raw('COUNT(*) as question_count'))
            ->groupBy('question_bank_id')
            ->get()
            ->keyBy('question_bank_id'); // Key by question_bank_id
    
        // Prepare the response structure
        $data = [];
        foreach ($examQuestions as $partId => $questions) {
            $partData = ['partId' => (string)$partId, 'banks' => []];
    
            foreach ($questions as $question) {
                $qbId = $question->question_bank_id;
    
                // Fetch question bank details and question counts
                $bank = $questionBanks->get($qbId);
                $questionCount = $questionCounts->get($qbId)->question_count ?? 0;
    
                $partData['banks'][] = [
                    "name" => $bank->name,
                    "questionsCount" => $questionCount,
                    "usedQuestions" => $question->used_questions,
                    "id" => $qbId,
                    "description" => $bank->description,
                    "questionBankChapter" => $bank->question_bank_chapter,
                    "questionBankDifficulty" => $bank->question_bank_difficulty_id,
                ];
            }
    
            $data[] = $partData;
        }
    
        // Add the meta data to the exam and return the resource
        $exam->meta = $data;
        return new ExamResource($exam);
    }
    
    public function index(Request $request){
        $data = request()->query();

        $size = $request->get('size') == 0 ? 25 : $request->get('size');
        $pageNo = $request->get('page', 1);
        $offset = ($pageNo - 1) * $size;
        $totalRecords = Exam::count();

        $exams = Exam::with('batch')
            // Apply batchId filter only if it exists
            ->when(!empty($data['batchId']), function ($query) use ($data) {
                return $query->where('batch_id', $data['batchId']);
            })
            // Apply date filter based on the criteria ('past' or 'upcoming')
            ->when(isset($data['dateCriteria']) && in_array($data['dateCriteria'], ['past', 'upcoming']), function ($query) use ($data) {
                $operator = $data['dateCriteria'] === 'past' ? '<' : '>';
                return $query->where('exam_date', $operator, now());
            })
            // Order by 'created_by' either ascending or descending based on the direction provided
            ->when(true, function ($query) use ($data) {
                $data['sortOrder'] = (!empty($data['sortOrder']) && (in_array($data['sortOrder'], ['asc', 'desc']))) ?  $data['sortOrder'] : 'desc';
                return $query->orderBy('created_at', $data['sortOrder']);
            })
        ->offset($offset)
        ->limit($size)
        ->get();
        
        $data = [
            "data" => empty($exams) ? [] : ExamResource::collection($exams,[]),
            "totalRecords" => $totalRecords,
            "totalPages" => ceil($totalRecords / $size)
        ];
        return response()->json($data,200);
    }

    public function create(Request $request){
        $data = $request->data;
        

        $data = $this->validateExam($data);

        if (!empty($data['message'])) {
            return response()->json($data, 400);
        }

        try {
            $exam =  Exam::create($data);
            $data =  new ExamResource($exam);
        } catch (QueryException $e) {
            if ($e->getCode() === '23000') {
                return response()->json([
                    'message' => 'Duplicate entry for name and batch_id combination',
                    'success' => false,
                    'status' =>  409
                ], 409); // 409 Conflict
            }
        }
        return response()->json(["data" => $data, 'message' => "Exam Created", "success" => true,'status' => 200], 200);
    }

    public function delete($id){

        $exam = Exam::find($id);
        if ($exam) {
            $exam->delete();
            return response()->json(['message' => 'Exam deleted successfully',"hasError"=>false], 200);
        }

        return response()->json(['message' => 'Exam not found',"hasError"=>false], 404);   
    }

    public function update($id,Request $request){
        $data = $request->data;
        if (empty($data)) {
            return response()->json(['message' => "Data key required", "hasError" => true], 400);
        }

        $exam =Exam::find($id);
        if (empty($exam)) {
            return response()->json(['message' => "Exam Not Found","hasError"=>false], 404);
        }

        $data = $this->validateExam($data);

        if (!empty($data['message'])) {
            return response()->json($data, 400);
        }

        if($exam->name == $data['title']){
            unset($data['title']);
        }

        try {
            $exam->update($data);
        } catch (QueryException $e) {
            if ($e->getCode() === '23000') {
                return response()->json([
                    'message' => 'Duplicate entry for name and batch_id combination',
                    'hasError' => true
                ], 409); // 409 Conflict
            }
        }
        $data =  new ExamResource($exam);
        return response()->json(["data" => $data, 'message' => "Exam Updated", "success" => true,'status' => 200], 200);
    }

    public function validateExam($data){

        $validator = Validator::make($data, [
            'id' => 'nullable|integer',
            'batchId' => 'required|integer|exists:batches,id',

            'curriculumId' => 'required|array|exists:curriculum,id',
            'title' => ['required','string','max:50'],
            'instructions' => 'nullable|string|max:1000',
            'examDate' => 'required|date_format:Y-m-d|after_or_equal:today',
            'startsAt' => [
                'required',
                'date_format:H:i',
                function ($attribute, $value, $fail) {
                    $examDate = request('examDate');
                    if ($examDate === date('Y-m-d') && $value <= date('H:i')) {
                        $fail('The start time must be after the current time if the exam is scheduled for today.');
                    }
                }
            ],
            'endsAt' => 'required|date_format:H:i|after:startsAt',
            'immediateResult' => 'boolean',
            'maxAttempts' => 'integer|max:10',
            'invigilators' => 'array',
            'invigilators.*.name' => 'required|string|max:255', 
            'invigilators.*.id' => 'required|integer|exists:users,id',
            'invigilators.*.phone' => 'required|string',
            'invigilators.*.email' => 'nullable|email',
        ]);
        
        if (!empty($validator->errors()->messages())) {
            return ['message' => $validator->errors()->all()[0], 'status' => 400,'success' =>false];
        }

        $data = $validator->validate();
        $curriculumsConfig = Curriculum::whereIn('id', $data['curriculumId'])->pluck('name', 'id')->toArray();
        $curriculums = [];
        foreach($data['curriculumId'] as $cId){
            $curriculums[] = [
                'id' => $cId,
                'name' => $curriculumsConfig[$cId]
            ];
        }
        $data['curriculums'] = $curriculums;
        $data["starts_at"] = $data['startsAt'];
        $data['ends_at'] = $data['endsAt'];
        $data['max_attempts'] = $data['maxAttempts'] ?? 1;
        $data['batch_id'] = $data['batchId'];
        $data['immediate_result'] = $data['immediateResult'] ?? 1;
        $data['exam_date'] =$data['examDate'];
        return $data;   
    }

    public function getExams($id, Request $request)
    {

        $totalRecords = 0;
        $pageNo = $request->get('page', 1);
        $today = date('Y-m-d 00:00:00');
      
        $size = $request->get('size') == 0 ? 25 : $request->get('size', 25);
        $offset = ($pageNo - 1) * $size;

        $examType = $request->examType == 'past'  ? 'past' : 'upcoming';
        $user = User::find($id);
        if(empty($user))
            return  response()->json(['message' => "User not found", 'status' => 404,'success' =>false]);

        $batchIds = $user->batches()->get()->pluck('id')->toArray();

        if(empty($batchIds))
            return  response()->json(['message' => "User is not enrolled to any batch", 'status' => 400,'success' =>false],400);

        $exams = Exam::with('subject')->whereIn('batch_id', $batchIds)->orderBy('exam_date', 'desc');
        $attemptedExams = ExamAttempt::where('student_id', $id)->get();
        $attemptedExamIds = $attemptedExams->pluck('exam_id')->toArray();
        $exams->each(function ($exam) use (&$data, $attemptedExamIds, $attemptedExams, $today, $user) {
            
            if(in_array($exam->id,$attemptedExamIds )){
                $examAttemptLog = $attemptedExams->where('exam_id', $exam->id)->where('student_id', $user->id)->first();
                if($examAttemptLog->status == 'completed'){
                    $exam->totalMarksObtained = $examAttemptLog->report['aggregateReport']['totalMarksObtained'] ?? 0;
                    $exam->attemptId = $examAttemptLog->id;
                    $exam->status = "Completed" ;
                    $examResource = new StudentExamResource($exam);
                    $data['pastExams'][] = $examResource;
                }else{
                    $exam->status =  ($exam->exam_date == $today ) ? 'Available' : 'Expired';
                    $examResource = new StudentExamResource($exam);
                    if($exam->status == 'Expired'){
                        $data['pastExams'][] = $examResource;
                    }else{
                        $data['upcomingExams'][] = $examResource;
                    }
                }
            }else if ($exam->exam_date < $today) {
                $exam->status = "Expired";
                $exam->totalMarksObtained = 0;
                $examResource = new StudentExamResource($exam);
                $data['pastExams'][] = $examResource;
            } else {
                if($exam->exam_date == $today){
                    if(($exam->ends_at >  date('H:i') && $exam->starts_at <= date('H:i'))) {
                        $exam->status = 'Available';
                        $examResource = new StudentExamResource($exam);
                        $data['upcomingExams'][] = $examResource;
                    }elseif( $exam->starts_at > date('H:i') ) {
                        $exam->status = 'Upcoming';
                        $examResource = new StudentExamResource($exam);
                        $data['upcomingExams'][] = $examResource;
                    }
                    else{
                        $exam->status = 'Expired';
                        $examResource = new StudentExamResource($exam);
                        $data['pastExams'][] = $examResource;
                    }
                }else{
                    $exam->status =  ($exam->exam_date == $today ) ? 'Available' : 'Upcoming';
                    $examResource = new StudentExamResource($exam);
                    $data['upcomingExams'][] = $examResource;
                }
            }
        });


        $data = $examType == 'past' ? $data['pastExams'] ?? [] : $data['upcomingExams'] ?? [];
        $totalRecords = count($data);
        $data =  array_slice($data, $offset, $size);

        $data = [
            "data" => empty($data) ? [] : $data,
            "totalRecords" => $totalRecords,
            "totalPages" => ceil($totalRecords / $size),
            "success" => true,
            'status' => 200
        ];
        return response()->json($data, 200);
    }

    public function getMarkList($examId){
        $exam = Exam::find($examId);
        if(empty($exam))
            return response()->json(['message' => "Exam not found", "hasError" => true], 400);
        $batchId = $exam->batch_id;
        $batch = Batch::where('id',$batchId)->first();
        $batchUsers = $batch->students()->get()->select('id', 'name', 'email');

        $attemptedExamUsers = ExamAttempt::with(['student' => function($query) {
            $query->select('id', 'name', 'email');

        }])->select("*", DB::raw("UPPER(status) as status"))->where('exam_id', $examId)->orderBy('score','desc')->get()->toArray();
      
        $userIds = collect($attemptedExamUsers)->pluck('student.id')->toArray();

        $notAttemptedExamUser = collect($batchUsers)->whereNotIn('id', $userIds)->map(function ($user) {
            return [
                'student' => $user,
                'status' => 'Expired',
            ];
        })->toArray();
        return response()->json(['data' =>  array_merge($attemptedExamUsers, $notAttemptedExamUser)], 200);
    }
    public function GetExamChart(Request $request)
    {
        // $userId = Auth::id();
        $user=$request->user();
        $userId=$user->id;
        $fiveDaysAgo = Carbon::now()->subDays(5)->startOfDay();

        $exams = Exam::with(['batch.curriculums'])
            ->whereHas('examAttempts', function ($query) use ($userId) {
                $query->where('student_id', $userId);
            })
            // ->whereDate('exam_date', '>=', $fiveDaysAgo) // Fetch only last 5 days' records
            ->orderBy('exam_date', 'desc')
            ->get()
            ->map(function ($exam) use ($userId) {
                $latestAttempt = $exam->examAttempts()
                    ->where('student_id', $userId)
                    ->latest()
                    ->first();

                return [
                    'id' => $exam->id,
                    'title' => $exam->title,
                    'date' => $exam->exam_date ? Carbon::parse($exam->exam_date) : 'N/A',
                    // 'curriculums' => $exam->batch->curriculums->pluck('name')->implode(','),
                    'curriculums'=>$exam->curriculums,
                    // 'curriculum' => $exam->batch->course_package->name,
                    'max_marks' => $exam->total_marks,
                    'obtained_marks' => $latestAttempt ? (int) $latestAttempt->score : 0,
                ];
            });

        return response()->json([
            'success' => true,
            'data' => $exams,
        ]);
    }

    public function ExamLeaderBoard(Request $request){

        $user=$request->user();
        $batch_id=$user->batchesstudents->pluck('id')->first();
        $exams_id=Exam::where('batch_id',$batch_id)->latest('exam_date')->first()->id;
        $examAttempts=ExamAttempt::with('student','getExams')->where('exam_id',$exams_id)->orderByDesc('score')->take(5)->get();
        $leaderboard=[];
        foreach($examAttempts as $examAttempt){
            $leaderboard[]=[
                'StudentName'=>$examAttempt->student->name,
                'Exam_name'=>$examAttempt->getExams->title,
                'Score'=>$examAttempt->score,
                'StudentId'=>$examAttempt->student->id,
            ];
           
        }
        return response()->json([
           $leaderboard

        ]);
        // foreach($exams_id as $exam_id){
        //     $examAttempt=ExamAttempt::where('exam_id',$exam_id)->get()->pluck('student_id','score')->toArray();
        //     $examAttempt=collect($examAttempt)->sortByDesc('score')->take(5)->map(function($attempt) use ($exam_id) {
        //         return [
        //             'student_id' => $attempt['student_id'],
        //             'score' => $attempt['score'],
        //             'exam_id' => $exam_id,
        //         ];
        //     })->values()->all();

        // }
        
        // return response()->json([
        //     'success' => true,
        //     'exams'=> $exams_id,
        //     'batch_id' => $batch_id,

        //     'examAttempt' => $examAttempt,
        // ]);
    }
    public function getUserAssignments(Request $request)
    {
        // Ensure the user is authenticated
        $user = $request->user();
        if (!$user || !$user->is_student) {
            return response()->json(['message' => 'Unauthorized'], 401);
        }

        // Get the batch_id from the batch_user pivot table
        $batchUser = $user->batches()->first();
        if (!$batchUser) {
            return response()->json(['message' => 'No batch assigned to user'], 404);
        }

        // Fetch batch with eager-loaded relationships
        $batch = Batch::with([
            'curriculums.topics.topic',
            'curriculums.topics.assignments' => function ($query) use ($user) {
                $query->with(['teachingMaterialStatuses' => function ($statusQuery) use ($user) {
                    $statusQuery->where('user_id', $user->id); // Global scope already applies this for students
                }]);
            }
        ])->findOrFail($batchUser->id);

        // Prepare the response
        $assignmentsByTopic = [];

        // Iterate through curriculums and topics
        foreach ($batch->curriculums as $curriculum) {
            foreach ($curriculum->topics as $topic) {
                $topicData = [
                    'topic_id' => $topic->topic_id,
                    'topic_name' => $topic->topic->name,
                    'assignments' => $topic->assignments->map(function ($assignment) use ($user) {
                        $status = $assignment->teachingMaterialStatuses->first();
                        return [
                            'id' => $assignment->id,
                            'name' => $assignment->name,
                            'description' => $assignment->description,
                            'file' => $assignment->file ? asset('storage/' . $assignment->file) : null,
                            'marks_scored' => $status ? (int) $status->obtained_marks : null,
                            'total_marks' => $assignment->maximum_marks ? (int) $assignment->maximum_marks : null, // Adjust if total_marks is elsewhere
                            'is_submitted' => $status !== null,
                        ];
                    })->all(),
                ];

                if (!empty($topicData['assignments'])) {
                    $assignmentsByTopic[] = $topicData;
                }
            }
        }

        return response()->json([
            'success' => true,
            'data' => $assignmentsByTopic,
        ], 200);
    }
}
