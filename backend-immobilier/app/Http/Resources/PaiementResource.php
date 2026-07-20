<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class PaiementResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id_paiement' => $this->id_paiement,
            'reference' => $this->reference,
            'date_paiement' => $this->date_paiement,
            'montant' => $this->montant,
            'mode_paiement' => $this->mode_paiement,
            'statut' => $this->statut,
            'notes' => $this->notes,
            'id_contrat' => $this->id_contrat,
            'id_user_enregistrement' => $this->id_user_enregistrement,
            
            // Relations
            'contrat' => new ContratResource($this->whenLoaded('contrat')),
            
            'date_creation' => $this->date_creation,
            'date_modification' => $this->date_modification,
        ];
    }
}
