<?php

namespace App\Http\Controllers;

use App\Models\QuestionBankChapter;
use App\Models\QuestionBankType;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class QuestionBankChapterController extends Controller
{
    public function show($id){
        $validator = Validator::make(['id' => $id], [
            'id' => 'nullable|integer'
        ]);

        if ($validator->fails()) {
            return response()->json(['message' => 'Chapter Id must be Integer', 'hasError'=>true], 400);
        }
        $questionBank = QuestionBankChapter::find($id);

        if (empty($questionBank)) {
            return response()->json(['message' => 'Chapter not found', 'hasError'=>false], 404);
        }            
        return response()->json(["data"=> $questionBank],200);
    }

    public function index(Request $req)
    {
        $size = $req->get('size') == 0 ? 25 : $req->get('size');
        $pageNo = $req->get('page', 1);
        $offset = ($pageNo - 1) * $size;

        $totalRecords = QuestionBankChapter::count();
        // Fetch the records for the current page
        $questionBankChapters = QuestionBankChapter::offset($offset)->limit($size);
        $data = [
            "data" => ($questionBankChapters->count() == 0) ? [] : $questionBankChapters->get(),
            "totalRecords" => $totalRecords,
            "totalPages" => ceil($totalRecords / $size)
        ];
        return response()->json($data, 200);
    }

    public function create(Request $req)
    {
        $data = $req->data;
        $validator = Validator::make($data, [
            'name' => 'required|string'
        ]);
        $data = $validator->validated();
        if ($validator->fails()) {
            return response()->json(['message' => 'Chapter Id must be Integer', 'hasError'=>true], 400);
        }
        
        QuestionBankChapter::create($validator->validated());
        return response()->json(['message' => "Chapter Created","hasError"=>false], 200);
    }

    public function update($id,Request $request){

        $chapter = QuestionBankChapter::find($id);
        if (!$chapter) {
            return response()->json(['message' => 'Chapter Not found', 'hasError'=>true], 404);
        }
        $data = $request->data;
        $validator = Validator::make($data, [
            'name' => 'required|string'
        ]);
        if(!empty($validator->errors()->messages())){
            return response()->json(['message' => "Invalid data format","hasError"=>false], 200);
        }
        $chapter->update($validator->validated());
        return response()->json(['message' => "Chapter Updated","hasError"=>false], 200);
    }

    public function delete($id){
        $questionBankChapter = QuestionBankChapter::find($id);
        if ($questionBankChapter) {
            $questionBankChapter->delete();
            return response()->json(['message' => 'Chapter deleted successfully',"hasError"=>false], 200);
        }
        return response()->json(['message' => 'Chapter bank not found',"hasError"=>false], 404);
    }
}
