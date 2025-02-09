// Classe pour gérer le panier
class Cart {
    constructor() {
        this.items = JSON.parse(localStorage.getItem('cart')) || [];
        this.total = 0;
        this.count = 0;
        this.init();
    }

    init() {
        // Mettre à jour l'affichage du nombre d'articles
        this.updateCartCount();
        
        // Initialiser les événements du mini-panier
        this.initMiniCart();
        
        // Si on est sur la page panier, afficher les articles
        if (document.querySelector('.cart-items-full')) {
            this.displayCartItems();
        }
    }

    // Ajouter un produit au panier
    addItem(product) {
        const existingItem = this.items.find(item => item.id === product.id);
        
        if (existingItem) {
            existingItem.quantity += product.quantity;
        } else {
            this.items.push(product);
        }
        
        this.saveCart();
        this.updateCartCount();
        this.updateMiniCart();
    }

    // Retirer un produit du panier
    removeItem(productId) {
        const itemElement = document.querySelector(`.cart-item[data-id="${productId}"]`);
        if (itemElement) {
            itemElement.style.animation = 'slideOut 0.3s ease forwards';
            setTimeout(() => {
                this.items = this.items.filter(item => item.id !== productId);
                this.saveCart();
                this.updateCartCount();
                this.updateMiniCart();
                if (document.querySelector('.cart-items-full')) {
                    this.displayCartItems();
                }
            }, 300);
        } else {
            this.items = this.items.filter(item => item.id !== productId);
            this.saveCart();
            this.updateCartCount();
            this.updateMiniCart();
        }
    }

    // Mettre à jour la quantité
    updateQuantity(productId, quantity) {
        const item = this.items.find(item => item.id === productId);
        if (item) {
            item.quantity = parseInt(quantity);
            if (item.quantity <= 0) {
                this.removeItem(productId);
            } else {
                this.saveCart();
                this.updateCartCount();
                this.updateMiniCart();
                if (document.querySelector('.cart-items-full')) {
                    this.displayCartItems();
                }
                this.updateCartTotals();
            }
        }
    }

    // Sauvegarder le panier dans le localStorage
    saveCart() {
        localStorage.setItem('cart', JSON.stringify(this.items));
    }

    // Mettre à jour le compteur du panier
    updateCartCount() {
        const cartCount = document.querySelector('.cart-count');
        const cartBtn = document.querySelector('.cart-btn'); // Sélectionnez le bouton du panier
        
        if (cartCount) {
            const count = this.items.reduce((sum, item) => sum + item.quantity, 0);
            cartCount.textContent = count;
            
            // Ajouter ou supprimer la classe en fonction du nombre d'articles
            if (cartBtn) {
                if (count > 0) {
                    cartBtn.classList.add('has-items');
                } else {
                    cartBtn.classList.remove('has-items');
                }
            }
        }
    }
    // Initialiser le mini-panier
    initMiniCart() {
        const cartToggle = document.getElementById('cart-toggle');
        if (cartToggle) {
            cartToggle.addEventListener('click', (e) => {
                e.preventDefault();
                document.getElementById('mini-cart').classList.toggle('active');
            });
        }
        this.updateMiniCart();
    }

    // Mettre à jour le mini-panier
    updateMiniCart() {
        const cartItems = document.querySelector('.cart-items');
        if (!cartItems) return;

        if (this.items.length === 0) {
            cartItems.innerHTML = '<p>Votre panier est vide</p>';
        } else {
            cartItems.innerHTML = this.items.map(item => `
                <div class="mini-cart-item">
                    <img src="${item.image}" alt="${item.title}">
                    <div class="item-details">
                        <p>${item.title}</p>
                        <p>${item.quantity} x ${item.price}€</p>
                    </div>
                    <button onclick="cart.removeItem('${item.id}')" class="remove-item">×</button>
                </div>
            `).join('');
        }

        this.updateCartTotals();
    }

    // Afficher les articles dans la page panier
    displayCartItems() {
        const cartItemsContainer = document.querySelector('.cart-items-full');
        if (!cartItemsContainer) return;
    
        if (this.items.length === 0) {
            cartItemsContainer.innerHTML = `
                <div class="empty-cart-message">
                    <i class="fas fa-shopping-cart">Votre panier est vide</i>
                    <br>
                    <br>
                    <p>Vous pouvez ajouter des arcticle en cliquant sur le bouton ci-dessous</p>
                    <br>
                    <a href="index.html" class="checkout-btn">
                        <i class="fas fa-shopping-bag"></i>
                        Continuer mes achats
                    </a>
                </div>`;
        } else {
            cartItemsContainer.innerHTML = this.items.map(item => `
                <div class="cart-item" data-id="${item.id}">
                    <img src="${item.image}" alt="${item.title}">
                    <div class="item-details">
                        <h3>${item.title}</h3>
                        <p class="price">${item.price.toFixed(2)}€</p>
                        <div class="quantity-controls">
                            <button onclick="cart.updateQuantity('${item.id}', ${item.quantity - 1})">
                                <i class="fas fa-minus"></i>
                            </button>
                            <input type="number" 
                                   value="${item.quantity}" 
                                   min="1" 
                                   onchange="cart.updateQuantity('${item.id}', this.value)">
                            <button onclick="cart.updateQuantity('${item.id}', ${item.quantity + 1})">
                                <i class="fas fa-plus"></i>
                            </button>
                        </div>
                        <p class="item-total">Total: ${(item.price * item.quantity).toFixed(2)}€</p>
                    </div>
                    <button onclick="cart.removeItem('${item.id}')" class="remove-item" title="Supprimer">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
            `).join('');
        }
    
        this.updateCartTotals();
    }

    // Mettre à jour les totaux
    updateCartTotals() {
        const subtotal = this.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        const shipping = subtotal > 0 ? subtotal * 0.2 : 0; // Frais de livraison 20%
        const total = subtotal + shipping;

        // Mise à jour du mini-panier
        const cartTotal = document.getElementById('cart-total');
        if (cartTotal) {
            cartTotal.textContent = total.toFixed(2);
        }

        // Mise à jour de la page panier si on y est
        const subtotalElement = document.getElementById('subtotal');
        if (subtotalElement) {
            subtotalElement.textContent = subtotal.toFixed(2);
            document.getElementById('shipping').textContent = shipping.toFixed(2);
            document.getElementById('total').textContent = total.toFixed(2);
        }
    }
}

// Initialiser le panier
const cart = new Cart();

// Fonction pour ajouter au panier depuis la modal ou la carte produit
function addToCart(button) {
    const productCard = button.closest('.product-card') || button.closest('.modal-content');
    const product = {
        id: productCard.dataset.productId,
        title: productCard.querySelector('.product-title').textContent,
        price: parseFloat(productCard.querySelector('.current-price').textContent),
        image: productCard.querySelector('.product-image').src,
        quantity: 1
    };
    
    cart.addItem(product);
}