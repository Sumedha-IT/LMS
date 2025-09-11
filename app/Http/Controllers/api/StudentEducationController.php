<?php

namespace App\Http\Controllers\api;

use App\Models\DegreeType;
use Illuminate\Http\Request;
use App\Models\Specialization;
use App\Models\StudentEducation;
use App\Http\Controllers\Controller;
use App\Http\Resources\DegreeResource;
use App\Http\Resources\SpeacializationResource;
use App\Http\Resources\StudentEducationResource;

class StudentEducationController extends Controller
{
    public function GetDegreeTypes(Request $request){
        $degreeTypes=DegreeType::all();
        return DegreeResource::collection($degreeTypes);
    }
    public function GetSpecializations($id){
        $speacializations=Specialization::where('degree_type_id',$id)->get();
        return response()->json([
            'data' => SpeacializationResource::collection($speacializations),
            'has_other' => true
        ]);
    }
    public function store (Request $request){
        $user=$request->user();

        // Get the degree type to check if it's school education (10th or 12th)
        $degreeType = DegreeType::find($request->degree_type_id);
        $isSchoolEducation = $degreeType && in_array($degreeType->id, [1, 2]); // 10th and 12th class
        
        // Base validation rules
        $rules = [
            'degree_type_id' => 'required|exists:degree_types,id',
            'grade_type' => 'required|in:percentage,cgpa',
            'percentage_cgpa' => 'required|numeric',
            'institute_name' => 'required|string',
            'location' => 'required|string',
        ];

        // Add duration or year validation based on education type
        if ($isSchoolEducation) {
            // For school education (10th/12th), require year_of_passout
            $rules['year_of_passout'] = 'required|string|max:4';
            // Make duration fields optional for school education
            $rules['duration_from'] = 'nullable|string';
            $rules['duration_to'] = 'nullable|string';
        } else {
            // For other education types, require duration fields
            $rules['duration_from'] = 'required|string';
            $rules['duration_to'] = 'required|string';
            // Make year_of_passout optional for non-school education
            $rules['year_of_passout'] = 'nullable|string|max:4';
        }

        // Add specialization validation only for bachelor's and master's degrees
        if ($degreeType && in_array($degreeType->name, ['Bachelors/Btech', 'Masters/Mtech'])) {
            // If specialization_id is 0 (Others), require other_specialization
            if ($request->specialization_id === '0') {
                $rules['other_specialization'] = 'required|string';
                // Set specialization_id to null since we're using other_specialization
                $request->merge(['specialization_id' => null]);
            } else {
                $rules['specialization_id'] = 'required|exists:specializations,id';
            }
        } else {
            // For other degree types, make specialization optional
            $rules['specialization_id'] = 'nullable|exists:specializations,id';
            $rules['other_specialization'] = 'nullable|string';
        }

        $request->validate($rules);

        // Additional validation for CGPA vs Percentage ranges and degree type compatibility
        if ($request->grade_type === 'cgpa') {
            // Allow CGPA for all education types (10th, 12th, Bachelor's, Master's, etc.)
            if ($request->percentage_cgpa < 0 || $request->percentage_cgpa > 10) {
                return response()->json(['message' => 'CGPA must be between 0 and 10'], 422);
            }
            // Store CGPA value as-is without conversion
        } else {
            if ($request->percentage_cgpa < 0 || $request->percentage_cgpa > 100) {
                return response()->json(['message' => 'Percentage must be between 0 and 100'], 422);
            }
        }

        // Debug logging
        \Log::info('Education data received:', $request->all());
        \Log::info('Year of passout value:', ['year_of_passout' => $request->input('year_of_passout')]);
        \Log::info('Degree type:', ['id' => $degreeType->id, 'name' => $degreeType->name]);
        \Log::info('Grade type:', ['grade_type' => $request->input('grade_type')]);
        \Log::info('Percentage/CGPA:', ['percentage_cgpa' => $request->input('percentage_cgpa')]);

        $educationData = $request->all();
        $educationData['user_id'] = $user->id;
        
        // Store the value in percentage_cgpa field for both CGPA and percentage
        // The grade_type field will indicate whether it's CGPA or percentage
        $educationData['percentage_cgpa'] = $request->percentage_cgpa;
        
        $education = $user->studentEducation()->create($educationData);
        
        // Debug logging after creation
        \Log::info('Education created:', $education->toArray());
        
        return new StudentEducationResource($education);
    }
    public function Get_education(Request $request){
        $user=$request->user();
        $education=StudentEducation::where('user_id',$user->id)->get();
        
        // Debug: Log the raw database data
        \Log::info('Raw education data from database:', $education->toArray());
        
        return StudentEducationResource::collection($education);
    }

    public function GetUserEducation(Request $request, $userId){
        // Check if the current user is an admin or has permission to view other users' data
        $user = $request->user();
        
        
        // Allow admin, coordinator, and placement coordinator users to view any user's education
        // You can add more specific permission checks here
        if (!$user->is_admin && !$user->is_coordinator && !$user->is_placement_coordinator && $user->id != $userId) {
            \Log::warning('GetUserEducation - Unauthorized access attempt. User ID: ' . $user->id . ', Target User ID: ' . $userId);
            return response()->json(['message' => 'Unauthorized'], 403);
        }
        
        $education = StudentEducation::where('user_id', $userId)
            ->with(['degreeType', 'specialization'])
            ->get();
            
        return response()->json([
            'data' => StudentEducationResource::collection($education)
        ]);
    }
    public function Update(Request $request){
        $user=$request->user();
        $id=$request->input('id');
        $education=StudentEducation::where('id',$id)->first();
        if (!$education) {
            return response()->json(['message' => 'Education record not found'], 404);
        }

        // Get the degree type to check if it's school education (10th or 12th)
        $degreeType = DegreeType::find($request->degree_type_id);
        $isSchoolEducation = $degreeType && in_array($degreeType->id, [1, 2]); // 10th and 12th class
        
        // Base validation rules
        $rules = [
            'degree_type_id' => 'required|exists:degree_types,id',
            'grade_type' => 'required|in:percentage,cgpa',
            'percentage_cgpa' => 'required|numeric',
            'institute_name' => 'required|string',
            'location' => 'required|string',
        ];

        // Add duration or year validation based on education type
        if ($isSchoolEducation) {
            // For school education (10th/12th), require year_of_passout
            $rules['year_of_passout'] = 'required|string|max:4';
            // Make duration fields optional for school education
            $rules['duration_from'] = 'nullable|string';
            $rules['duration_to'] = 'nullable|string';
        } else {
            // For other education types, require duration fields
            $rules['duration_from'] = 'required|string';
            $rules['duration_to'] = 'required|string';
            // Make year_of_passout optional for non-school education
            $rules['year_of_passout'] = 'nullable|string|max:4';
        }

        // Add specialization validation only for bachelor's and master's degrees
        if ($degreeType && in_array($degreeType->name, ['Bachelors/Btech', 'Masters/Mtech'])) {
            // If specialization_id is 0 (Others), require other_specialization
            if ($request->specialization_id === '0') {
                $rules['other_specialization'] = 'required|string';
                // Set specialization_id to null since we're using other_specialization
                $request->merge(['specialization_id' => null]);
            } else {
                $rules['specialization_id'] = 'required|exists:specializations,id';
            }
        } else {
            // For other degree types, make specialization optional
            $rules['specialization_id'] = 'nullable|exists:specializations,id';
            $rules['other_specialization'] = 'nullable|string';
        }

        $request->validate($rules);

        // Additional validation for CGPA vs Percentage ranges and degree type compatibility
        if ($request->grade_type === 'cgpa') {
            // Allow CGPA for all education types (10th, 12th, Bachelor's, Master's, etc.)
            if ($request->percentage_cgpa < 0 || $request->percentage_cgpa > 10) {
                return response()->json(['message' => 'CGPA must be between 0 and 10'], 422);
            }
            // Store CGPA value as-is without conversion
        } else {
            if ($request->percentage_cgpa < 0 || $request->percentage_cgpa > 100) {
                return response()->json(['message' => 'Percentage must be between 0 and 100'], 422);
            }
        }
        
        $updateData = $request->all();
        
        // Store the value in percentage_cgpa field for both CGPA and percentage
        // The grade_type field will indicate whether it's CGPA or percentage
        $updateData['percentage_cgpa'] = $request->percentage_cgpa;
        
        $education->update($updateData);
        return new StudentEducationResource($education);
    }

    public function Delete(Request $request){
        $user=$request->user();
        $id=$request->input('id');
        $education=StudentEducation::where('id',$id)->first();
        if (!$education) {
            return response()->json(['message' => 'Education record not found'], 404);
        }
        $education->delete();
        return response()->json(['message' => 'Education record deleted successfully']);
    }
}
