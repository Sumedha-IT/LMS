<?php

namespace App\Http\Controllers\api;

use App\Http\Controllers\Controller;
use App\Models\Certificate;
use App\Models\Certificates;
use App\Models\Job;
use App\Models\JobProfile;
use App\Models\ProfileEducation;
use App\Models\ProfileExperience;
use App\Models\Project;
use App\Models\User;
use DateTime;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;
use Symfony\Component\HttpKernel\EventListener\ProfilerListener;
use Symfony\Component\HttpKernel\Profiler\Profile;

class JobProfileController extends Controller
{
    public function show(Request $request, User $user){
        $data['profile'] = JobProfile::where('user_id',$user->id)->get();
        $data['profileEducations'] = ProfileEducation::where('user_id',$user->id)->get();
        $data['profileExperiences'] = ProfileExperience::where('user_id',$user->id)->get();
        $data['projects'] = Project::where('user_id',$user->id)->get();
        $data['certificates'] = Certificate::where('user_id',$user->id)->get();
        return response()->json($data);
    }


    public function createProject(Request $req, User $user)
    {
        $data = $this->validateProject($req->data, $user);
        if (!empty($data['message'])) {
            return response()->json($data, $data['status']);
        }
        if (empty($data['id'])) {
            $data['user_id'] = $user->id;
            $profileEducation = Project::create($data);
        } else {
            $profileEducation = Project::find($data['id']);
            unset($data['id']);
            $profileEducation->update($data);
            $profileEducation->refresh();
        }

        return response()->json($profileEducation);
    }

    public function validateProject($data, $user)
    {
        $validator = Validator::make($data, [
            'id' => 'nullable|exists:projects,id',
            'startedAt' => 'required|date_format:Y-m-d',
            'endsAt' => 'nullable|date_format:Y-m-d|after:startedAt',
            'name' => 'required|string|max:255',
            'description' => 'required|string',

        ]);


        if (!empty($validator->errors()->messages())) {
            return ['message' => $validator->errors()->all()[0], 'status' => 400, 'success' => false];
        }

        $data = $validator->validate();
        $data['started_at'] = $data['startedAt'];
        $data['ends_at'] = $data['endsAt'] ?? null;

        unset($data['startedAt'], $data['endsAt']);
        return $data;
    }

    public function createProfileExperience(Request $req, User $user)
    {
        $data = $this->validateProfileExperiences($req->data, $user);

        if (!empty($data['message'])) {
            return response()->json($data, $data['status']);
        }
        if (empty($data['id'])) {
            $data['user_id'] = $user->id;
            $profileEducation = ProfileExperience::create($data);
        } else {
            $profileEducation = ProfileExperience::find($data['id']);
            unset($data['id']);
            $profileEducation->update($data);
            $profileEducation->refresh();
        }

        return response()->json($profileEducation);
    }

    public function validateProfileExperiences($data, $user)
    {
        $validator = Validator::make($data, [
            'id' => 'nullable|exists:profile_experiences,id',
            'organisation' => 'required|string|max:255',
            'jobType' => 'required|string|in:full_time,part_time,internship,contractual',
            'jobRole' => 'required|string',
            'startedAt' => 'required|date_format:Y-m-d',
            'endsAt' => 'nullable|date_format:Y-m-d|after:startedAt',
        ]);

        if (!empty($validator->errors()->messages())) {
            return ['message' => $validator->errors()->all()[0], 'status' => 400, 'success' => false];
        }

        $data = $validator->validate();
        $data['job_type'] = $data['jobType'];
        $data['job_role'] = $data['jobRole'];
        $data['started_at'] = $data['startedAt'];
        $data['ends_at'] = $data['endsAt'] ?? null;
        $id = $data['id'] ?? null;
        $validationResponse = $this->validateExperienceOverlap($user->id, $data['started_at'], $data['ends_at'], $id);
        if (!$validationResponse['success']) {
            return $validationResponse;
        }

        unset($data['jobType'], $data['jobRole'], $data['startedAt'], $data['endsAt']);
        return $data;
    }

    public function createProfileEducations(Request $req, User $user)
    {

        $data = $this->validateProfileEducations($req->data, $user);

        if (!empty($data['message'])) {
            return response()->json($data, $data['status']);
        }
        if (!empty($data['email']) || !empty($data['phone']) ||  !empty($data['name'])) {
            $user->update($data);
            unset($data['email'], $data['phone'], $data['name']);
        }
        $data['user_id'] = $user->id;
        try {
            if (empty($data['id'])) {
                $profileEducation =  ProfileEducation::create($data);
            } else {
                $profileEducation = ProfileEducation::find($data['id'])->first();
                unset($data['id']);
                $profileEducation->update($data);
                $profileEducation->refresh();
            }

            return response()->json($profileEducation);
        } catch (\Exception $e) {
            if ($e->getCode() == '23000') {
                return response()->json([
                    'message' => 'Duplicate Institute and course name',
                    'success' => false,
                    'status' =>  409,
                    'debug' => $e->getMessage()
                ], 409); // 409 Conflict
            }
            return response()->json([
                'message' => 'Something went wrong',
                'success' => false,
                'status' =>  500
            ], 500);
        }
    }

    public function validateProfileEducations($data, $user)
    {
        $validator = Validator::make($data, [
            'id' => 'nullable|exists:profile_educations,id',
            'institute' => 'required|string|max:255',
            'gradeType' => 'required|string|in:scale_of_10,percentage,scale_of_5,pass_or_fail',
            'result' => [
                'nullable',
                'string',
                function ($attribute, $value, $fail) use ($data) {
                    $gradeType = $data['gradeType'] ?? null;

                    if ($gradeType === 'scale_of_10' && (!is_numeric($value) || $value < 0 || $value > 10)) {
                        $fail("The result must be a numeric value between 0 and 10 for scale of 10.");
                    } elseif ($gradeType === 'scale_of_5' && (!is_numeric($value) || $value < 0 || $value > 5)) {
                        $fail("The result must be a numeric value between 0 and 5 for scale_of_5.");
                    } elseif ($gradeType === 'percentage' && (!is_numeric($value) || $value < 0 || $value > 100)) {
                        $fail("The result must be a numeric value between 0 and 100 for percentage.");
                    } elseif ($gradeType === 'pass_or_fail' && !in_array(strtolower($value), ['pass', 'fail'])) {
                        $fail("The result must be 'pass' or 'fail' for pass or fail.");
                    }
                },
            ],
            'course' => 'nullable|string',
            'startedAt' => 'required|date_format:Y-m-d',
            'endsAt' => 'nullable|date_format:Y-m-d|after:startedAt',
            'institute' => 'required|string|max:255',
            'course' => 'required|string|max:255|distinct',
            'startedAt' => 'required|date_format:Y-m-d',
            'endsAt' => 'nullable|date_format:Y-m-d|after:profileEducations.*.startedAt',
        ]);

        if (!empty($validator->errors()->messages())) {
            return ['message' => $validator->errors()->all()[0], 'status' => 400, 'success' => false];
        }
        $data = $validator->validate();
        if (empty($data['endsAt'])) {
            $currentlyPursuingCount = ProfileEducation::where('user_id', $user->id)->where('ends_at', null)->count();
            if ($currentlyPursuingCount > 1) {
                return ['message' => "You can pursue only one education at a time", 'status' => 400, 'success' => false];
            }
        }

        $data['grade_type'] = $data['gradeType'];
        $data['started_at'] = $data['startedAt'];
        $data['ends_at'] = $data['endsAt'];

        unset($data['gradeType'], $data['startedAt'], $data['endsAt']);
        return $data;
    }

    public function create(Request $req, User $user)
    {

        $data = $this->validateProfileData($req->data, $user);

        if (!empty($data['message'])) {
            return response()->json($data, $data['status']);
        }
        if (!empty($data['email']) || !empty($data['phone']) ||  !empty($data['name'])) {
            $user->update($data);
            unset($data['email'], $data['phone'], $data['name']);
        }
        $data['user_id'] = $user->id;
        $jobProfile =  JobProfile::updateOrCreate(['user_id' => $user->id], $data);


        return response()->json($jobProfile);
    }

    public function validateProfileData($data)
    {

        $validator = Validator::make($data, [
            'name' => 'nullable|string',
            'email' => 'nullable|email',
            'currentLocation' => 'nullable|string',
            'aboutMe' => 'nullable|string',
            'achievements' => 'nullable|string',
            'socialLinks'=> 'nullable|array',
            'socialLinks.*.url' => 'required|url', // Each URL must be a valid URL
            'socialLinks.*.type' => ['required', function ($attribute, $value, $fail) use ($data) {
                // Check if type is unique
                $types = array_column($data['socialLinks'], 'type');
                $count = array_count_values($types)[$value] ?? 0;
                
                if ($count > 1) {
                    $fail('The ' . $value . ' type is duplicated.');
                }
            }],
            'languagesKnown' => 'nullable|distinct',
            'address' => 'nullable|string',
            'country' => 'nullable|string',
            'state' => 'nullable|string',

        ]);

        if (!empty($validator->errors()->messages())) {
            return ['message' => $validator->errors()->all()[0], 'status' => 400, 'success' => false];
        }


        $data = $validator->validate();
        $data['current_location'] = $data['currentLocation'];
        $data['about_me'] = $data['aboutMe'];
        $data['social_links'] = $data['socialLinks'];
        $data['languages_known'] = $data['languagesKnown'];
        unset($data['currentLocation'], $data['aboutMe'], $data['socialLinks'], $data['languagesKnown']);
        return $data;
    }

    public function validateExperienceOverlap($userId, $startedAt, $endsAt = null, $id = null)
    {

        if ($endsAt == null) {
            if (ProfileExperience::where('user_id', $userId)->where('ends_at', null)->exists()) {
                return [
                    'message' => "Ends At required",
                    'success' => false,
                    'status' => 400
                ];
            }
            $experience = ProfileExperience::where('user_id', $userId)
                ->whereNotNull('ends_at') // Ensures only rows with `ends_at` are considered
                ->orderBy('ends_at', 'desc')
                ->first();

            if ($experience->ends_at < $startedAt) {
                return [
                    'message' => "Ends At overlaps with : " . $experience->organisation,
                    'success' => false,
                    'status' => 400
                ];
            }

            return [
                'success' => true,
                'status' => 200
            ];
        }

        $experience = ProfileExperience::where('user_id', $userId)->where(function ($query) use ($startedAt) {
            $query->where('started_at', '<', $startedAt)
                ->Where('ends_at', '>', $startedAt);
        })->orwhere(function ($query) use ($endsAt) {
            $query->where('started_at', '<', $endsAt)
                ->Where('ends_at', '>', $endsAt);
        })->first();
        if (!empty($experience) && (empty($id) ||  ($id != $experience->id))) {
            return [
                'message' => "Start or End date  ovelaps with previous organisation: " . $experience->organisation,
                'success' => false,
                'status' => 400
            ];
        }

        return [
            'success' => true,
            'status' => 200
        ];
    }

    public function updateCertificate(Request $request, User $user)
    {
        $data = $request->all();

        $validator = Validator::make($data, [
            'id' => 'nullable|exists:certificates,id',
            'name' => "required|string",
            'file' => 'nullable|mimes:pdf|max:10240', // File is optional during update
            'fromDate' => 'required|date_format:Y-m-d',
            'toDate' => 'nullable|date_format:Y-m-d|after:fromDate',
        ]);

        if (!empty($validator->errors()->messages())) {
            return ['message' => $validator->errors()->all()[0], 'status' => 400, 'success' => false];
        }
        $data = $validator->validated();

        $fileRecord = $this->createFileConfig($data, $user->id);

        if (empty($data['id'])) {
            $certificate = Certificate::create($fileRecord);
        } else {

            $certificate = Certificate::where('id', $data['id'])->first();
            if ($certificate->path && Storage::disk('public')->exists($certificate->path)) {
                Storage::disk('public')->delete($certificate->path);
                unset($fileRecord['id']);
            }
            $certificate->update($fileRecord);
        }

        return response()->json($certificate);
    }

    public function createFileConfig($data, $user_id)
    {
        // Store the new file
        $file = $data['file'];
        $path = $file->store('certificates/' . $user_id, 'public');

        return [
            'file_id' => pathinfo($path, PATHINFO_FILENAME),
            'path' => $path,
            'name' => $data['name'],
            'from_date' => $data['fromDate'] ?? null,
            'to_date' => $data['toDate'] ?? null,
            'user_id'  => $user_id
        ];
    }
}
