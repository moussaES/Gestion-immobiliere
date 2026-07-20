<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateLocataireRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $id = $this->route('locataire') ?? $this->route('id');

        return [
            'nom' => 'sometimes|string|max:100',
            'prenom' => 'sometimes|string|max:100',
            'telephone' => 'sometimes|string|unique:locataires,telephone,' . $id . ',id_locataire|max:20',
            'email' => 'sometimes|email|unique:locataires,email,' . $id . ',id_locataire|max:150|nullable',
            'profession' => 'sometimes|string|max:100|nullable',
            'adresse' => 'sometimes|string|max:255|nullable',
            'cni' => 'sometimes|string|unique:locataires,cni,' . $id . ',id_locataire|max:50|nullable',
        ];
    }
}
