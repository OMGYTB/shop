<?php
require_once '../../config/database.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $username = trim($_POST['username']);
    $email = trim($_POST['email']);
    $password = $_POST['password'];
    $confirm_password = $_POST['confirm_password'];

    // Validation
    if ($password !== $confirm_password) {
        die("Les mots de passe ne correspondent pas");
    }

    // Vérifier si l'email existe déjà
    $stmt = $pdo->prepare("SELECT id FROM users WHERE email = ?");
    $stmt->execute([$email]);
    if ($stmt->rowCount() > 0) {
        die("Cet email est déjà utilisé");
    }

    // Hasher le mot de passe
    $hashed_password = password_hash($password, PASSWORD_DEFAULT);

    // Insérer l'utilisateur
    $stmt = $pdo->prepare("INSERT INTO users (username, email, password) VALUES (?, ?, ?)");
    try {
        $stmt->execute([$username, $email, $hashed_password]);
        header("Location: ../../login.html?success=1");
    } catch(PDOException $e) {
        die("Erreur d'inscription : " . $e->getMessage());
    }
}
?>
