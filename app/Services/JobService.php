<?php

namespace App\Services;

use App\Models\ProfileEducation;
use App\Models\ProfileExperience;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;

class JobService
{

    protected $validator;

    public function __construct()
    {
        $this->validator = new Validator();
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

    public function validateAwards($data)
    {
        $validator = Validator::make($data, [
            'id' => 'nullable|exists:projects,id',
            'issueAt' => 'nullable|date_format:Y-m-d',
            'name' => 'required|string|max:255',
            'description' => 'required|string',
        ]);

        if (!empty($validator->errors()->messages())) {
            return ['message' => $validator->errors()->all()[0], 'status' => 400, 'success' => false];
        }

        $data = $validator->validate();
        $data['issue_at'] = $data['issueAt'] ?? null;

        unset($data['issueAt']);
        return $data;
    }

    public function validateProfileExperiences($data, $user, $profileExperience = null)
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

        $experiences = ProfileExperience::where('user_id', $user->id)->get();
        $duplicateExperience = $experiences->filter(function ($experience) use ($data) {
            return $experience->job_role === $data['jobRole'] &&
                $experience->organisation === $data['organisation'];
        })->first();

        if ($duplicateExperience) {
            if (empty($profileExperience) || $profileExperience->id != $duplicateExperience->id) {
                return ['message' => "Company and designation must be unique", 'status' => 400, 'success' => false];
            }
        }
        $validationResponse = $this->validateExperienceOverlap($experiences, $user->id, $data['started_at'], $data['ends_at'], $id);
        if (!$validationResponse['success']) {
            return $validationResponse;
        }


        // Initialize total experience in days
        $totalDays = 0;

        // Iterate over each experience
        foreach ($experiences as $experience) {
            $startDate = Carbon::parse($experience->started_at);
            $endDate = $experience->ends_at ? Carbon::parse($experience->ends_at) : Carbon::today();

            // Add the difference in days between start and end dates
            $totalDays += $startDate->diffInDays($endDate);
        }

        // Convert total days into years (and remaining months, optional)
        $data['totalYears'] = floor($totalDays / 365);

        unset($data['jobType'], $data['jobRole'], $data['startedAt'], $data['endsAt']);
        return $data;
    }

    public function validateExperienceOverlap($experiences, $userId, $startedAt, $endsAt = null, $id = null)
    {

        if ($endsAt == null) {

            $overlappingNullEnd = $experiences->first(function ($experience) {
                return $experience->ends_at === null;
            });

            if ($overlappingNullEnd) {
                return [
                    'message' => "Ends At required",
                    'success' => false,
                    'status' => 400
                ];
            }

            // Find the latest experience where `ends_at` is not null
            $latestEndedExperience = $experiences
                ->filter(function ($experience) {
                    return $experience->ends_at !== null;
                })
                ->sortByDesc('ends_at')
                ->first();

            if ($latestEndedExperience && $latestEndedExperience->ends_at < $startedAt) {
                return [
                    'message' => "Ends At overlaps with: " . $latestEndedExperience->organisation,
                    'success' => false,
                    'status' => 400
                ];
            }

            return [
                'success' => true,
                'status' => 200
            ];
        }

        $overlappingExperience = $experiences->first(function ($experience) use ($startedAt, $endsAt, $id) {
            $overlapsStart = $experience->started_at < $startedAt && $experience->ends_at > $startedAt;
            $overlapsEnd = $endsAt && $experience->started_at < $endsAt && $experience->ends_at > $endsAt;

            // Check if there's an overlap and exclude the current experience if `$id` is provided
            return ($overlapsStart || $overlapsEnd) && (empty($id) || $id != $experience->id);
        });


        if (!empty($overlappingExperience)) {
            return [
                'message' => "Start or End date overlaps with previous organisation: " . $overlappingExperience->organisation,
                'success' => false,
                'status' => 400
            ];
        }

        return [
            'success' => true,
            'status' => 200
        ];
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
            'degreeType' => 'required|string|in:UG,PG,PHD,10,12',
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
        $data['degree_type'] = $data['degreeType'];
        $data['grade_type'] = $data['gradeType'];
        $data['started_at'] = $data['startedAt'];
        $data['ends_at'] = $data['endsAt'];

        unset($data['gradeType'], $data['startedAt'], $data['endsAt'], $data['degreeType']);
        return $data;
    }

    public function validateProfileData($data, $jobProfile = null)
    {
        if(isset($data['aboutMe']) && empty($data['aboutMe'])){
            $data['aboutMe'] = null;
        }

        if(isset($data['achievements']) && empty($data['achievements'])){
            $data['achievements'] = null;
        }
        if(isset($data['languagesKnown']) && empty($data['languagesKnown'])){
            $data['languagesKnown'] = null;
        }

        $validator = Validator::make($data, [
            'name' => 'nullable|string',
            'email' => 'nullable|email',
            'currentLocation' => 'nullable|string',
            'aboutMe' => 'nullable|string',
            'phone' => 'nullable|string|max:12',
            'birthday' => 'nullable|date_format:Y-m-d',
            'awards' => 'nullable|array',
            // 'achievements.*.title' => 'required_if:achievements,!=,null|string',
            // 'achievements.*.description' => 'required_if:achievements,!=,null|string',
            'socialLinks.url' => 'nullable|url', // Each URL must be a valid URL
            'socialLinks.type' => [ 'required_with:socialLinks.url',
                function ($attribute, $value, $fail) use ($data) {
                    // Check if type is unique
                    $types = array_column($data['socialLinks'], 'type');
                    $count = array_count_values($types)[$value] ?? 0;
                    if (!in_array($value, ['linkedIn', 'others'])) {
                        $fail('Only linkedIn is supported.');
                    }
                    if ($count > 1) {
                        $fail('The ' . $value . ' type is duplicated.');
                    }
                }
            ],

            'languagesKnown' => 'nullable|distinct',
            'address' => 'nullable|string',
            'country' => 'nullable|string',
            'state' => 'nullable|string',
        ]);

        if (!empty($validator->errors()->messages())) {
            return ['message' => $validator->errors()->all()[0], 'status' => 400, 'success' => false];
        }
        
        $data = $validator->validate();

        if (array_key_exists('currentLocation',$data))
            $data['current_location'] = $data['currentLocation'];

        if (array_key_exists('aboutMe',$data))
            $data['about_me'] = $data['aboutMe'];

        
        if (array_key_exists('socialLinks',$data)){
            $data['social_links'] = !empty($jobProfile) ? $jobProfile->social_links : [];
            $data['social_links'][$data['socialLinks']['type']] = $data['socialLinks'];
        }


        if (array_key_exists('languagesKnown',$data))
            $data['languages_known'] = $data['languagesKnown'];
        
        unset($data['currentLocation'], $data['aboutMe'], $data['socialLinks'], $data['languagesKnown']);
        return $data;
    }

    public function getPdfReview($path, $fileName)
    {
        // Check if the file exists in the storage
        if (!Storage::exists($path)) {
            return response()->json(['error' => 'Certificate not found'], 404);
        }
        // Serve the file as a response
        return Storage::response($path, $fileName, [
            'Content-Type' => 'application/pdf',
        ]);
    }
}
