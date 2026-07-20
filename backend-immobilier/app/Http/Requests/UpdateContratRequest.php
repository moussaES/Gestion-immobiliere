<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateContratRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $id = $this->route('contrat') ?? $this->route('id');

        return [
            'reference' => 'sometimes|string|unique:contrats,reference,' . $id . ',id_contrat|max:50',
            'type_contrat' => 'sometimes|in:LOCATAIRE,PROPRIETAIRE',
            'date_debut' => 'sometimes|date',
            'date_fin' => 'sometimes|date|after:date_debut',
            'montant' => 'sometimes|numeric|min:0',
            'statut' => 'sometimes|in:ACTIF,RESILIE,ARCHIVE',
            'id_bien' => 'sometimes|exists:biens,id_bien',
            'id_proprietaire' => 'sometimes|exists:proprietaires,id_proprietaire',
            'id_locataire' => 'sometimes|nullable|exists:locataires,id_locataire',
            'notes' => 'sometimes|string|nullable',
            'date_annulation' => 'sometimes|nullable|date',
        ];
    }
}
