<?php

namespace App\Http\Controllers;

use App\Models\Job;
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

        if ($user->isRecruitor()) {
            $jobs = Job::where('recruiter_id', $user->id);
            $totalRecords = $jobs->count();
            $jobs = $jobs->offset($offset)->limit($size)->get();
        } else {
            $jobs = Job::offset($offset)->limit($size)->get();
            $totalRecords = $jobs->count();
        }


        return response()->json([
            'data' => $jobs,
            "totalRecords" => $totalRecords,
            "totalPages" => ceil($totalRecords / $size)
        ]);
    }

    public function update(Request $req, User $user, Job $job)
    {
        $data = $req->data;
        $data = $this->validateJobDetails($data);

        if (!empty($data['message'])) {
            return response()->json($data, $data['status']);
        }

        $data['recruiter_id'] = $user->id;
        $job->update($data);
        $job->refresh();
        return response()->json($data);
    }

    public function create(Request $req, User $user)
    {
        $data = $req->data;
        $data = $this->validateJobDetails($data);

        if (!empty($data['message'])) {
            return response()->json($data, $data['status']);
        }

        $data['recruiter_id'] = $user->id;
        $data = Job::create($data);
        return response()->json($data);
    }

    public function delete(Request $req, User $user, Job $job)
    {
        $job->delete();
        return response()->json([
            "message" => "Job deleted Successfully"
        ]);
    }

    public function validateJobDetails($data)
    {
        $validator = Validator::make($data, [
            'name' => 'required|string|max:255',
            'status' => 'required|string|in:draft,publish,closed,open',
            'jobType' => 'required|string|in:remote,full_time,part_time,internship,contractual',
            'officePolicy' => 'required|string|in:wfo,wfh,hybrid',
            'minExperience' => 'required|integer|min:0',
            'maxExperience' => 'required|integer|min:0|gte:minExperience',
            'location' => 'required|string|max:255',
            'description' => 'nullable|string|max:1000',
            'salary' => 'required|integer|min:1',
        ]);

        if (!empty($validator->errors()->messages())) {
            return ['message' => $validator->errors()->all()[0], 'status' => 400, 'success' => false];
        }

        $data = $validator->validate();
        $data['office_policy'] = $data['officePolicy'];
        $data['min_experience'] = $data['minExperience'];
        $data['max_experience'] = $data['maxExperience'];
        $data['job_type'] = $data['jobType'];
        unset($data['officePolicy'], $data['minExperience'], $data['maxExperience'], $data['jobType']);
        return $data;
    }
}
