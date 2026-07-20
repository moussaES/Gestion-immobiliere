<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateProprietaireRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $id = $this->route('proprietaire') ?? $this->route('id');

        return [
            'nom' => 'sometimes|string|max:100',
            'prenom' => 'sometimes|string|max:100',
            'telephone' => 'sometimes|string|unique:proprietaires,telephone,' . $id . ',id_proprietaire|max:20',
            'email' => 'sometimes|email|unique:proprietaires,email,' . $id . ',id_proprietaire|max:150|nullable',
            'adresse' => 'sometimes|string|max:255',
            'cni' => 'sometimes|string|unique:proprietaires,cni,' . $id . ',id_proprietaire|max:50|nullable',
        ];
    }
}
