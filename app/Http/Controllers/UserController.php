<?php

namespace App\Http\Controllers;

use App\Http\Resources\StudentResource;
use App\Http\Resources\UserResource;
use App\Models\Qualification;
use App\Models\User;
use App\Services\UserService;
use App\Services\ZohoService;
use Google\Rpc\RequestInfo;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Validator;
use PDO;

class UserController extends Controller
{
    public function update(Request $request)
    {
        // Validation
        $request->validate([
            'name' => 'required|string',
            'email' => 'required|email',
            'receive_email_notification' => 'required|boolean',
            'receive_sms_notification' => 'required|boolean',
            //'registration_number' => 'required|string',
            //'phone' => 'required|string',
            'gender' => 'required|in:Male,Female,Other',
            'birthday' => 'required|date',
            //'year_of_passed_out' => 'required|integer',
            'address' => 'required|string',
            'pincode' => 'required|string',
            //'school' => 'required|string',
            'city' => 'required|string',
            'qualifications' => 'required|array',
            'state_id' => 'required|integer',
            'aadhaar_number' => 'required|integer|digits:12',
            'linkedin_profile' => 'nullable|url',
            'upload_resume' => 'required|file|mimes:pdf,doc,docx',
            'upload_aadhar' => 'required|file|mimes:pdf,doc,docx',
            'avatar_url' => 'nullable|file|mimes:jpeg,jpg,png,gif',
            'parent_name' => 'nullable|string|max:191',
            'parent_email' => 'nullable|email|max:191',
            'parent_aadhar' => 'nullable|integer|digits:12',
            'parent_occupation' => 'nullable|string|max:191',
            'residential_address' => 'nullable|string|max:191'
        ]);

        $upload_aadhar = $upload_resume = $upload_avatar_url = "";
        // Handle the file upload logic
        $file = $request->file('upload_aadhar');
        if ($file)
            $upload_aadhar = $file->store('public'); // Store the file in the 'uploads' directory

        $file = $request->file('upload_resume');
        if ($file)
            $upload_resume = $file->store('public'); // Store the file in the 'uploads' directory

        $file = $request->file('avatar_url');
        if ($file)
            $upload_avatar_url = $file->store('public'); // Store the file in the 'uploads' directory


        // Update user
        $user = $request->user();
        $user->name = $request->name;
        $user->email = $request->email;
        $user->receive_email_notification = $request->receive_email_notification;
        $user->receive_sms_notification = $request->receive_sms_notification;
        //$user->registration_number = $request->registration_number;
        //$user->phone = $request->phone;
        $user->gender = $request->gender;
        $user->birthday = $request->birthday;
        //$user->year_of_passed_out = $request->year_of_passed_out;
        $user->address = $request->address;
        $user->pincode = $request->pincode;
        //$user->school = $request->school;
        $user->city = $request->city;
        //$user->qualification_id = $request->qualification_id;

        //dd($request->qualifications);
        //        foreach ($request->qualifications as $qualification) {
        //
        //            $qualificationsWithName = array_map(function($qualification) {
        //                $qualificationDetail = Qualification::find($qualification['qualification_id']);
        //                $qualification['name'] = $qualificationDetail ? $qualificationDetail->name : 'Unknown';
        //                return $qualification;
        //            }, $qualifications);
        //
        //        }

        //$qualifications = json_encode($request->qualifications);
        $arr_qualifications = [];
        foreach ($request->qualifications as $qualification) {
            $arr_qualifications = json_decode(trim(stripslashes($qualification), '"'), true);
        }


        //dd(trim($qualifications,'"'));
        // Decode the incorrectly encoded JSON string
        //$qualifications = json_decode(trim(stripslashes($qualifications),'"'), true);




        // Encode it properly
        //$qualifications = $qualifications;
        //dd($qualifications);

        $user->qualification = $arr_qualifications;


        $user->state_id = $request->state_id;
        $user->aadhaar_number = $request->aadhaar_number;
        $user->linkedin_profile = $request->linkedin_profile;

        if ($upload_resume)
            $user->upload_resume = basename($upload_resume);
        if ($upload_aadhar)
            $user->upload_aadhar = basename($upload_aadhar);

        if ($upload_avatar_url)
            $user->avatar_url = basename($upload_avatar_url);

        $user->save();
        //        dd($user);

        return response()->json(['message' => 'User updated successfully', 'user' => new UserResource($user)]);
    }

    public function find(Request $request) {}

    public function tutors(Request $request)
    {
        $users = User::where('role_id', 7)
            ->select('id', 'name', 'email', 'phone')
            ->get();
        return response()->json(["data" => $users]);
    }

    public function createStudent(Request $request, UserService $us)
    {
        $data = $request->data;

        if(gettype($data) != 'array')
            $data = json_decode($data,true);
            if(gettype($data) != 'array')
                return response()->json(['message' => "Data key must be in array", 'status' => 400, 'success' => false], 400);

        $validator = Validator::make($data, [
            'email' => 'required|email',
            // 'paymentStatus' => 'required|in:1,2,3',
            'name' =>  'required|string',
            "phone" => "required|string|max:12",
            "branchLocation" => 'required|string|exists:branches,name',
            "zohoCustomerId" => 'required|integer'
        ]);

        if (!empty($validator->errors()->messages())) {
            return response()->json(['message' => $validator->errors()->all()[0], 'status' => 400, 'success' => false], 400);
        }

        $data = $validator->validate();
        try {
            $data = $us->createStudent($data);
            return response()->json(['message' => 'User Created', 'data' => new StudentResource($data['user']), 'status' => 200, 'success' => true], 200);
        } catch (\Exception $e) {
            if ($e->getCode() === '23000') {
                return response()->json([
                    'message' => 'User Already registered',
                    'success' => false,
                    'status' =>  409
                ], 409); // 409 Conflict
            }
            return response()->json([
                'message' => $e->getMessage(),
                'success' => false,
                'status' =>  400
            ], 400); // 409 Conflict

        }
    }


    public function getPaymentDetails(ZohoService $zs)
    {
        $user = Auth::user();
        if(empty($user))
            return response()->json([ 'message' => 'User not found', "success" => false,'status' => 404], 404);

        if(!$user->getIsStudentAttribute())
            return response()->json([ 'message' => 'Payment Centre only for the user role', "success" => false,'status' => 400], 400);

        $zohoCrmId = $user->zoho_crm_id;
        if(empty($zohoCrmId))
            return response()->json([ 'message' => 'Customer Not Synced yet on zoho', "success" => false,'status' => 400], 400);

        try{
            $paymentData = $zs->getInvoiceDetails($user);
        }catch(\Exception $e){
            return response()->json([ 'message' => $e->getMessage(), "success" => false,'status' => 500], 500);
        }

        return response()->json(($paymentData));
    }
}
