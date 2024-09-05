<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\OptionResource;
use App\Models\Question;
use App\Models\QuestionOption;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class QuestionOptionController extends Controller
{
    public function show(Request $req, $id)
    {
        $validator = Validator::make(['id' => $id, 'questionId' => $req->questionId], [
            'id' => 'integer',
            'questionId' => 'required|integer'

        ]);

        if ($validator->fails()) {
            return response()->json(['message' => "Invalid Data",'hasError'=>true], 400);
        }

        $input = $validator->validated();
        $option = Question::find($input['questionId'])->questions_options()->where('id', $input['id'])->first();
        if (!$option) {
            return response()->json(['message' => 'Option not found','hasError'=>false], 404);
        }

        return new OptionResource($option);
    }

    public function index(Request $req)
    {
        $validator = Validator::make(['questionId' => $req->questionId], [
            'questionId' => 'integer'
        ]);
        $data = $validator->validated();
        if ($validator->fails()) {
            return response()->json(['message' => 'Question Id must be Integer','hasError'=>true], 400);
        }

        $options = QuestionOption::where("question_id", $data['questionId']);
        $data = [
            "data" => ($options->count() == 0) ? [] :  OptionResource::collection($options->get())
        ];
        return response()->json($data, 200);
    }
}
