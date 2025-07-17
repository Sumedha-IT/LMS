<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ProfileResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {

        $socialLinks = [];
        if (!empty($this->social_links)) {
            $socialLinks = $this->social_links;
        }
        if (empty($socialLinks['linkedIn'])) {
            $socialLinks['linkedIn'] = [
                'url' => '',
                'type' => 'linkedIn'
            ];
        }
        if (empty($socialLinks['others'])) {
            $socialLinks['others'] = [
                'url' => '',
                'type' => 'others'
            ];
        }
        $data = [
            'name' => $this['user']['name'] ?? null,
            'email' => $this['user']['email'] ?? null,
            'phone' => $this['user']['phone'],
            'birthday' => $this['user']['birthday'] ?? null,
        ];

        if (!empty($this->languages_known)) {
            $laguagesKnown =  gettype($this->languages_known)  == 'string' ? [$this->languages_known] : $this->languages_known;
        } else {
            $laguagesKnown = null;
        }


        $data = array_merge($data, [
            'id' => $this->id ?? null,
            'userId' => $this->user_id ?? null,
            'currentLocation' => $this->current_location ?? null,
            'totalExperience' => $this->total_experience ?? null,
            'socialLinks' => array_values($socialLinks),
            'languagesKnown' =>  $laguagesKnown ?? [],
            'aboutMe' => $this->about_me ?? null,
            'achievements' => $this->achievements ?? null,
            'resumeId' => $this->resumeId ?? null,
            'resumeUrl' => $this->resumeUrl ?? null,
            'address' => $this->address ?? null,
            'state' => $this->state ?? null,
            'country' => $this->country ?? null,
            'otherDetails' => $this->meta['otherDetails'] ?? null
        ]);

        return $data;
    }
}
