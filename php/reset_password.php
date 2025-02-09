<?php
session_start();
require_once '../../config/database.php';

// Vérifier si le token est valide
if (!isset($_GET['token'])) {
    header('Location: login.html');
    exit();
}

$token = $_GET['token'];
$stmt = $pdo->prepare("SELECT * FROM password_resets WHERE token = ? AND expiry > NOW() AND used = 0");
$stmt->execute([$token]);
$reset = $stmt->fetch();

if (!$reset) {
    header('Location: login.html');
    exit();
}
?>

<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Réinitialiser votre mot de passe</title>
    <link rel="stylesheet" href="assets/css/auth.css">
</head>
<body>
    <div class="reset-container">
        <form id="newPasswordForm">
            <input type="hidden" name="token" value="<?php echo htmlspecialchars($token); ?>">
            <div class="form-group">
                <input type="password" name="password" placeholder="Nouveau mot de passe" required>
            </div>
            <div class="form-group">
                <input type="password" name="confirm_password" placeholder="Confirmer le mot de passe" required>
            </div>
            <button type="submit">Changer le mot de passe</button>
        </form>
    </div>
    <script src="assets/js/reset-password.js"></script>
</body>
</html>
