<?php
require __DIR__.'/vendor/autoload.php';
$app = require_once __DIR__.'/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

$docs = App\Models\Document::all();
foreach($docs as $doc) {
  echo $doc->id_document . " - " . $doc->type_document . " - id_bien: " . $doc->id_bien . " - id_contrat: " . $doc->id_contrat . "\n";
}
