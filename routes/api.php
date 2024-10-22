<?php

use App\Http\Controllers\api\ExamAttemptController;
use App\Http\Controllers\api\ExamController;
use App\Http\Controllers\api\QuestionOptionController;
use App\Http\Controllers\api\StudentsController;
use App\Http\Controllers\api\QuestionAttempLogController;
use Illuminate\Http\Request;
use App\Http\Controllers\api\QuestionController;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\UserController;
use Illuminate\Support\Facades\Password;
use App\Http\Controllers\BatchController;
use App\Http\Controllers\CurriculumController;
use App\Http\Controllers\SectionController;
use App\Http\Controllers\CalendarController;
use App\Http\Controllers\ChaptersController;
use App\Http\Controllers\CourseController;
use App\Http\Controllers\ExamQuestionController;
use App\Http\Controllers\ExamSectionController;
use App\Http\Controllers\TeachingMaterialController;
use App\Http\Controllers\QualificationController;
use App\Http\Controllers\LeaveController;
//use App\Http\Controllers\AttendanceController;
use App\Http\Controllers\PasswordResetController;
use App\Http\Controllers\PostController;
use App\Http\Controllers\QuestionBankChapterController;
use App\Http\Controllers\QuestionBankController;
use App\Http\Controllers\QuestionTypesController;
use App\Http\Controllers\SubjectController;
use App\Http\Controllers\TestingController;


/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

Route::post('/send-notification', [\App\Http\Controllers\NotificationController::class, 'sendNotification']);
Route::middleware([
    'auth:sanctum'
    //, 'verified'
])->group(function () {
    Route::get('/user', function (Request $request) {
        return new \App\Http\Resources\UserResource($request->user());
    });

    Route::put('/user', [UserController::class, 'update']);
});

// Authentication Routes
Route::post('login', [AuthController::class, 'login']);
Route::get('cities', function() {
    return \App\Http\Resources\CityResource::collection(\App\Models\City::all());
});
Route::get('states', function() {
    return \App\Http\Resources\StateResource::collection(\App\Models\State::all());
});
Route::get('qualifications', function() {
    return \App\Http\Resources\QualificationResource::collection(\App\Models\Qualification::all());
});

Route::post('/forgot-password', function (Request $request) {
    $request->validate(['email' => 'required|email']);

    $status = Password::sendResetLink(
        $request->only('email')
    );

    return $status === Password::RESET_LINK_SENT
        ? response()->json(['status' => true, 'message' => __($status)])
        : response()->json(['status' => false, 'message' => __($status)]);
})->middleware('guest')
    ->name('password.email');


//Route::post('forgot-password', [AuthController::class, 'sendResetLinkEmail'])->name('password.email');
//Route::post('reset-password/{token}', [AuthController::class, 'showResetForm'])->name('password.reset');
//Route::post('reset-password', [AuthController::class, 'reset'])->name('password.update');

Route::group(['middleware' => ['auth:sanctum']], function () {
    // Place protected routes here
    Route::post('logout', [AuthController::class, 'logout']);

    //api for notifications
    Route::get('/notifications',[\App\Http\Controllers\NotificationController::class,'index']);

    Route::post('/notifications/mark-read/{id}',[\App\Http\Controllers\NotificationController::class, 'markAsRead']);

    Route::delete('/notifications/{id}', [\App\Http\Controllers\NotificationController::class, 'delete']);

    Route::post('/notifications/mark-all-read', [\App\Http\Controllers\NotificationController::class, 'markAllAsRead']);
    
    Route::get('/notifications/count', [\App\Http\Controllers\NotificationController::class, 'count']);
    
    //Batch + Course
    Route::get('/batches', [BatchController::class,'index']);
    Route::get('/{id}/batch', [BatchController::class,'view']);

    //Sections By Batch
    Route::get('/{id}/curriculum',[CurriculumController::class,'index']);

    //Sections By Batch
    Route::get('/{id}/sections/{curriculum_id?}',[SectionController::class,'index']);

    //Teaching Material
    Route::get('/{id}/materials/{curriculum_id?}/{section_id?}/',[TeachingMaterialController::class,'index']);
    
    Route::get('assignments', [TeachingMaterialController::class, 'getPendingAssignments']);
    
    Route::post('/submit-assignment', [TeachingMaterialController::class, 'submitAssignment']);
    
    Route::get('/assignment-chart', [TeachingMaterialController::class, 'getChartData']);




    Route::post('/leaves/apply', [LeaveController::class, 'applyLeave']);
    Route::get('/leaves/list',[LeaveController::class,'index']);
    Route::get('/calenders/list', [CalendarController::class, 'fetchData']);

    Route::post('password/change', [PasswordResetController::class, 'changePassword']);

    //Route::get('/Syllabus',[\App\Http\Controllers\SyllabusController::class,'getUserSyllabus']);
    Route::get('/syllabus/list', [\App\Http\Controllers\SyllabusController::class, 'getCompletedSyllabus']);

    //Api for attendances
    Route::get('/attendances', [\App\Http\Controllers\AttendanceController::class, 'index']);
    
    Route::get('/attendance-report', [\App\Http\Controllers\AttendanceController::class, 'getAttendanceReport']);

    Route::get('/attendance-chart', [\App\Http\Controllers\AttendanceController::class, 'getChartData']);
    //Api for annoucements
    Route::get('/announcements', [\App\Http\Controllers\AnnouncementController::class, 'index']);
    
    Route::get('/tutors', [\App\Http\Controllers\UserController::class, 'tutors']);

    //api for listing for sections
    
     
        
    Route::get('posts', [PostController::class, 'index']);
    // Route::get('posts/{id}', [PostController::class, 'show']);
    Route::post('posts/like', [PostController::class, 'like']);
    Route::post('posts/comment', [PostController::class, 'comment']);
    Route::get('posts/comments', [PostController::class, 'getComments']);



//	 Route::get('/attendances', [AttendanceController::class, 'index']);
//	 Route::get('/batches',[BatchController::class,'get_batches']);

    Route::post('/batches', [BatchController::class,'create']);
    Route::get('/batches/{id}', [BatchController::class,'show']);
    Route::get('/allBatches', [BatchController::class,'getBatches']);
    Route::put('/batches/{id}', [BatchController::class,'update']);
    Route::delete('/batches/{id}', [BatchController::class,'delete']);

    // Subjects
    Route::get('/subjects', [SubjectController::class,'getSubjects']);
    Route::get('/subjects/{id}', [SubjectController::class,'show']);
    Route::post('/subjects', [SubjectController::class,'create']);
    Route::delete('/subjects/{id}', [SubjectController::class,'delete']);

    // Question Bank
    Route::get('/questionBanks', [QuestionBankController::class,'index']);
    Route::get('/questionBanks/{id}', [QuestionBankController::class,'show']);
    Route::delete('/questionBanks/{id}', [QuestionBankController::class,'delete']);
    Route::get('/questionBankTypes',[QuestionBankController::class,'getQuestionBankTypes']);
    Route::get('/questionBankDifficulties',[QuestionBankController::class,'getQuestionBankDifficulties']);

    // Students
    Route::get('/students', [StudentsController::class,'index']);

    // Courses
    Route::get('/courses', [CourseController::class,'getAllCourses']);
    Route::get('/courses/{id}', [CourseController::class,'show']);

    // Chapters
    Route::get('/chapters/{id}', [QuestionBankChapterController::class,'show']);
    Route::get('/chapters', [QuestionBankChapterController::class,'index']);
    Route::post('/chapters', [QuestionBankChapterController::class,'create']);
    Route::put('/chapters/{id}', [QuestionBankChapterController::class,'update']);
    Route::delete('/chapters/{id}', [QuestionBankChapterController::class,'delete']);

    // Question
    Route::get('/questions', [QuestionController::class,'index']);
    Route::get('/questions/{question_id}', [QuestionController::class,'show']);
    Route::put('/questions/{question_id}', [QuestionController::class,'update']);
    Route::delete('/questions/{question_id}', [QuestionController::class,'delete']);

    // Options
    Route::get('/options', [QuestionOptionController::class,'index']);
    Route::get('/options/{id}', [QuestionOptionController::class,'show']);
    Route::put('/options', [QuestionOptionController::class,'update']);

    // Exams
    Route::get('/exams', [ExamController::class,'index']);
    Route::get('/exams/{id}', [ExamController::class,'show']);
    Route::put('/exams/{id}', [ExamController::class,'update']);
    Route::delete('/exams/{id}', [ExamController::class,'delete']);

    //Exam Question
    Route::get('/{examId}/examQuestions', [ExamQuestionController::class,'index']);

    
    Route::get('/invigilators',[UserController::class,'tutors']);
                       
   
});
Route::group(['middleware' => [
    'encryptCookie',
    'addHeader', 
    'auth:sanctum',
    ]], function () {

    Route::get('/student/exams', [ExamController::class,'getExams']);
    Route::get('/exams', [ExamController::class,'index']);

    //Student Module Apis
    Route::get('/student/{examId}/exams', [ExamController::class,'getExams']);
    Route::get('/student/{id}/exam/{examId}/initiateExam', [ExamAttemptController::class,'startExam']);
    Route::get('/student/{id}/examQuestions', [QuestionAttempLogController::class,'getQuestions']);
    Route::post('/student/{id}/examQuestions', [QuestionAttempLogController::class,'attemptQuestion']);
    Route::post('/student/{id}/exam/{examId}/submitExam', [ExamAttemptController::class,'submitExam']);

    Route::get('/student/{id}/exam/{examId}/examStat', [ExamAttemptController::class,'getExamStat']);    
    Route::get('/student/{id}/exam/{examId}/examReport', [ExamAttemptController::class,'getExamReport']);  
    Route::get('/student/{id}/exam/{examId}/reviewExam', [ExamAttemptController::class,'reviewExam']);  

    Route::get('/students/{id}', [StudentsController::class,'show']);

    Route::get('/invigilators',[UserController::class,'tutors']);
 
});
