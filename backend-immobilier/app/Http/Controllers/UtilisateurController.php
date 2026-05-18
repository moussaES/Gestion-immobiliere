<?php

namespace App\Http\Controllers;

use App\Models\Utilisateur;
use Illuminate\Http\Request;

class UtilisateurController extends Controller
{
    /**
     * Afficher la liste de tous les utilisateurs
     */
    public function index()
    {
        try {
            $utilisateurs = Utilisateur::all();
            return response()->json([
                'success' => true,
                'data' => $utilisateurs,
                'message' => 'Liste des utilisateurs récupérée avec succès'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Afficher un utilisateur spécifique
     */
    public function show($id)
    {
        try {
            $utilisateur = Utilisateur::findOrFail($id);
            return response()->json([
                'success' => true,
                'data' => $utilisateur,
                'message' => 'Utilisateur récupéré avec succès'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Utilisateur non trouvé'
            ], 404);
        }
    }

    /**
     * Créer un nouvel utilisateur
     */
    public function store(Request $request)
    {
        try {
            $validated = $request->validate([
                'nom' => 'required|string|max:100',
                'prenom' => 'required|string|max:100',
                'email' => 'required|email|unique:utilisateurs|max:150',
                'password' => 'required|string|min:8',
                'role' => 'required|in:ADMIN,GESTIONNAIRE,COMPTABLE',
                'statut' => 'required|in:ACTIF,INACTIF',
            ]);

            $validated['password'] = bcrypt($validated['password']);
            $utilisateur = Utilisateur::create($validated);

            return response()->json([
                'success' => true,
                'data' => $utilisateur,
                'message' => 'Utilisateur créé avec succès'
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
     * Mettre à jour un utilisateur
     */
    public function update(Request $request, $id)
    {
        try {
            $utilisateur = Utilisateur::findOrFail($id);

            $validated = $request->validate([
                'nom' => 'sometimes|string|max:100',
                'prenom' => 'sometimes|string|max:100',
                'email' => 'sometimes|email|unique:utilisateurs,email,' . $id . ',id_user|max:150',
                'password' => 'sometimes|string|min:8',
                'role' => 'sometimes|in:ADMIN,GESTIONNAIRE,COMPTABLE',
                'statut' => 'sometimes|in:ACTIF,INACTIF',
            ]);

            if (isset($validated['password'])) {
                $validated['password'] = bcrypt($validated['password']);
            }

            $utilisateur->update($validated);

            return response()->json([
                'success' => true,
                'data' => $utilisateur,
                'message' => 'Utilisateur mis à jour avec succès'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Supprimer un utilisateur
     */
    public function destroy($id)
    {
        try {
            $utilisateur = Utilisateur::findOrFail($id);
            $utilisateur->delete();

            return response()->json([
                'success' => true,
                'message' => 'Utilisateur supprimé avec succès'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Récupérer les utilisateurs par rôle
     */
    public function byRole($role)
    {
        try {
            $utilisateurs = Utilisateur::where('role', $role)->get();
            return response()->json([
                'success' => true,
                'data' => $utilisateurs,
                'message' => "Utilisateurs avec le rôle {$role} récupérés"
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage()
            ], 500);
        }
    }
}
