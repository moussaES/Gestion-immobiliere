<?php

namespace App\Http\Controllers;

use App\Models\Utilisateur;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class AuthController extends Controller
{
    /**
     * Connexion de l'utilisateur
     */
    public function login(Request $request)
    {
        try {
            $validated = $request->validate([
                'email'    => 'required|email',
                'password' => 'required|string',
            ]);

            $user = Utilisateur::where('email', $validated['email'])->first();

            if (!$user || !Hash::check($validated['password'], $user->password)) {
                return response()->json([
                    'success' => false,
                    'message' => 'Email ou mot de passe incorrect.'
                ], 401);
            }

            if (strtoupper($user->statut) !== 'ACTIF') {
                return response()->json([
                    'success' => false,
                    'message' => 'Ce compte est inactif.'
                ], 403);
            }

            // Génération d'un token aléatoire pour la session frontend
            $token = Str::random(60);

            return response()->json([
                'success' => true,
                'token'   => $token,
                'token_type' => 'Bearer',
                'user'    => $user,
                'message' => 'Connexion réussie.'
            ]);
        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Erreur de validation.',
                'errors'  => $e->errors()
            ], 422);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Une erreur est survenue lors de la connexion.',
                'error'   => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Déconnexion de l'utilisateur
     */
    public function logout(Request $request)
    {
        return response()->json([
            'success' => true,
            'message' => 'Déconnexion réussie.'
        ]);
    }
}
