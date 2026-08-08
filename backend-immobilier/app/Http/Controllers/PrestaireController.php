<?php

namespace App\Http\Controllers;

use App\Models\Prestataire;
use Illuminate\Http\Request;

class PrestaireController extends Controller
{
    public function index()
    {
        try {
            $prestataires = Prestataire::all();
            return response()->json([
                'success' => true,
                'data' => $prestataires,
                'message' => 'Liste des prestataires récupérée avec succès'
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
                'nom' => 'required|string|max:255',
                'prenom' => 'required|string|max:255',
                'specialite' => 'required|string|max:255',
                'telephone' => 'required|string|max:20',
                'adresse' => 'nullable|string'
            ]);

            $prestataire = Prestataire::create($validated);

            return response()->json([
                'success' => true,
                'data' => $prestataire,
                'message' => 'Prestataire créé avec succès'
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
            $prestataire = Prestataire::findOrFail($id);
            return response()->json([
                'success' => true,
                'data' => $prestataire
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Prestataire non trouvé'
            ], 404);
        }
    }

    public function update(Request $request, $id)
    {
        try {
            $prestataire = Prestataire::findOrFail($id);

            $validated = $request->validate([
                'nom' => 'sometimes|required|string|max:255',
                'prenom' => 'sometimes|required|string|max:255',
                'specialite' => 'sometimes|required|string|max:255',
                'telephone' => 'sometimes|required|string|max:20',
                'adresse' => 'sometimes|nullable|string'
            ]);

            $prestataire->update($validated);

            return response()->json([
                'success' => true,
                'data' => $prestataire,
                'message' => 'Prestataire mis à jour avec succès'
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
            $prestataire = Prestataire::findOrFail($id);
            $prestataire->delete();

            return response()->json([
                'success' => true,
                'message' => 'Prestataire supprimé avec succès'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage()
            ], 500);
        }
    }
}
