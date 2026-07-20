<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreBienRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'reference' => 'required|string|unique:biens|max:50',
            'type' => 'required|in:MAISON,APPARTEMENT,IMMEUBLE,TERRAIN,STUDIO',
            'adresse' => 'required|string|max:255',
            'ville' => 'required|string|max:100',
            'code_postal' => 'sometimes|string|max:10',
            'surface' => 'sometimes|numeric|min:0',
            'nombre_pieces' => 'sometimes|integer|min:0',
            'loyer_mensuel' => 'required|numeric|min:0',
            'statut' => 'sometimes|in:OCCUPE,LIBRE,RESERVE',
            'description' => 'sometimes|string|nullable',
            'id_proprietaire' => 'required|exists:proprietaires,id_proprietaire',
        ];
    }
}
