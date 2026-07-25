<?php

namespace App\Services;

use App\Models\Proprietaire;

class ProprietaireService
{
    /**
     * Récupère la liste paginée des propriétaires avec leurs relations.
     */
    public function getAllPaginated(int $perPage = 15)
    {
        return Proprietaire::with(['biens', 'contrats'])
            ->withCount('biens')
            ->paginate($perPage);
    }

    /**
     * Récupère un propriétaire par son ID avec ses relations.
     */
    public function getById(int $id)
    {
        return Proprietaire::with(['biens', 'contrats'])->findOrFail($id);
    }

    /**
     * Crée un nouveau propriétaire.
     */
    public function create(array $data)
    {
        return Proprietaire::create($data);
    }

    /**
     * Met à jour un propriétaire existant.
     */
    public function update(int $id, array $data)
    {
        $proprietaire = Proprietaire::findOrFail($id);
        $proprietaire->update($data);
        return $proprietaire;
    }

    /**
     * Supprime un propriétaire.
     */
    public function delete(int $id)
    {
        $proprietaire = Proprietaire::findOrFail($id);
        return $proprietaire->delete();
    }

    /**
     * Récupère les biens d'un propriétaire.
     */
    public function getBiens(int $id)
    {
        $proprietaire = Proprietaire::findOrFail($id);
        return $proprietaire->biens()->get();
    }

    /**
     * Récupère les contrats d'un propriétaire.
     */
    public function getContrats(int $id)
    {
        $proprietaire = Proprietaire::findOrFail($id);
        return $proprietaire->contrats()->get();
    }
}
