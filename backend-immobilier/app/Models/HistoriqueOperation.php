<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class HistoriqueOperation extends Model
{
    use HasFactory;

    protected $table = 'historique_operations';
    protected $primaryKey = 'id_historique';
    public $timestamps = false;

    protected $fillable = [
        'id_user',
        'type_operation',
        'entite',
        'id_entite',
        'description',
        'ancienne_valeur',
        'nouvelle_valeur',
    ];

    protected $casts = [
        'date_operation' => 'datetime',
    ];

    // Relations
    public function utilisateur()
    {
        return $this->belongsTo(Utilisateur::class, 'id_user', 'id_user');
    }

    // Scopes
    public function scopeByUser($query, $id_user)
    {
        return $query->where('id_user', $id_user);
    }

    public function scopeByType($query, $type)
    {
        return $query->where('type_operation', $type);
    }

    public function scopeByEntite($query, $entite)
    {
        return $query->where('entite', $entite);
    }

    public function scopeRecent($query, $jours = 7)
    {
        return $query->where('date_operation', '>=', now()->subDays($jours));
    }
}
