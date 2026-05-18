-- MariaDB dump 10.19  Distrib 10.4.32-MariaDB, for Win64 (AMD64)
--
-- Host: localhost    Database: etoiles_du_sine
-- ------------------------------------------------------
-- Server version	10.4.32-MariaDB

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `biens`
--

DROP TABLE IF EXISTS `biens`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `biens` (
  `id_bien` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `reference` varchar(50) NOT NULL,
  `type` enum('MAISON','APPARTEMENT','IMMEUBLE','TERRAIN','STUDIO') NOT NULL,
  `adresse` varchar(255) NOT NULL,
  `ville` varchar(100) NOT NULL,
  `code_postal` varchar(10) DEFAULT NULL,
  `surface` decimal(10,2) DEFAULT NULL,
  `nombre_pieces` int(11) DEFAULT NULL,
  `loyer_mensuel` decimal(12,2) NOT NULL,
  `statut` enum('OCCUPE','LIBRE','RESERVE') NOT NULL DEFAULT 'LIBRE',
  `description` longtext DEFAULT NULL,
  `id_proprietaire` bigint(20) unsigned NOT NULL,
  `date_creation` timestamp NOT NULL DEFAULT current_timestamp(),
  `date_modification` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id_bien`),
  UNIQUE KEY `biens_reference_unique` (`reference`),
  KEY `biens_reference_index` (`reference`),
  KEY `biens_type_index` (`type`),
  KEY `biens_statut_index` (`statut`),
  KEY `biens_ville_index` (`ville`),
  KEY `biens_id_proprietaire_index` (`id_proprietaire`),
  FULLTEXT KEY `biens_reference_adresse_ville_fulltext` (`reference`,`adresse`,`ville`),
  CONSTRAINT `biens_id_proprietaire_foreign` FOREIGN KEY (`id_proprietaire`) REFERENCES `proprietaires` (`id_proprietaire`) ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `biens`
--

LOCK TABLES `biens` WRITE;
/*!40000 ALTER TABLE `biens` DISABLE KEYS */;
INSERT INTO `biens` VALUES (1,'BIEN-001','MAISON','12 Rue de Paris','Paris','75001',85.50,4,1200.00,'OCCUPE','Belle maison de ville avec jardin',1,'2026-05-18 11:42:08','2026-05-18 11:42:08'),(2,'BIEN-002','APPARTEMENT','Avenue Cheikh Anta Diop','Dakar','10000',65.00,3,450000.00,'LIBRE','Appartement moderne en centre-ville',2,'2026-05-18 11:42:08','2026-05-18 11:42:08');
/*!40000 ALTER TABLE `biens` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `cache`
--

DROP TABLE IF EXISTS `cache`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `cache` (
  `key` varchar(255) NOT NULL,
  `value` mediumtext NOT NULL,
  `expiration` int(11) NOT NULL,
  PRIMARY KEY (`key`),
  KEY `cache_expiration_index` (`expiration`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cache`
--

LOCK TABLES `cache` WRITE;
/*!40000 ALTER TABLE `cache` DISABLE KEYS */;
/*!40000 ALTER TABLE `cache` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `cache_locks`
--

DROP TABLE IF EXISTS `cache_locks`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `cache_locks` (
  `key` varchar(255) NOT NULL,
  `owner` varchar(255) NOT NULL,
  `expiration` int(11) NOT NULL,
  PRIMARY KEY (`key`),
  KEY `cache_locks_expiration_index` (`expiration`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cache_locks`
--

LOCK TABLES `cache_locks` WRITE;
/*!40000 ALTER TABLE `cache_locks` DISABLE KEYS */;
/*!40000 ALTER TABLE `cache_locks` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `contrats`
--

DROP TABLE IF EXISTS `contrats`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `contrats` (
  `id_contrat` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `reference` varchar(50) NOT NULL,
  `type_contrat` enum('LOCATAIRE','PROPRIETAIRE') NOT NULL,
  `date_debut` date NOT NULL,
  `date_fin` date NOT NULL,
  `montant` decimal(12,2) NOT NULL,
  `statut` enum('ACTIF','RESILIE','ARCHIVE') NOT NULL DEFAULT 'ACTIF',
  `id_bien` bigint(20) unsigned NOT NULL,
  `id_proprietaire` bigint(20) unsigned NOT NULL,
  `id_locataire` bigint(20) unsigned DEFAULT NULL,
  `id_user_createur` bigint(20) unsigned DEFAULT NULL,
  `notes` longtext DEFAULT NULL,
  `date_annulation` datetime DEFAULT NULL,
  `date_creation` timestamp NOT NULL DEFAULT current_timestamp(),
  `date_modification` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id_contrat`),
  UNIQUE KEY `contrats_reference_unique` (`reference`),
  KEY `contrats_id_user_createur_foreign` (`id_user_createur`),
  KEY `contrats_reference_index` (`reference`),
  KEY `contrats_type_contrat_index` (`type_contrat`),
  KEY `contrats_statut_index` (`statut`),
  KEY `contrats_id_bien_index` (`id_bien`),
  KEY `contrats_id_proprietaire_index` (`id_proprietaire`),
  KEY `contrats_id_locataire_index` (`id_locataire`),
  KEY `contrats_date_debut_index` (`date_debut`),
  KEY `contrats_date_fin_index` (`date_fin`),
  FULLTEXT KEY `contrats_reference_notes_fulltext` (`reference`,`notes`),
  CONSTRAINT `contrats_id_bien_foreign` FOREIGN KEY (`id_bien`) REFERENCES `biens` (`id_bien`) ON UPDATE CASCADE,
  CONSTRAINT `contrats_id_locataire_foreign` FOREIGN KEY (`id_locataire`) REFERENCES `locataires` (`id_locataire`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `contrats_id_proprietaire_foreign` FOREIGN KEY (`id_proprietaire`) REFERENCES `proprietaires` (`id_proprietaire`) ON UPDATE CASCADE,
  CONSTRAINT `contrats_id_user_createur_foreign` FOREIGN KEY (`id_user_createur`) REFERENCES `utilisateurs` (`id_user`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `contrats`
--

LOCK TABLES `contrats` WRITE;
/*!40000 ALTER TABLE `contrats` DISABLE KEYS */;
INSERT INTO `contrats` VALUES (1,'CTR-LOC-001','LOCATAIRE','2025-01-01','2026-12-31',1200.00,'ACTIF',1,1,1,2,'Bail d\'habitation de 2 ans',NULL,'2026-05-18 11:42:08','2026-05-18 11:42:08'),(2,'CTR-PROP-001','PROPRIETAIRE','2025-01-01','2025-12-31',450000.00,'ACTIF',2,2,NULL,2,'Mandat de gestion locative',NULL,'2026-05-18 11:42:08','2026-05-18 11:42:08');
/*!40000 ALTER TABLE `contrats` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `failed_jobs`
--

DROP TABLE IF EXISTS `failed_jobs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `failed_jobs` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `uuid` varchar(255) NOT NULL,
  `connection` text NOT NULL,
  `queue` text NOT NULL,
  `payload` longtext NOT NULL,
  `exception` longtext NOT NULL,
  `failed_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `failed_jobs_uuid_unique` (`uuid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `failed_jobs`
--

LOCK TABLES `failed_jobs` WRITE;
/*!40000 ALTER TABLE `failed_jobs` DISABLE KEYS */;
/*!40000 ALTER TABLE `failed_jobs` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `historique_operations`
--

DROP TABLE IF EXISTS `historique_operations`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `historique_operations` (
  `id_historique` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `id_user` bigint(20) unsigned DEFAULT NULL,
  `type_operation` varchar(50) NOT NULL,
  `entite` varchar(50) NOT NULL,
  `id_entite` bigint(20) unsigned DEFAULT NULL,
  `description` longtext DEFAULT NULL,
  `ancienne_valeur` longtext DEFAULT NULL,
  `nouvelle_valeur` longtext DEFAULT NULL,
  `date_operation` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id_historique`),
  KEY `historique_operations_id_user_index` (`id_user`),
  KEY `historique_operations_date_operation_index` (`date_operation`),
  KEY `historique_operations_type_operation_index` (`type_operation`),
  CONSTRAINT `historique_operations_id_user_foreign` FOREIGN KEY (`id_user`) REFERENCES `utilisateurs` (`id_user`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `historique_operations`
--

LOCK TABLES `historique_operations` WRITE;
/*!40000 ALTER TABLE `historique_operations` DISABLE KEYS */;
INSERT INTO `historique_operations` VALUES (1,2,'CREATION','BIEN',1,'Création du bien BIEN-001',NULL,'Maison Paris','2026-05-18 11:42:08'),(2,2,'CREATION','CONTRAT',1,'Création du contrat de location CTR-LOC-001',NULL,'Locataire Sophie Martin','2026-05-18 11:42:08'),(3,3,'CREATION','PAIEMENT',1,'Enregistrement paiement loyer janvier',NULL,'Montant 1200€','2026-05-18 11:42:08');
/*!40000 ALTER TABLE `historique_operations` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `job_batches`
--

DROP TABLE IF EXISTS `job_batches`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `job_batches` (
  `id` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `total_jobs` int(11) NOT NULL,
  `pending_jobs` int(11) NOT NULL,
  `failed_jobs` int(11) NOT NULL,
  `failed_job_ids` longtext NOT NULL,
  `options` mediumtext DEFAULT NULL,
  `cancelled_at` int(11) DEFAULT NULL,
  `created_at` int(11) NOT NULL,
  `finished_at` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `job_batches`
--

LOCK TABLES `job_batches` WRITE;
/*!40000 ALTER TABLE `job_batches` DISABLE KEYS */;
/*!40000 ALTER TABLE `job_batches` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `jobs`
--

DROP TABLE IF EXISTS `jobs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `jobs` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `queue` varchar(255) NOT NULL,
  `payload` longtext NOT NULL,
  `attempts` tinyint(3) unsigned NOT NULL,
  `reserved_at` int(10) unsigned DEFAULT NULL,
  `available_at` int(10) unsigned NOT NULL,
  `created_at` int(10) unsigned NOT NULL,
  PRIMARY KEY (`id`),
  KEY `jobs_queue_index` (`queue`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `jobs`
--

LOCK TABLES `jobs` WRITE;
/*!40000 ALTER TABLE `jobs` DISABLE KEYS */;
/*!40000 ALTER TABLE `jobs` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `locataires`
--

DROP TABLE IF EXISTS `locataires`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `locataires` (
  `id_locataire` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `nom` varchar(100) NOT NULL,
  `prenom` varchar(100) NOT NULL,
  `telephone` varchar(20) NOT NULL,
  `email` varchar(150) DEFAULT NULL,
  `profession` varchar(100) DEFAULT NULL,
  `adresse` varchar(255) DEFAULT NULL,
  `cni` varchar(50) DEFAULT NULL,
  `date_creation` timestamp NOT NULL DEFAULT current_timestamp(),
  `date_modification` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id_locataire`),
  UNIQUE KEY `locataires_telephone_unique` (`telephone`),
  UNIQUE KEY `locataires_email_unique` (`email`),
  UNIQUE KEY `locataires_cni_unique` (`cni`),
  KEY `locataires_telephone_index` (`telephone`),
  KEY `locataires_email_index` (`email`),
  KEY `locataires_cni_index` (`cni`),
  FULLTEXT KEY `locataires_nom_prenom_profession_fulltext` (`nom`,`prenom`,`profession`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `locataires`
--

LOCK TABLES `locataires` WRITE;
/*!40000 ALTER TABLE `locataires` DISABLE KEYS */;
INSERT INTO `locataires` VALUES (1,'Martin','Sophie','+221761112223','sophie.martin@example.com','Ingénieur','5 Rue des Lilas, 75002 Paris','AZERTY123','2026-05-18 11:42:08','2026-05-18 11:42:08'),(2,'Ndiaye','Mamadou','+221708889990','mamadou.ndiaye@example.com','Commerçant','15 Rue de la Liberté, Dakar','QWERTY456','2026-05-18 11:42:08','2026-05-18 11:42:08');
/*!40000 ALTER TABLE `locataires` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `migrations`
--

DROP TABLE IF EXISTS `migrations`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `migrations` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `migration` varchar(255) NOT NULL,
  `batch` int(11) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `migrations`
--

LOCK TABLES `migrations` WRITE;
/*!40000 ALTER TABLE `migrations` DISABLE KEYS */;
INSERT INTO `migrations` VALUES (1,'0001_01_01_000000_create_utilisateurs_table',1),(2,'0001_01_01_000001_create_cache_table',1),(3,'0001_01_01_000002_create_jobs_table',1),(4,'0001_01_01_000003_create_proprietaires_table',1),(5,'0001_01_01_000004_create_locataires_table',1),(6,'0001_01_01_000005_create_biens_table',1),(7,'0001_01_01_000006_create_contrats_table',1),(8,'0001_01_01_000007_create_paiements_table',1),(9,'0001_01_01_000008_create_historique_operations_table',1);
/*!40000 ALTER TABLE `migrations` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `paiements`
--

DROP TABLE IF EXISTS `paiements`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `paiements` (
  `id_paiement` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `reference` varchar(50) NOT NULL,
  `date_paiement` date NOT NULL,
  `montant` decimal(12,2) NOT NULL,
  `mode_paiement` enum('CHEQUE','VIREMENT','ESPECES','WAVE','ORANGE_MONEY') NOT NULL,
  `statut` enum('PAYE','PARTIEL','EN_ATTENTE') NOT NULL DEFAULT 'EN_ATTENTE',
  `id_contrat` bigint(20) unsigned NOT NULL,
  `id_user_enregistrement` bigint(20) unsigned DEFAULT NULL,
  `notes` longtext DEFAULT NULL,
  `date_enregistrement` timestamp NOT NULL DEFAULT current_timestamp(),
  `date_modification` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id_paiement`),
  UNIQUE KEY `paiements_reference_unique` (`reference`),
  KEY `paiements_reference_index` (`reference`),
  KEY `paiements_statut_index` (`statut`),
  KEY `paiements_mode_paiement_index` (`mode_paiement`),
  KEY `paiements_id_contrat_index` (`id_contrat`),
  KEY `paiements_id_user_enregistrement_index` (`id_user_enregistrement`),
  KEY `paiements_date_paiement_index` (`date_paiement`),
  FULLTEXT KEY `paiements_reference_notes_fulltext` (`reference`,`notes`),
  CONSTRAINT `paiements_id_contrat_foreign` FOREIGN KEY (`id_contrat`) REFERENCES `contrats` (`id_contrat`) ON UPDATE CASCADE,
  CONSTRAINT `paiements_id_user_enregistrement_foreign` FOREIGN KEY (`id_user_enregistrement`) REFERENCES `utilisateurs` (`id_user`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `paiements`
--

LOCK TABLES `paiements` WRITE;
/*!40000 ALTER TABLE `paiements` DISABLE KEYS */;
INSERT INTO `paiements` VALUES (1,'PAY-001','2025-01-05',1200.00,'VIREMENT','PAYE',1,3,'Loyer janvier 2025','2026-05-18 11:42:08','2026-05-18 11:42:08'),(2,'PAY-002','2025-02-03',1200.00,'CHEQUE','PAYE',1,3,'Loyer février 2025','2026-05-18 11:42:08','2026-05-18 11:42:08'),(3,'PAY-003','2025-03-10',1200.00,'WAVE','EN_ATTENTE',1,3,'Loyer mars 2025 en attente de confirmation','2026-05-18 11:42:08','2026-05-18 11:42:08');
/*!40000 ALTER TABLE `paiements` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `proprietaires`
--

DROP TABLE IF EXISTS `proprietaires`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `proprietaires` (
  `id_proprietaire` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `nom` varchar(100) NOT NULL,
  `prenom` varchar(100) NOT NULL,
  `telephone` varchar(20) NOT NULL,
  `email` varchar(150) DEFAULT NULL,
  `adresse` varchar(255) NOT NULL,
  `cni` varchar(50) DEFAULT NULL,
  `date_creation` timestamp NOT NULL DEFAULT current_timestamp(),
  `date_modification` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id_proprietaire`),
  UNIQUE KEY `proprietaires_telephone_unique` (`telephone`),
  UNIQUE KEY `proprietaires_email_unique` (`email`),
  UNIQUE KEY `proprietaires_cni_unique` (`cni`),
  KEY `proprietaires_telephone_index` (`telephone`),
  KEY `proprietaires_email_index` (`email`),
  KEY `proprietaires_cni_index` (`cni`),
  FULLTEXT KEY `proprietaires_nom_prenom_adresse_fulltext` (`nom`,`prenom`,`adresse`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `proprietaires`
--

LOCK TABLES `proprietaires` WRITE;
/*!40000 ALTER TABLE `proprietaires` DISABLE KEYS */;
INSERT INTO `proprietaires` VALUES (1,'Durand','Pierre','+221781234567','pierre.durand@example.com','12 Rue de Paris, 75001 Paris','123456789','2026-05-18 11:42:08','2026-05-18 11:42:08'),(2,'Diop','Aminata','+221775556667','aminata.diop@example.com','Avenue Cheikh Anta Diop, Dakar','987654321','2026-05-18 11:42:08','2026-05-18 11:42:08');
/*!40000 ALTER TABLE `proprietaires` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `utilisateurs`
--

DROP TABLE IF EXISTS `utilisateurs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `utilisateurs` (
  `id_user` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `nom` varchar(100) NOT NULL,
  `prenom` varchar(100) NOT NULL,
  `email` varchar(150) NOT NULL,
  `password` varchar(255) NOT NULL,
  `role` enum('ADMIN','GESTIONNAIRE','COMPTABLE') NOT NULL DEFAULT 'GESTIONNAIRE',
  `statut` enum('ACTIF','INACTIF') NOT NULL DEFAULT 'ACTIF',
  `email_verified_at` timestamp NULL DEFAULT NULL,
  `remember_token` varchar(100) DEFAULT NULL,
  `date_creation` timestamp NULL DEFAULT NULL,
  `date_modification` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id_user`),
  UNIQUE KEY `utilisateurs_email_unique` (`email`),
  KEY `utilisateurs_email_index` (`email`),
  KEY `utilisateurs_role_index` (`role`),
  KEY `utilisateurs_statut_index` (`statut`)
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `utilisateurs`
--

LOCK TABLES `utilisateurs` WRITE;
/*!40000 ALTER TABLE `utilisateurs` DISABLE KEYS */;
INSERT INTO `utilisateurs` VALUES (1,'Admin','System','admin@etoilesdusine.com','$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi','ADMIN','ACTIF',NULL,NULL,'2026-05-18 11:42:08','2026-05-18 11:42:08'),(2,'Gestion','Jean','jean.gestion@etoilesdusine.com','$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi','GESTIONNAIRE','ACTIF',NULL,NULL,'2026-05-18 11:42:08','2026-05-18 11:42:08'),(3,'Compta','Marie','marie.compta@etoilesdusine.com','$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi','COMPTABLE','ACTIF',NULL,NULL,'2026-05-18 11:42:08','2026-05-18 11:42:08');
/*!40000 ALTER TABLE `utilisateurs` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping routines for database 'etoiles_du_sine'
--
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-05-18 11:58:22
