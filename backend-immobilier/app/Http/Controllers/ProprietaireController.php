<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreProprietaireRequest;
use App\Http\Requests\UpdateProprietaireRequest;
use App\Http\Resources\ProprietaireResource;
use App\Services\ProprietaireService;
use Illuminate\Http\Request;

class ProprietaireController extends Controller
{
    protected ProprietaireService $proprietaireService;

    public function __construct(ProprietaireService $proprietaireService)
    {
        $this->proprietaireService = $proprietaireService;
    }

    public function index()
    {
        $proprietaires = $this->proprietaireService->getAllPaginated();
        
        return response()->json([
            'success' => true,
            'data' => ProprietaireResource::collection($proprietaires)->response()->getData(true),
            'message' => 'Liste des propriétaires récupérée avec succès'
        ]);
    }

    public function show($id)
    {
        $proprietaire = $this->proprietaireService->getById($id);
        
        return response()->json([
            'success' => true,
            'data' => new ProprietaireResource($proprietaire),
            'message' => 'Propriétaire récupéré avec succès'
        ]);
    }

    public function store(StoreProprietaireRequest $request)
    {
        $proprietaire = $this->proprietaireService->create($request->validated());

        return response()->json([
            'success' => true,
            'data' => new ProprietaireResource($proprietaire),
            'message' => 'Propriétaire créé avec succès'
        ], 201);
    }

    public function update(UpdateProprietaireRequest $request, $id)
    {
        $proprietaire = $this->proprietaireService->update($id, $request->validated());

        return response()->json([
            'success' => true,
            'data' => new ProprietaireResource($proprietaire),
            'message' => 'Propriétaire mis à jour avec succès'
        ]);
    }

    public function destroy($id)
    {
        $this->proprietaireService->delete($id);

        return response()->json(['success' => true, 'message' => 'Propriétaire supprimé avec succès']);
    }

    public function biens($id)
    {
        $biens = $this->proprietaireService->getBiens($id);

        return response()->json([
            'success' => true,
            'data' => $biens,
            'message' => 'Biens du propriétaire récupérés avec succès'
        ]);
    }

    public function contrats($id)
    {
        $contrats = $this->proprietaireService->getContrats($id);

        return response()->json([
            'success' => true,
            'data' => $contrats,
            'message' => 'Contrats du propriétaire récupérés avec succès'
        ]);
    }
}
