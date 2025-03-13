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

        $request->validate([
            'degree_type_id'=>'required|exists:degree_types,id',
            'specialization_id'=>'required|exists:specializations,id',
            'other_specialization'=>'nullable|string',
            'percentage_cgpa'=>'required|numeric',
            'institute_name'=>'required|string',
            'location'=>'required|string',
            'duration_from'=>'required|date',
            'duration_to'=>'required|date|after:duration_from'

        ]);
        $education=$user->studentEducation()->create($request->all(),['user_id'=>$user->id]);
        // return response()->json(['message' => 'Education record added successfully', 'data' => $education]);
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
        $request->validate([
            'degree_type_id'=>'required|exists:degree_types,id',
            'specialization_id'=>'required|exists:specializations,id',
            'other_specialization'=>'nullable|string',
            'percentage_cgpa'=>'required|numeric',
            'institute_name'=>'required|string',
            'location'=>'required|string',
            'duration_from'=>'required|date',
            'duration_to'=>'required|date|after:duration_from'

        ]);
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
