<?php

namespace App\Http\Controllers;

use App\Models\Proprietaire;
use Illuminate\Http\Request;

class ProprietaireController extends Controller
{
    /**
     * Afficher la liste de tous les propriétaires
     */
    public function index()
    {
        try {
            $proprietaires = Proprietaire::with('biens', 'contrats')->get();
            return response()->json([
                'success' => true,
                'data' => $proprietaires,
                'message' => 'Liste des propriétaires récupérée avec succès'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Afficher un propriétaire spécifique
     */
    public function show($id)
    {
        try {
            $proprietaire = Proprietaire::with('biens', 'contrats')->findOrFail($id);
            return response()->json([
                'success' => true,
                'data' => $proprietaire,
                'message' => 'Propriétaire récupéré avec succès'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Propriétaire non trouvé'
            ], 404);
        }
    }

    /**
     * Créer un nouveau propriétaire
     */
    public function store(Request $request)
    {
        try {
            $validated = $request->validate([
                'nom' => 'required|string|max:100',
                'prenom' => 'required|string|max:100',
                'telephone' => 'required|string|unique:proprietaires|max:20',
                'email' => 'sometimes|email|unique:proprietaires|max:150',
                'adresse' => 'required|string|max:255',
                'cni' => 'sometimes|string|unique:proprietaires|max:50',
            ]);

            $proprietaire = Proprietaire::create($validated);

            return response()->json([
                'success' => true,
                'data' => $proprietaire,
                'message' => 'Propriétaire créé avec succès'
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
     * Mettre à jour un propriétaire
     */
    public function update(Request $request, $id)
    {
        try {
            $proprietaire = Proprietaire::findOrFail($id);

            $validated = $request->validate([
                'nom' => 'sometimes|string|max:100',
                'prenom' => 'sometimes|string|max:100',
                'telephone' => 'sometimes|string|unique:proprietaires,telephone,' . $id . ',id_proprietaire|max:20',
                'email' => 'sometimes|email|unique:proprietaires,email,' . $id . ',id_proprietaire|max:150',
                'adresse' => 'sometimes|string|max:255',
                'cni' => 'sometimes|string|unique:proprietaires,cni,' . $id . ',id_proprietaire|max:50',
            ]);

            $proprietaire->update($validated);

            return response()->json([
                'success' => true,
                'data' => $proprietaire,
                'message' => 'Propriétaire mis à jour avec succès'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Supprimer un propriétaire
     */
    public function destroy($id)
    {
        try {
            $proprietaire = Proprietaire::findOrFail($id);
            $proprietaire->delete();

            return response()->json([
                'success' => true,
                'message' => 'Propriétaire supprimé avec succès'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Récupérer les biens d'un propriétaire
     */
    public function biens($id)
    {
        try {
            $proprietaire = Proprietaire::findOrFail($id);
            $biens = $proprietaire->biens()->get();

            return response()->json([
                'success' => true,
                'data' => $biens,
                'message' => 'Biens du propriétaire récupérés avec succès'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Récupérer les contrats d'un propriétaire
     */
    public function contrats($id)
    {
        try {
            $proprietaire = Proprietaire::findOrFail($id);
            $contrats = $proprietaire->contrats()->get();

            return response()->json([
                'success' => true,
                'data' => $contrats,
                'message' => 'Contrats du propriétaire récupérés avec succès'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage()
            ], 500);
        }
    }
}
