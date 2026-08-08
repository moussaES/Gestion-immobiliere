<?php

namespace App\Http\Controllers;

use App\Http\Requests\StorePaiementRequest;
use App\Http\Requests\UpdatePaiementRequest;
use App\Http\Resources\PaiementResource;
use App\Services\PaiementService;
use Illuminate\Http\Request;

class PaiementController extends Controller
{
    protected PaiementService $paiementService;

    public function __construct(PaiementService $paiementService)
    {
        $this->paiementService = $paiementService;
    }

    public function index()
    {
        $paiements = $this->paiementService->getAllPaginated();

        return response()->json([
            'success' => true,
            'data' => PaiementResource::collection($paiements)->response()->getData(true),
            'message' => 'Liste des paiements récupérée avec succès'
        ]);
    }

    public function show($id)
    {
        $paiement = $this->paiementService->getById($id);

        return response()->json([
            'success' => true,
            'data' => new PaiementResource($paiement),
            'message' => 'Paiement récupéré avec succès'
        ]);
    }

    public function store(StorePaiementRequest $request)
    {
        $paiement = $this->paiementService->create($request->validated());

        return response()->json([
            'success' => true,
            'data' => new PaiementResource($paiement),
            'message' => 'Paiement créé avec succès et reçu généré'
        ], 201);
    }

    public function update(UpdatePaiementRequest $request, $id)
    {
        $paiement = $this->paiementService->update($id, $request->validated());

        return response()->json([
            'success' => true,
            'data' => new PaiementResource($paiement),
            'message' => 'Paiement mis à jour avec succès'
        ]);
    }

    public function valider(Request $request, $id)
    {
        $modePaiement = $request->input('mode_paiement');
        $paiement = $this->paiementService->validerPaiement($id, $modePaiement);

        return response()->json([
            'success' => true,
            'data' => new PaiementResource($paiement),
            'message' => 'Paiement validé avec succès'
        ]);
    }

    public function destroy($id)
    {
        $this->paiementService->delete($id);

        return response()->json(['success' => true, 'message' => 'Paiement supprimé avec succès']);
    }

    public function payes()
    {
        $paiements = $this->paiementService->getPayes();

        return response()->json([
            'success' => true,
            'data' => PaiementResource::collection($paiements)->response()->getData(true),
            'message' => 'Paiements payés récupérés avec succès'
        ]);
    }

    public function enAttente()
    {
        $paiements = $this->paiementService->getEnAttente();

        return response()->json([
            'success' => true,
            'data' => PaiementResource::collection($paiements)->response()->getData(true),
            'message' => 'Paiements en attente récupérés avec succès'
        ]);
    }

    public function byMode($mode)
    {
        $paiements = $this->paiementService->getByMode($mode);

        return response()->json([
            'success' => true,
            'data' => PaiementResource::collection($paiements)->response()->getData(true),
            'message' => "Paiements par {$mode} récupérés"
        ]);
    }

    public function byMois($mois)
    {
        $paiements = $this->paiementService->getByMois($mois);

        return response()->json([
            'success' => true,
            'data' => PaiementResource::collection($paiements)->response()->getData(true),
            'message' => "Paiements du mois {$mois} récupérés"
        ]);
    }

    public function statistiques()
    {
        $stats = $this->paiementService->getStatistiques();

        return response()->json([
            'success' => true,
            'data' => $stats,
            'message' => 'Statistiques des paiements récupérées'
        ]);
    }
}
