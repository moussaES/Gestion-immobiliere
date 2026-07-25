<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdatePaiementRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $id = $this->route('paiement') ?? $this->route('id');

        $paiement = \App\Models\Paiement::find($id);
        $id_contrat = $this->input('id_contrat') ?? ($paiement ? $paiement->id_contrat : null);

        return [
            'reference' => 'sometimes|string|unique:paiements,reference,' . $id . ',id_paiement|max:50',
            'date_paiement' => 'sometimes|date',
            'montant' => 'sometimes|numeric|min:0',
            'mode_paiement' => 'sometimes|in:CHEQUE,VIREMENT,ESPECES,WAVE,ORANGE_MONEY',
            'statut' => 'sometimes|in:PAYE,EN_ATTENTE,IMPAYE',
            'id_contrat' => 'sometimes|exists:contrats,id_contrat',
            'notes' => 'sometimes|string|nullable',
            'mois_concerne' => [
                'sometimes',
                'string',
                'max:20',
                \Illuminate\Validation\Rule::unique('paiements')->where(function ($query) use ($id_contrat) {
                    return $query->where('id_contrat', $id_contrat);
                })->ignore($id, 'id_paiement'),
            ],
        ];
    }
}
