<?php

namespace App\Http\Controllers\api;

use App\Http\Controllers\Controller;
use App\Http\Resources\AwardsResource;
use App\Http\Resources\CertificateResource;
use App\Http\Resources\ProfileEducationResource;
use App\Http\Resources\ProfileExperienceResource;
use App\Http\Resources\ProfileResource;
use App\Http\Resources\ProjectResource;
use App\Models\Award;
use App\Models\Certificate;
use App\Models\JobProfile;
use App\Models\ProfileEducation;
use App\Models\ProfileExperience;
use App\Models\Project;
use App\Models\User;
use App\Services\JobService;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;

class JobProfileController extends Controller
{
    public function show(Request $request, User $user)
    {
        $data['profile'] = JobProfile::where('user_id', $user->id)->first();
        $data['profile']['user'] = $user;
        $data['profile']['name'] = $user->name;
        $data['profile']['email'] = $user->email;
        $data['profile']['phone'] = $user->phone;
        $data['profile']['address'] = $user->address;
        $completedDetails = 0;
        $certificate = Certificate::where('user_id', $user->id)->where('is_resume', true)->first() ?? null;
        $incompleteDetails['resume'] = 0;

        if (!empty($certificate)) {
            $data['profile']['resumeUrl'] = config('services.app.url') . 'storage' . '/' . $certificate->path;
            $data['profile']['resumeId'] = $certificate->id ?? null;
            $completedDetails = 1;
            $incompleteDetails['resume'] = 1;
        }

        if (empty($data['profile'])) {
            return response()->json(
                [
                    'message' => "Profile not found",
                    'success' => false,
                    'status' => 404
                ],
                404
            );
        }

        $profileData['profileEducations'] = ProfileEducation::where('user_id', $user->id)->get() ?? null;
        $profileData['profileExperiences'] = ProfileExperience::where('user_id', $user->id)->get() ?? null;
        $profileData['projects'] = Project::where('user_id', $user->id)->get() ?? null;
        $profileData['certificates'] = Certificate::where('user_id', $user->id)->where('is_resume', false)->get() ?? null;

        $completedDetails += $incompleteDetails['profileDetails'] = (int)(!empty($data['profile']->about_me));

        foreach ($profileData as $key => $value) {
            $incompleteDetails[$key] = $value->isEmpty() ? 0 : 1;
            $completedDetails += $incompleteDetails[$key];
        }
        $profileData['awards'] = Award::where('user_id', $user->id)->get();

        $data = [
            'profile' => new ProfileResource($data['profile']),
            'profileEducations' => ProfileEducationResource::collection($profileData['profileEducations']),
            'profileExperiences' => ProfileExperienceResource::collection($profileData['profileExperiences']),
            'projects' => ProjectResource::collection($profileData['projects']),
            'certificates' => CertificateResource::collection($profileData['certificates']),
            'awards' => AwardsResource::collection($profileData['awards']),

        ];
        
        $data['profileScore']  = (($completedDetails)/ (count($incompleteDetails))) * 100;
        $data['completeDetails'] = $incompleteDetails;
        $data['percentageContribution'] = (1 / count($incompleteDetails)) * 100;

        return response()->json([
            'data' => $data,
            'success' => true,
            'status' => 200
        ], 200);
    }

    public function create(Request $req, User $user, JobService $js)
    {
        $jobProfile =  JobProfile::where('user_id', $user->id)->first();
        $data = $js->validateProfileData($req->data, $jobProfile);

        if (!empty($data['message'])) {
            return response()->json($data, $data['status']);
        }

        if (!empty($data['email']) || !empty($data['phone']) ||  !empty($data['name'])  ||  !empty($data['birthday'])) {
            try {
                $user->update($data);
            } catch (\Exception $e) {
                if ($e->getCode() == '23000') {
                    return response()->json([
                        'message' => 'Email Already exists',
                        'success' => false,
                        'status' =>  409,
                    ], 409); // 409 Conflict
                }

                return response()->json([
                    'message' => 'Something went wrong',
                    'success' => false,
                    'status' =>  500
                ], 500);
            }
            unset($data['email'], $data['phone'], $data['name'], $data['birthday']);
        }

        $data['user_id'] = $user->id;
        try {
            $jobProfile =  JobProfile::updateOrCreate(['user_id' => $user->id], $data);
        } catch (\Exception $e) {

            if ($e->getCode() == '23000') {
                return response()->json([
                    'message' => 'Duplicate Institute and course name',
                    'success' => false,
                    'status' =>  409,
                ], 409); // 409 Conflict
            }

            return response()->json([
                'message' => 'Something went wrong',
                'success' => false,
                'status' =>  500
            ], 500);
        }

        return response()->json([
            'data' => ['profile' => new ProfileResource($jobProfile)],
            'success' => true,
            'status' => 200
        ], 200);
    }

    public function createProject(Request $req, User $user, JobService $js)
    {
        $data = $js->validateProject($req->data, $user);
        if (!empty($data['message'])) {
            return response()->json($data, $data['status']);
        }

        $data['user_id'] = $user->id;
        $project = Project::create($data);

        return response()->json([
            "data" => ['projects' => new ProjectResource($project)],
            "success" => true,
            'status' => 200
        ], 200);
    }

    public function updateProject(Request $req, User $user, Project $project, JobService $js)
    {
        $data = $js->validateProject($req->data, $user);
        if (!empty($data['message'])) {
            return response()->json($data, $data['status']);
        }
        $project->update($data);
        $project->refresh();
        return response()->json([
            "data" => ['projects' => new ProjectResource($project)],
            "success" => true,
            'status' => 200
        ], 200);
    }

    public function deleteProject(Request $req, User $user, Project $project)
    {

        $project->delete();
        return response()->json([
            'data' => [
                'message' => 'Project deleted Successfully'
            ]
        ], 200);
    }

    public function createProfileExperience(Request $req, User $user, JobService $js)
    {
        $data = $js->validateProfileExperiences($req->data, $user);
        if (!empty($data['message'])) {
            return response()->json($data, $data['status']);
        }
        $data['user_id'] = $user->id;

        unset($data['totalYears']);
        $profileExperience = ProfileExperience::create($data);
        return response()->json([
            'data' => ['profileExperience' => new ProfileExperienceResource($profileExperience)],
            'success' => true,
            'status' => 200
        ], 200);
    }

    public function deleteProfileExperience(Request $req, User $user, ProfileExperience $profileExperience)
    {

        $profileExperience->delete();
        return response()->json([
            'data' => [
                'message' => 'Profile Experience deleted Successfully'
            ]
        ], 200);
    }

    public function updateProfileExperience(Request $req, User $user, ProfileExperience $profileExperience, JobService $js)
    {

        $data = $js->validateProfileExperiences($req->data, $user, $profileExperience);
        if (!empty($data['message'])) {
            return response()->json($data, $data['status']);
        }

        $jobProfile = JobProfile::where('user_id', $user->id);
        $jobProfile->update(['total_experience' => $data['totalYears']]);

        unset($data['id'], $data['totalYears']);

        $profileExperience->update($data);

        $profileExperience->refresh();

        return response()->json([
            'data' => ['profileExperience' => new ProfileExperienceResource($profileExperience)],
            'success' => true,
            'status' => 200
        ], 200);
    }

    public function createProfileEducations(Request $req, User $user, JobService $js)
    {

        $data = $js->validateProfileEducations($req->data, $user);

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

            return response()->json([
                'data' => ['profileEducation' => new ProfileEducationResource($profileEducation)],
                'success' => true,
                'status' => 200
            ], 200);
        } catch (\Exception $e) {

            if ($e->getCode() == '23000') {
                return response()->json([
                    'message' => 'Duplicate Institute and course name',
                    'success' => false,
                    'status' =>  409,
                ], 409); // 409 Conflict
            }

            return response()->json([
                'message' => 'Something went wrong',
                'success' => false,
                'status' =>  500
            ], 500);
        }
    }

    public function updateProfileEducation(Request $req, User $user, ProfileEducation $profileEducation, JobService $js)
    {
        $data = $js->validateProfileEducations($req->data, $user);

        if (!empty($data['message'])) {
            return response()->json($data, $data['status']);
        }

        if (!empty($data['email']) || !empty($data['phone']) ||  !empty($data['name'])) {
            $user->update($data);
            unset($data['email'], $data['phone'], $data['name']);
        }

        $data['user_id'] = $user->id;

        try {
            unset($data['id']);
            $profileEducation->update($data);
            $profileEducation->refresh();

            return response()->json([
                'data' => ['profileEducation' => new ProfileEducationResource($profileEducation)],
                'success' => true,
                'status' => 200
            ], 200);
        } catch (\Exception $e) {
            if ($e->getCode() == '23000') {
                return response()->json([
                    'message' => 'Duplicate Institute and course name',
                    'success' => false,
                    'status' =>  409,
                ], 409); // 409 Conflict
            }
            return response()->json([
                'message' => 'Something went wrong',
                'success' => false,
                'status' =>  500
            ], 500);
        }
    }

    public function deleteProfileEducation(Request $req, User $user, ProfileEducation $profileEducation)
    {
        $profileEducation->delete();
        return response()->json([
            'data' => [
                'message' => 'Profile Eduacation deleted Successfully'
            ]
        ], 200);
    }

    public function addCertificate(Request $request, User $user)
    {
        $data = $request->all();
        $rules = [
            'id' => 'nullable|exists:certificates,id',
            'name' => "required|string",
            'file' => 'required|mimes:pdf|max:102400',
            'isResume' => 'nullable|boolean|in:1'
        ];

        if (empty($data['isResume'])) {
            $rules = array_merge($rules, [
                'fromDate' => 'required|date_format:Y-m-d',
                'toDate' => 'nullable|date_format:Y-m-d|after:fromDate',
            ]);
        } else {
            if (empty($data['id'])) {
                Certificate::where('user_id', $user->id)
                    ->where('is_resume', true)
                    ->delete();
            }
        }

        $validator = Validator::make($data, $rules);

        if (!empty($validator->errors()->messages())) {
            return response()->json(['message' => $validator->errors()->all()[0], 'status' => 400, 'success' => false], 400);
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
        return response()->json([
            "data" => ["certificate" => new CertificateResource($certificate)],
            'success' => true,
            'status' => 200
        ], 200);
    }

    public function createFileConfig($data, $user_id, $path = null)
    {
        // Store the new file
        $file = $data['file'];
        $path = $path ?? $file->store('certificates/' . $user_id, 'public');
        return [
            'file_id' => pathinfo($path, PATHINFO_FILENAME),
            'path' => $path,
            'name' => $data['name'],
            'from_date' => $data['fromDate'] ?? null,
            'to_date' => $data['toDate'] ?? null,
            'user_id'  => $user_id,
            'is_resume' => !empty($data['isResume'])
        ];
    }

    public function deleteCertificate(Request $req, User $user, Certificate $certificate)
    {
        $certificate->delete();
        return response()->json([
            'data' => [
                'message' => 'Certificate deleted Successfully'
            ]
        ], 200);
    }

    public function previewCertificate(User $user, Certificate $certificate, JobService $js)
    {
        $path = "public/" . $certificate->path;
        return $js->getPdfReview($path, $certificate->file_id);
    }

    public function  getDocuments(Request $request, User $user)
    {

        $size = $request->get('size') == 0 ? 25 : $request->get('size');
        $pageNo = $request->get('page', 1);
        $offset = ($pageNo - 1) * $size;
        $certificates = Certificate::where('user_id', $user->id);
        if (!empty($request->onlyResume)) {
            $certificates->where('is_resume', true);
        }
        $totalRecords = $certificates->count();
        return [
            'data' => CertificateResource::collection($certificates->offset($offset)->limit($size)->get()),
            "totalRecords" => $totalRecords,
            "pageNo" =>  $pageNo,
            "totalPages" => ceil($totalRecords / $size)
        ];
    }

    public function createAwards(Request $req, User $user, JobService $js)
    {

        $data = $js->validateAwards($req->data);
        if (!empty($data['message'])) {
            return response()->json($data, $data['status']);
        }
        $data['user_id'] = $user->id;
        $award = Award::create($data);

        return response()->json([
            'data' => ['awards' => new AwardsResource($award)],
            'success' => true,
            'message' => "Award Added Successfully",
            'status' => 200

        ], 200);
    }

    public function updateAwards(Request $req, User $user, Award $award, JobService $js)
    {
        $data = $js->validateAwards($req->data);
        if (!empty($data['message'])) {
            return response()->json($data, $data['status']);
        }
        $award->update($data);
        return response()->json([
            'data' => ['awards' => new AwardsResource($award)],
            'success' => true,
            'status' => 200,
            'message' => "Award Updated Successfully"
        ], 200);
    }

    public function  deleteAwards(Request $req, User $user, Award $award, JobService $js)
    {
        $award->delete();
        return response()->json([
            'data' => [
                'message' => 'Award deleted Successfully'
            ]
        ], 200);
    }
}
