<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class WargaResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @param Request $request
     */
    public function toArray($request): array
    {
        return [
            'userid'        => $this['user_id'] ?? null,
            'nama'      => $this['nama'] ?? null,
            'email'     => $this['email'] ?? null,
            'nik'       => $this['nik'] ?? null,
            'no_rumah'    => $this['no_rumah'] ?? null,
            'no_hp'     => $this['no_hp'] ?? null,
        ];
    }
}
