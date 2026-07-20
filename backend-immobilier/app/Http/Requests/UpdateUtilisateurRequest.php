<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateUtilisateurRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $id = $this->route('utilisateur') ?? $this->route('id');
        
        return [
            'nom' => 'sometimes|string|max:100',
            'prenom' => 'sometimes|string|max:100',
            'email' => 'sometimes|email|unique:utilisateurs,email,' . $id . ',id_user|max:150',
            'password' => 'sometimes|string|min:8',
            'role' => 'sometimes|in:ADMIN,GESTIONNAIRE',
            'statut' => 'sometimes|in:ACTIF,INACTIF',
        ];
    }
}
