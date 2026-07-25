<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreContratRequest;
use App\Http\Requests\UpdateContratRequest;
use App\Http\Resources\ContratResource;
use App\Services\ContratService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Response;

class ContratController extends Controller
{
    protected ContratService $contratService;

    public function __construct(ContratService $contratService)
    {
        $this->contratService = $contratService;
    }

    public function index()
    {
        $contrats = $this->contratService->getAllPaginated();

        return response()->json([
            'success' => true,
            'data' => ContratResource::collection($contrats)->response()->getData(true),
            'message' => 'Liste des contrats récupérée avec succès'
        ]);
    }

    public function show($id)
    {
        $contrat = $this->contratService->getById($id);

        return response()->json([
            'success' => true,
            'data' => new ContratResource($contrat),
            'message' => 'Contrat récupéré avec succès'
        ]);
    }

    public function store(StoreContratRequest $request)
    {
        $contrat = $this->contratService->create($request->validated());

        return response()->json([
            'success' => true,
            'data' => new ContratResource($contrat),
            'message' => 'Contrat créé avec succès'
        ], 201);
    }

    public function update(UpdateContratRequest $request, $id)
    {
        $contrat = $this->contratService->update($id, $request->validated());

        return response()->json([
            'success' => true,
            'data' => new ContratResource($contrat),
            'message' => 'Contrat mis à jour avec succès'
        ]);
    }

    public function destroy($id)
    {
        $this->contratService->delete($id);

        return response()->json(['success' => true, 'message' => 'Contrat supprimé avec succès']);
    }

    public function actifs()
    {
        $contrats = $this->contratService->getActifs();

        return response()->json([
            'success' => true,
            'data' => ContratResource::collection($contrats)->response()->getData(true),
            'message' => 'Contrats actifs récupérés avec succès'
        ]);
    }

    public function enCours()
    {
        $contrats = $this->contratService->getEnCours();

        return response()->json([
            'success' => true,
            'data' => ContratResource::collection($contrats)->response()->getData(true),
            'message' => 'Contrats en cours récupérés avec succès'
        ]);
    }

    public function paiements($id)
    {
        $paiements = $this->contratService->getPaiements($id);

        return response()->json([
            'success' => true,
            'data' => $paiements,
            'message' => 'Paiements du contrat récupérés avec succès'
        ]);
    }

    public function byType($type)
    {
        $contrats = $this->contratService->getByType($type);

        return response()->json([
            'success' => true,
            'data' => ContratResource::collection($contrats)->response()->getData(true),
            'message' => "Contrats de type {$type} récupérés"
        ]);
    }

    public function exportPdf($id)
    {
        $data = $this->contratService->getPdfData($id);
        return $data['pdf']->download($data['filename']);
    }

    public function exportCsv($id)
    {
        $data = $this->contratService->getCsvData($id);
        return Response::make($data['csv'], 200, [
            'Content-Type' => 'text/csv; charset=UTF-8',
            'Content-Disposition' => 'attachment; filename="' . $data['filename'] . '"',
        ]);
    }

    public function exportAllPdf()
    {
        $data = $this->contratService->getAllPdfData();
        return $data['pdf']->download($data['filename']);
    }

    public function exportAllCsv()
    {
        $data = $this->contratService->getAllCsvData();
        return Response::make($data['csv'], 200, [
            'Content-Type' => 'text/csv; charset=UTF-8',
            'Content-Disposition' => 'attachment; filename="' . $data['filename'] . '"',
        ]);
    }
}
