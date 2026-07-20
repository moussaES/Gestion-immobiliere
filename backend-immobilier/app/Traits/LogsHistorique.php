<?php

namespace App\Traits;

use App\Models\HistoriqueOperation;

trait LogsHistorique
{
    protected static function bootLogsHistorique()
    {
        static::created(function ($model) {
            self::logOperation($model, 'INSERT');
        });

        static::updated(function ($model) {
            self::logOperation($model, 'UPDATE');
        });

        static::deleted(function ($model) {
            self::logOperation($model, 'DELETE');
        });
    }

    protected static function logOperation($model, $type)
    {
        try {
            $entiteName = class_basename($model);
            $primaryKey = $model->getKeyName();
            
            // On essaie de récupérer un nom/référence pour la description
            $ref = $model->reference ?? $model->nom ?? $model->id ?? 'N/A';
            
            $descMap = [
                'INSERT' => "Création de {$entiteName} : {$ref}",
                'UPDATE' => "Modification de {$entiteName} : {$ref}",
                'DELETE' => "Suppression de {$entiteName} : {$ref}"
            ];

            HistoriqueOperation::create([
                'id_user' => request()->user()->id_user ?? 1, // par défaut 1 si non auth ou API sans state
                'type_operation' => $type,
                'entite' => $entiteName,
                'id_entite' => $model->{$primaryKey},
                'description' => $descMap[$type] ?? "Opération sur {$entiteName}",
            ]);
        } catch (\Exception $e) {
            // Silence si l'historisation échoue pour ne pas bloquer l'appli
            \Log::error("Erreur Historique : " . $e->getMessage());
        }
    }
}
