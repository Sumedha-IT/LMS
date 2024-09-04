<?php

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\UserController;
use Illuminate\Support\Facades\Password;
use App\Http\Controllers\BatchController;
use App\Http\Controllers\CurriculumController;
use App\Http\Controllers\SectionController;
use App\Http\Controllers\CalendarController;
use App\Http\Controllers\TeachingMaterialController;
use App\Http\Controllers\QualificationController;
use App\Http\Controllers\LeaveController;
//use App\Http\Controllers\AttendanceController;
use App\Http\Controllers\PasswordResetController;
use App\Http\Controllers\PostController;

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
Route::middleware(['auth:sanctum'
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
    
     // Api for Post/Timeline
    
    Route::get('posts', [PostController::class, 'index']);
    // Route::get('posts/{id}', [PostController::class, 'show']);
    Route::post('posts/like', [PostController::class, 'like']);
    Route::post('posts/comment', [PostController::class, 'comment']);
    Route::get('posts/comments', [PostController::class, 'getComments']);



//	 Route::get('/attendances', [AttendanceController::class, 'index']);
//	  Route::get('/batches',[BatchController::class,'get_batches']);
});

