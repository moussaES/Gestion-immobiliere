<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Document extends Model
{
    use HasFactory;

    protected $table = 'documents';
    protected $primaryKey = 'id_document';
    public $timestamps = true;
    const CREATED_AT = 'date_creation';
    const UPDATED_AT = 'date_modification';

    protected $fillable = [
        'reference',
        'type',
        'nom_fichier',
        'chemin_fichier',
        'id_locataire',
        'id_proprietaire',
        'id_bien',
        'id_contrat',
        'id_paiement',
    ];

    public function locataire()
    {
        return $this->belongsTo(Locataire::class, 'id_locataire', 'id_locataire');
    }

    public function proprietaire()
    {
        return $this->belongsTo(Proprietaire::class, 'id_proprietaire', 'id_proprietaire');
    }

    public function bien()
    {
        return $this->belongsTo(Bien::class, 'id_bien', 'id_bien');
    }

    public function contrat()
    {
        return $this->belongsTo(Contrat::class, 'id_contrat', 'id_contrat');
    }

    public function paiement()
    {
        return $this->belongsTo(Paiement::class, 'id_paiement', 'id_paiement');
    }
}
