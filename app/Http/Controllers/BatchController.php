<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Http\Resources\BatchResource;
use App\Models\Batch;
use Illuminate\Support\Facades\Validator;

class BatchController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();

        $batches = $user->batches()
            ->with('course_package')
            ->get();

        return BatchResource::collection($batches);
    }

    public function view($id, Request $request)
    {
        $user = $request->user();
        $batches = $user->batches()
            ->with('course_package')
            ->find($id);

        return new BatchResource($batches);
    }

    public function show($id){
        $validator = Validator::make(['id' => $id], [
            'id' => 'required|integer'
        ]);

        if ($validator->fails()) {
            return response()->json(['message' => 'Batch Id must be Integer'], 400);
        }
        $batch = Batch::find($id);

        if (empty($batch)) {
            return response()->json(['message' => 'Batch id not found'], 404);
        }            
        return new BatchResource($batch);
    }

    public function getBatches(Request $req)
    {
        $size = $req->get('size') == 0 ? 25 : $req->get('size');
        $pageNo = $req->get('page', 1);
        $offset = ($pageNo - 1) * $size;
        $totalRecords = Batch::count();

        // Fetch the records for the current page
        $batches = Batch::offset($offset)->limit($size)->get();
        $data = [
            "data" => empty($batches) ? [] : BatchResource::collection($batches),
            "totalRecords" => $totalRecords,
            "totalPages" => ceil($totalRecords / $size)
        ];
        return response()->json($data,200);
    }
}
