<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <title>Contrat de {{ ucfirst(strtolower($contrat->type_contrat)) }}</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            font-size: 13px;
            line-height: 1.5;
            color: #333;
            margin: 20px;
        }
        .header {
            text-align: center;
            margin-bottom: 20px;
        }
        .header h1 {
            font-size: 22px;
            text-decoration: underline;
            margin-bottom: 5px;
            margin-top: 10px;
        }
        .header h2 {
            font-size: 18px;
            margin-bottom: 0;
        }
        .header h3 {
            font-size: 12px;
            margin-top: 5px;
            font-weight: normal;
        }
        .header-logo {
            font-size: 24px;
            font-weight: bold;
        }
        .section {
            margin-bottom: 15px;
        }
        .section h4 {
            font-size: 15px;
            text-decoration: underline;
            margin-bottom: 10px;
        }
        .article {
            margin-bottom: 10px;
            text-align: justify;
        }
        .article-title {
            font-weight: bold;
            text-transform: uppercase;
        }
        .signatures {
            margin-top: 40px;
            width: 100%;
        }
        .signatures td {
            width: 50%;
            text-align: center;
            vertical-align: top;
        }
        .amount-box {
            border: 1px solid #333;
            padding: 10px;
            margin-top: 15px;
            background-color: #f9f9f9;
        }
        .amount-box p {
            margin: 5px 0;
        }
        ul {
            margin-top: 5px;
            margin-bottom: 5px;
        }
    </style>
</head>
<body>

    <div class="header">
        <?php
            $logoPath = 'C:/xampp/htdocs/Gestion-immobiliere/frontend/src/assets/logo.jpeg';
            if (file_exists($logoPath)) {
                $logoData = base64_encode(file_get_contents($logoPath));
                $logoSrc = 'data:image/jpeg;base64,' . $logoData;
                echo '<img src="' . $logoSrc . '" alt="Logo" style="height: 60px;">';
            }
        ?>
        <h2>AGENCE IMMOBILIERE LES ETOILES DU SINE</h2>
        <p style="margin:2px; font-size:11px;">Tivaoune peulh citée apix TEL / 782021500 / 752588820</p>
        <h3>ACHAT-VENTE -LOCATION -GERENCE DE MAISON -BATIMENT-TERRASSEMENT -VIABILISATION -BTP</h3>
        <h1>CONTRAT DE {{ strtoupper($contrat->type_contrat) }}</h1>
    </div>

    <div class="section">
        <p style="text-decoration: underline; font-weight: bold;">Entre les soussignés :</p>
        <p><strong>L'agence immobilière LES ETOILES DU SINE</strong> particulièrement par le directeur général Monsieur MOUSSA FAYE titulaire du ninea 006546769SS dénommé @if($contrat->type_contrat === 'LOCATAIRE') Bailleur @else Mandataire @endif d'une part,</p>
        
        @if($contrat->type_contrat === 'LOCATAIRE')
            <p><strong>{{ $contrat->locataire->prenom ?? '' }} {{ $contrat->locataire->nom ?? '' }}</strong>, 
            @if(isset($contrat->locataire->profession)) profession: {{ $contrat->locataire->profession }}, @endif
            tutélaire de la carte d'identité N° {{ $contrat->locataire->cni ?? '...................' }} dénommé PRENEUR (locataire).</p>
        @else
            <p><strong>{{ $contrat->proprietaire->prenom ?? '' }} {{ $contrat->proprietaire->nom ?? '' }}</strong>, 
            demeurant à {{ $contrat->proprietaire->adresse ?? '...................' }}, 
            titulaire de la carte d'identité N° {{ $contrat->proprietaire->cni ?? '...................' }} dénommé PROPRIETAIRE (mandant).</p>
        @endif
        <p>D'autre part</p>
        <p style="text-decoration: underline; font-weight: bold;">Il a été convenu ce qui suit :</p>
    </div>

    @if($contrat->type_contrat === 'LOCATAIRE')
        <div class="section">
            <p><strong>L'Agence immobilière les étoiles du sine</strong> donne en location à <strong>{{ $contrat->locataire->prenom ?? '' }} {{ $contrat->locataire->nom ?? '' }}</strong> qui l'accepte ; le bien situé à {{ $contrat->bien->adresse ?? '...................' }} ({{ $contrat->bien->nom_bien ?? '...................' }}). À l'entente de l'exécution du contrat, le preneur s'acquitte des montants convenus représentant la caution et la commission non remboursable.</p>
            
            <p style="text-decoration: underline; font-weight: bold; text-align:center;">DUREE DU CONTRAT</p>
            <p>Le contrat est valable pour une durée de 1 an renouvelable. Le présent bail est fait d'une durée déterminée qui commence à courir à compter du <strong>{{ $contrat->date_debut ? $contrat->date_debut->format('d/m/Y') : '...................' }}</strong> pour prendre fin le <strong>{{ $contrat->date_fin ? $contrat->date_fin->format('d/m/Y') : '...................' }}</strong>.</p>
            
            <p style="text-decoration: underline; font-weight: bold; text-align:center;">CHARGES ET CONDITIONS</p>
            
            <div class="article">
                <span class="article-title">Article 1 :</span> Le bailleur est tenu de délivrer au locataire, les locaux loués en bon état d'usage et de réparation.
            </div>
            <div class="article">
                <span class="article-title">Article 2 :</span> Le bailleur peut venir visiter les lieux au maximum deux fois par mois sans avertir le locataire.
            </div>
            <div class="article">
                <span class="article-title">Article 3 - Loyer :</span> Le loyer mensuel est fixé à la somme de <strong>{{ number_format($contrat->montant, 0, ',', ' ') }} FCFA</strong>, payable mensuellement et d'avance, entre le 1er et le 5 de chaque mois. En cas de retard supérieur à dix (10) jours, une pénalité équivalente à 10% du montant du loyer sera appliquée.
            </div>
            <div class="article">
                <span class="article-title">Article 4 - Dépôt de garantie :</span> À la signature du présent contrat, le Locataire verse un dépôt de garantie. Il sera restitué à la fin du bail, après état des lieux de sortie et déduction des éventuelles réparations locatives ou sommes dues. Et une commission non remboursable.
            </div>
            <div class="article">
                <span class="article-title">Article 5 - Charges :</span> Les consommations d'eau, d'électricité, de téléphone, d'internet et les frais d'ordures ménagères sont à la charge du Locataire. Le Locataire prend à sa charge l'entretien courant (ampoules, serrures, vitres, peinture d'usage). Le Bailleur reste tenu des grosses réparations (murs, toiture, installations principales).
            </div>
            <div class="article">
                <span class="article-title">Article 6 - Obligations du locataire :</span> Le Locataire s'engage à :
                <ul>
                    <li>Payer régulièrement le loyer et les charges.</li>
                    <li>User paisiblement du logement et respecter la tranquillité du voisinage (toute pollution sonore ou autre est formellement interdit).</li>
                    <li>Ne pas transformer les lieux ni sous-louer sans accord écrit du Bailleur.</li>
                    <li>Réparer ou rembourser les éventuelles dégradations.</li>
                </ul>
            </div>
            <div class="article">
                <span class="article-title">Article 7 - Visites du bailleur :</span> Le Bailleur ou son mandataire pourra visiter le logement avec l'accord préalable du Locataire et après un préavis minimum de 48 heures, sauf urgence.
            </div>
            <div class="article">
                <span class="article-title">Article 8 - État des lieux :</span> Un état des lieux contradictoire sera établi à l'entrée et à la sortie. Les dégradations imputables au Locataire seront réparées à ses frais ou déduites du dépôt de garantie.
            </div>
            <div class="article">
                <span class="article-title">Article 9 - Résiliation :</span> Le Locataire peut résilier le contrat à tout moment, moyennant un préavis d'un (01) mois. Le Bailleur peut pour motifs légaux. Toute expulsion ne peut être effectuée que par décision de justice.
            </div>
            <div class="article">
                <span class="article-title">Article 10 - Litiges :</span> Tout litige relatif au présent contrat sera porté devant le tribunal compétent du ressort où est situé l'immeuble.
            </div>
            <div class="article">
                <span class="article-title">Article 11 - Dispositions finales :</span> Le présent contrat est établi en deux exemplaires originaux. Il ne peut être modifié que par avenant écrit et signé par les deux parties.
            </div>
        </div>
    @else
        <div class="section">
            <p><strong>{{ $contrat->proprietaire->prenom ?? '' }} {{ $contrat->proprietaire->nom ?? '' }}</strong> donne par le présent contrat à l'agence immobilière <strong>les étoiles du sine</strong> et qu'accepte de gérer sa villa/bien située à <strong>{{ $contrat->bien->adresse ?? '...................' }}</strong> ({{ $contrat->bien->nom_bien ?? '...................' }}) telle que décrit dans l'état des lieux ci-joint. Laquelle villa est conçue pour HABITATION dans son état actuel au moment de la remise.</p>
            <p>L'agent prendra une commission de 10% sur tous les loyers encaissés chaque fin du mois. En cas de travaux l'agent doit aviser le propriétaire pour qu'il les exécute lui-même.</p>
            <p>Ce contrat est renouvelable il commence à partir de la signature des présents pour une durée de 1 an. En cas du non respect des dispositions ci-dessous énumérées, et sans aucune solution possible le contrat prendra fin après un préavis de deux (2) mois notifié par l'une ou par l'autre partie par simple courrier avec accusé de réception. Par ailleurs le contrat peut être résilié sur demande de l'une partie, âpres (02) mois de préavis.</p>
        </div>
    @endif

    <div class="section">
        <div class="amount-box">
            <p><strong>Montant Total (Loyer) :</strong> {{ number_format($contrat->montant, 0, ',', ' ') }} FCFA</p>
            <hr>
            <p><strong>Commission de l'Agence (10%) :</strong> {{ number_format($contrat->commission_agence, 0, ',', ' ') }} FCFA</p>
            <p><strong>Part du Propriétaire (90%) :</strong> {{ number_format($contrat->montant_proprietaire, 0, ',', ' ') }} FCFA</p>
        </div>
    </div>

    <p style="text-align: right; margin-top:20px;">Fait à <strong>Tivaoune Peulh</strong>, le <strong>{{ date('d/m/Y') }}</strong></p>

    <table class="signatures">
        <tr>
            <td>
                <strong>LE BAILLEUR / SON MANDATAIRE</strong><br><br><br><br><br>
                <em>(Signature et Cachet)</em>
            </td>
            <td>
                @if($contrat->type_contrat === 'LOCATAIRE')
                    <strong>LE LOCATAIRE</strong>
                @else
                    <strong>LE PROPRIÉTAIRE</strong>
                @endif
                <br><br><br><br><br>
                <em>(Signature)</em>
            </td>
        </tr>
    </table>

</body>
</html>
