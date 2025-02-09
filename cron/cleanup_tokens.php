<?php
// Définir le fuseau horaire
date_default_timezone_set('Europe/Paris');

// Désactiver l'affichage des erreurs
error_reporting(0);

// Journal des exécutions
$logFile = __DIR__ . '/cleanup_log.txt';

try {
    // Inclure la configuration de la base de données
    require_once __DIR__ . '/../config/database.php';

    // Supprimer les tokens expirés ou utilisés
    $stmt = $pdo->prepare("DELETE FROM password_resets WHERE expiry < NOW() OR used = 1");
    $stmt->execute();
    
    $deletedRows = $stmt->rowCount();
    
    // Journaliser l'exécution
    $message = date('Y-m-d H:i:s') . " - Nettoyage effectué. $deletedRows entrées supprimées.\n";
    file_put_contents($logFile, $message, FILE_APPEND);

} catch (Exception $e) {
    // Journaliser l'erreur
    $errorMessage = date('Y-m-d H:i:s') . " - Erreur : " . $e->getMessage() . "\n";
    file_put_contents($logFile, $errorMessage, FILE_APPEND);
}
?>
