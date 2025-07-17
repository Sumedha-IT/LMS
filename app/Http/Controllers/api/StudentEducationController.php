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

        // Get the degree type to check if it's bachelor's or master's
        $degreeType = DegreeType::find($request->degree_type_id);
        
        // Base validation rules
        $rules = [
            'degree_type_id' => 'required|exists:degree_types,id',
            'percentage_cgpa' => 'required|numeric',
            'institute_name' => 'required|string',
            'location' => 'required|string',
            'duration_from' => 'required|date',
            'duration_to' => 'required|date|after:duration_from'
        ];

        // Add specialization validation only for bachelor's and master's degrees
        if ($degreeType && in_array($degreeType->name, ['Bachelors', 'Masters'])) {
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

        $education=$user->studentEducation()->create($request->all(),['user_id'=>$user->id]);
        return new StudentEducationResource($education);
    }
    public function Get_education(Request $request){
        $user=$request->user();
        $education=StudentEducation::where('user_id',$user->id)->get();
        return StudentEducationResource::collection($education);
    }
    public function Update(Request $request){
        $user=$request->user();
        $id=$request->input('id');
        $education=StudentEducation::where('id',$id)->first();
        if (!$education) {
            return response()->json(['message' => 'Education record not found'], 404);
        }

        // Get the degree type to check if it's bachelor's or master's
        $degreeType = DegreeType::find($request->degree_type_id);
        
        // Base validation rules
        $rules = [
            'degree_type_id' => 'required|exists:degree_types,id',
            'percentage_cgpa' => 'required|numeric',
            'institute_name' => 'required|string',
            'location' => 'required|string',
            'duration_from' => 'required|date',
            'duration_to' => 'required|date|after:duration_from'
        ];

        // Add specialization validation only for bachelor's and master's degrees
        if ($degreeType && in_array($degreeType->name, ['Bachelors', 'Masters'])) {
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
        
        $education->update($request->all());
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
