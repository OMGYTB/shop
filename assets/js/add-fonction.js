// Fonction pour gérer le thème
function toggleTheme() {
    const html = document.documentElement;
    const currentTheme = html.getAttribute('data-theme');
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
            
            document.body.classList.add('theme-transition');
            html.setAttribute('data-theme', newTheme);
            
            const icon = document.querySelector('#themeToggle i');
            icon.className = newTheme === 'light' ? 'fas fa-sun' : 'fas fa-moon';
            
            localStorage.setItem('theme', newTheme);
            
            setTimeout(() => {
                document.body.classList.remove('theme-transition');
            }, 300);
        }

        // Fonction pour montrer le loading
        function showLoading() {
            document.getElementById('loading').style.display = 'flex';
        }

        // Fonction pour cacher le loading
        function hideLoading() {
            document.getElementById('loading').style.display = 'none';
        }

        // Fonction pour filtrer et trier les items
        function filterAndSortItems() {
            const sortBy = document.getElementById('sortBy').value;
            const priceRange = document.getElementById('priceRange').value;
            const searchTerm = document.getElementById('searchInput').value.toLowerCase();

            showLoading();

            setTimeout(() => {
                const wishlist = JSON.parse(localStorage.getItem('wishlist') || '[]');
                let items = wishlist.map(id => getProductData(id));

                // Filtrage par prix
                items = items.filter(item => parseFloat(item.price) <= parseFloat(priceRange));

                // Filtrage par recherche
                if (searchTerm) {
                    items = items.filter(item => 
                        item.name.toLowerCase().includes(searchTerm)
                    );
                }

                // Tri
                items.sort((a, b) => {
                    switch(sortBy) {
                        case 'name':
                            return a.name.localeCompare(b.name);
                        case 'price-asc':
                            return parseFloat(a.price) - parseFloat(b.price);
                        case 'price-desc':
                            return parseFloat(b.price) - parseFloat(a.price);
                        case 'date':
                            return new Date(b.date) - new Date(a.date);
                        default:
                            return 0;
                    }
                });

                displayItems(items);
                hideLoading();
            }, 500); // Simulation de chargement
        }

        // Fonction pour afficher les items
        function displayItems(items) {
            const container = document.getElementById('wishlist-items');
            
            if (items.length === 0) {
               container.innerHTML = `
                    <div class="empty-wishlist">
                        <i class="far fa-heart"></i>
                        <h2>Aucun produit trouvé</h2>
                        <p>Essayez de modifier vos filtres</p>
                    </div>
                `;
            return;
            }

            container.innerHTML = '';
            items.forEach(item => {
                const itemElement = createWishlistItem(item);
            container.appendChild(itemElement);
            });
        }

        // Initialisation
        document.addEventListener('DOMContentLoaded', () => {
            // Initialiser le thème
            const savedTheme = localStorage.getItem('theme') || 'light';
            document.documentElement.setAttribute('data-theme', savedTheme);
            document.querySelector('#themeToggle i').className = 
                savedTheme === 'light' ? 'fas fa-sun' : 'fas fa-moon';

            // Event listeners pour les filtres
            document.getElementById('sortBy').addEventListener('change', filterAndSortItems);
            document.getElementById('priceRange').addEventListener('input', (e) => {
                document.getElementById('priceValue').textContent = `${e.target.value}€`;
                filterAndSortItems();
            });
            document.getElementById('searchInput').addEventListener('input', filterAndSortItems);
            document.getElementById('themeToggle').addEventListener('click', toggleTheme);

            // Charger les items initiaux
            filterAndSortItems();
        });