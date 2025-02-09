<?php
session_start();
require_once '../../config/database.php';

// Fonction pour nettoyer les données
function cleanInput($data) {
    $data = trim($data);
    $data = stripslashes($data);
    $data = htmlspecialchars($data);
    return $data;
}

// Vérifier si le formulaire a été soumis
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $email = cleanInput($_POST['email']);
    $password = $_POST['password'];
    $errors = [];

    // Validation de base
    if (empty($email)) {
        $errors[] = "L'email est requis";
    }
    if (empty($password)) {
        $errors[] = "Le mot de passe est requis";
    }

    // Si pas d'erreurs, procéder à la connexion
    if (empty($errors)) {
        try {
            // Préparer la requête
            $stmt = $pdo->prepare("SELECT * FROM users WHERE email = ?");
            $stmt->execute([$email]);
            $user = $stmt->fetch();

            // Vérifier si l'utilisateur existe et si le mot de passe est correct
            if ($user && password_verify($password, $user['password'])) {
                // Créer la session
                $_SESSION['user_id'] = $user['id'];
                $_SESSION['email'] = $user['email'];
                $_SESSION['username'] = $user['username'];

                // Rediriger vers la page d'accueil ou le tableau de bord
                header("Location: ../index.html");
                exit();
            } else {
                $errors[] = "Email ou mot de passe incorrect";
            }
        } catch(PDOException $e) {
            $errors[] = "Erreur de connexion à la base de données: " . $e->getMessage();
        }
    }

    // S'il y a des erreurs, les renvoyer au format JSON
    if (!empty($errors)) {
        http_response_code(400);
        echo json_encode(['success' => false, 'errors' => $errors]);
        exit();
    }
} else {
    // Si quelqu'un essaie d'accéder directement au fichier
    header("Location: ../login.html");
    exit();
}
?>
