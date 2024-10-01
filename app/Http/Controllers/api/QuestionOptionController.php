<?php

namespace App\Http\Controllers\api;

use App\Http\Controllers\Controller;
use App\Http\Resources\OptionResource;
use App\Models\Question;
use App\Models\QuestionOption;
use Illuminate\Http\Client\ResponseSequence;
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

    public function create(Request $req){
        $data = $req->data;
        $question = Question::find($data['questionId']);

        if (empty($question)) {
            return response()->json(["message" => "Question not found", "hasError" => true], 400);
        }

        $options = $question->questions_options();
        if (!$options->get()->isEmpty()) {
            return response()->json(["message" => "Options already present", "hasError" => true], 400);
        }

        $data['question_type_id'] =  $question->question_type;
        $data = $this->validateOptions($data);
        if($data['hasError'] == true){
            return $data;
        }
        QuestionOption::insert($data['options']);
        return response()->json("Options Created",200);
    }

    public function  update(Request $req){
        $data = $req->data;
        $question = Question::find($data['questionId']);

        if (empty($question)) {
            return response()->json(["message" => "Question not found", "hasError" => true], 404);
        }

        $options = $question->questions_options();
        if ($options->get()->isEmpty()) {
            return response()->json(["message" => "Options Not found", "hasError" => true], 404);
        }

        $data['question_type_id'] =  $question->question_type;
        $data = $this->validateOptions($data);
        if($data['hasError'] == true){
            return $data;
        }
        $options->forceDelete();
        QuestionOption::insert($data['options']);
        return response()->json("Options Updated",200);
    }

    public function validateOptions($data){

        $questionTypeId = $data['question_type_id'];
        $validator = Validator::make($data, [
            'questionId' => 'required|integer|exists:questions,id',
            'options' => 'required|array|min:2',
            'options.*.option' => 'required|string',
            'options.*.is_correct' => 'required|boolean',
            'question_type_id' => 'required|integer|in:1,2,5',
        ]);

        if (!empty($validator->errors()->messages())) {
            return ['message' => $validator->errors()->all()[0], 'status' => 400,'success' =>false];
        }

        $data = $validator->validated();
        $options = $data['options'];
        $correctOptionsCount = collect($options)->where('is_correct', 1)->count();

        $errors = "";
        if ($questionTypeId == 1) {
            // Single Correct: Only one correct option is allowed
            if ($correctOptionsCount !== 1) {
                $errors ="Exactly one option must be marked as correct for a single correct question.";
            }
        } elseif ($questionTypeId == 2) {
            // Multi Correct: At least one correct option is required
            if ($correctOptionsCount < 1) {
                $errors ="At least one option must be marked as correct for a multi-correct question.";
            }
        } elseif ($questionTypeId == 5) {
            // True/False: Only two options are allowed, and exactly one should be correct
            if (count($options) !== 2 || $correctOptionsCount !== 1) {
                $errors ="For True/False, there must be exactly two options, and one must be correct.";
            }
        }

        if (!empty($errors)) {
            return  ["message" => $errors, "hasError" => true];
        }

        foreach ($options as &$option) {
            $option['question_id'] = $data['questionId'];
        }

        $data['options'] = $options;
        $data['hasError'] = false;
        return $data;
    }
}
