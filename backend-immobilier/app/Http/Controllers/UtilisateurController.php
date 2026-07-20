<?php

namespace App\Http\Controllers;

use App\Models\Utilisateur;
use App\Http\Requests\StoreUtilisateurRequest;
use App\Http\Requests\UpdateUtilisateurRequest;
use App\Http\Resources\UtilisateurResource;
use Illuminate\Http\Request;

class UtilisateurController extends Controller
{
    public function index()
    {
        try {
            $utilisateurs = Utilisateur::paginate(15);
            return response()->json([
                'success' => true,
                'data' => UtilisateurResource::collection($utilisateurs)->response()->getData(true),
                'message' => 'Liste des utilisateurs récupérée avec succès'
            ]);
        } catch (\Exception $e) {
            return response()->json(['success' => false, 'message' => $e->getMessage()], 500);
        }
    }

    public function show($id)
    {
        try {
            $utilisateur = Utilisateur::findOrFail($id);
            return response()->json([
                'success' => true,
                'data' => new UtilisateurResource($utilisateur),
                'message' => 'Utilisateur récupéré avec succès'
            ]);
        } catch (\Exception $e) {
            return response()->json(['success' => false, 'message' => 'Utilisateur non trouvé'], 404);
        }
    }

    public function store(StoreUtilisateurRequest $request)
    {
        try {
            $validated = $request->validated();
            $validated['password'] = bcrypt($validated['password']);
            $utilisateur = Utilisateur::create($validated);

            return response()->json([
                'success' => true,
                'data' => new UtilisateurResource($utilisateur),
                'message' => 'Utilisateur créé avec succès'
            ], 201);
        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Erreur de validation',
                'errors' => $e->errors()
            ], 422);
        } catch (\Exception $e) {
            \Log::error('Erreur dans UtilisateurController@store : ' . $e->getMessage());
            return response()->json(['success' => false, 'message' => $e->getMessage()], 500);
        }
    }

    public function update(UpdateUtilisateurRequest $request, $id)
    {
        try {
            $utilisateur = Utilisateur::findOrFail($id);
            $validated = $request->validated();

            if (isset($validated['password'])) {
                $validated['password'] = bcrypt($validated['password']);
            }

            $utilisateur->update($validated);

            return response()->json([
                'success' => true,
                'data' => new UtilisateurResource($utilisateur),
                'message' => 'Utilisateur mis à jour avec succès'
            ]);
        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Erreur de validation',
                'errors' => $e->errors()
            ], 422);
        } catch (\Exception $e) {
            \Log::error('Erreur dans UtilisateurController@update : ' . $e->getMessage());
            return response()->json(['success' => false, 'message' => $e->getMessage()], 500);
        }
    }

    public function destroy($id)
    {
        try {
            $utilisateur = Utilisateur::findOrFail($id);
            $utilisateur->delete();

            return response()->json(['success' => true, 'message' => 'Utilisateur supprimé avec succès']);
        } catch (\Exception $e) {
            return response()->json(['success' => false, 'message' => $e->getMessage()], 500);
        }
    }

    public function byRole($role)
    {
        try {
            $utilisateurs = Utilisateur::where('role', $role)->paginate(15);
            return response()->json([
                'success' => true,
                'data' => UtilisateurResource::collection($utilisateurs)->response()->getData(true),
                'message' => "Utilisateurs avec le rôle {$role} récupérés"
            ]);
        } catch (\Exception $e) {
            return response()->json(['success' => false, 'message' => $e->getMessage()], 500);
        }
    }
}
