// Animation au défilement
document.addEventListener('DOMContentLoaded', () => {
    const productCards = document.querySelectorAll('.product-card');
    
    const observerOptions = {
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    productCards.forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        observer.observe(card);
    });
});

// Gestion des boutons d'action
document.querySelectorAll('.action-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
        e.preventDefault();
        
        // Animation du clic
        btn.style.transform = 'scale(0.95)';
        setTimeout(() => {
            btn.style.transform = 'scale(1)';
        }, 100);

        // Gestion des différentes actions
        if (btn.classList.contains('wishlist-btn')) {
            toggleWishlist(btn);
        } else if (btn.classList.contains('cart-btn')) {
            addToCart(btn);
        } else if (btn.classList.contains('view-btn')) {
            quickView(btn);
        }
    });
});

// Fonction pour la liste de souhaits
function toggleWishlist(btn) {
    btn.classList.toggle('active');
    const icon = btn.querySelector('i');
    if (btn.classList.contains('active')) {
        icon.style.color = '#ff4757';
        showNotification('Produit ajouté aux favoris');
    } else {
        icon.style.color = '';
        showNotification('Produit retiré des favoris');
    }
}

// Notification
function showNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    document.body.appendChild(notification);

    setTimeout(() => {
        notification.remove();
    }, 3000);
}

// Animation des vagues
document.addEventListener('DOMContentLoaded', () => {
    const waves = document.querySelectorAll('.wave');
    waves.forEach((wave, index) => {
        wave.style.animationDelay = `${index * 2}s`;
    });
});

// Animation du formulaire newsletter
const newsletterForm = document.querySelector('.newsletter-form');
if (newsletterForm) {
    newsletterForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const input = newsletterForm.querySelector('input');
        const button = newsletterForm.querySelector('button');
        
        // Animation du bouton
        button.innerHTML = '<i class="fas fa-check"></i>';
        button.style.background = '#00b894';
        
        // Réinitialisation après 2 secondes
        setTimeout(() => {
            button.innerHTML = '<i class="fas fa-paper-plane"></i>';
            input.value = '';
        }, 2000);
    });
}

// Animation des liens sociaux
document.querySelectorAll('.social-link').forEach(link => {
    link.addEventListener('mouseover', () => {
        link.style.transform = 'translateY(-5px) rotate(360deg)';
    });
    
    link.addEventListener('mouseout', () => {
        link.style.transform = 'translateY(0) rotate(0deg)';
    });
});

document.addEventListener('DOMContentLoaded', function() {
    const cartToggle = document.getElementById('cart-toggle');
    const miniCart = document.getElementById('mini-cart');
    
    // Afficher/Masquer le mini-panier
    cartToggle.addEventListener('click', function(e) {
        e.preventDefault();
        miniCart.classList.toggle('active');
    });

    // Fermer le mini-panier en cliquant à l'extérieur
    document.addEventListener('click', function(e) {
        if (!miniCart.contains(e.target) && !cartToggle.contains(e.target)) {
            miniCart.classList.remove('active');
        }
    });

    // Fonction pour mettre à jour le panier
    function updateCart(items) {
        const cartItems = document.querySelector('.cart-items');
        const cartTotal = document.getElementById('cart-total');
        let total = 0;

        cartItems.innerHTML = '';
        
        items.forEach(item => {
            total += item.price * item.quantity;
            cartItems.innerHTML += `
                <div class="cart-item">
                    <img src="${item.image}" alt="${item.name}">
                    <div class="item-details">
                        <h4>${item.name}</h4>
                        <p>${item.price}€ x ${item.quantity}</p>
                    </div>
                </div>
            `;
        });

        cartTotal.textContent = total.toFixed(2);
    }
});

// Fonction pour ouvrir la modal
function openProductModal(button) {
    const modal = document.getElementById('productModal');
    const productCard = button.closest('.product-card');
    
    // Récupérer les informations du produit
    const productImage = productCard.querySelector('.product-image').src;
    const productTitle = productCard.querySelector('.product-title').textContent;
    const productCategory = productCard.querySelector('.product-category').textContent;
    const currentPrice = productCard.querySelector('.current-price').textContent;
    const originalPrice = productCard.querySelector('.original-price').textContent;
    const rating = productCard.querySelector('.product-rating span').textContent;

    // Récupérer la notation (étoiles)
    const ratingStars = productCard.querySelectorAll('.product-rating .fa-star');
    const ratingValue = productCard.querySelector('.product-rating span').textContent;

    // Récupérer la description et les spécifications
    const description = productCard.querySelector('.product-description').textContent;
    const specifications = productCard.querySelectorAll('.product-specifications li');

    // Mettre à jour le contenu de la modal
    modal.querySelector('.modal-product-image img').src = productImage;
    modal.querySelector('.modal-product-title').textContent = productTitle;
    modal.querySelector('.modal-product-category').textContent = productCategory;
    modal.querySelector('.modal-product-price .current-price').textContent = currentPrice;
    modal.querySelector('.modal-product-price .original-price').textContent = originalPrice;
    modal.querySelector('.rating-value').textContent = rating;

    // Mettre à jour les étoiles dans la modal
    updateStarsInModal(ratingStars.length, modal);
    modal.querySelector('.rating-value').textContent = ratingValue;

    // Mettre à jour la liste des spécifications
    const specList = modal.querySelector('.modal-product-details-list ul');
    specList.innerHTML = ''; // Vider la liste existante
    specifications.forEach(spec => {
        specList.innerHTML += `<li>${spec.textContent}</li>`;
    });

    // Fonction pour mettre à jour les étoiles dans la modal
    function updateStarsInModal(rating, modal) {
    const modalStars = modal.querySelectorAll('.modal-product-rating i');
    
        modalStars.forEach((star, index) => {
        // Réinitialiser toutes les classes d'étoiles
        star.className = '';
        
        if (index < Math.floor(rating)) {
            // Étoile pleine
            star.className = 'fas fa-star';
        } else if (index === Math.floor(rating) && rating % 1 !== 0) {
            // Demi-étoile
            star.className = 'fas fa-star-half-alt';
        } else {
            // Étoile vide
            star.className = 'far fa-star';
        }
    });
}
    
    // Réinitialiser la quantité
    modal.querySelector('.quantity-input').value = 1;
    
    // Afficher la modal
    modal.style.display = 'block';
    document.body.style.overflow = 'hidden';
}

// Gestionnaire pour fermer la modal
document.querySelector('.close-modal').addEventListener('click', () => {
    const modal = document.getElementById('productModal');
    modal.style.display = 'none';
    document.body.style.overflow = 'auto';
});

// Fermer la modal en cliquant en dehors
window.addEventListener('click', (event) => {
    const modal = document.getElementById('productModal');
    if (event.target === modal) {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
});

// Gestion de la quantité
document.addEventListener('DOMContentLoaded', function() {
    // Diminuer la quantité
    document.querySelector('.quantity-btn.minus').addEventListener('click', function() {
        const input = this.parentElement.querySelector('.quantity-input');
        const value = parseInt(input.value);
        if (value > 1) input.value = value - 1;
        if (value ===1) input.value = 1;
    });

    // Augmenter la quantité
    document.querySelector('.quantity-btn.plus').addEventListener('click', function() {
        const input = this.parentElement.querySelector('.quantity-input');
        input.value = parseInt(input.value) + 1;
    });

    // Validation de la quantité sur input manuel
    document.querySelector('.quantity-input').addEventListener('change', function() {
        if (this.value < 1) this.value = 1;
    });
});

// Gestion du bouton Ajouter au panier dans la modal
document.querySelector('.modal-add-to-cart').addEventListener('click', function() {
    const modal = document.getElementById('productModal');
    const quantity = modal.querySelector('.quantity-input').value;
    const productTitle = modal.querySelector('.modal-product-title').textContent;
    const price = modal.querySelector('.modal-product-price .current-price').textContent;
    
    // Ici, vous pouvez ajouter votre logique pour ajouter au panier
    console.log(`Ajouté au panier: ${quantity} x ${productTitle} à ${price}`);
    
    // Fermer la modal après ajout
    modal.style.display = 'none';
    document.body.style.overflow = 'auto';
});

