<?php

namespace App\Http\Controllers;

use App\Models\HistoriqueOperation;
use Illuminate\Http\Request;

class HistoriqueOperationController extends Controller
{
    /**
     * Afficher la liste de tous les historiques
     */
    public function index()
    {
        try {
            $historiques = HistoriqueOperation::with('utilisateur')->orderBy('date_operation', 'desc')->get();
            return response()->json([
                'success' => true,
                'data' => $historiques,
                'message' => 'Liste des historiques récupérée avec succès'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Afficher un historique spécifique
     */
    public function show($id)
    {
        try {
            $historique = HistoriqueOperation::with('utilisateur')->findOrFail($id);
            return response()->json([
                'success' => true,
                'data' => $historique,
                'message' => 'Historique récupéré avec succès'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Historique non trouvé'
            ], 404);
        }
    }

    /**
     * Créer un nouvel historique (généralement automatique)
     */
    public function store(Request $request)
    {
        try {
            $validated = $request->validate([
                'id_user' => 'required|exists:utilisateurs,id_user',
                'type_operation' => 'required|string|max:50',
                'entite' => 'required|string|max:50',
                'id_entite' => 'sometimes|integer',
                'description' => 'sometimes|string',
                'ancienne_valeur' => 'sometimes|string',
                'nouvelle_valeur' => 'sometimes|string',
            ]);

            $historique = HistoriqueOperation::create($validated);

            return response()->json([
                'success' => true,
                'data' => $historique,
                'message' => 'Historique créé avec succès'
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
     * Supprimer un historique
     */
    public function destroy($id)
    {
        try {
            $historique = HistoriqueOperation::findOrFail($id);
            $historique->delete();

            return response()->json([
                'success' => true,
                'message' => 'Historique supprimé avec succès'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Récupérer l'historique d'un utilisateur
     */
    public function byUser($id_user)
    {
        try {
            $historiques = HistoriqueOperation::byUser($id_user)->orderBy('date_operation', 'desc')->get();
            return response()->json([
                'success' => true,
                'data' => $historiques,
                'message' => "Historique de l'utilisateur {$id_user} récupéré"
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Récupérer l'historique par type d'opération
     */
    public function byType($type)
    {
        try {
            $historiques = HistoriqueOperation::byType($type)->orderBy('date_operation', 'desc')->get();
            return response()->json([
                'success' => true,
                'data' => $historiques,
                'message' => "Historique des opérations {$type} récupéré"
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Récupérer l'historique par entité
     */
    public function byEntite($entite)
    {
        try {
            $historiques = HistoriqueOperation::byEntite($entite)->orderBy('date_operation', 'desc')->get();
            return response()->json([
                'success' => true,
                'data' => $historiques,
                'message' => "Historique de l'entité {$entite} récupéré"
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Récupérer l'historique par entité et id
     */
    public function byEntiteAndId($entite, $id)
    {
        try {
            $historiques = HistoriqueOperation::where('entite', $entite)
                ->where('id_entite', $id)
                ->orderBy('date_operation', 'desc')
                ->get();
            return response()->json([
                'success' => true,
                'data' => $historiques,
                'message' => "Historique de {$entite} #{$id} récupéré"
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Récupérer l'historique récent (7 derniers jours)
     */
    public function recent($jours = 7)
    {
        try {
            $historiques = HistoriqueOperation::recent($jours)->orderBy('date_operation', 'desc')->get();
            return response()->json([
                'success' => true,
                'data' => $historiques,
                'message' => "Historique des {$jours} derniers jours récupéré"
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Récupérer les statistiques d'audit
     */
    public function statistiques()
    {
        try {
            $stats = [
                'total_operations' => HistoriqueOperation::count(),
                'operations_create' => HistoriqueOperation::byType('INSERT')->count(),
                'operations_update' => HistoriqueOperation::byType('UPDATE')->count(),
                'operations_delete' => HistoriqueOperation::byType('DELETE')->count(),
                'derniere_operation' => HistoriqueOperation::orderBy('date_operation', 'desc')->first(),
            ];

            return response()->json([
                'success' => true,
                'data' => $stats,
                'message' => 'Statistiques d\'audit récupérées'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Nettoyer les historiques de plus de N jours
     */
    public function cleanup($jours = 90)
    {
        try {
            $deleted = HistoriqueOperation::where('date_operation', '<', now()->subDays($jours))->delete();

            return response()->json([
                'success' => true,
                'data' => ['deleted' => $deleted],
                'message' => "{$deleted} historiques de plus de {$jours} jours supprimés"
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage()
            ], 500);
        }
    }
}
