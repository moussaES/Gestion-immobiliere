<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class UtilisateurResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id_user' => $this->id_user,
            'nom' => $this->nom,
            'prenom' => $this->prenom,
            'email' => $this->email,
            'role' => $this->role,
            'statut' => $this->statut,
            'date_creation' => $this->date_creation,
            'date_modification' => $this->date_modification,
        ];
    }
}
