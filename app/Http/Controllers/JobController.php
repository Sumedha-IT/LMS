<?php

namespace App\Http\Controllers;

use App\Http\Resources\JobResource;
use App\Models\Job;
use App\Models\JobStatus;
use App\Models\Team;
use App\Models\TeamJob;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class JobController extends Controller
{
    public function index(Request $request, User $user)
    {
        $size = $request->get('size') == 0 ? 25 : $request->get('size');
        $pageNo = $request->get('page', 1);
        $offset = ($pageNo - 1) * $size;
        $totalRecords = 0;

        if (!empty($request->query())) {
            $filters =  $this->validateFilters($request->query());
            if (!empty($filters['message'])) {
                return response()->json($filters, $filters['status']);
            }
        }

        if ($user->isRecruitor()) {
            $jobs = Job::where('recruiter_id', $user->id);
            // $totalRecords = $jobs->count();
            // $jobs = $jobs->offset($offset)->limit($size)->get();

        } else if ($user->getIsStudentAttribute()) {
            $jobIds = TeamJob::whereIn('team_id', $user->teams()->get()->pluck('id')->toArray())->get()->pluck('job_id')->toArray();
            $appliedJobIds = JobStatus::where('user_id',$user->id)->get()->pluck('job_id')->toArray();

            $jobs = Job::with('recruiter')->whereIn('id', array_diff($jobIds,$appliedJobIds));
            $totalRecords = $jobs->count();
            // $jobs = $jobs->offset($offset)->limit($size)->get();
        } else {
            $jobs = Job::with('recruiter')
                ->when($request->status, function ($query, $status) {
                    $query->where('status', $status); // Apply the status filter only if present
                });
            // $totalRecords = $jobs->count();
        }
        
        if(!empty($filters)){

            $jobs->when(!(empty($filters['maxExperience']) && empty($filters['minExperience'])), function ($query) use ($filters) {
                return $query->where('min_experience', '>=', $filters['minExperience'])
                    ->where('max_experience', '<=', $filters['maxExperience']);
            });

            $jobs->when(!empty($filters['status']), function ($query) use($filters) {
                return $query->where('status',$filters['status']);
            });

            $jobs->when(!empty($filters['jobType']), function ($query) use($filters) {
                return $query->where('job_type',$filters['jobType']);
            });
            
            $jobs->when(!empty($filters['officePolicy']), function ($query) use($filters) {
                return $query->where('office_policy',$filters['officePolicy']);
            });

            $jobs->when(isset($filters['jobPosted']), function ($query) use ($filters) {

                $days = $filters['jobPosted'];
                if ($days < 0) {
                    // Filter jobs created within the last |$days| days
                    return $query->whereDate('created_at', '=', now()->addDays($days)->toDateString());

                } else {
                    // Filter jobs created from now to the next $days days
                    return $query->where('created_at', '=', now()->addDays($days));
                }
            });

            $jobs->when( !( empty($filters['minSalary'])  && empty($filters['maxSalary']) ), function ($query) use ($filters) {

                return $query->where('salary', '>=', $filters['minSalary'])
                    ->where('salary', '<=', $filters['maxSalary']);
            });

            $jobs->when(!empty($filters['search']), function ($query) use ($filters) {
                return  $query->where('name', 'like', '%' . $filters['search'] . '%');
            });
        }   
        // Paginate jobs
        $totalRecords = $jobs->count();
        $jobs = $jobs->offset($offset)->limit($size)->get();

        return response()->json([
            'data' => JobResource::collection($jobs),
            "totalRecords" => $totalRecords,
            "totalPages" => ceil($totalRecords / $size),
            "roleId" => $user->role_id
        ]);
    }

    public function update(Request $req, User $user, Job $job)
    {
        $data = $req->data;
        $data = $this->validateJobDetails($data);

        if (!empty($data['message'])) {
            return response()->json($data, $data['status']);
        }

        // Update the job details
        $teamIds = $data['teamIds'];
        unset($data['teamIds']);

        $data['recruiter_id'] = $user->id;
        $job->update($data);
        // Sync the team relationships
        $teamJobs = [];
        foreach ($teamIds as $teamId) {
            $teamJobs[] = [
                'job_id' => $job->id,
                'team_id' => $teamId,
                'created_at' => now(),
                'updated_at' => now(),
            ];
        }

        // Delete existing team-job relationships for this job
        TeamJob::where('job_id', $job->id)->delete();

        // Insert the new relationships
        TeamJob::insert($teamJobs);

        return response()->json([
            "data" => new JobResource($job),
            "status" => 200,
            "success" => true,
            "message" => "Job updated successfully"
        ], 200);
    }

    public function create(Request $req, User $user)
    {
        $data = $req->data;
        $data = $this->validateJobDetails($data);

        if($user->getIsStudentAttribute()){
            return response()->json(['message' => "Unauthorised Role", 'status' => 400, 'success' => false],400);

        }
        if (!empty($data['message'])) {
            return response()->json($data, $data['status']);
        }
        $teamIds =  $data['teamIds'];
        unset($data['teamIds']);

        $data['recruiter_id'] = $user->id;
        $job = Job::create($data);

        $teamJobs = [];
        foreach ($teamIds as $teamId) {
            $teamJobs[] = [
                'job_id' => $job->id,
                'team_id' => $teamId,
                'created_at' => now(),
                'updated_at' => now(),
            ];
        }

        // Insert relationships in bulk
        TeamJob::insert($teamJobs);
        return response()->json([
            "data" => new JobResource($job),
            "status" => 200,
            "success" => true,
            "message" => "Job created Successfully"
        ], 200);
    }

    public function delete(Request $req, User $user, Job $job)
    {
        $job->delete();
        return response()->json([
            "message" => "Job deleted Successfully"
        ], 200);
    }

    public function validateJobDetails($data)
    {
        $validator = Validator::make($data, [
            'name' => 'required|string|max:255',
            'status' => 'required|string|in:ACTIVE,ONHOLD,CLOSED',
            'jobType' => 'required|string|in:remote,full_time,part_time,internship,contractual',
            'officePolicy' => 'required|string|in:wfo,wfh,hybrid',
            'minExperience' => 'required|integer|min:0',
            'maxExperience' => 'required|integer|min:0|gte:minExperience',
            'location' => 'required|string|max:255',
            'company' => 'required|string',
            'description' => 'nullable|string|max:1000',
            'salary' => 'required|integer|min:1',
            'teamIds' => 'required|array',
            'expiredAt' => 'required|date_format:Y-m-d|after:today',
        ]);

        if (!empty($validator->errors()->messages())) {
            return ['message' => $validator->errors()->all()[0], 'status' => 400, 'success' => false];
        }

        $data = $validator->validate();

        $teamsIds = Team::where('allow_registration', true)->get()->pluck('id')->toArray();
        $invalidTeamIds = array_diff($data['teamIds'], $teamsIds);

        if (!empty($invalidTeamIds)) {
            return ['message' => "Invalid Team Ids", 'status' => 400, 'success' => false];
        }

        $data['office_policy'] = $data['officePolicy'];
        $data['min_experience'] = $data['minExperience'];
        $data['max_experience'] = $data['maxExperience'];
        $data['job_type'] = $data['jobType'];
        $data['expired_at'] = $data['expiredAt'];

        unset($data['officePolicy'], $data['minExperience'], $data['maxExperience'], $data['jobType'], $data['expiredAt']);
        return $data;
    }

    public function validateFilters($filter){
        $rules = [
            'maxExperience' => 'nullable|numeric|min:0|gte:minExperience',
            'minExperience' => 'nullable|numeric|min:0',
            'status' => 'nullable|string|in:ACTIVE,ONHOLD,CLOSED',
            'jobType' => 'nullable|string|in:remote,full_time,part_time,internship,contractual',
            'jobPosted' => 'nullable|integer|min:-30|max:30',
            'officePolicy' => 'nullable|string|in:wfh,wfo,remote',
            'maxSalary' => 'nullable|numeric|min:0|gte:minSalary',
            'minSalary' => 'nullable|numeric|min:0',
            'search' => 'nullable|string'
        ];
        
        $validator = Validator::make($filter, $rules);
        if (!empty($validator->errors()->messages())) {
            return ['message' => $validator->errors()->all()[0], 'status' => 400, 'success' => false];
        }
        $filters = $validator->validate();
        $filters = collect($validator->validated())->filter(function ($value) {
            return !is_null($value); // Remove keys with null values
        })->toArray();
        return $filters;

    }
}
