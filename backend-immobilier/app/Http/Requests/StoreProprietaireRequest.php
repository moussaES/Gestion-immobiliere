<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreProprietaireRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'nom' => 'required|string|max:100',
            'prenom' => 'required|string|max:100',
            'telephone' => 'required|string|unique:proprietaires|max:20',
            'email' => 'sometimes|email|unique:proprietaires|max:150|nullable',
            'adresse' => 'required|string|max:255',
            'cni' => 'sometimes|string|unique:proprietaires|max:50|nullable',
        ];
    }
}
