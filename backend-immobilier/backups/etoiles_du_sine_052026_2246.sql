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
-- Table structure for table `admins`
--

DROP TABLE IF EXISTS `admins`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `admins` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `username` varchar(50) NOT NULL,
  `password` varchar(255) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `username` (`username`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `admins`
--

LOCK TABLES `admins` WRITE;
/*!40000 ALTER TABLE `admins` DISABLE KEYS */;
/*!40000 ALTER TABLE `admins` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `biens`
--

DROP TABLE IF EXISTS `biens`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `biens` (
  `id_bien` int(11) NOT NULL AUTO_INCREMENT,
  `reference` varchar(50) NOT NULL,
  `type` enum('MAISON','APPARTEMENT','IMMEUBLE','TERRAIN') NOT NULL,
  `adresse` varchar(255) NOT NULL,
  `ville` varchar(100) NOT NULL,
  `code_postal` varchar(10) DEFAULT NULL,
  `surface` decimal(10,2) DEFAULT NULL,
  `nombre_pieces` int(11) DEFAULT NULL,
  `loyer_mensuel` decimal(12,2) NOT NULL,
  `statut` enum('OCCUPE','LIBRE','RESERVE') NOT NULL DEFAULT 'LIBRE',
  `description` text DEFAULT NULL,
  `id_proprietaire` int(11) NOT NULL,
  `date_creation` timestamp NOT NULL DEFAULT current_timestamp(),
  `date_modification` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id_bien`),
  UNIQUE KEY `reference` (`reference`),
  KEY `idx_reference` (`reference`),
  KEY `idx_type` (`type`),
  KEY `idx_statut` (`statut`),
  KEY `idx_ville` (`ville`),
  KEY `idx_proprietaire` (`id_proprietaire`),
  FULLTEXT KEY `ft_search` (`reference`,`adresse`,`ville`),
  CONSTRAINT `fk_bien_proprietaire` FOREIGN KEY (`id_proprietaire`) REFERENCES `proprietaires` (`id_proprietaire`) ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `biens`
--

LOCK TABLES `biens` WRITE;
/*!40000 ALTER TABLE `biens` DISABLE KEYS */;
/*!40000 ALTER TABLE `biens` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `contrats`
--

DROP TABLE IF EXISTS `contrats`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `contrats` (
  `id_contrat` int(11) NOT NULL AUTO_INCREMENT,
  `reference` varchar(50) NOT NULL,
  `type_contrat` enum('LOCATAIRE','PROPRIETAIRE') NOT NULL,
  `date_debut` date NOT NULL,
  `date_fin` date NOT NULL,
  `montant` decimal(12,2) NOT NULL,
  `statut` enum('ACTIF','RESILIE','ARCHIVE') NOT NULL DEFAULT 'ACTIF',
  `id_bien` int(11) NOT NULL,
  `id_proprietaire` int(11) NOT NULL,
  `id_locataire` int(11) DEFAULT NULL,
  `id_user_createur` int(11) DEFAULT NULL,
  `date_creation` timestamp NOT NULL DEFAULT current_timestamp(),
  `date_modification` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `date_annulation` datetime DEFAULT NULL,
  `notes` text DEFAULT NULL,
  PRIMARY KEY (`id_contrat`),
  UNIQUE KEY `reference` (`reference`),
  KEY `fk_contrat_user` (`id_user_createur`),
  KEY `idx_reference` (`reference`),
  KEY `idx_type_contrat` (`type_contrat`),
  KEY `idx_statut` (`statut`),
  KEY `idx_bien` (`id_bien`),
  KEY `idx_proprietaire` (`id_proprietaire`),
  KEY `idx_locataire` (`id_locataire`),
  KEY `idx_date_debut` (`date_debut`),
  KEY `idx_date_fin` (`date_fin`),
  FULLTEXT KEY `ft_search` (`reference`,`notes`),
  CONSTRAINT `fk_contrat_bien` FOREIGN KEY (`id_bien`) REFERENCES `biens` (`id_bien`) ON UPDATE CASCADE,
  CONSTRAINT `fk_contrat_locataire` FOREIGN KEY (`id_locataire`) REFERENCES `locataires` (`id_locataire`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `fk_contrat_proprietaire` FOREIGN KEY (`id_proprietaire`) REFERENCES `proprietaires` (`id_proprietaire`) ON UPDATE CASCADE,
  CONSTRAINT `fk_contrat_user` FOREIGN KEY (`id_user_createur`) REFERENCES `utilisateurs` (`id_user`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `contrats`
--

LOCK TABLES `contrats` WRITE;
/*!40000 ALTER TABLE `contrats` DISABLE KEYS */;
/*!40000 ALTER TABLE `contrats` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `historique_operations`
--

DROP TABLE IF EXISTS `historique_operations`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `historique_operations` (
  `id_historique` int(11) NOT NULL AUTO_INCREMENT,
  `id_user` int(11) NOT NULL,
  `type_operation` varchar(50) NOT NULL,
  `entite` varchar(50) NOT NULL,
  `id_entite` int(11) DEFAULT NULL,
  `description` text DEFAULT NULL,
  `ancienne_valeur` text DEFAULT NULL,
  `nouvelle_valeur` text DEFAULT NULL,
  `date_operation` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id_historique`),
  KEY `idx_user` (`id_user`),
  KEY `idx_date` (`date_operation`),
  KEY `idx_type` (`type_operation`),
  CONSTRAINT `fk_historique_user` FOREIGN KEY (`id_user`) REFERENCES `utilisateurs` (`id_user`) ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `historique_operations`
--

LOCK TABLES `historique_operations` WRITE;
/*!40000 ALTER TABLE `historique_operations` DISABLE KEYS */;
/*!40000 ALTER TABLE `historique_operations` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `locataires`
--

DROP TABLE IF EXISTS `locataires`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `locataires` (
  `id_locataire` int(11) NOT NULL AUTO_INCREMENT,
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
  UNIQUE KEY `telephone` (`telephone`),
  UNIQUE KEY `email` (`email`),
  UNIQUE KEY `cni` (`cni`),
  KEY `idx_telephone` (`telephone`),
  KEY `idx_email` (`email`),
  KEY `idx_cni` (`cni`),
  FULLTEXT KEY `ft_search` (`nom`,`prenom`,`profession`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `locataires`
--

LOCK TABLES `locataires` WRITE;
/*!40000 ALTER TABLE `locataires` DISABLE KEYS */;
/*!40000 ALTER TABLE `locataires` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `paiements`
--

DROP TABLE IF EXISTS `paiements`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `paiements` (
  `id_paiement` int(11) NOT NULL AUTO_INCREMENT,
  `reference` varchar(50) NOT NULL,
  `date_paiement` date NOT NULL,
  `montant` decimal(12,2) NOT NULL,
  `mode_paiement` enum('CHEQUE','VIREMENT','ESPECES','WAVE','ORANGE_MONEY') NOT NULL,
  `statut` enum('PAYE','PARTIEL','EN_ATTENTE') NOT NULL DEFAULT 'EN_ATTENTE',
  `id_contrat` int(11) NOT NULL,
  `id_user_enregistrement` int(11) DEFAULT NULL,
  `date_enregistrement` timestamp NOT NULL DEFAULT current_timestamp(),
  `date_modification` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `notes` text DEFAULT NULL,
  PRIMARY KEY (`id_paiement`),
  UNIQUE KEY `reference` (`reference`),
  KEY `idx_reference` (`reference`),
  KEY `idx_statut` (`statut`),
  KEY `idx_mode_paiement` (`mode_paiement`),
  KEY `idx_contrat` (`id_contrat`),
  KEY `idx_user_enregistrement` (`id_user_enregistrement`),
  KEY `idx_date_paiement` (`date_paiement`),
  FULLTEXT KEY `ft_search` (`reference`,`notes`),
  CONSTRAINT `fk_paiement_contrat` FOREIGN KEY (`id_contrat`) REFERENCES `contrats` (`id_contrat`) ON UPDATE CASCADE,
  CONSTRAINT `fk_paiement_user` FOREIGN KEY (`id_user_enregistrement`) REFERENCES `utilisateurs` (`id_user`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `paiements`
--

LOCK TABLES `paiements` WRITE;
/*!40000 ALTER TABLE `paiements` DISABLE KEYS */;
/*!40000 ALTER TABLE `paiements` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `proprietaires`
--

DROP TABLE IF EXISTS `proprietaires`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `proprietaires` (
  `id_proprietaire` int(11) NOT NULL AUTO_INCREMENT,
  `nom` varchar(100) NOT NULL,
  `prenom` varchar(100) NOT NULL,
  `telephone` varchar(20) NOT NULL,
  `email` varchar(150) DEFAULT NULL,
  `adresse` varchar(255) NOT NULL,
  `cni` varchar(50) DEFAULT NULL,
  `date_creation` timestamp NOT NULL DEFAULT current_timestamp(),
  `date_modification` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id_proprietaire`),
  UNIQUE KEY `telephone` (`telephone`),
  UNIQUE KEY `email` (`email`),
  UNIQUE KEY `cni` (`cni`),
  KEY `idx_telephone` (`telephone`),
  KEY `idx_email` (`email`),
  KEY `idx_cni` (`cni`),
  FULLTEXT KEY `ft_search` (`nom`,`prenom`,`adresse`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `proprietaires`
--

LOCK TABLES `proprietaires` WRITE;
/*!40000 ALTER TABLE `proprietaires` DISABLE KEYS */;
/*!40000 ALTER TABLE `proprietaires` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `utilisateurs`
--

DROP TABLE IF EXISTS `utilisateurs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `utilisateurs` (
  `id_user` int(11) NOT NULL AUTO_INCREMENT,
  `nom` varchar(100) NOT NULL,
  `prenom` varchar(100) NOT NULL,
  `email` varchar(150) NOT NULL,
  `password` varchar(255) NOT NULL,
  `role` enum('ADMIN','GESTIONNAIRE','COMPTABLE') NOT NULL DEFAULT 'GESTIONNAIRE',
  `statut` enum('ACTIF','INACTIF') NOT NULL DEFAULT 'ACTIF',
  `date_creation` timestamp NOT NULL DEFAULT current_timestamp(),
  `date_modification` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id_user`),
  UNIQUE KEY `email` (`email`),
  KEY `idx_email` (`email`),
  KEY `idx_role` (`role`),
  KEY `idx_statut` (`statut`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `utilisateurs`
--

LOCK TABLES `utilisateurs` WRITE;
/*!40000 ALTER TABLE `utilisateurs` DISABLE KEYS */;
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

-- Dump completed on 2026-05-13 22:46:54
