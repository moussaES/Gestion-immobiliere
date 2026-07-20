<?php

namespace App\Http\Controllers;

use App\Models\Contrat;
use App\Models\Document;
use App\Http\Requests\StoreContratRequest;
use App\Http\Requests\UpdateContratRequest;
use App\Http\Resources\ContratResource;
use Illuminate\Http\Request;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Support\Facades\Response;
use Illuminate\Support\Facades\Storage;

class ContratController extends Controller
{
    public function index()
    {
        try {
            $contrats = Contrat::with('bien', 'proprietaire', 'locataire', 'utilisateur', 'paiements')->paginate(15);
            return response()->json([
                'success' => true,
                'data' => ContratResource::collection($contrats)->response()->getData(true),
                'message' => 'Liste des contrats récupérée avec succès'
            ]);
        } catch (\Exception $e) {
            return response()->json(['success' => false, 'message' => $e->getMessage()], 500);
        }
    }

    public function show($id)
    {
        try {
            $contrat = Contrat::with('bien', 'proprietaire', 'locataire', 'utilisateur', 'paiements')->findOrFail($id);
            return response()->json([
                'success' => true,
                'data' => new ContratResource($contrat),
                'message' => 'Contrat récupéré avec succès'
            ]);
        } catch (\Exception $e) {
            return response()->json(['success' => false, 'message' => 'Contrat non trouvé'], 404);
        }
    }

    public function store(StoreContratRequest $request)
    {
        try {
            $validated = $request->validated();
            $contrat = Contrat::create($validated);
            
            $contratWithRelations = Contrat::with('bien', 'proprietaire', 'locataire', 'utilisateur')->find($contrat->id_contrat);
            $this->generateAndSaveDocument($contratWithRelations);

            return response()->json([
                'success' => true,
                'data' => new ContratResource($contrat),
                'message' => 'Contrat créé avec succès'
            ], 201);
        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Erreur de validation',
                'errors' => $e->errors()
            ], 422);
        } catch (\Exception $e) {
            \Log::error('Erreur dans ContratController@store : ' . $e->getMessage());
            return response()->json(['success' => false, 'message' => $e->getMessage()], 500);
        }
    }

    public function update(UpdateContratRequest $request, $id)
    {
        try {
            $contrat = Contrat::findOrFail($id);
            $validated = $request->validated();
            $contrat->update($validated);

            $contratWithRelations = Contrat::with('bien', 'proprietaire', 'locataire', 'utilisateur')->find($id);
            $this->generateAndSaveDocument($contratWithRelations);

            return response()->json([
                'success' => true,
                'data' => new ContratResource($contrat),
                'message' => 'Contrat mis à jour avec succès'
            ]);
        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Erreur de validation',
                'errors' => $e->errors()
            ], 422);
        } catch (\Exception $e) {
            \Log::error('Erreur dans ContratController@update : ' . $e->getMessage());
            return response()->json(['success' => false, 'message' => $e->getMessage()], 500);
        }
    }

    public function destroy($id)
    {
        try {
            $contrat = Contrat::findOrFail($id);
            $contrat->delete();

            return response()->json(['success' => true, 'message' => 'Contrat supprimé avec succès']);
        } catch (\Exception $e) {
            return response()->json(['success' => false, 'message' => $e->getMessage()], 500);
        }
    }

    public function actifs()
    {
        try {
            $contrats = Contrat::actif()->paginate(15);
            return response()->json([
                'success' => true,
                'data' => ContratResource::collection($contrats)->response()->getData(true),
                'message' => 'Contrats actifs récupérés avec succès'
            ]);
        } catch (\Exception $e) {
            return response()->json(['success' => false, 'message' => $e->getMessage()], 500);
        }
    }

    public function enCours()
    {
        try {
            $contrats = Contrat::enCours()->paginate(15);
            return response()->json([
                'success' => true,
                'data' => ContratResource::collection($contrats)->response()->getData(true),
                'message' => 'Contrats en cours récupérés avec succès'
            ]);
        } catch (\Exception $e) {
            return response()->json(['success' => false, 'message' => $e->getMessage()], 500);
        }
    }

    public function paiements($id)
    {
        try {
            $contrat = Contrat::findOrFail($id);
            $paiements = $contrat->paiements()->get();

            return response()->json([
                'success' => true,
                'data' => $paiements,
                'message' => 'Paiements du contrat récupérés avec succès'
            ]);
        } catch (\Exception $e) {
            return response()->json(['success' => false, 'message' => $e->getMessage()], 500);
        }
    }

    public function byType($type)
    {
        try {
            $contrats = Contrat::where('type_contrat', $type)->paginate(15);
            return response()->json([
                'success' => true,
                'data' => ContratResource::collection($contrats)->response()->getData(true),
                'message' => "Contrats de type {$type} récupérés"
            ]);
        } catch (\Exception $e) {
            return response()->json(['success' => false, 'message' => $e->getMessage()], 500);
        }
    }

    public function exportPdf($id)
    {
        try {
            $contrat = Contrat::with('bien', 'proprietaire', 'locataire', 'utilisateur', 'paiements')->findOrFail($id);
            $pdf = Pdf::loadView('exports.contrat', compact('contrat'));
            return $pdf->download("contrat_{$contrat->reference}.pdf");
        } catch (\Exception $e) {
            return response()->json(['success' => false, 'message' => $e->getMessage()], 500);
        }
    }

    public function exportCsv($id)
    {
        try {
            $contrat = Contrat::with('bien', 'proprietaire', 'locataire', 'utilisateur')->findOrFail($id);
            
            $csvHeader = ["Référence", "Type", "Date Début", "Date Fin", "Montant", "Commission (10%)", "Part Propriétaire (90%)", "Statut", "Locataire", "Propriétaire", "Bien"];
            $csvRow = [
                $contrat->reference,
                $contrat->type_contrat,
                $contrat->date_debut ? $contrat->date_debut->format('Y-m-d') : '',
                $contrat->date_fin ? $contrat->date_fin->format('Y-m-d') : '',
                $contrat->montant,
                $contrat->commission_agence,
                $contrat->montant_proprietaire,
                $contrat->statut,
                $contrat->locataire ? $contrat->locataire->nom . ' ' . $contrat->locataire->prenom : 'N/A',
                $contrat->proprietaire ? $contrat->proprietaire->nom . ' ' . $contrat->proprietaire->prenom : 'N/A',
                $contrat->bien ? $contrat->bien->nom_bien : 'N/A'
            ];

            $csvData = implode(';', $csvHeader) . "\n" . implode(';', $csvRow) . "\n";
            $csvData = "\xEF\xBB\xBF" . $csvData;

            return Response::make($csvData, 200, [
                'Content-Type' => 'text/csv; charset=UTF-8',
                'Content-Disposition' => 'attachment; filename="contrat_' . $contrat->reference . '.csv"',
            ]);
        } catch (\Exception $e) {
            return response()->json(['success' => false, 'message' => $e->getMessage()], 500);
        }
    }

    public function exportAllPdf()
    {
        try {
            $contrats = Contrat::with('bien', 'proprietaire', 'locataire', 'utilisateur')->get();
            $pdf = Pdf::loadView('exports.contrats_list', compact('contrats'))->setPaper('a4', 'landscape');
            return $pdf->download("liste_contrats.pdf");
        } catch (\Exception $e) {
            return response()->json(['success' => false, 'message' => $e->getMessage()], 500);
        }
    }

    public function exportAllCsv()
    {
        try {
            $contrats = Contrat::with('bien', 'proprietaire', 'locataire', 'utilisateur')->get();
            
            $csvHeader = ["Référence", "Type", "Date Début", "Date Fin", "Montant", "Commission (10%)", "Part Propriétaire (90%)", "Statut", "Locataire", "Propriétaire", "Bien"];
            $csvData = implode(';', $csvHeader) . "\n";
            
            foreach ($contrats as $contrat) {
                $csvRow = [
                    $contrat->reference,
                    $contrat->type_contrat,
                    $contrat->date_debut ? $contrat->date_debut->format('Y-m-d') : '',
                    $contrat->date_fin ? $contrat->date_fin->format('Y-m-d') : '',
                    $contrat->montant,
                    $contrat->commission_agence,
                    $contrat->montant_proprietaire,
                    $contrat->statut,
                    $contrat->locataire ? $contrat->locataire->nom . ' ' . $contrat->locataire->prenom : 'N/A',
                    $contrat->proprietaire ? $contrat->proprietaire->nom . ' ' . $contrat->proprietaire->prenom : 'N/A',
                    $contrat->bien ? $contrat->bien->nom_bien : 'N/A'
                ];
                $csvData .= implode(';', $csvRow) . "\n";
            }

            $csvData = "\xEF\xBB\xBF" . $csvData;

            return Response::make($csvData, 200, [
                'Content-Type' => 'text/csv; charset=UTF-8',
                'Content-Disposition' => 'attachment; filename="liste_contrats.csv"',
            ]);
        } catch (\Exception $e) {
            return response()->json(['success' => false, 'message' => $e->getMessage()], 500);
        }
    }

    private function generateAndSaveDocument(Contrat $contrat)
    {
        try {
            $pdf = Pdf::loadView('exports.contrat', compact('contrat'));
            $filename = "contrat_{$contrat->reference}.pdf";
            $path = "documents/contrats/{$filename}";
            
            Storage::disk('public')->put($path, $pdf->output());

            Document::updateOrCreate(
                ['id_contrat' => $contrat->id_contrat],
                [
                    'reference' => 'DOC-' . $contrat->reference,
                    'type' => 'CONTRAT',
                    'nom_fichier' => $filename,
                    'chemin_fichier' => $path,
                    'id_bien' => $contrat->id_bien,
                    'id_proprietaire' => $contrat->id_proprietaire,
                    'id_locataire' => $contrat->id_locataire,
                ]
            );
        } catch (\Exception $e) {
            \Illuminate\Support\Facades\Log::error("Erreur de génération de document: " . $e->getMessage());
        }
    }
}
