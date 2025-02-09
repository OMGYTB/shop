<?php
session_start();
require_once '../../config/database.php';
require '../../vendor/autoload.php'; // Pour PHPMailer

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $email = filter_var($_POST['email'], FILTER_SANITIZE_EMAIL);
    $errors = [];

    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        $errors[] = "Email invalide";
    }

    if (empty($errors)) {
        try {
            // Vérifier si l'email existe
            $stmt = $pdo->prepare("SELECT id FROM users WHERE email = ?");
            $stmt->execute([$email]);
            $user = $stmt->fetch();

            if ($user) {
                // Générer un token unique
                $token = bin2hex(random_bytes(32));
                $expiry = date('Y-m-d H:i:s', strtotime('+1 hour'));

                // Sauvegarder le token dans la base de données
                $stmt = $pdo->prepare("INSERT INTO password_resets (email, token, expiry) VALUES (?, ?, ?)");
                $stmt->execute([$email, $token, $expiry]);

                // Configurer PHPMailer
                $mail = new PHPMailer(true);
                try {
                    $mail->isSMTP();
                    $mail->Host = 'smtp.gmail.com'; // Remplacer par votre serveur SMTP
                    $mail->SMTPAuth = true;
                    $mail->Username = 'votre_email@gmail.com'; // Votre email
                    $mail->Password = 'votre_mot_de_passe'; // Votre mot de passe
                    $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;
                    $mail->Port = 587;

                    $mail->setFrom('votre_email@gmail.com', 'MonShop');
                    $mail->addAddress($email);

                    $mail->isHTML(true);
                    $mail->Subject = 'Réinitialisation de votre mot de passe';
                    
                    // Corps du mail avec logo et style
                    $resetLink = "http://votre-site.com/reset-password.php?token=" . $token;
                    $mail->Body = "
                        <div style='text-align: center; font-family: Arial, sans-serif;'>
                            <img src='http://votre-site.com/assets/images/logo.png' alt='MonShop Logo' style='width: 150px; margin-bottom: 20px;'>
                            <h2>Réinitialisation de votre mot de passe</h2>
                            <p>Vous avez demandé la réinitialisation de votre mot de passe.</p>
                            <p>Cliquez sur le bouton ci-dessous pour définir un nouveau mot de passe :</p>
                            <a href='{$resetLink}' style='display: inline-block; padding: 10px 20px; background-color: #4CAF50; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0;'>Réinitialiser mon mot de passe</a>
                            <p>Ce lien expirera dans 1 heure.</p>
                            <p>Si vous n'avez pas demandé cette réinitialisation, ignorez cet email.</p>
                        </div>
                    ";

                    $mail->send();
                    echo json_encode(['success' => true]);
                } catch (Exception $e) {
                    echo json_encode(['success' => false, 'error' => "L'email n'a pas pu être envoyé."]);
                }
            } else {
                echo json_encode(['success' => false, 'error' => "Email non trouvé"]);
            }
        } catch(PDOException $e) {
            echo json_encode(['success' => false, 'error' => "Erreur de base de données"]);
        }
    } else {
        echo json_encode(['success' => false, 'errors' => $errors]);
    }
}
?>
