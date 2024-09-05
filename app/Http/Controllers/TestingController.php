<?php

namespace App\Http\Controllers;

use App\Http\Resources\CourseResource;
use App\Models\Course;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class TestingController extends Controller
{
    // public function test($id){
    //     $validator = Validator::make(['id' => $id], [
    //         'id' => 'required|integer',
    //     ]);
    //     $data =$validator->validated();
    //     if ($validator->fails()) {
    //         return response()->json(['message' => 'Course Id must be Integer'], 400);
    //     }
    //     $course = Course::find($data['id']);
    //     if (empty($course)) {
    //         return response()->json(['message' => 'Course not found'], 404);
    //     }
    //     return new CourseResource($course);

    // }

    public function show($id){
        $validator = Validator::make(['id' => $id], [
            'id' => 'required|integer',
        ]);

        $data = $validator->validated();
        if ($validator->fails()) {
            return response()->json(['message' => 'Course Id must be Integer'], 400);
        }

        $course = Course::find($data['id']);
        if (empty($course)) {
            return response()->json(['message' => 'Course not found'], 404);
        }
        return new CourseResource($course);
    }

    // public function show($id){
    //     $validator = Validator::make(['id' => $id], [
    //         'id' => 'required|integer',
    //     ]);

    //     if ($validator->fails()) {
    //         return response()->json(['message' => 'Course Id must be Integer'], 400);
    //     }

    //     $course = Course::find($id);
    //     if (empty($course)) {
    //         return response()->json(['message' => 'Course not found'], 404);
    //     }
    //     return new CourseResource($course);
    // }

    public function getAllCourses(Request $req)
    {
        $courses = Course::all();
        // Return the courses as a JSON response
        return response()->json($courses);

        $size = $req->get('size') == 0 ? 25 : $req->get('size');
        $pageNo = $req->get('page', 1);
        $offset = ($pageNo - 1) * $size;
        $totalRecords = Course::count();

        // Fetch the records for the current page
        $courses = Course::offset($offset)->limit($size)->get();
        $data = [
            "data" => empty($courses) ? [] : CourseResource::collection($courses),
            "totalRecords" => $totalRecords,
            "totalPages" => ceil($totalRecords / $size)
        ];
        return response()->json($data,200);
    }

}
