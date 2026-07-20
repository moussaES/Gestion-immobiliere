<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StorePaiementRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'reference' => 'required|string|unique:paiements|max:50',
            'date_paiement' => 'required|date',
            'montant' => 'required|numeric|min:0',
            'mode_paiement' => 'required|in:CHEQUE,VIREMENT,ESPECES,WAVE,ORANGE_MONEY',
            'statut' => 'sometimes|in:PAYE,PARTIEL,EN_ATTENTE,IMPAYE',
            'id_contrat' => 'required|exists:contrats,id_contrat',
            'id_user_enregistrement' => 'sometimes|exists:utilisateurs,id_user',
            'notes' => 'sometimes|string|nullable',
        ];
    }
}
