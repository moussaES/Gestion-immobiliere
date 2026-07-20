<?php

namespace App\Http\Controllers;

use App\Models\Bien;
use App\Http\Requests\StoreBienRequest;
use App\Http\Requests\UpdateBienRequest;
use App\Http\Resources\BienResource;
use Illuminate\Http\Request;

class BienController extends Controller
{
    public function index()
    {
        try {
            $biens = Bien::with('proprietaire', 'contrats')->paginate(15);
            return response()->json([
                'success' => true,
                'data' => BienResource::collection($biens)->response()->getData(true),
                'message' => 'Liste des biens récupérée avec succès'
            ]);
        } catch (\Exception $e) {
            \Log::error('Erreur dans BienController@index : ' . $e->getMessage() . ' Trace: ' . $e->getTraceAsString());
            return response()->json(['success' => false, 'message' => $e->getMessage()], 500);
        }
    }

    public function show($id)
    {
        try {
            $bien = Bien::with('proprietaire', 'contrats')->findOrFail($id);
            return response()->json([
                'success' => true,
                'data' => new BienResource($bien),
                'message' => 'Bien récupéré avec succès'
            ]);
        } catch (\Exception $e) {
            return response()->json(['success' => false, 'message' => 'Bien non trouvé'], 404);
        }
    }

    public function store(StoreBienRequest $request)
    {
        try {
            $validated = $request->validated();
            $bien = Bien::create($validated);

            return response()->json([
                'success' => true,
                'data' => new BienResource($bien),
                'message' => 'Bien créé avec succès'
            ], 201);
        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Erreur de validation',
                'errors' => $e->errors()
            ], 422);
        } catch (\Exception $e) {
            \Log::error('Erreur dans BienController@store : ' . $e->getMessage());
            return response()->json(['success' => false, 'message' => $e->getMessage()], 500);
        }
    }

    public function update(UpdateBienRequest $request, $id)
    {
        try {
            $bien = Bien::findOrFail($id);
            $validated = $request->validated();
            $bien->update($validated);

            return response()->json([
                'success' => true,
                'data' => new BienResource($bien),
                'message' => 'Bien mis à jour avec succès'
            ]);
        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Erreur de validation',
                'errors' => $e->errors()
            ], 422);
        } catch (\Exception $e) {
            \Log::error('Erreur dans BienController@update : ' . $e->getMessage());
            return response()->json(['success' => false, 'message' => $e->getMessage()], 500);
        }
    }

    public function destroy($id)
    {
        try {
            $bien = Bien::findOrFail($id);
            $bien->delete();

            return response()->json(['success' => true, 'message' => 'Bien supprimé avec succès']);
        } catch (\Exception $e) {
            return response()->json(['success' => false, 'message' => $e->getMessage()], 500);
        }
    }

    public function byStatut($statut)
    {
        try {
            $biens = Bien::where('statut', $statut)->paginate(15);
            return response()->json([
                'success' => true,
                'data' => BienResource::collection($biens)->response()->getData(true),
                'message' => "Biens avec le statut {$statut} récupérés"
            ]);
        } catch (\Exception $e) {
            return response()->json(['success' => false, 'message' => $e->getMessage()], 500);
        }
    }

    public function byType($type)
    {
        try {
            $biens = Bien::where('type', $type)->paginate(15);
            return response()->json([
                'success' => true,
                'data' => BienResource::collection($biens)->response()->getData(true),
                'message' => "Biens de type {$type} récupérés"
            ]);
        } catch (\Exception $e) {
            return response()->json(['success' => false, 'message' => $e->getMessage()], 500);
        }
    }

    public function byVille($ville)
    {
        try {
            $biens = Bien::where('ville', $ville)->paginate(15);
            return response()->json([
                'success' => true,
                'data' => BienResource::collection($biens)->response()->getData(true),
                'message' => "Biens de la ville {$ville} récupérés"
            ]);
        } catch (\Exception $e) {
            return response()->json(['success' => false, 'message' => $e->getMessage()], 500);
        }
    }

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
            return response()->json(['success' => false, 'message' => $e->getMessage()], 500);
        }
    }
}
