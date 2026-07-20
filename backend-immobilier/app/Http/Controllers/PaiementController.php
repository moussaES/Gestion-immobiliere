<?php

namespace App\Http\Controllers;

use App\Models\Paiement;
use App\Models\Document;
use App\Http\Requests\StorePaiementRequest;
use App\Http\Requests\UpdatePaiementRequest;
use App\Http\Resources\PaiementResource;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Support\Facades\Storage;
use Illuminate\Http\Request;

class PaiementController extends Controller
{
    public function index()
    {
        try {
            $paiements = Paiement::with('contrat.locataire', 'contrat.proprietaire', 'utilisateur')->paginate(15);
            return response()->json([
                'success' => true,
                'data' => PaiementResource::collection($paiements)->response()->getData(true),
                'message' => 'Liste des paiements récupérée avec succès'
            ]);
        } catch (\Exception $e) {
            return response()->json(['success' => false, 'message' => $e->getMessage()], 500);
        }
    }

    public function show($id)
    {
        try {
            $paiement = Paiement::with('contrat.locataire', 'contrat.proprietaire', 'utilisateur')->findOrFail($id);
            return response()->json([
                'success' => true,
                'data' => new PaiementResource($paiement),
                'message' => 'Paiement récupéré avec succès'
            ]);
        } catch (\Exception $e) {
            return response()->json(['success' => false, 'message' => 'Paiement non trouvé'], 404);
        }
    }

    public function store(StorePaiementRequest $request)
    {
        try {
            $validated = $request->validated();
            $paiement = Paiement::create($validated);

            try {
                $paiement->load('contrat.bien.proprietaire', 'contrat.locataire');
                $contrat = $paiement->contrat;
                $bien = $contrat ? $contrat->bien : null;
                $proprietaire = $bien ? $bien->proprietaire : null;
                $locataire = $contrat ? $contrat->locataire : null;

                $documentData = new Document([
                    'reference' => 'DOC-' . time() . '-' . rand(1000, 9999),
                    'type' => 'RECU_PAIEMENT',
                    'id_paiement' => $paiement->id_paiement,
                    'id_contrat' => $contrat ? $contrat->id_contrat : null,
                    'id_bien' => $bien ? $bien->id_bien : null,
                    'id_proprietaire' => $proprietaire ? $proprietaire->id_proprietaire : null,
                    'id_locataire' => $locataire ? $locataire->id_locataire : null,
                    'chemin_fichier' => '',
                    'nom_fichier' => 'Recu_Paiement_' . $paiement->reference . '.pdf',
                ]);

                $pdf = Pdf::loadView('pdfs.recu_paiement', [
                    'paiement' => $paiement,
                    'document' => $documentData,
                    'contrat' => $contrat,
                    'bien' => $bien,
                    'proprietaire' => $proprietaire,
                    'locataire' => $locataire,
                ]);

                $fileName = 'documents/' . $documentData->reference . '.pdf';
                Storage::disk('public')->put($fileName, $pdf->output());

                $documentData->chemin_fichier = $fileName;
                $documentData->save();
            } catch (\Exception $ex) {
                \Illuminate\Support\Facades\Log::error('Erreur génération PDF : ' . $ex->getMessage());
            }

            return response()->json([
                'success' => true,
                'data' => new PaiementResource($paiement),
                'message' => 'Paiement créé avec succès et reçu généré'
            ], 201);
        } catch (\Exception $e) {
            return response()->json(['success' => false, 'message' => $e->getMessage()], 500);
        }
    }

    public function update(UpdatePaiementRequest $request, $id)
    {
        try {
            $paiement = Paiement::findOrFail($id);
            $validated = $request->validated();
            $paiement->update($validated);

            return response()->json([
                'success' => true,
                'data' => new PaiementResource($paiement),
                'message' => 'Paiement mis à jour avec succès'
            ]);
        } catch (\Exception $e) {
            return response()->json(['success' => false, 'message' => $e->getMessage()], 500);
        }
    }

    public function destroy($id)
    {
        try {
            $paiement = Paiement::findOrFail($id);
            $paiement->delete();

            return response()->json(['success' => true, 'message' => 'Paiement supprimé avec succès']);
        } catch (\Exception $e) {
            return response()->json(['success' => false, 'message' => $e->getMessage()], 500);
        }
    }

    public function payes()
    {
        try {
            $paiements = Paiement::paye()->paginate(15);
            return response()->json([
                'success' => true,
                'data' => PaiementResource::collection($paiements)->response()->getData(true),
                'message' => 'Paiements payés récupérés avec succès'
            ]);
        } catch (\Exception $e) {
            return response()->json(['success' => false, 'message' => $e->getMessage()], 500);
        }
    }

    public function enAttente()
    {
        try {
            $paiements = Paiement::enAttente()->paginate(15);
            return response()->json([
                'success' => true,
                'data' => PaiementResource::collection($paiements)->response()->getData(true),
                'message' => 'Paiements en attente récupérés avec succès'
            ]);
        } catch (\Exception $e) {
            return response()->json(['success' => false, 'message' => $e->getMessage()], 500);
        }
    }

    public function byMode($mode)
    {
        try {
            $paiements = Paiement::byMode($mode)->paginate(15);
            return response()->json([
                'success' => true,
                'data' => PaiementResource::collection($paiements)->response()->getData(true),
                'message' => "Paiements par {$mode} récupérés"
            ]);
        } catch (\Exception $e) {
            return response()->json(['success' => false, 'message' => $e->getMessage()], 500);
        }
    }

    public function byMois($mois)
    {
        try {
            $paiements = Paiement::byMois($mois)->paginate(15);
            return response()->json([
                'success' => true,
                'data' => PaiementResource::collection($paiements)->response()->getData(true),
                'message' => "Paiements du mois {$mois} récupérés"
            ]);
        } catch (\Exception $e) {
            return response()->json(['success' => false, 'message' => $e->getMessage()], 500);
        }
    }

    public function statistiques()
    {
        try {
            $stats = [
                'total_paiements' => Paiement::sum('montant'),
                'nombre_paiements' => Paiement::count(),
                'paiements_payes' => Paiement::paye()->sum('montant'),
                'paiements_en_attente' => Paiement::enAttente()->sum('montant'),
                'paiements_partiels' => Paiement::partiel()->sum('montant'),
            ];

            return response()->json([
                'success' => true,
                'data' => $stats,
                'message' => 'Statistiques des paiements récupérées'
            ]);
        } catch (\Exception $e) {
            return response()->json(['success' => false, 'message' => $e->getMessage()], 500);
        }
    }
}
