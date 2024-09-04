<?php

namespace App\Http\Controllers;


use App\Http\Resources\QuestionBankResource;
use App\Models\QuestionBank;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class QuestionBankController extends Controller
{

    public function show($id){
        $validator = Validator::make(['id' => $id], [
            'id' => 'nullable|integer'
        ]);

        if ($validator->fails()) {
            return response()->json(['message' => 'Question Bank Id must be Integer'], 400);
        }
        $questionBank = QuestionBank::find($id);

        if (empty($questionBank)) {
            return response()->json(['message' => 'Question bank not found'], 404);
        }            
        return new QuestionBankResource($questionBank);
    }

    public function getQuestionBanks(Request $req)
    {
        $size = $req->get('size') == 0 ? 25 : $req->get('size');
        $pageNo = $req->get('page', 1);
        $offset = ($pageNo - 1) * $size;

        $totalRecords = QuestionBank::count();
        // Fetch the records for the current page
        $questionBanks = QuestionBank::offset($offset)->limit($size);
        $data = [
            "data" => ($questionBanks->count() == 0) ? [] : QuestionBankResource::collection($questionBanks->get()),
            "totalRecords" => $totalRecords,
            "totalPages" => ceil($totalRecords / $size)
        ];
        return response()->json($data, 200);
    }
}
