document.addEventListener('DOMContentLoaded', () => {
    const resetForm = document.getElementById('resetForm');
    const emailState = document.getElementById('emailState');
    const sendingState = document.getElementById('sendingState');
    const successState = document.getElementById('successState');

    resetForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const email = document.getElementById('email').value;

        // Validation basique de l'email
        if (!isValidEmail(email)) {
            showError('Veuillez entrer une adresse email valide');
            return;
        }

        // Cacher l'état initial
        emailState.classList.remove('active');
        // Montrer l'animation d'envoi
        sendingState.classList.add('active');

        try {
            // Simuler l'appel API
            await new Promise(resolve => setTimeout(resolve, 2000));

            // Cacher l'animation d'envoi
            sendingState.classList.remove('active');
            // Montrer l'état de succès
            successState.classList.add('active');

        } catch (error) {
            // En cas d'erreur, revenir à l'état initial
            sendingState.classList.remove('active');
            emailState.classList.add('active');
            showError('Une erreur est survenue. Veuillez réessayer.');
        }
    });

    function isValidEmail(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }

    function showError(message) {
        const errorElement = document.querySelector('.error-message');
        errorElement.textContent = message;
        errorElement.style.display = 'block';
        
        // Secouer le formulaire
        resetForm.classList.add('shake');
        setTimeout(() => {
            resetForm.classList.remove('shake');
        }, 500);
    }
});