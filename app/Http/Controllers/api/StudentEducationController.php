<?php

namespace App\Http\Controllers\api;

use App\Models\DegreeType;
use Illuminate\Http\Request;
use App\Models\Specialization;
use App\Models\StudentEducation;
use App\Http\Controllers\Controller;
use App\Http\Resources\DegreeResource;
use App\Http\Resources\SpeacializationResource;

class StudentEducationController extends Controller
{
    public function GetDegreeTypes(Request $request){
        $degreeTypes=DegreeType::all();
        return DegreeResource::collection($degreeTypes);
    }
    public function GetSpecializations($id){
        $speacializations=Specialization::where('degree_type_id',$id)->get();
        return SpeacializationResource::collection($speacializations);
        
    }
   
}
