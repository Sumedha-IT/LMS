<?php

namespace App\Http\Controllers;

use App\Http\Resources\SubjectResource;
use App\Models\Subject;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class SubjectController extends Controller
{
    public function showFolders(Subject $subject)
    {
        $folders = $subject->folders;
        return view('folders.index', compact('folders'));
    }

    public function show($id)
    {
        $validator = Validator::make(['id' => $id], [
            'id' => 'required|integer'
        ]);

        if ($validator->fails()) {
            return response()->json(['message' => 'Subject Id must be Integer and required', "hasError" => true], 400);
        }
        $subject = Subject::find($id);

        if (empty($subject)) {
            return response()->json(['message' => 'Subject id not found', "hasError" => false], 404);
        }
        return new SubjectResource($subject);
    }

    public function getSubjects(Request $req, $id = null)
    {
        $size = $req->get('size') == 0 ? 25 : $req->get('size');
        $pageNo = $req->get('page', 1);
        $offset = ($pageNo - 1) * $size;
        $totalRecords = Subject::count();
        // Fetch the records for the current page
        $subjects = Subject::offset($offset)->limit($size);
        $data = [
            "data" => ($subjects->count() == 0) ? [] : SubjectResource::collection($subjects->get()),
            "totalRecords" => $totalRecords,
            "totalPages" => ceil($totalRecords / $size)
        ];
        return response()->json($data, 200);
    }

    public function create(Request $req){

        $validator = Validator::make($req->data, [
            'name' => 'required|string'
        ]);

        if (!empty($validator->errors()->messages())) {
            return ['message' => $validator->errors()->all()[0], 'status' => 400,'success' =>false];
        }

        $data = $validator->validated();
        Subject::create($data);
        return response()->json(['message' => "Subject Created", "hasError" => false], 200);
    }

    public function delete($id){
        $batch = Subject::find($id);
        if ($batch) {
            $batch->delete();
            return response()->json(['message' => 'Subject deleted successfully',"hasError"=>false], 200);
        }
        return response()->json(['message' => 'Subject not found',"hasError"=>false], 404);
    }
}
