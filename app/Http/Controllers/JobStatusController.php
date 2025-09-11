<?php

namespace App\Http\Controllers;

use App\Http\Resources\JobStatusResource;
use App\Models\Domain;
use App\Models\Job;
use App\Models\JobProfile;
use App\Models\JobStatus;
use App\Models\User;
use App\Services\ProfileCompletionService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class JobStatusController extends Controller
{
    protected $profileCompletionService;

    public function __construct(ProfileCompletionService $profileCompletionService)
    {
        $this->profileCompletionService = $profileCompletionService;
    }

    public function applyJob(User $user, Job $job)
    {


        if (!$user->getIsStudentAttribute()) {
            return response()->json(['message' => 'Only students can apply for the job', 'status' => 400, 'success' => false], 400);
        }

        // Validate profile completion using the new service
        $profileValidation = $this->profileCompletionService->canApplyForPlacements($user);
        
        if (!$profileValidation['can_apply']) {
            return response()->json([
                'message' => $profileValidation['message'],
                'status' => 400,
                'success' => false,
                'completion_percentage' => $profileValidation['completion_percentage'],
                'missing_sections' => $profileValidation['missing_sections'],
                'required_percentage' => 100
            ], 400);
        } 

        try {
            $job = JobStatus::create([
                'job_id' => $job->id,
                'user_id' => $user->id,
                'status' => "applied"
            ]);
        } catch (\Exception $e) {
            if ($e->getCode() == '23000') {
                return response()->json([
                    'message' => 'Job Already Applied',
                    'success' => false,
                    'status' =>  409
                ], 409); // 409 Conflict 
            }

            return response()->json([
                'message' => 'Something went wrong',
                'success' => false,
                'status' =>  500
            ], 500); // 409 Conflict 
        }
        return response()->json(['message' => 'Job Applied Successfully', 'status' => 200, 'success' => true], 200);
    }

    public function deleteJobApplication(User $user, JobStatus $jobStatus)
    {
        $jobStatus->delete();
        return response()->json(
            [
                "message" => "Application Deleted Successfully"
            ],
            200
        );
    }

    public function indexJobs(User $user, Request $request)
    {
        $size = $request->get('size') == 0 ? 25 : $request->get('size');
        $pageNo = $request->get('page', 1);
        $offset = ($pageNo - 1) * $size;
        $filters  = !empty($request->query()) ? $this->validateJobFilter($request->query()) : [];
        if (!empty($filters['message'])) {
            return response()->json($filters, $filters['status']);
        }

        switch (true) {
                // For students
            case $user->getIsStudentAttribute():
                $query = JobStatus::where('user_id', $user->id);
                break;
              
            default:
                if($user->isRecruitor()){
                    $query = JobStatus::whereHas('job', function ($query) use ($user) {
                        $query->where('recruiter_id', $user->id);
                    });
                }else{
                    $query = JobStatus::query();
                }
          
                if(!empty($filters['domain'])){
                    $userIds = User::where('domain_id',$filters['domain'])->get()->pluck('id');
                    $query->whereIn('user_id',$userIds);
                }

                break;
        }
        $query = $query->with('job')->whereHas('profile', function ($query) use ($filters) {

            // Add conditions for experience, e.g., years of experience range.
            $experienceFilters = $filters['experience'] ?? null;
            $query->when(!empty($experienceFilters), function ($query) use ($experienceFilters) {
                $query->where('total_experience', '>=', $experienceFilters['min_experience'])
                    ->where('total_experience', '<=', $experienceFilters['max_experience']);
            });

            // Conditionally apply the UG percentage filter
            $percentage = $filters['percentage'] ?? null;
            $query->when(!empty($percentage), function ($query) use ($percentage) {
                $query->whereHas('education', function ($query) use ($percentage) {
                    // Filter for UG degree type as doc says graduation percentage.
                    $query->where('degree_type', 'UG')
                        ->where('result', $percentage['operator'], $percentage['value']);
                });
            });

            // Conditionally apply the UG percentage filter
            $status = $filters['status'] ?? null;
            $query->when(!empty($status), function ($query) use ($status) {
                $query->where('status', $status);
            });
        })->with(['profile.education', 'profile.experience'])->whereHas('job', function ($query) use ($filters) {
            $search = !empty($filters['search']) ? trim($filters['search']) : null;

            $query->when(!empty($search), function ($query) use ($search) {
                $query->where('name', 'like', '%' . $search . '%');
            });

            // Add condition for job_type.
            $jobType = $filters['jobType'] ?? null;
            $query->when(!empty($jobType), function ($query) use ($jobType) {
                $query->where('job_type', $jobType);
            });

            $officePolicy = $filters['officePolicy'] ?? null;
            $query->when(!empty($officePolicy), function ($query) use ($officePolicy) {
                $query->where('office_policy', $officePolicy);
            });
        });
           

        // Count total records for the query
        $totalRecords = $query->count();

        // Fetch paginated results using offset and limit
        $jobStatuses = $query->offset($offset)->limit($size)->get();

        return response()->json([
            'data' => JobStatusResource::collection($jobStatuses),
            "totalRecords" => $totalRecords,
            "pageNo" =>  $pageNo,
            "totalPages" => ceil($totalRecords / $size)
        ]);
    }

    public function updateJobStatus(Request $request, User $user, JobStatus $jobStatus)
    {
        $data = $request->data;

        $validator = Validator::make($data, [
            'feedback' => 'nullable|string',
            'status' => 'required|in:in_interview,selected,rejected',
        ]);
        if (!empty($validator->errors()->messages())) {
            return ['message' => $validator->errors()->all()[0], 'status' => 400, 'success' => false];
        }
        $data = $validator->validate();
        $jobStatus->update($data);

        return response()->json([
            'data' => new  JobStatusResource($jobStatus),
            'status' => 200,
            'success' => true
        ]);
    }

    public function validateJobFilter($data)
    {
        $validator = Validator::make($data, [
            'experieceFilter' => 'nullable|array',
            'experieceFilter.min_experience' => 'required_if:experieceFilter,value|integer|min:0',
            'experieceFilter.max_experience' => 'required_if:experieceFilter,value|integer|min:0',

            'percentageOperator' => 'required_if:percentage,value|string|in:less_than,greater_than,equal_to',
            'percentage' => 'required_if:percentage,value|integer|min:0|max:100',
            'status' => 'nullable|in:applied,in_interview,offered,rejected',
            'jobType' => 'nullable|in:remote,full_time,part_time,internship,contractual',
            'officePolicy' => 'nullable|in:remote,wfo,wfh,hybrid',
            'search' => 'nullable|string',

            'domain' => 'nullable|string'

            // 'status' => 'nullable|array',
            // 'jobType' => 'nullable|array',
            // 'jobType.*' => 'required_if:jobType,value|in:remote,full_time,part_time,internship,contractual',
            // 'officePolicy' => 'nullable|array',
            // 'officePolicy.*' => 'required_if:officePolicy,value|in:remote,wfo,wfh,hybrid',


        ]);
        if (!empty($validator->errors()->messages())) {
            return ['message' => $validator->errors()->all()[0], 'status' => 400, 'success' => false];
        }
        $filters = $validator->validate();
        if (!empty($filters['domain'])) {
            $domains = Domain::all()->pluck('name', 'id');

            $idx = array_search($filters['domain'],$domains->toArray());
            if(!$idx){
                return ['message' => 'Invalid Domain', 'status' => 400, 'success' => false];
            }

            $filters['domain'] = $idx;
        }
        

        $operatorEnum = [
            'greater_than' => '>',
            'greater_than_equal_to' => '>=',
            'less_than' => '<',
            'less_than_equal_to' => '<=',
            'equal_to' => '=',
        ];

        if (!empty($filters['percentage'])) {
            $filters['percentage'] = [
                'value' => $filters['percentage'],
                'operator' =>  $operatorEnum[$filters['percentageOperator']]
            ];
            unset($filters['percentageOperator']);
        }
        return $filters;
    }
}
