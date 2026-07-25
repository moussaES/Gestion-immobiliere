<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreLocataireRequest;
use App\Http\Requests\UpdateLocataireRequest;
use App\Http\Resources\LocataireResource;
use App\Services\LocataireService;
use Illuminate\Http\Request;

class LocataireController extends Controller
{
    protected LocataireService $locataireService;

    public function __construct(LocataireService $locataireService)
    {
        $this->locataireService = $locataireService;
    }

    public function index()
    {
        $locataires = $this->locataireService->getAllPaginated();

        return response()->json([
            'success' => true,
            'data' => LocataireResource::collection($locataires)->response()->getData(true),
            'message' => 'Liste des locataires récupérée avec succès'
        ]);
    }

    public function show($id)
    {
        $locataire = $this->locataireService->getById($id);

        return response()->json([
            'success' => true,
            'data' => new LocataireResource($locataire),
            'message' => 'Locataire récupéré avec succès'
        ]);
    }

    public function store(StoreLocataireRequest $request)
    {
        $locataire = $this->locataireService->create($request->validated());

        return response()->json([
            'success' => true,
            'data' => new LocataireResource($locataire),
            'message' => 'Locataire créé avec succès'
        ], 201);
    }

    public function update(UpdateLocataireRequest $request, $id)
    {
        $locataire = $this->locataireService->update($id, $request->validated());

        return response()->json([
            'success' => true,
            'data' => new LocataireResource($locataire),
            'message' => 'Locataire mis à jour avec succès'
        ]);
    }

    public function destroy($id)
    {
        $this->locataireService->delete($id);

        return response()->json(['success' => true, 'message' => 'Locataire supprimé avec succès']);
    }

    public function contrats($id)
    {
        $contrats = $this->locataireService->getContrats($id);

        return response()->json([
            'success' => true,
            'data' => $contrats,
            'message' => 'Contrats du locataire récupérés avec succès'
        ]);
    }

    public function byProfession($profession)
    {
        $locataires = $this->locataireService->getByProfession($profession);

        return response()->json([
            'success' => true,
            'data' => LocataireResource::collection($locataires)->response()->getData(true),
            'message' => "Locataires avec la profession {$profession} récupérés"
        ]);
    }
}
