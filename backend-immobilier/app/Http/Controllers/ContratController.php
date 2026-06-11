<?php

namespace App\Http\Controllers;

use App\Models\Contrat;
use Illuminate\Http\Request;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Support\Facades\Response;

class ContratController extends Controller
{
    /**
     * Afficher la liste de tous les contrats
     */
    public function index()
    {
        try {
            $contrats = Contrat::with('bien', 'proprietaire', 'locataire', 'utilisateur', 'paiements')->get();
            return response()->json([
                'success' => true,
                'data' => $contrats,
                'message' => 'Liste des contrats récupérée avec succès'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Afficher un contrat spécifique
     */
    public function show($id)
    {
        try {
            $contrat = Contrat::with('bien', 'proprietaire', 'locataire', 'utilisateur', 'paiements')->findOrFail($id);
            return response()->json([
                'success' => true,
                'data' => $contrat,
                'message' => 'Contrat récupéré avec succès'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Contrat non trouvé'
            ], 404);
        }
    }

    /**
     * Créer un nouveau contrat
     */
    public function store(Request $request)
    {
        try {
            $validated = $request->validate([
                'reference' => 'required|string|unique:contrats|max:50',
                'type_contrat' => 'required|in:LOCATAIRE,PROPRIETAIRE',
                'date_debut' => 'required|date',
                'date_fin' => 'required|date|after:date_debut',
                'montant' => 'required|numeric|min:0',
                'statut' => 'sometimes|in:ACTIF,RESILIE,ARCHIVE',
                'id_bien' => 'required|exists:biens,id_bien',
                'id_proprietaire' => 'required|exists:proprietaires,id_proprietaire',
                'id_locataire' => 'sometimes|nullable|exists:locataires,id_locataire',
                'id_user_createur' => 'sometimes|exists:utilisateurs,id_user',
                'notes' => 'sometimes|string',
            ]);

            $contrat = Contrat::create($validated);

            return response()->json([
                'success' => true,
                'data' => $contrat,
                'message' => 'Contrat créé avec succès'
            ], 201);
        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Erreur de validation',
                'errors' => $e->errors()
            ], 422);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Mettre à jour un contrat
     */
    public function update(Request $request, $id)
    {
        try {
            $contrat = Contrat::findOrFail($id);

            $validated = $request->validate([
                'reference' => 'sometimes|string|unique:contrats,reference,' . $id . ',id_contrat|max:50',
                'type_contrat' => 'sometimes|in:LOCATAIRE,PROPRIETAIRE',
                'date_debut' => 'sometimes|date',
                'date_fin' => 'sometimes|date|after:date_debut',
                'montant' => 'sometimes|numeric|min:0',
                'statut' => 'sometimes|in:ACTIF,RESILIE,ARCHIVE',
                'id_bien' => 'sometimes|exists:biens,id_bien',
                'id_proprietaire' => 'sometimes|exists:proprietaires,id_proprietaire',
                'id_locataire' => 'sometimes|nullable|exists:locataires,id_locataire',
                'notes' => 'sometimes|string',
                'date_annulation' => 'sometimes|nullable|date',
            ]);

            $contrat->update($validated);

            return response()->json([
                'success' => true,
                'data' => $contrat,
                'message' => 'Contrat mis à jour avec succès'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Supprimer un contrat
     */
    public function destroy($id)
    {
        try {
            $contrat = Contrat::findOrFail($id);
            $contrat->delete();

            return response()->json([
                'success' => true,
                'message' => 'Contrat supprimé avec succès'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Récupérer les contrats actifs
     */
    public function actifs()
    {
        try {
            $contrats = Contrat::actif()->get();
            return response()->json([
                'success' => true,
                'data' => $contrats,
                'message' => 'Contrats actifs récupérés avec succès'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Récupérer les contrats en cours
     */
    public function enCours()
    {
        try {
            $contrats = Contrat::enCours()->get();
            return response()->json([
                'success' => true,
                'data' => $contrats,
                'message' => 'Contrats en cours récupérés avec succès'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Récupérer les paiements d'un contrat
     */
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
            return response()->json([
                'success' => false,
                'message' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Récupérer les contrats par type
     */
    public function byType($type)
    {
        try {
            $contrats = Contrat::where('type_contrat', $type)->get();
            return response()->json([
                'success' => true,
                'data' => $contrats,
                'message' => "Contrats de type {$type} récupérés"
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Exporter un contrat spécifique en PDF
     */
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

    /**
     * Exporter un contrat spécifique en CSV
     */
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

            // Ajout du BOM UTF-8 pour Excel
            $csvData = "\xEF\xBB\xBF" . $csvData;

            return Response::make($csvData, 200, [
                'Content-Type' => 'text/csv; charset=UTF-8',
                'Content-Disposition' => 'attachment; filename="contrat_' . $contrat->reference . '.csv"',
            ]);
        } catch (\Exception $e) {
            return response()->json(['success' => false, 'message' => $e->getMessage()], 500);
        }
    }

    /**
     * Exporter tous les contrats en PDF
     */
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

    /**
     * Exporter tous les contrats en CSV
     */
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

            // Ajout du BOM UTF-8 pour Excel
            $csvData = "\xEF\xBB\xBF" . $csvData;

            return Response::make($csvData, 200, [
                'Content-Type' => 'text/csv; charset=UTF-8',
                'Content-Disposition' => 'attachment; filename="liste_contrats.csv"',
            ]);
        } catch (\Exception $e) {
            return response()->json(['success' => false, 'message' => $e->getMessage()], 500);
        }
    }
}
