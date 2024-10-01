<?php

namespace App\Http\Controllers;

use App\Models\ExamSection;
use Illuminate\Database\QueryException;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class ExamSectionController extends Controller
{
    public function show($id)
    {
        $validator = Validator::make(['id' => $id], [
            'id' => 'required|integer'
        ]);

        if ($validator->fails()) {
            return response()->json(['message' => 'Exam Id must be Integer', 'hasError' => true], 404);
        }
        $examSection = ExamSection::find($id);

        if (empty($examSection)) {
            return response()->json(['message' => 'Exam Id not found', 'hasError' => false], 404);
        }
        return response()->json(["data" => $examSection]);
    }

    public function index(Request $request)
    {
        $size = $request->get('size') == 0 ? 25 : $request->get('size');
        $pageNo = $request->get('page', 1);
        $offset = ($pageNo - 1) * $size;
        $totalRecords = ExamSection::count();

        // Fetch the records for the current page
        $sections = ExamSection::offset($offset)->limit($size)->get();
        $data = [
            "data" => empty($sections) ? [] : $sections,
            "totalRecords" => $totalRecords,
            "totalPages" => ceil($totalRecords / $size)
        ];
        return response()->json($data, 200);
    }

    public function create(Request $request)
    {
        $data = $request->data;
        $validator = Validator::make($data, [
            'name' => 'required|string',
        ]);
        if ($validator->fails()) {
            return response()->json(['message' => 'Invalid data', 'hasError' => true], 400);
        }
        $data = $validator->validate();


        try {
            ExamSection::create($data);
        } catch (QueryException $e) {
            if ($e->getCode() === '23000') {
                return response()->json([
                    'message' => 'Duplicate entry for secion name ',
                    'hasError' => true
                ], 409); // 409 Conflict
            }
        }
        return response()->json(['message' => "Exam Section Created"], 200);
    }

    public function delete($id)
    {
        $examSection = ExamSection::find($id);
        if ($examSection) {
            $examSection->delete();
            return response()->json(['message' => 'Exam Section deleted successfully', "hasError" => false], 200);
        }
        return response()->json(['message' => 'Exam Section not found', "hasError" => false], 404);
    }

    public function update($id, Request $request)
    {
        $data = $request->data;
        $validator = Validator::make($data, [
            'name' => 'required|string',
        ]);

        $examSection = ExamSection::find($id);
        if (empty($examSection)) {
            return response()->json(['message' => 'Exam Section not found', 'hasError' => true], 404);
        }

        if ($validator->fails()) {
            return response()->json(['message' => 'Invalid data', 'hasError' => true], 400);
        }
        $data = $validator->validate();

        try {
            $examSection->update($data);
        } catch (QueryException $e) {
            if ($e->getCode() === '23000') {
                return response()->json([
                    'message' => 'Duplicate entry for secion name ',
                    'hasError' => true
                ], 409); // 409 Conflict
            }
        }
        return response()->json(['message' => "Exam Section Updated"], 200);
    }
}
