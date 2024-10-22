<?php

namespace App\Http\Controllers\api;

use App\Http\Controllers\Controller;
use App\Http\Resources\StudentResource;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class StudentsController extends Controller
{
    public function index(Request $req){
        $size = $req->get('size') == 0 ? 25 : $req->get('size');
        $pageNo = $req->get('page', 1);
        $offset = ($pageNo - 1) * $size;

        $students = User::with('role')->whereHas('role', function($query) {
            $query->where('name', 'Student');
        })->offset($offset)->limit($size)->get();

        return StudentResource::collection($students);
    }

    public function show($id)
    {
        $validator = Validator::make(['id' => $id], [
            'id' => 'integer'
        ]);

        if ($validator->fails()) {
            return response()->json(['message' => 'Student Id must be Integer','hasError'=>true], 400);
        }

        $input = $validator->validated();
        $student = User::with('role')->whereHas('role', function($query) {
            $query->where('name', 'Student');
        })->where("id",$input['id'])->first();

        if(empty($student)){
            return response()->json(['message' => 'Student not found','hasError'=>false], 404);
        }
        return new StudentResource($student);

    }

    
}
