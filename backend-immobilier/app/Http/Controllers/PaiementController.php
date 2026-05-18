<?php

namespace App\Http\Controllers;

use App\Models\Paiement;
use Illuminate\Http\Request;

class PaiementController extends Controller
{
    /**
     * Afficher la liste de tous les paiements
     */
    public function index()
    {
        try {
            $paiements = Paiement::with('contrat', 'utilisateur')->get();
            return response()->json([
                'success' => true,
                'data' => $paiements,
                'message' => 'Liste des paiements récupérée avec succès'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Afficher un paiement spécifique
     */
    public function show($id)
    {
        try {
            $paiement = Paiement::with('contrat', 'utilisateur')->findOrFail($id);
            return response()->json([
                'success' => true,
                'data' => $paiement,
                'message' => 'Paiement récupéré avec succès'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Paiement non trouvé'
            ], 404);
        }
    }

    /**
     * Créer un nouveau paiement
     */
    public function store(Request $request)
    {
        try {
            $validated = $request->validate([
                'reference' => 'required|string|unique:paiements|max:50',
                'date_paiement' => 'required|date',
                'montant' => 'required|numeric|min:0',
                'mode_paiement' => 'required|in:CHEQUE,VIREMENT,ESPECES,WAVE,ORANGE_MONEY',
                'statut' => 'sometimes|in:PAYE,PARTIEL,EN_ATTENTE',
                'id_contrat' => 'required|exists:contrats,id_contrat',
                'id_user_enregistrement' => 'sometimes|exists:utilisateurs,id_user',
                'notes' => 'sometimes|string',
            ]);

            $paiement = Paiement::create($validated);

            return response()->json([
                'success' => true,
                'data' => $paiement,
                'message' => 'Paiement créé avec succès'
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
     * Mettre à jour un paiement
     */
    public function update(Request $request, $id)
    {
        try {
            $paiement = Paiement::findOrFail($id);

            $validated = $request->validate([
                'reference' => 'sometimes|string|unique:paiements,reference,' . $id . ',id_paiement|max:50',
                'date_paiement' => 'sometimes|date',
                'montant' => 'sometimes|numeric|min:0',
                'mode_paiement' => 'sometimes|in:CHEQUE,VIREMENT,ESPECES,WAVE,ORANGE_MONEY',
                'statut' => 'sometimes|in:PAYE,PARTIEL,EN_ATTENTE',
                'id_contrat' => 'sometimes|exists:contrats,id_contrat',
                'notes' => 'sometimes|string',
            ]);

            $paiement->update($validated);

            return response()->json([
                'success' => true,
                'data' => $paiement,
                'message' => 'Paiement mis à jour avec succès'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Supprimer un paiement
     */
    public function destroy($id)
    {
        try {
            $paiement = Paiement::findOrFail($id);
            $paiement->delete();

            return response()->json([
                'success' => true,
                'message' => 'Paiement supprimé avec succès'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Récupérer les paiements payés
     */
    public function payes()
    {
        try {
            $paiements = Paiement::paye()->get();
            return response()->json([
                'success' => true,
                'data' => $paiements,
                'message' => 'Paiements payés récupérés avec succès'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Récupérer les paiements en attente
     */
    public function enAttente()
    {
        try {
            $paiements = Paiement::enAttente()->get();
            return response()->json([
                'success' => true,
                'data' => $paiements,
                'message' => 'Paiements en attente récupérés avec succès'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Récupérer les paiements par mode
     */
    public function byMode($mode)
    {
        try {
            $paiements = Paiement::byMode($mode)->get();
            return response()->json([
                'success' => true,
                'data' => $paiements,
                'message' => "Paiements par {$mode} récupérés"
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Récupérer les paiements par mois
     */
    public function byMois($mois)
    {
        try {
            $paiements = Paiement::byMois($mois)->get();
            return response()->json([
                'success' => true,
                'data' => $paiements,
                'message' => "Paiements du mois {$mois} récupérés"
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Récupérer les statistiques de paiements
     */
    public function statistiques()
    {
        try {
            $stats = [
                'total_paiements' => Paiement::sum('montant'),
                'nombre_paiements' => Paiement::count(),
                'paiements_payes' => Paiement::paye()->sum('montant'),
                'paiements_en_attente' => Paiement::enAttente()->sum('montant'),
                'paiements_partiels' => Paiement::partiel()->sum('montant'),
            ];

            return response()->json([
                'success' => true,
                'data' => $stats,
                'message' => 'Statistiques des paiements récupérées'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage()
            ], 500);
        }
    }
}
