<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class CertificateResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray($request)
    {
        return [
            'id' => $this->id,
            'userId' => $this->user_id,
            'name' => $this->name,
            'fileId' => $this->file_id,
            'url' => config('services.app.url') . 'storage' . '/' . $this->path,
            'path' => $this->path,
            'fromDate' => $this->from_date,
            'isResume' => $this->is_resume,
            'toDate' => $this->to_date,
            'createdAt' => $this->created_at,
            'updatedAt' => $this->updated_at,
        ];
    }
}
