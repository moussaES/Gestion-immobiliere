<?php

namespace Tests\Unit;

use Tests\TestCase;
use App\Models\Proprietaire;
use App\Services\ProprietaireService;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Database\Eloquent\ModelNotFoundException;

class ProprietaireServiceTest extends TestCase
{
    use RefreshDatabase;

    protected ProprietaireService $proprietaireService;

    protected function setUp(): void
    {
        parent::setUp();
        $this->proprietaireService = new ProprietaireService();
    }

    public function test_can_create_proprietaire()
    {
        $data = [
            'nom' => 'Dupont',
            'prenom' => 'Jean',
            'email' => 'jean.dupont@example.com',
            'telephone' => '0123456789',
            'adresse' => '10 rue de Paris',
            'cni' => '1234567890123'
        ];

        $proprietaire = $this->proprietaireService->create($data);

        $this->assertInstanceOf(Proprietaire::class, $proprietaire);
        $this->assertEquals('Dupont', $proprietaire->nom);
        $this->assertDatabaseHas('proprietaires', ['email' => 'jean.dupont@example.com']);
    }

    public function test_can_get_proprietaire_by_id()
    {
        $proprietaire = Proprietaire::factory()->create();

        $found = $this->proprietaireService->getById($proprietaire->id_proprietaire);

        $this->assertEquals($proprietaire->id_proprietaire, $found->id_proprietaire);
    }

    public function test_throws_exception_if_proprietaire_not_found()
    {
        $this->expectException(ModelNotFoundException::class);
        $this->proprietaireService->getById(999);
    }

    public function test_can_update_proprietaire()
    {
        $proprietaire = Proprietaire::factory()->create(['nom' => 'Old Name']);

        $updated = $this->proprietaireService->update($proprietaire->id_proprietaire, ['nom' => 'New Name']);

        $this->assertEquals('New Name', $updated->nom);
        $this->assertDatabaseHas('proprietaires', ['id_proprietaire' => $proprietaire->id_proprietaire, 'nom' => 'New Name']);
    }

    public function test_can_delete_proprietaire()
    {
        $proprietaire = Proprietaire::factory()->create();

        $this->proprietaireService->delete($proprietaire->id_proprietaire);

        $this->assertDatabaseMissing('proprietaires', ['id_proprietaire' => $proprietaire->id_proprietaire]);
    }
}
