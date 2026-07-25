<?php

namespace App\Services;

use App\Models\Contrat;
use App\Models\Document;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Response;

class ContratService
{
    public function getAllPaginated(int $perPage = 15)
    {
        return Contrat::with(['bien', 'proprietaire', 'locataire', 'utilisateur', 'paiements'])->paginate($perPage);
    }

    public function getById(int $id)
    {
        return Contrat::with(['bien', 'proprietaire', 'locataire', 'utilisateur', 'paiements'])->findOrFail($id);
    }

    public function create(array $data)
    {
        $contrat = Contrat::create($data);
        
        if (isset($data['type_contrat']) && $data['type_contrat'] === 'LOCATAIRE' && isset($data['id_bien'])) {
            $bien = \App\Models\Bien::find($data['id_bien']);
            if ($bien && $bien->statut === 'LIBRE') {
                $bien->statut = 'OCCUPE';
                $bien->save();
            }
        }
        
        $this->generateAndSaveDocument($contrat->id_contrat);
        return $contrat;
    }

    public function update(int $id, array $data)
    {
        $contrat = Contrat::findOrFail($id);
        $oldStatut = $contrat->statut;
        
        $contrat->update($data);
        $newStatut = $contrat->statut;
        
        if ($contrat->type_contrat === 'LOCATAIRE' && $contrat->id_bien) {
            if ($oldStatut !== 'RESILIE' && $newStatut === 'RESILIE') {
                $bien = \App\Models\Bien::find($contrat->id_bien);
                if ($bien) {
                    $bien->statut = 'LIBRE';
                    $bien->save();
                }
            } elseif ($oldStatut !== 'ACTIF' && $newStatut === 'ACTIF') {
                $bien = \App\Models\Bien::find($contrat->id_bien);
                if ($bien) {
                    $bien->statut = 'OCCUPE';
                    $bien->save();
                }
            }
        }
        
        $this->generateAndSaveDocument($id);
        return $contrat;
    }

    public function delete(int $id)
    {
        $contrat = Contrat::findOrFail($id);
        return $contrat->delete();
    }

    public function getActifs(int $perPage = 15)
    {
        return Contrat::actif()->paginate($perPage);
    }

    public function getEnCours(int $perPage = 15)
    {
        return Contrat::enCours()->paginate($perPage);
    }

    public function getPaiements(int $id)
    {
        $contrat = Contrat::findOrFail($id);
        return $contrat->paiements()->get();
    }

    public function getByType(string $type, int $perPage = 15)
    {
        return Contrat::where('type_contrat', $type)->paginate($perPage);
    }

    public function generateAndSaveDocument(int $id)
    {
        try {
            $contrat = Contrat::with(['bien', 'proprietaire', 'locataire', 'utilisateur'])->findOrFail($id);
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

    public function getPdfData(int $id)
    {
        $contrat = Contrat::with(['bien', 'proprietaire', 'locataire', 'utilisateur', 'paiements'])->findOrFail($id);
        $pdf = Pdf::loadView('exports.contrat', compact('contrat'));
        return [
            'pdf' => $pdf,
            'filename' => "contrat_{$contrat->reference}.pdf"
        ];
    }

    public function getCsvData(int $id)
    {
        $contrat = Contrat::with(['bien', 'proprietaire', 'locataire', 'utilisateur'])->findOrFail($id);
        
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

        return [
            'csv' => $csvData,
            'filename' => "contrat_{$contrat->reference}.csv"
        ];
    }

    public function getAllPdfData()
    {
        $contrats = Contrat::with(['bien', 'proprietaire', 'locataire', 'utilisateur'])->get();
        $pdf = Pdf::loadView('exports.contrats_list', compact('contrats'))->setPaper('a4', 'landscape');
        return [
            'pdf' => $pdf,
            'filename' => "liste_contrats.pdf"
        ];
    }

    public function getAllCsvData()
    {
        $contrats = Contrat::with(['bien', 'proprietaire', 'locataire', 'utilisateur'])->get();
        
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

        return [
            'csv' => $csvData,
            'filename' => "liste_contrats.csv"
        ];
    }
}
