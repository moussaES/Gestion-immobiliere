<?php

namespace App\Http\Controllers;

use App\Models\Bien;
use Illuminate\Http\Request;

class BienController extends Controller
{
    /**
     * Afficher la liste de tous les biens
     */
    public function index()
    {
        try {
            $biens = Bien::with('proprietaire', 'contrats')->get();
            return response()->json([
                'success' => true,
                'data' => $biens,
                'message' => 'Liste des biens récupérée avec succès'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Afficher un bien spécifique
     */
    public function show($id)
    {
        try {
            $bien = Bien::with('proprietaire', 'contrats')->findOrFail($id);
            return response()->json([
                'success' => true,
                'data' => $bien,
                'message' => 'Bien récupéré avec succès'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Bien non trouvé'
            ], 404);
        }
    }

    /**
     * Créer un nouveau bien
     */
    public function store(Request $request)
    {
        try {
            $validated = $request->validate([
                'reference' => 'required|string|unique:biens|max:50',
                'type' => 'required|in:MAISON,APPARTEMENT,IMMEUBLE,TERRAIN',
                'adresse' => 'required|string|max:255',
                'ville' => 'required|string|max:100',
                'code_postal' => 'sometimes|string|max:10',
                'surface' => 'sometimes|numeric|min:0',
                'nombre_pieces' => 'sometimes|integer|min:0',
                'loyer_mensuel' => 'required|numeric|min:0',
                'statut' => 'sometimes|in:OCCUPE,LIBRE,RESERVE',
                'description' => 'sometimes|string',
                'id_proprietaire' => 'required|exists:proprietaires,id_proprietaire',
            ]);

            $bien = Bien::create($validated);

            return response()->json([
                'success' => true,
                'data' => $bien,
                'message' => 'Bien créé avec succès'
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
     * Mettre à jour un bien
     */
    public function update(Request $request, $id)
    {
        try {
            $bien = Bien::findOrFail($id);

            $validated = $request->validate([
                'reference' => 'sometimes|string|unique:biens,reference,' . $id . ',id_bien|max:50',
                'type' => 'sometimes|in:MAISON,APPARTEMENT,IMMEUBLE,TERRAIN',
                'adresse' => 'sometimes|string|max:255',
                'ville' => 'sometimes|string|max:100',
                'code_postal' => 'sometimes|string|max:10',
                'surface' => 'sometimes|numeric|min:0',
                'nombre_pieces' => 'sometimes|integer|min:0',
                'loyer_mensuel' => 'sometimes|numeric|min:0',
                'statut' => 'sometimes|in:OCCUPE,LIBRE,RESERVE',
                'description' => 'sometimes|string',
                'id_proprietaire' => 'sometimes|exists:proprietaires,id_proprietaire',
            ]);

            $bien->update($validated);

            return response()->json([
                'success' => true,
                'data' => $bien,
                'message' => 'Bien mis à jour avec succès'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Supprimer un bien
     */
    public function destroy($id)
    {
        try {
            $bien = Bien::findOrFail($id);
            $bien->delete();

            return response()->json([
                'success' => true,
                'message' => 'Bien supprimé avec succès'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Récupérer les biens par statut
     */
    public function byStatut($statut)
    {
        try {
            $biens = Bien::where('statut', $statut)->get();
            return response()->json([
                'success' => true,
                'data' => $biens,
                'message' => "Biens avec le statut {$statut} récupérés"
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Récupérer les biens par type
     */
    public function byType($type)
    {
        try {
            $biens = Bien::where('type', $type)->get();
            return response()->json([
                'success' => true,
                'data' => $biens,
                'message' => "Biens de type {$type} récupérés"
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Récupérer les biens par ville
     */
    public function byVille($ville)
    {
        try {
            $biens = Bien::where('ville', $ville)->get();
            return response()->json([
                'success' => true,
                'data' => $biens,
                'message' => "Biens de la ville {$ville} récupérés"
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Récupérer les contrats d'un bien
     */
    public function contrats($id)
    {
        try {
            $bien = Bien::findOrFail($id);
            $contrats = $bien->contrats()->get();

            return response()->json([
                'success' => true,
                'data' => $contrats,
                'message' => 'Contrats du bien récupérés avec succès'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage()
            ], 500);
        }
    }
}
