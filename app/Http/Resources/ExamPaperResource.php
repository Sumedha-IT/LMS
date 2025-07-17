<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ExamPaperResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' =>$this->id,
            'question' =>$this->question,
            'questionId' => $this->question_id,
            'meta' =>[
                'options' => array_map(function ($option) {
                    return [
                        'id' => $option['id'],
                        'option' => $option['option'],
                    ]; 
                }, $this->meta['options']),
                'questionConfig' => $this->meta['questionMeta'],
            ],
            'statusCode' => $this->status ?? null,
            'answer'=> $this->answer ?? null,
            'score' => $this->score ?? 0,
            'negativeScore' =>$this->negative_score ?? 0
        ];
    }
}
