<?php
session_start();
require_once '../../config/database.php';

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $token = $_POST['token'];
    $password = $_POST['password'];
    $confirm_password = $_POST['confirm_password'];
    $errors = [];

    if (strlen($password) < 8) {
        $errors[] = "Le mot de passe doit contenir au moins 8 caractères";
    }

    if ($password !== $confirm_password) {
        $errors[] = "Les mots de passe ne correspondent pas";
    }

    if (empty($errors)) {
        try {
            // Vérifier si le token est valide et non expiré
            $stmt = $pdo->prepare("SELECT email FROM password_resets WHERE token = ? AND expiry > NOW() AND used = 0");
            $stmt->execute([$token]);
            $reset = $stmt->fetch();

            if ($reset) {
                // Mettre à jour le mot de passe
                $hashed_password = password_hash($password, PASSWORD_DEFAULT);
                $stmt = $pdo->prepare("UPDATE users SET password = ? WHERE email = ?");
                $stmt->execute([$hashed_password, $reset['email']]);

                // Marquer le token comme utilisé
                $stmt = $pdo->prepare("UPDATE password_resets SET used = 1 WHERE token = ?");
                $stmt->execute([$token]);

                echo json_encode(['success' => true]);
            } else {
                echo json_encode(['success' => false, 'error' => "Token invalide ou expiré"]);
            }
        } catch(PDOException $e) {
            echo json_encode(['success' => false, 'error' => "Erreur de base de données"]);
        }
    } else {
        echo json_encode(['success' => false, 'errors' => $errors]);
    }
}
?>
