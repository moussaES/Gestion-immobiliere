<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Depense extends Model
{
    use \Illuminate\Database\Eloquent\Factories\HasFactory;

    protected $primaryKey = 'id_depense';

    protected $fillable = [
        'type_depense',
        'categorie',
        'description',
        'montant',
        'date_depense',
        'id_bien',
        'id_proprietaire',
        'id_prestataire',
        'justificatif'
    ];

    public function bien()
    {
        return $this->belongsTo(Bien::class, 'id_bien');
    }

    public function proprietaire()
    {
        return $this->belongsTo(Proprietaire::class, 'id_proprietaire');
    }

    public function prestataire()
    {
        return $this->belongsTo(Prestataire::class, 'id_prestataire');
    }
}
