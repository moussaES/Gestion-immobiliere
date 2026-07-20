<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Traits\LogsHistorique;

class Travail extends Model
{
    use HasFactory, LogsHistorique;

    protected $table = 'travaux';
    protected $primaryKey = 'id_travail';

    protected $fillable = [
        'titre',
        'description',
        'montant',
        'date_intervention',
        'statut',
        'id_bien',
        'id_locataire',
        'id_proprietaire'
    ];

    protected $casts = [
        'date_intervention' => 'date',
        'montant' => 'decimal:2'
    ];

    public function bien()
    {
        return $this->belongsTo(Bien::class, 'id_bien', 'id_bien');
    }

    public function locataire()
    {
        return $this->belongsTo(Locataire::class, 'id_locataire', 'id_locataire');
    }

    public function proprietaire()
    {
        return $this->belongsTo(Proprietaire::class, 'id_proprietaire', 'id_proprietaire');
    }
}
