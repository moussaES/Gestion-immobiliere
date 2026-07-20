<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class LocataireResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id_locataire' => $this->id_locataire,
            'nom' => $this->nom,
            'prenom' => $this->prenom,
            'email' => $this->email,
            'telephone' => $this->telephone,
            'profession' => $this->profession,
            'adresse' => $this->adresse,
            'cni' => $this->cni,
            'date_creation' => $this->date_creation,
            'date_modification' => $this->date_modification,
        ];
    }
}
