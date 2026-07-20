<?php

namespace App\Http\Controllers;

use App\Models\Travail;
use Illuminate\Http\Request;

class TravailController extends Controller
{
    public function index()
    {
        try {
            $travaux = Travail::with(['bien', 'locataire', 'proprietaire'])->get();
            return response()->json([
                'success' => true,
                'data' => $travaux,
                'message' => 'Liste des travaux récupérée avec succès'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage()
            ], 500);
        }
    }

    public function store(Request $request)
    {
        try {
            $validated = $request->validate([
                'titre' => 'required|string|max:255',
                'description' => 'nullable|string',
                'montant' => 'required|numeric|min:0',
                'date_intervention' => 'required|date',
                'statut' => 'sometimes|in:PREVU,EN_COURS,TERMINE,ANNULE',
                'id_bien' => 'required|exists:biens,id_bien',
                'id_locataire' => 'nullable|exists:locataires,id_locataire',
                'id_proprietaire' => 'nullable|exists:proprietaires,id_proprietaire',
            ]);

            $travail = Travail::create($validated);

            return response()->json([
                'success' => true,
                'data' => $travail,
                'message' => 'Travail ajouté avec succès'
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage()
            ], 500);
        }
    }

    public function show($id)
    {
        try {
            $travail = Travail::with(['bien', 'locataire', 'proprietaire'])->findOrFail($id);
            return response()->json([
                'success' => true,
                'data' => $travail
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Travail non trouvé'
            ], 404);
        }
    }

    public function update(Request $request, $id)
    {
        try {
            $travail = Travail::findOrFail($id);

            $validated = $request->validate([
                'titre' => 'sometimes|string|max:255',
                'description' => 'nullable|string',
                'montant' => 'sometimes|numeric|min:0',
                'date_intervention' => 'sometimes|date',
                'statut' => 'sometimes|in:PREVU,EN_COURS,TERMINE,ANNULE',
                'id_bien' => 'sometimes|exists:biens,id_bien',
                'id_locataire' => 'nullable|exists:locataires,id_locataire',
                'id_proprietaire' => 'nullable|exists:proprietaires,id_proprietaire',
            ]);

            $travail->update($validated);

            return response()->json([
                'success' => true,
                'data' => $travail,
                'message' => 'Travail mis à jour avec succès'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage()
            ], 500);
        }
    }

    public function destroy($id)
    {
        try {
            $travail = Travail::findOrFail($id);
            $travail->delete();

            return response()->json([
                'success' => true,
                'message' => 'Travail supprimé avec succès'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage()
            ], 500);
        }
    }
}
