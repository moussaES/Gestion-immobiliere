<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreContratRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'reference' => 'required|string|unique:contrats|max:50',
            'type_contrat' => 'required|in:LOCATAIRE,PROPRIETAIRE',
            'date_debut' => 'required|date',
            'date_fin' => 'required|date|after:date_debut',
            'montant' => 'required|numeric|min:0',
            'statut' => 'sometimes|in:ACTIF,RESILIE,ARCHIVE',
            'id_bien' => 'required|exists:biens,id_bien',
            'id_proprietaire' => 'required|exists:proprietaires,id_proprietaire',
            'id_locataire' => 'sometimes|nullable|exists:locataires,id_locataire',
            'id_user_createur' => 'sometimes|exists:utilisateurs,id_user',
            'notes' => 'sometimes|string|nullable',
        ];
    }
}
