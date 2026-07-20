<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class BienResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id_bien' => $this->id_bien,
            'reference' => $this->reference,
            'type' => $this->type,
            'adresse' => $this->adresse,
            'ville' => $this->ville,
            'code_postal' => $this->code_postal,
            'surface' => $this->surface,
            'nombre_pieces' => $this->nombre_pieces,
            'loyer_mensuel' => $this->loyer_mensuel,
            'statut' => $this->statut,
            'description' => $this->description,
            'id_proprietaire' => $this->id_proprietaire,
            // Optionnel : Inclure les relations si elles sont chargées
            'proprietaire' => new ProprietaireResource($this->whenLoaded('proprietaire')),
            'date_creation' => $this->date_creation,
            'date_modification' => $this->date_modification,
        ];
    }
}
