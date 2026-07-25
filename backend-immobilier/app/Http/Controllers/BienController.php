<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreBienRequest;
use App\Http\Requests\UpdateBienRequest;
use App\Http\Resources\BienResource;
use App\Services\BienService;
use Illuminate\Http\Request;

class BienController extends Controller
{
    protected BienService $bienService;

    public function __construct(BienService $bienService)
    {
        $this->bienService = $bienService;
    }

    public function index()
    {
        $biens = $this->bienService->getAllPaginated();

        return response()->json([
            'success' => true,
            'data' => BienResource::collection($biens)->response()->getData(true),
            'message' => 'Liste des biens récupérée avec succès'
        ]);
    }

    public function show($id)
    {
        $bien = $this->bienService->getById($id);

        return response()->json([
            'success' => true,
            'data' => new BienResource($bien),
            'message' => 'Bien récupéré avec succès'
        ]);
    }

    public function store(StoreBienRequest $request)
    {
        $bien = $this->bienService->create($request->validated());

        return response()->json([
            'success' => true,
            'data' => new BienResource($bien),
            'message' => 'Bien créé avec succès'
        ], 201);
    }

    public function update(UpdateBienRequest $request, $id)
    {
        $bien = $this->bienService->update($id, $request->validated());

        return response()->json([
            'success' => true,
            'data' => new BienResource($bien),
            'message' => 'Bien mis à jour avec succès'
        ]);
    }

    public function destroy($id)
    {
        $this->bienService->delete($id);

        return response()->json(['success' => true, 'message' => 'Bien supprimé avec succès']);
    }

    public function byStatut($statut)
    {
        $biens = $this->bienService->getByStatut($statut);

        return response()->json([
            'success' => true,
            'data' => BienResource::collection($biens)->response()->getData(true),
            'message' => "Biens avec le statut {$statut} récupérés"
        ]);
    }

    public function byType($type)
    {
        $biens = $this->bienService->getByType($type);

        return response()->json([
            'success' => true,
            'data' => BienResource::collection($biens)->response()->getData(true),
            'message' => "Biens de type {$type} récupérés"
        ]);
    }

    public function byVille($ville)
    {
        $biens = $this->bienService->getByVille($ville);

        return response()->json([
            'success' => true,
            'data' => BienResource::collection($biens)->response()->getData(true),
            'message' => "Biens de la ville {$ville} récupérés"
        ]);
    }

    public function contrats($id)
    {
        $contrats = $this->bienService->getContrats($id);

        return response()->json([
            'success' => true,
            'data' => $contrats,
            'message' => 'Contrats du bien récupérés avec succès'
        ]);
    }
}
