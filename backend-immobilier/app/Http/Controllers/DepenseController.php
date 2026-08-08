<?php

namespace App\Http\Controllers;

use App\Models\Depense;
use Illuminate\Http\Request;

class DepenseController extends Controller
{
    public function index()
    {
        try {
            $depenses = Depense::with(['bien', 'proprietaire', 'prestataire'])->get();
            return response()->json([
                'success' => true,
                'data' => $depenses,
                'message' => 'Liste des dépenses récupérée avec succès'
            ], 200);
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
                'type_depense' => 'required|in:AGENCE,BIEN',
                'categorie' => 'nullable|required_if:type_depense,AGENCE|in:DEPLACEMENT,ACHAT,AUTRE',
                'description' => 'required|string',
                'montant' => 'required|numeric|min:0',
                'date_depense' => 'required|date',
                'id_bien' => 'nullable|required_if:type_depense,BIEN|exists:biens,id_bien',
                'id_proprietaire' => 'nullable|exists:proprietaires,id_proprietaire',
                'id_prestataire' => 'nullable|exists:prestataires,id_prestataire',
                'justificatif' => 'nullable|string'
            ]);

            $depense = Depense::create($validated);

            return response()->json([
                'success' => true,
                'data' => $depense,
                'message' => 'Dépense créée avec succès'
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
            $depense = Depense::with(['bien', 'proprietaire', 'prestataire'])->findOrFail($id);
            return response()->json([
                'success' => true,
                'data' => $depense
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Dépense non trouvée'
            ], 404);
        }
    }

    public function update(Request $request, $id)
    {
        try {
            $depense = Depense::findOrFail($id);

            $validated = $request->validate([
                'type_depense' => 'sometimes|required|in:AGENCE,BIEN',
                'categorie' => 'sometimes|nullable|required_if:type_depense,AGENCE|in:DEPLACEMENT,ACHAT,AUTRE',
                'description' => 'sometimes|required|string',
                'montant' => 'sometimes|required|numeric|min:0',
                'date_depense' => 'sometimes|required|date',
                'id_bien' => 'sometimes|nullable|required_if:type_depense,BIEN|exists:biens,id_bien',
                'id_proprietaire' => 'sometimes|nullable|exists:proprietaires,id_proprietaire',
                'id_prestataire' => 'sometimes|nullable|exists:prestataires,id_prestataire',
                'justificatif' => 'sometimes|nullable|string'
            ]);

            $depense->update($validated);

            return response()->json([
                'success' => true,
                'data' => $depense,
                'message' => 'Dépense mise à jour avec succès'
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
            $depense = Depense::findOrFail($id);
            $depense->delete();

            return response()->json([
                'success' => true,
                'message' => 'Dépense supprimée avec succès'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage()
            ], 500);
        }
    }
}
