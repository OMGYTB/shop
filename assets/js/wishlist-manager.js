class WishlistManager {
    constructor() {
        this.favorites = JSON.parse(localStorage.getItem('favorites')) || [];
        this.init();
    }

    init() {
        this.updateFavoritesCount();
        this.initializeHeartButtons();
        this.setupEventListeners();
        if (window.location.pathname.includes('fav.html')) {
            this.loadFavoritesPage();
        }
    }

    // Mettre à jour le compteur de favoris
    updateFavoritesCount() {
        const counter = document.querySelector('.favorites-count');
        if (counter) {
            counter.textContent = this.favorites.length;
            counter.style.display = this.favorites.length > 0 ? 'block' : 'none';
        }
    }

    // Initialiser les boutons cœur
    initializeHeartButtons() {
        document.querySelectorAll('.wishlist-btn').forEach(btn => {
            const productCard = btn.closest('.product-card');
            if (productCard) {
                const productId = productCard.dataset.productId;
                if (this.isInFavorites(productId)) {
                    btn.classList.add('active');
                }
            }
        });
    }

    // Configuration des écouteurs d'événements
    setupEventListeners() {
        // Écouteur pour le tri des favoris
        const sortSelect = document.getElementById('sortBy');
        if (sortSelect) {
            sortSelect.addEventListener('change', () => this.sortFavorites(sortSelect.value));
        }

        // Écouteur pour la recherche
        const searchInput = document.getElementById('searchWishlist');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => this.searchFavorites(e.target.value));
        }
    }

    // Vérifier si un produit est dans les favoris
    isInFavorites(productId) {
        return this.favorites.some(item => item.id === productId);
    }

    // Basculer un produit dans les favoris
    toggleFavorite(btn) {
        const productCard = btn.closest('.product-card');
        if (!productCard) return;

        const productId = productCard.dataset.productId;
        const isAlreadyFavorite = this.isInFavorites(productId);

        if (isAlreadyFavorite) {
            this.removeFromFavorites(productId);
            btn.classList.remove('active');
            this.showNotification('Produit retiré des favoris');
        } else {
            const productInfo = this.getProductInfo(productCard);
            this.addToFavorites(productInfo);
            btn.classList.add('active');
            this.showNotification('Produit ajouté aux favoris');
        }

        btn.classList.add('pulse');
        setTimeout(() => btn.classList.remove('pulse'), 300);

        this.updateFavoritesCount();
        if (window.location.pathname.includes('fav.html')) {
            this.loadFavoritesPage();
        }
    }

    // Ajouter aux favoris
    addToFavorites(productInfo) {
        if (!this.isInFavorites(productInfo.id)) {
            this.favorites.push({
                ...productInfo,
                dateAdded: new Date().toISOString()
            });
            localStorage.setItem('favorites', JSON.stringify(this.favorites));
        }
    }

    // Retirer des favoris
removeFromFavorites(productId) {
    // Trouver l'élément à supprimer
    const itemElement = document.querySelector(`.wishlist-item[data-product-id="${productId}"]`);
    
    if (itemElement) {
        // Ajouter une animation de sortie
        itemElement.style.animation = 'slideOut 0.3s ease forwards';
        
        // Attendre la fin de l'animation avant de supprimer
        setTimeout(() => {
            // Supprimer de la liste des favoris
            this.favorites = this.favorites.filter(item => item.id !== productId);
            // Sauvegarder dans localStorage
            localStorage.setItem('favorites', JSON.stringify(this.favorites));
            // Mettre à jour le compteur
            this.updateFavoritesCount();
            // Recharger la page des favoris
            this.loadFavoritesPage();
        }, 300);
    } else {
        // Si l'élément n'est pas trouvé, faire la suppression directement
        this.favorites = this.favorites.filter(item => item.id !== productId);
        localStorage.setItem('favorites', JSON.stringify(this.favorites));
        this.updateFavoritesCount();
        this.loadFavoritesPage();
    }
}


    // Récupérer les informations du produit
    getProductInfo(productCard) {
        const modalDetails = productCard.querySelector('.product-details');
        return {
            id: productCard.dataset.productId,
            name: productCard.querySelector('.product-title').textContent,
            price: productCard.querySelector('.current-price').textContent,
            originalPrice: productCard.querySelector('.original-price').textContent,
            image: productCard.querySelector('.product-image').src,
            category: productCard.querySelector('.product-category').textContent,
            rating: productCard.querySelector('.product-rating span').textContent,
            description: modalDetails ? modalDetails.querySelector('.product-description').textContent : '',
            specifications: modalDetails ? Array.from(modalDetails.querySelectorAll('.product-specifications li')).map(li => li.textContent) : []
        };
    }

    // Charger la page des favoris
    loadFavoritesPage() {
        const container = document.querySelector('.wishlist-items-grid');
        const totalElement = document.getElementById('wishlist-total');
        const countElement = document.getElementById('wishlist-count');
        
        if (!container) return;

        if (this.favorites.length === 0) {
            container.innerHTML = this.getEmptyWishlistHTML();
            if (totalElement) totalElement.textContent = '0.00€';
            if (countElement) countElement.textContent = '0';
            return;
        }

        let total = 0;
        container.innerHTML = this.favorites.map(product => {
            const price = parseFloat(product.price.replace('€', ''));
            total += price;
            return this.getProductCardHTML(product);
        }).join('');

        if (totalElement) totalElement.textContent = `${total.toFixed(2)}€`;
        if (countElement) countElement.textContent = this.favorites.length;

        this.initializeProductCards();
    }

    // HTML pour la liste vide
    getEmptyWishlistHTML() {
        return `
            <div class="empty-wishlist">
                <i class="fas fa-heart"></i>
                <h2>Votre liste de favoris est vide</h2>
                <p>Découvrez nos produits et ajoutez-les à vos favoris !</p>
                <a href="index.html" class="return-btn">
                    <i class="fas fa-arrow-left"></i>
                    Retourner à la boutique
                </a>
            </div>
        `;
    }

    // HTML pour une carte produit
    getProductCardHTML(product) {
        return `
            <div class="wishlist-item" data-product-id="${product.id}">
                <div class="wishlist-item-image">
                    <img src="${product.image}" alt="${product.name}">
                </div>
                <div class="wishlist-item-info">
                    <div class="wishlist-item-header">
                        <h3>${product.name}</h3>
                        <span class="category">${product.category}</span>
                    </div>
                    <div class="product-rating">
                        ${this.generateRatingStars(product.rating)}
                        <span>${product.rating}</span>
                    </div>
                    <div class="product-price">
                        <span class="current-price">${product.price}</span>
                        <span class="original-price">${product.originalPrice}</span>
                    </div>
                    <div class="product-description">
                        <p>${product.description}</p>
                    </div>
                    <div class="wishlist-item-actions">
                        <button class="add-to-cart-btn" onclick="addToCart('${product.id}')">
                            <i class="fas fa-shopping-cart"></i>
                            Ajouter au panier
                        </button>
                        <button class="remove-btn" onclick="wishlistManager.removeFromFavorites('${product.id}')">
                            <i class="fas fa-trash"></i>
                            Retirer
                        </button>
                    </div>
                </div>
            </div>
        `;
    }

    // Générer les étoiles de notation
    generateRatingStars(rating) {
        const fullStars = Math.floor(rating);
        const hasHalfStar = rating % 1 !== 0;
        let starsHTML = '';

        for (let i = 0; i < 5; i++) {
            if (i < fullStars) {
                starsHTML += '<i class="fas fa-star"></i>';
            } else if (i === fullStars && hasHalfStar) {
                starsHTML += '<i class="fas fa-star-half-alt"></i>';
            } else {
                starsHTML += '<i class="far fa-star"></i>';
            }
        }

        return starsHTML;
    }

    // Trier les favoris
    sortFavorites(criteria) {
        switch (criteria) {
            case 'date-desc':
                this.favorites.sort((a, b) => new Date(b.dateAdded) - new Date(a.dateAdded));
                break;
            case 'date-asc':
                this.favorites.sort((a, b) => new Date(a.dateAdded) - new Date(b.dateAdded));
                break;
            case 'price-asc':
                this.favorites.sort((a, b) => parseFloat(a.price) - parseFloat(b.price));
                break;
            case 'price-desc':
                this.favorites.sort((a, b) => parseFloat(b.price) - parseFloat(a.price));
                break;
            case 'name':
                this.favorites.sort((a, b) => a.name.localeCompare(b.name));
                break;
        }
        this.loadFavoritesPage();
    }

    // Rechercher dans les favoris
    searchFavorites(query) {
        const container = document.querySelector('.wishlist-items-grid');
        if (!container) return;

        const filteredProducts = this.favorites.filter(product => 
            product.name.toLowerCase().includes(query.toLowerCase()) ||
            product.category.toLowerCase().includes(query.toLowerCase())
        );

        if (filteredProducts.length === 0) {
            container.innerHTML = `
                <div class="empty-search">
                    <i class="fas fa-search"></i>
                    <h3>Aucun résultat trouvé</h3>
                    <p>Essayez avec d'autres termes de recherche</p>
                </div>
            `;
        } else {
            container.innerHTML = filteredProducts.map(product => 
                this.getProductCardHTML(product)
            ).join('');
        }
    }

    // Afficher une notification
    showNotification(message) {
        const notification = document.createElement('div');
        notification.className = 'notification';
        notification.textContent = message;
        document.body.appendChild(notification);

        setTimeout(() => {
            notification.remove();
        }, 3000);
    }
}

// Initialiser le gestionnaire de favoris
const wishlistManager = new WishlistManager();

// Fonction globale pour le bouton de favoris
function toggleWishlist(btn) {
    wishlistManager.toggleFavorite(btn);
}

function addToCartFromWishlist(productId) {
    const product = this.favorites.find(item => item.id === productId);
    if (product) {
        const cartItem = {
            id: product.id,
            title: product.name || product.title,
            price: parseFloat(product.price.replace('€', '')),
            image: product.image,
            quantity: 1
        };
        cart.addItem(cartItem);
    }
}



