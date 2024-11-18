<?php

namespace App\Http\Controllers;

use App\Models\Job;
use App\Models\JobStatus;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class JobStatusController extends Controller
{
    public function applyJob(User $user, Job $job)
    {
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
        return response()->json($job);
    }

    public function deleteJobApplication(User $user, JobStatus $jobStatus)
    {
        $jobStatus->delete();
        return response()->json(
            "Application Deleted Successfully"
        );
    }


    public function indexJobs(User $user, Request $request)
    {
        $size = $request->get('size') == 0 ? 25 : $request->get('size');
        $pageNo = $request->get('page', 1);
        $offset = ($pageNo - 1) * $size;
        if ($user->getIsStudentAttribute()) {
            // For students
            $query = JobStatus::where('user_id', $user->id);
        } elseif ($user->isRecruitor()) {

            // For recruiters
            $query = JobStatus::whereHas('job', function ($query) use ($user) {
                $query->where('recruiter_id', $user->id);
            });
        } else {
            // For other users
            $query = JobStatus::query();
        }

        // Count total records for the query
        $totalRecords = $query->count();

        // Fetch paginated results using offset and limit
        $jobStatuses = $query->offset($offset)->limit($size)->get();

        return response()->json([
            'data' => $jobStatuses,
            "totalRecords" => $totalRecords,
            "pageNo" =>  $pageNo,
            "totalPages" => ceil($totalRecords / $size)
        ]);
    }

    public function updateJobStatus(Request $request, JobStatus $jobStatus)
    {

        $data = $request->data;

        $validator = Validator::make($data, [
            'feedback' => 'nullable|string',
            'status' => 'required|in:onhold,interview_ready,selected,rejected',
        ]);
        if (!empty($validator->errors()->messages())) {
            return ['message' => $validator->errors()->all()[0], 'status' => 400,'success' =>false];
        }
        $data = $validator->validate();
        $jobStatus->update($data);
        return response()->json($jobStatus);
    }
}
