<?php

namespace App\Http\Controllers;

use App\Models\Contrat;
use Illuminate\Http\Request;

class ContratController extends Controller
{
    /**
     * Afficher la liste de tous les contrats
     */
    public function index()
    {
        try {
            $contrats = Contrat::with('bien', 'proprietaire', 'locataire', 'utilisateur', 'paiements')->get();
            return response()->json([
                'success' => true,
                'data' => $contrats,
                'message' => 'Liste des contrats récupérée avec succès'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Afficher un contrat spécifique
     */
    public function show($id)
    {
        try {
            $contrat = Contrat::with('bien', 'proprietaire', 'locataire', 'utilisateur', 'paiements')->findOrFail($id);
            return response()->json([
                'success' => true,
                'data' => $contrat,
                'message' => 'Contrat récupéré avec succès'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Contrat non trouvé'
            ], 404);
        }
    }

    /**
     * Créer un nouveau contrat
     */
    public function store(Request $request)
    {
        try {
            $validated = $request->validate([
                'reference' => 'required|string|unique:contrats|max:50',
                'type_contrat' => 'required|in:LOCATAIRE,PROPRIETAIRE',
                'date_debut' => 'required|date',
                'date_fin' => 'required|date|after:date_debut',
                'montant' => 'required|numeric|min:0',
                'statut' => 'sometimes|in:ACTIF,RESILIE,ARCHIVE',
                'id_bien' => 'required|exists:biens,id_bien',
                'id_proprietaire' => 'required|exists:proprietaires,id_proprietaire',
                'id_locataire' => 'sometimes|nullable|exists:locataires,id_locataire',
                'id_user_createur' => 'sometimes|exists:utilisateurs,id_user',
                'notes' => 'sometimes|string',
            ]);

            $contrat = Contrat::create($validated);

            return response()->json([
                'success' => true,
                'data' => $contrat,
                'message' => 'Contrat créé avec succès'
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
     * Mettre à jour un contrat
     */
    public function update(Request $request, $id)
    {
        try {
            $contrat = Contrat::findOrFail($id);

            $validated = $request->validate([
                'reference' => 'sometimes|string|unique:contrats,reference,' . $id . ',id_contrat|max:50',
                'type_contrat' => 'sometimes|in:LOCATAIRE,PROPRIETAIRE',
                'date_debut' => 'sometimes|date',
                'date_fin' => 'sometimes|date|after:date_debut',
                'montant' => 'sometimes|numeric|min:0',
                'statut' => 'sometimes|in:ACTIF,RESILIE,ARCHIVE',
                'id_bien' => 'sometimes|exists:biens,id_bien',
                'id_proprietaire' => 'sometimes|exists:proprietaires,id_proprietaire',
                'id_locataire' => 'sometimes|nullable|exists:locataires,id_locataire',
                'notes' => 'sometimes|string',
                'date_annulation' => 'sometimes|nullable|date',
            ]);

            $contrat->update($validated);

            return response()->json([
                'success' => true,
                'data' => $contrat,
                'message' => 'Contrat mis à jour avec succès'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Supprimer un contrat
     */
    public function destroy($id)
    {
        try {
            $contrat = Contrat::findOrFail($id);
            $contrat->delete();

            return response()->json([
                'success' => true,
                'message' => 'Contrat supprimé avec succès'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Récupérer les contrats actifs
     */
    public function actifs()
    {
        try {
            $contrats = Contrat::actif()->get();
            return response()->json([
                'success' => true,
                'data' => $contrats,
                'message' => 'Contrats actifs récupérés avec succès'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Récupérer les contrats en cours
     */
    public function enCours()
    {
        try {
            $contrats = Contrat::enCours()->get();
            return response()->json([
                'success' => true,
                'data' => $contrats,
                'message' => 'Contrats en cours récupérés avec succès'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Récupérer les paiements d'un contrat
     */
    public function paiements($id)
    {
        try {
            $contrat = Contrat::findOrFail($id);
            $paiements = $contrat->paiements()->get();

            return response()->json([
                'success' => true,
                'data' => $paiements,
                'message' => 'Paiements du contrat récupérés avec succès'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Récupérer les contrats par type
     */
    public function byType($type)
    {
        try {
            $contrats = Contrat::where('type_contrat', $type)->get();
            return response()->json([
                'success' => true,
                'data' => $contrats,
                'message' => "Contrats de type {$type} récupérés"
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage()
            ], 500);
        }
    }
}
