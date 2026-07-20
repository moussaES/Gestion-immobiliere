<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Bien extends Model
{
    use HasFactory, \App\Traits\LogsHistorique;

    protected $table = 'biens';
    protected $primaryKey = 'id_bien';
    public $timestamps = true;
    const CREATED_AT = 'date_creation';
    const UPDATED_AT = 'date_modification';

    protected $fillable = [
        'reference',
        'type',
        'adresse',
        'ville',
        'code_postal',
        'surface',
        'nombre_pieces',
        'loyer_mensuel',
        'statut',
        'description',
        'id_proprietaire',
    ];

    protected $casts = [
        'surface' => 'decimal:2',
        'loyer_mensuel' => 'decimal:2',
    ];

    // Relations
    public function proprietaire()
    {
        return $this->belongsTo(Proprietaire::class, 'id_proprietaire', 'id_proprietaire');
    }

    public function contrats()
    {
        return $this->hasMany(Contrat::class, 'id_bien', 'id_bien');
    }

    // Scopes
    public function scopeOccupe($query)
    {
        return $query->where('statut', 'OCCUPE');
    }

    public function scopeLibre($query)
    {
        return $query->where('statut', 'LIBRE');
    }

    public function scopeReserve($query)
    {
        return $query->where('statut', 'RESERVE');
    }

    public function scopeByType($query, $type)
    {
        return $query->where('type', $type);
    }

    public function scopeByVille($query, $ville)
    {
        return $query->where('ville', $ville);
    }
}
