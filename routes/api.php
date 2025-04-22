<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\JobController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\PostController;
use App\Http\Controllers\UserController;
use Illuminate\Support\Facades\Password;
use App\Http\Controllers\BatchController;
use App\Http\Controllers\LeaveController;
use App\Http\Controllers\CourseController;
use App\Http\Controllers\ProjectController;
use App\Http\Controllers\SectionController;
use App\Http\Controllers\SubjectController;
use App\Http\Controllers\TestingController;
use App\Http\Controllers\api\ExamController;
use App\Http\Controllers\CalendarController;
use App\Http\Controllers\ChaptersController;
use App\Http\Controllers\JobStatusController;
use App\Http\Controllers\CurriculumController;
use App\Http\Controllers\api\ProfileController;
use App\Http\Controllers\ExamSectionController;
use App\Http\Controllers\ZohoInvoiceController;
use App\Http\Controllers\api\QuestionController;
use App\Http\Controllers\api\StudentsController;
use App\Http\Controllers\ExamQuestionController;
use App\Http\Controllers\QuestionBankController;
use Illuminate\Http\Resources\Json\JsonResource;
use App\Http\Controllers\CertificationController;
use App\Http\Controllers\PasswordResetController;
use App\Http\Controllers\api\JobProfileController;
use App\Http\Controllers\StudentJourneyController;
use App\Http\Controllers\api\ExamAttemptController;
use App\Http\Controllers\api\UserProfileController;
use App\Http\Controllers\TeachingMaterialController;
use App\Http\Controllers\api\QuestionOptionController;
use App\Http\Controllers\QuestionBankChapterController;
use App\Http\Controllers\api\StudentEducationController;
use App\Http\Controllers\api\QuestionAttempLogController;
use App\Http\Controllers\api\MyCourseController;
use App\Http\Controllers\api\BatchController as ApiBatchController;
use App\Http\Controllers\api\CurriculumController as ApiCurriculumController;
use App\Http\Controllers\api\TopicController;

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
//states api 
Route::get('states', function() {
    return \App\Http\Resources\StateResource::collection(\App\Models\State::all());
});
//
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

    // Certification routes
    Route::get('/certifications', [CertificationController::class, 'index']);
    Route::post('/certifications', [CertificationController::class, 'store']);
    Route::put('/certifications/{certification}', [CertificationController::class, 'update']);
    Route::delete('/certifications/{certification}', [CertificationController::class, 'destroy']);

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


    //Api for user profile
    Route::get('/profile',[UserProfileController::class,'Index']);
    Route::post('/profile',[UserProfileController::class,'Update']);

    //Api for education section 
    Route::get('get/degrees',[StudentEducationController::class,'GetDegreeTypes']);
    Route::get('get/specialization/{id}',[StudentEducationController::class,'GetSpecializations']);

    Route::post('education',[StudentEducationController::class,'store']);
    Route::get('get/education',[StudentEducationController::class,"Get_education"]);
    Route::put('update/education',[StudentEducationController::class,'Update']);
    Route::delete('delete/education',[StudentEducationController::class,'delete']);

    //Api for student dashboard 
        // api for exam chart
        Route::get('/exam-chart', [ExamController::class, 'GetExamChart']);
        Route::get('/leaderboard', [ExamController::class, 'ExamLeaderBoard']);

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

    Route::get('/student/journey', [StudentJourneyController::class, 'journey']);

    //api for listing for sections
    

});


Route::group(['middleware' => [
    'addHeader', 
    'auth:sanctum',
    ]], function () {


    //Student Module Apis
    Route::get('/student/{examId}/exams', [ExamController::class,'getExams']);
    Route::get('/student/{id}/exam/{examId}/initiateExam', [ExamAttemptController::class,'startExam']);
    Route::get('/student/{id}/examQuestions', [QuestionAttempLogController::class,'getQuestions']);
    Route::post('/student/{id}/examQuestions', [QuestionAttempLogController::class,'attemptQuestion']);
    Route::post('/student/{id}/exam/{examId}/submitExam', [ExamAttemptController::class,'submitExam']);
    Route::get('/student/{id}/exam/{examId}/examStat', [ExamAttemptController::class,'getExamStat']);    
    Route::get('/student/{id}/exam/{examId}/reviewExam', [ExamAttemptController::class,'reviewExam']);    
    Route::get('/student/{id}/exam/{examId}/examReport', [ExamAttemptController::class,'getExamReport']);    



    Route::get('/invigilators',[UserController::class,'tutors']);

      
        
    Route::get('posts', [PostController::class, 'index']);
    // Route::get('posts/{id}', [PostController::class, 'show']);
    Route::post('posts/like', [PostController::class, 'like']);
    Route::post('posts/comment', [PostController::class, 'comment']);
    Route::get('posts/comments', [PostController::class, 'getComments']);



    //	 Route::get('/attendances', [AttendanceController::class, 'index']);
    //	 Route::get('/batches',[BatchController::class,'get_batches']);

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
    Route::get('/students/{id}', [StudentsController::class,'show']);

    // Courses
    Route::get('/courses', [CourseController::class,'getAllCourses']);
    Route::get('/courses/{id}', [CourseController::class,'show']);

    //Curriculam
    Route::get('/curriculums', [BatchController::class,'getCurriculams']);

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
    Route::get('/exams/{id}', [ExamController::class,'show']);
    Route::put('/exams/{id}', [ExamController::class,'update']);
    Route::delete('/exams/{id}', [ExamController::class,'delete']);
    Route::get('/exams', [ExamController::class,'index']);

    //Exam Question
    Route::get('/{examId}/examQuestions', [ExamQuestionController::class,'index']);
    Route::get('exams/{id}/listMarks',[ExamController::class,'getMarkList']);

    Route::get("/countryAndStates", [UserController::class, "getCountryAndStates"]);


    // Api for Post/Timeline
    Route::middleware(['payloadCheck'])->group(function () {

        Route::post('/exams', [ExamController::class,'create']);
        Route::post('/{examId}/examQuestions', [ExamQuestionController::class,'create']);
        Route::delete('/{examId}/examQuestions', [ExamQuestionController::class,'delete']);

        Route::post('/questionBanks', [QuestionBankController::class,'create']);
        Route::post('/questions', [QuestionController::class,'create']);
        Route::post('/options', [QuestionOptionController::class,'create']);
        
        Route::put('/{examId}/examQuestions', [ExamQuestionController::class,'patch']);
        Route::post('/questionIds', [ExamQuestionController::class,'getQuestionIds']);
        Route::post('/student/{id}/examQuestions', [QuestionAttempLogController::class,'attemptQuestion']);


        Route::patch('{user}/profile', [JobProfileController::class,'create']);
     
        Route::post('/{user}/profileEducations', [JobProfileController::class,'createProfileEducations']);
        Route::put('/{user}/profileEducations/{profileEducation}', [JobProfileController::class,'updateProfileEducation']);

        Route::post('/{user}/profileExperience', [JobProfileController::class,'createProfileExperience']);
        Route::put('/{user}/profileExperience/{profileExperience}', [JobProfileController::class,'updateProfileExperience']);

        Route::post('/{user}/projects', [JobProfileController::class,'createProject']);
        Route::put('/{user}/projects/{project}', [JobProfileController::class,'updateProject']);

        Route::post('/{user}/job', [JobController::class, 'create']);
        Route::put('/{user}/job/{job}', [JobController::class, 'update']);
        
        Route::patch('/{user}/jobStatus/{jobStatus}', [JobStatusController::class, 'updateJobStatus']);

        // Route::post('/{user}/awards', [JobProfileController::class,'createAwards']);
        // Route::put('/{user}/awards/{award}', [JobProfileController::class,'updateAwards']);
        // Route::delete('/{user}/awards/{award}', [JobProfileController::class,'deleteAwards']);

    });
    Route::get("/paymentCentre", [UserController::class, "getPaymentDetails"]);


     // Profile Api
     Route::get('/profile/{user}', [JobProfileController::class,'show']);
     Route::delete('/{user}/profileEducations/{profileEducation}', [JobProfileController::class,'deleteProfileEducation']);
     Route::delete('/{user}/profileExperience/{profileExperience}', [JobProfileController::class,'deleteProfileExperience']);
     Route::delete('/{user}/projects/{project}', [JobProfileController::class,'deleteProject']);
 
     Route::get('/{user}/documents', [JobProfileController::class,'addCertificate']);
     
     Route::post('/{user}/documents', [JobProfileController::class,'addCertificate']);
     Route::delete('/{user}/documents/{certificate}', [JobProfileController::class,'deleteCertificate']);
    //  Route::get('/{user}/documents', [JobProfileController::class,'getDocuments'])->name('api.certificate');
     Route::get('/{user}/documents/{certificate}', [JobProfileController::class,'previewCertificate'])->name('api.certificate');
 
 
     Route::delete('/{user}/job/{jobId}', [JobController::class, 'delete']);
     Route::get('/{user}/job', [JobController::class, 'index']);
 
     Route::post('/{user}/job/{job}/apply', [JobStatusController::class, 'applyJob']);
     Route::get('/{user}/appliedJobs', [JobStatusController::class, 'indexJobs']);
     Route::get('/{user}/job/{job}', [JobStatusController::class, 'deleteJobApplication']);
     
});

Route::middleware(['zohoAuth'])->group(function () {
    Route::get('/paymentDetails/{zohoCrmId}/refresh', [ZohoInvoiceController::class,'refreshZoho']);
  
    Route::post('/student', [UserController::class,'createStudent']);
    Route::post('/batches', [BatchController::class,'create']);
    Route::put('/batches/{id}', [BatchController::class,'update']);

   
});

    

Route::get('/test', [TestingController::class,'testMail']);

Route::get("/teams", [UserController::class, "getTeams"]);

// Project routes
Route::middleware('auth:sanctum')->group(function () {
    Route::get('/projects', [ProjectController::class, 'index']);
    Route::post('/projects', [ProjectController::class, 'store']);
    Route::put('/projects/{project}', [ProjectController::class, 'update']);
    Route::delete('/projects/{project}', [ProjectController::class, 'destroy']);
});

// My Courses API route
Route::middleware(['auth:sanctum', 'addHeader'])->group(function () {
    // Course Management Routes
    Route::prefix('courses')->group(function () {
        // My courses
        Route::get('/my/{id}', [MyCourseController::class, 'index']);
        
        // Batch related routes
        Route::prefix('batches')->group(function () {
            Route::get('/', [ApiBatchController::class, 'index']);
            Route::get('/{id}', [ApiBatchController::class, 'show']);
            Route::get('/{id}/curriculums', [ApiBatchController::class, 'getCurriculums']);
        });

        // Curriculum related routes
        Route::prefix('curriculums')->group(function () {
            Route::get('/', [ApiCurriculumController::class, 'index']);
            Route::get('/{id}', [ApiCurriculumController::class, 'show']);
            Route::get('/{id}/topics', [ApiCurriculumController::class, 'getTopics']);
        });

        // Topic related routes
        Route::prefix('topics')->group(function () {
            Route::get('/', [TopicController::class, 'index']);
            Route::get('/{id}', [TopicController::class, 'show']);
            Route::post('/{id}/complete', [TopicController::class, 'markAsCompleted']);
        });
    });
});

Route::middleware(['auth:sanctum'])->group(function () {
    // ... other routes ...
    
    Route::get('/courses/my/{id}', [MyCourseController::class, 'index']);
    Route::get('/topics', [MyCourseController::class, 'getTopics']);
    Route::get('/teaching-materials', [TeachingMaterialController::class, 'index']);
    Route::get('/teaching-materials/{topic_id}', [TeachingMaterialController::class, 'getByTopic']);
});
