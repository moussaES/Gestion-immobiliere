<?php

namespace App\Http\Controllers;

use App\Models\Utilisateur;
use App\Http\Resources\UtilisateurResource;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class ProfilController extends Controller
{
    /**
     * Récupérer le profil de l'utilisateur connecté (par son ID)
     */
    public function show($id)
    {
        try {
            $user = Utilisateur::findOrFail($id);
            return response()->json([
                'success' => true,
                'data'    => new UtilisateurResource($user),
                'message' => 'Profil récupéré avec succès'
            ]);
        } catch (\Exception $e) {
            return response()->json(['success' => false, 'message' => 'Utilisateur non trouvé'], 404);
        }
    }

    /**
     * Mettre à jour les informations du profil (nom, prénom, email)
     */
    public function updateProfil(Request $request, $id)
    {
        try {
            $user = Utilisateur::findOrFail($id);

            $validated = $request->validate([
                'nom'    => 'sometimes|string|max:100',
                'prenom' => 'sometimes|string|max:100',
                'email'  => 'sometimes|email|unique:utilisateurs,email,' . $id . ',id_user',
            ]);

            $user->update($validated);

            return response()->json([
                'success' => true,
                'data'    => new UtilisateurResource($user),
                'message' => 'Profil mis à jour avec succès'
            ]);
        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Erreur de validation',
                'errors'  => $e->errors()
            ], 422);
        } catch (\Exception $e) {
            return response()->json(['success' => false, 'message' => $e->getMessage()], 500);
        }
    }

    /**
     * Changer le mot de passe
     */
    public function changePassword(Request $request, $id)
    {
        try {
            $user = Utilisateur::findOrFail($id);

            $validated = $request->validate([
                'ancien_mot_de_passe'  => 'required|string',
                'nouveau_mot_de_passe' => 'required|string|min:6|confirmed',
            ]);

            if (!Hash::check($validated['ancien_mot_de_passe'], $user->password)) {
                return response()->json([
                    'success' => false,
                    'message' => 'L\'ancien mot de passe est incorrect.'
                ], 422);
            }

            $user->password = bcrypt($validated['nouveau_mot_de_passe']);
            $user->save();

            return response()->json([
                'success' => true,
                'message' => 'Mot de passe modifié avec succès.'
            ]);
        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Erreur de validation',
                'errors'  => $e->errors()
            ], 422);
        } catch (\Exception $e) {
            return response()->json(['success' => false, 'message' => $e->getMessage()], 500);
        }
    }
}
