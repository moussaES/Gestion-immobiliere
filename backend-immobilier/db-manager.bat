@echo off
REM ========================================================================
REM Script de Sauvegarde et Restauration - Étoiles du Sine (Windows)
REM ========================================================================

setlocal enabledelayedexpansion

REM Configuration
set DB_NAME=etoiles_du_sine
set DB_USER=root
set DB_HOST=localhost
set BACKUP_DIR=backups
set MYSQL_PATH=C:\xampp\mysql\bin

REM Créer le répertoire de sauvegarde s'il n'existe pas
if not exist "%BACKUP_DIR%" mkdir "%BACKUP_DIR%"

REM ========================================================================
REM Afficher l'aide
REM ========================================================================
if "%1"=="" goto show_help
if "%1"=="help" goto show_help
if "%1"=="--help" goto show_help
if "%1"=="-h" goto show_help

if "%1"=="backup" goto backup_database
if "%1"=="restore" goto restore_database
if "%1"=="list" goto list_backups
if "%1"=="status" goto check_status
if "%1"=="reset" goto reset_database
if "%1"=="clean" goto clean_old_backups

echo Commande inconnue: %1
echo Tapez: db-manager.bat help
exit /b 1

:show_help
cls
echo ========================================================================
echo    Étoiles du Sine - Gestion de la Base de Données (Windows)
echo ========================================================================
echo.
echo Usage: db-manager.bat [COMMANDE] [OPTIONS]
echo.
echo Commandes:
echo   backup           - Créer une sauvegarde de la base de données
echo   restore FICHIER  - Restaurer une base de données à partir d'une sauvegarde
echo   list             - Lister toutes les sauvegardes disponibles
echo   status           - Vérifier le statut de la base de données
echo   reset            - Réinitialiser la base de données (DANGER!)
echo   clean            - Supprimer les anciennes sauvegardes (> 30 jours)
echo   help             - Afficher cette aide
echo.
echo Exemples:
echo   db-manager.bat backup
echo   db-manager.bat restore backups\etoiles_du_sine_20240512_101530.sql
echo   db-manager.bat list
echo.
goto end

:backup_database
echo.
echo [*] Sauvegarde de la base de données...
for /f "tokens=2-4 delims=/ " %%a in ('date /t') do (set mydate=%%c%%a%%b)
for /f "tokens=1-2 delims=/:" %%a in ('time /t') do (set mytime=%%a%%b)
set DUMP_FILE=%BACKUP_DIR%\%DB_NAME%_%mydate%_%mytime%.sql

echo    Fichier: %DUMP_FILE%
echo    Connexion à MySQL en cours...

REM Créer le fichier de dump
"%MYSQL_PATH%\mysqldump.exe" -u%DB_USER% -h%DB_HOST% --single-transaction --routines --triggers %DB_NAME% > "%DUMP_FILE%" 2>nul

if %errorlevel% equ 0 (
    for /f %%A in ('powershell -Command "(Get-Item '%DUMP_FILE%').length / 1MB"') do set SIZE=%%A
    echo [✓] Sauvegarde créée avec succès
    echo    Fichier: %DUMP_FILE%
    echo    Taille: !SIZE! MB
) else (
    echo [✗] Erreur lors de la sauvegarde
    echo    Vérifiez que MySQL est en cours d'exécution
    echo    Assurez-vous que le chemin MYSQL_PATH est correct: %MYSQL_PATH%
    exit /b 1
)
goto end

:restore_database
if "%2"=="" (
    echo [✗] Erreur: Veuillez spécifier le fichier à restaurer
    echo    Usage: db-manager.bat restore [FICHIER]
    exit /b 1
)

if not exist "%2" (
    echo [✗] Erreur: Fichier non trouvé: %2
    exit /b 1
)

echo.
echo [⚠]  Attention! Ceci va remplacer la base de données actuelle.
set /p confirm="Êtes-vous sûr? (oui/non): "

if not "!confirm!"=="oui" (
    echo Opération annulée.
    goto end
)

echo [*] Restauration de la base de données...
echo    À partir de: %2

REM Créer la base si elle n'existe pas
"%MYSQL_PATH%\mysql.exe" -u%DB_USER% -h%DB_HOST% -e "CREATE DATABASE IF NOT EXISTS %DB_NAME%;" 2>nul

REM Restaurer les données
"%MYSQL_PATH%\mysql.exe" -u%DB_USER% -h%DB_HOST% %DB_NAME% < "%2" 2>nul

if %errorlevel% equ 0 (
    echo [✓] Base de données restaurée avec succès
) else (
    echo [✗] Erreur lors de la restauration
    exit /b 1
)
goto end

:list_backups
echo.
echo [*] Sauvegardes disponibles:
echo.

if not exist "%BACKUP_DIR%" (
    echo Aucune sauvegarde disponible
    goto end
)

for /f "delims=" %%F in ('dir /b "%BACKUP_DIR%\*.sql" 2^>nul') do (
    for /f %%S in ('powershell -Command "(Get-Item '%BACKUP_DIR%\%%F').length / 1MB"') do (
        echo    %%F (%%S MB)
    )
)

for /f %%C in ('dir /b "%BACKUP_DIR%\*.sql" 2^>nul ^| find /c /v ""') do (
    echo.
    echo Total: %%C fichier(s)
)

goto end

:check_status
echo.
echo [*] Statut de la base de données:
echo.

"%MYSQL_PATH%\mysql.exe" -u%DB_USER% -h%DB_HOST% -e "SELECT 1" >nul 2>&1

if %errorlevel% equ 0 (
    echo [✓] MySQL connecté
    echo    Base de données: %DB_NAME%
    echo.
    echo    Tables:
    "%MYSQL_PATH%\mysql.exe" -u%DB_USER% -h%DB_HOST% %DB_NAME% -e "SHOW TABLES;" 2>nul
    echo.
    echo    Taille:
    "%MYSQL_PATH%\mysql.exe" -u%DB_USER% -h%DB_HOST% -e "SELECT ROUND(SUM(data_length + index_length) / 1024 / 1024, 2) as 'Taille (MB)' FROM information_schema.TABLES WHERE table_schema = '%DB_NAME%';" 2>nul
) else (
    echo [✗] Erreur: Impossible de se connecter à MySQL
    echo    - Assurez-vous que MySQL est en cours d'exécution
    echo    - Vérifiez les identifiants
    exit /b 1
)
goto end

:reset_database
echo.
echo [⚠⚠⚠] ATTENTION! OPÉRATION DANGEREUSE [⚠⚠⚠]
echo Ceci va SUPPRIMER COMPLÈTEMENT la base de données actuelle!
echo.
set /p confirm="Tapez 'CONFIRMER' pour continuer: "

if not "!confirm!"=="CONFIRMER" (
    echo Opération annulée.
    goto end
)

echo [*] Création d'une sauvegarde de sécurité...
call :backup_database

echo [*] Suppression de la base de données...
"%MYSQL_PATH%\mysql.exe" -u%DB_USER% -h%DB_HOST% -e "DROP DATABASE IF EXISTS %DB_NAME%;" 2>nul

echo [✓] Base de données réinitialisée avec succès
goto end

:clean_old_backups
echo.
echo [*] Nettoyage des sauvegardes...
echo.

if not exist "%BACKUP_DIR%" (
    echo Aucun répertoire de sauvegarde.
    goto end
)

echo Actuellement, seule la suppression manuelle est disponible sur Windows.
echo Veuillez supprimer manuellement les fichiers du dossier: %BACKUP_DIR%
goto end

:end
echo.
endlocal
