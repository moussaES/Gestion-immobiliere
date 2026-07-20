<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ProprietaireResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id_proprietaire' => $this->id_proprietaire,
            'nom' => $this->nom,
            'prenom' => $this->prenom,
            'email' => $this->email,
            'telephone' => $this->telephone,
            'adresse' => $this->adresse,
            'cni' => $this->cni,
            'ville' => $this->ville,
            'code_postal' => $this->code_postal,
            'date_creation' => $this->date_creation,
            'biens_count' => $this->whenCounted('biens'),
        ];
    }
}
