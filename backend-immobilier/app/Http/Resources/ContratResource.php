<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ContratResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id_contrat' => $this->id_contrat,
            'reference' => $this->reference,
            'type_contrat' => $this->type_contrat,
            'date_debut' => $this->date_debut,
            'date_fin' => $this->date_fin,
            'montant' => $this->montant,
            'commission_agence' => $this->commission_agence,
            'montant_proprietaire' => $this->montant_proprietaire,
            'statut' => $this->statut,
            'notes' => $this->notes,
            'date_annulation' => $this->date_annulation,
            'id_bien' => $this->id_bien,
            'id_proprietaire' => $this->id_proprietaire,
            'id_locataire' => $this->id_locataire,
            'id_user_createur' => $this->id_user_createur,
            
            // Relations
            'bien' => new BienResource($this->whenLoaded('bien')),
            'proprietaire' => new ProprietaireResource($this->whenLoaded('proprietaire')),
            'locataire' => new LocataireResource($this->whenLoaded('locataire')),
            
            'date_creation' => $this->date_creation,
            'date_modification' => $this->date_modification,
        ];
    }
}
