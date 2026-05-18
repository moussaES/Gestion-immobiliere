<?php

namespace App\Http\Controllers;

use App\Models\Locataire;
use Illuminate\Http\Request;

class LocataireController extends Controller
{
    /**
     * Afficher la liste de tous les locataires
     */
    public function index()
    {
        try {
            $locataires = Locataire::with('contrats')->get();
            return response()->json([
                'success' => true,
                'data' => $locataires,
                'message' => 'Liste des locataires récupérée avec succès'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Afficher un locataire spécifique
     */
    public function show($id)
    {
        try {
            $locataire = Locataire::with('contrats')->findOrFail($id);
            return response()->json([
                'success' => true,
                'data' => $locataire,
                'message' => 'Locataire récupéré avec succès'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Locataire non trouvé'
            ], 404);
        }
    }

    /**
     * Créer un nouveau locataire
     */
    public function store(Request $request)
    {
        try {
            $validated = $request->validate([
                'nom' => 'required|string|max:100',
                'prenom' => 'required|string|max:100',
                'telephone' => 'required|string|unique:locataires|max:20',
                'email' => 'sometimes|email|unique:locataires|max:150',
                'profession' => 'sometimes|string|max:100',
                'adresse' => 'sometimes|string|max:255',
                'cni' => 'sometimes|string|unique:locataires|max:50',
            ]);

            $locataire = Locataire::create($validated);

            return response()->json([
                'success' => true,
                'data' => $locataire,
                'message' => 'Locataire créé avec succès'
            ], 201);
        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Erreur de validation',
                'errors' => $e->errors()
            ], 422);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Mettre à jour un locataire
     */
    public function update(Request $request, $id)
    {
        try {
            $locataire = Locataire::findOrFail($id);

            $validated = $request->validate([
                'nom' => 'sometimes|string|max:100',
                'prenom' => 'sometimes|string|max:100',
                'telephone' => 'sometimes|string|unique:locataires,telephone,' . $id . ',id_locataire|max:20',
                'email' => 'sometimes|email|unique:locataires,email,' . $id . ',id_locataire|max:150',
                'profession' => 'sometimes|string|max:100',
                'adresse' => 'sometimes|string|max:255',
                'cni' => 'sometimes|string|unique:locataires,cni,' . $id . ',id_locataire|max:50',
            ]);

            $locataire->update($validated);

            return response()->json([
                'success' => true,
                'data' => $locataire,
                'message' => 'Locataire mis à jour avec succès'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Supprimer un locataire
     */
    public function destroy($id)
    {
        try {
            $locataire = Locataire::findOrFail($id);
            $locataire->delete();

            return response()->json([
                'success' => true,
                'message' => 'Locataire supprimé avec succès'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Récupérer les contrats d'un locataire
     */
    public function contrats($id)
    {
        try {
            $locataire = Locataire::findOrFail($id);
            $contrats = $locataire->contrats()->get();

            return response()->json([
                'success' => true,
                'data' => $contrats,
                'message' => 'Contrats du locataire récupérés avec succès'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Rechercher des locataires par profession
     */
    public function byProfession($profession)
    {
        try {
            $locataires = Locataire::where('profession', $profession)->get();
            return response()->json([
                'success' => true,
                'data' => $locataires,
                'message' => "Locataires avec la profession {$profession} récupérés"
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage()
            ], 500);
        }
    }
}
