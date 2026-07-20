<?php

namespace App\Http\Controllers;

use App\Models\Locataire;
use App\Http\Requests\StoreLocataireRequest;
use App\Http\Requests\UpdateLocataireRequest;
use App\Http\Resources\LocataireResource;
use Illuminate\Http\Request;

class LocataireController extends Controller
{
    public function index()
    {
        try {
            $locataires = Locataire::with('contrats')->paginate(15);
            return response()->json([
                'success' => true,
                'data' => LocataireResource::collection($locataires)->response()->getData(true),
                'message' => 'Liste des locataires récupérée avec succès'
            ]);
        } catch (\Exception $e) {
            return response()->json(['success' => false, 'message' => $e->getMessage()], 500);
        }
    }

    public function show($id)
    {
        try {
            $locataire = Locataire::with('contrats')->findOrFail($id);
            return response()->json([
                'success' => true,
                'data' => new LocataireResource($locataire),
                'message' => 'Locataire récupéré avec succès'
            ]);
        } catch (\Exception $e) {
            return response()->json(['success' => false, 'message' => 'Locataire non trouvé'], 404);
        }
    }

    public function store(StoreLocataireRequest $request)
    {
        try {
            $validated = $request->validated();
            $locataire = Locataire::create($validated);

            return response()->json([
                'success' => true,
                'data' => new LocataireResource($locataire),
                'message' => 'Locataire créé avec succès'
            ], 201);
        } catch (\Exception $e) {
            return response()->json(['success' => false, 'message' => $e->getMessage()], 500);
        }
    }

    public function update(UpdateLocataireRequest $request, $id)
    {
        try {
            $locataire = Locataire::findOrFail($id);
            $validated = $request->validated();
            $locataire->update($validated);

            return response()->json([
                'success' => true,
                'data' => new LocataireResource($locataire),
                'message' => 'Locataire mis à jour avec succès'
            ]);
        } catch (\Exception $e) {
            return response()->json(['success' => false, 'message' => $e->getMessage()], 500);
        }
    }

    public function destroy($id)
    {
        try {
            $locataire = Locataire::findOrFail($id);
            $locataire->delete();

            return response()->json(['success' => true, 'message' => 'Locataire supprimé avec succès']);
        } catch (\Exception $e) {
            return response()->json(['success' => false, 'message' => $e->getMessage()], 500);
        }
    }

    public function contrats($id)
    {
        try {
            $locataire = Locataire::findOrFail($id);
            $contrats = $locataire->contrats()->get();

            return response()->json([
                'success' => true,
                'data' => $contrats,
                'message' => 'Contrats du locataire récupérés avec succès'
            ]);
        } catch (\Exception $e) {
            return response()->json(['success' => false, 'message' => $e->getMessage()], 500);
        }
    }

    public function byProfession($profession)
    {
        try {
            $locataires = Locataire::where('profession', $profession)->paginate(15);
            return response()->json([
                'success' => true,
                'data' => LocataireResource::collection($locataires)->response()->getData(true),
                'message' => "Locataires avec la profession {$profession} récupérés"
            ]);
        } catch (\Exception $e) {
            return response()->json(['success' => false, 'message' => $e->getMessage()], 500);
        }
    }
}
