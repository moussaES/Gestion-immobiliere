<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreLocataireRequest extends FormRequest
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
            'telephone' => 'required|string|unique:locataires|max:20',
            'email' => 'sometimes|email|unique:locataires|max:150|nullable',
            'profession' => 'sometimes|string|max:100|nullable',
            'adresse' => 'sometimes|string|max:255|nullable',
            'cni' => 'sometimes|string|unique:locataires|max:50|nullable',
        ];
    }
}
