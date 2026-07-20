<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateBienRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $id = $this->route('bien') ?? $this->route('id');

        return [
            'reference' => 'sometimes|string|unique:biens,reference,' . $id . ',id_bien|max:50',
            'type' => 'sometimes|in:MAISON,APPARTEMENT,IMMEUBLE,TERRAIN,STUDIO',
            'adresse' => 'sometimes|string|max:255',
            'ville' => 'sometimes|string|max:100',
            'code_postal' => 'sometimes|string|max:10',
            'surface' => 'sometimes|numeric|min:0',
            'nombre_pieces' => 'sometimes|integer|min:0',
            'loyer_mensuel' => 'sometimes|numeric|min:0',
            'statut' => 'sometimes|in:OCCUPE,LIBRE,RESERVE',
            'description' => 'sometimes|string|nullable',
            'id_proprietaire' => 'sometimes|exists:proprietaires,id_proprietaire',
        ];
    }
}
