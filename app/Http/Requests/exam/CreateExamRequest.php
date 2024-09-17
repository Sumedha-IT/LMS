<?php

namespace App\Http\Requests\exam;

use Illuminate\Foundation\Http\FormRequest;

class CreateExamRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            "a"=>"required"
        ];
    }

    protected function passedValidation()
    {
        dd("asdf");
        // Use the custom validated method
        $validatedData = $this->validated();
        // Perform additional logic with validated data
    }

}
