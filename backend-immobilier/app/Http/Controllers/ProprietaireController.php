<?php

namespace App\Http\Controllers;

use App\Models\Proprietaire;
use App\Http\Requests\StoreProprietaireRequest;
use App\Http\Requests\UpdateProprietaireRequest;
use App\Http\Resources\ProprietaireResource;
use Illuminate\Http\Request;

class ProprietaireController extends Controller
{
    public function index()
    {
        try {
            $proprietaires = Proprietaire::with('biens', 'contrats')->withCount('biens')->paginate(15);
            return response()->json([
                'success' => true,
                'data' => ProprietaireResource::collection($proprietaires)->response()->getData(true),
                'message' => 'Liste des propriétaires récupérée avec succès'
            ]);
        } catch (\Exception $e) {
            return response()->json(['success' => false, 'message' => $e->getMessage()], 500);
        }
    }

    public function show($id)
    {
        try {
            $proprietaire = Proprietaire::with('biens', 'contrats')->findOrFail($id);
            return response()->json([
                'success' => true,
                'data' => new ProprietaireResource($proprietaire),
                'message' => 'Propriétaire récupéré avec succès'
            ]);
        } catch (\Exception $e) {
            return response()->json(['success' => false, 'message' => 'Propriétaire non trouvé'], 404);
        }
    }

    public function store(StoreProprietaireRequest $request)
    {
        try {
            $validated = $request->validated();
            $proprietaire = Proprietaire::create($validated);

            return response()->json([
                'success' => true,
                'data' => new ProprietaireResource($proprietaire),
                'message' => 'Propriétaire créé avec succès'
            ], 201);
        } catch (\Exception $e) {
            return response()->json(['success' => false, 'message' => $e->getMessage()], 500);
        }
    }

    public function update(UpdateProprietaireRequest $request, $id)
    {
        try {
            $proprietaire = Proprietaire::findOrFail($id);
            $validated = $request->validated();
            $proprietaire->update($validated);

            return response()->json([
                'success' => true,
                'data' => new ProprietaireResource($proprietaire),
                'message' => 'Propriétaire mis à jour avec succès'
            ]);
        } catch (\Exception $e) {
            return response()->json(['success' => false, 'message' => $e->getMessage()], 500);
        }
    }

    public function destroy($id)
    {
        try {
            $proprietaire = Proprietaire::findOrFail($id);
            $proprietaire->delete();

            return response()->json(['success' => true, 'message' => 'Propriétaire supprimé avec succès']);
        } catch (\Exception $e) {
            return response()->json(['success' => false, 'message' => $e->getMessage()], 500);
        }
    }

    public function biens($id)
    {
        try {
            $proprietaire = Proprietaire::findOrFail($id);
            $biens = $proprietaire->biens()->get();

            return response()->json([
                'success' => true,
                'data' => $biens, // Potentiellement à paginer et resourcer plus tard
                'message' => 'Biens du propriétaire récupérés avec succès'
            ]);
        } catch (\Exception $e) {
            return response()->json(['success' => false, 'message' => $e->getMessage()], 500);
        }
    }

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
            return response()->json(['success' => false, 'message' => $e->getMessage()], 500);
        }
    }
}
