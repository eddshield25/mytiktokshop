// Simple product configuration - just add your affiliate links and product details
const affiliateProducts = [
    {
        affiliateLink: "https://vt.tiktok.com/ZSH36LxvvSCjd-eWYRh",
        title: "Viral Hair Growth Serum",
        description: "The hair serum that's taking TikTok by storm! Users report incredible growth results in weeks.",
        price: "$24.99",
        originalPrice: "$39.99",
        category: "beauty",
        badge: "Viral"
    },
    {
        affiliateLink: "https://www.tiktok.com/affiliate/your-link-2", 
        title: "Smart Posture Corrector",
        description: "Wearable device that vibrates when you slouch. Perfect for desk workers and students.",
        price: "$29.99",
        originalPrice: "$49.99",
        category: "tech",
        badge: "Trending"
    },
    // ADD MORE PRODUCTS HERE:
    // Copy the format above and replace with your affiliate links & product info
    {
        affiliateLink: "YOUR_TIKTOK_AFFILIATE_LINK_HERE",
        title: "Your Product Name",
        description: "Product description that will appeal to customers",
        price: "$00.00",
        originalPrice: "$00.00",
        category: "beauty",
        badge: "New"
    }
];

// DOM Elements
const productsGrid = document.getElementById('productsGrid');
const filterBtns = document.querySelectorAll('.filter-btn');
const loadMoreBtn = document.getElementById('loadMore');
let currentFilter = 'all';
let displayedProducts = 8;

// Initialize the website
document.addEventListener('DOMContentLoaded', function() {
    displayProducts();
    setupEventListeners();
    console.log('TikTrend Shop loaded with', affiliateProducts.length, 'products');
});

// Display products based on filter
function displayProducts() {
    const filteredProducts = currentFilter === 'all' 
        ? affiliateProducts 
        : affiliateProducts.filter(product => product.category === currentFilter);
    
    const productsToShow = filteredProducts.slice(0, displayedProducts);
    
    productsGrid.innerHTML = '';
    
    if (productsToShow.length === 0) {
        productsGrid.innerHTML = '<p class="no-products">No products found in this category.</p>';
        return;
    }
    
    productsToShow.forEach(product => {
        const productCard = createProductCard(product);
        productsGrid.appendChild(productCard);
    });
    
    loadMoreBtn.style.display = displayedProducts >= filteredProducts.length ? 'none' : 'block';
}

// Create product card HTML
function createProductCard(product) {
    const card = document.createElement('div');
    card.className = 'product-card';
    card.innerHTML = `
        ${product.badge ? `<div class="product-badge">${product.badge}</div>` : ''}
        <div class="product-image">
            <i class="fas fa-shopping-bag"></i>
        </div>
        <div class="product-content">
            <h3 class="product-title">${product.title}</h3>
            <p class="product-description">${product.description}</p>
            <div class="product-price">
                ${product.price}
                ${product.originalPrice ? `<span class="product-original-price">${product.originalPrice}</span>` : ''}
            </div>
            <div class="product-actions">
                <button class="btn-buy" data-link="${product.affiliateLink}">
                    <i class="fab fa-tiktok"></i>
                    Buy on TikTok
                </button>
                <button class="btn-save">
                    <i class="far fa-heart"></i>
                </button>
            </div>
        </div>
    `;
    return card;
}

// Setup event listeners
function setupEventListeners() {
    // Filter buttons
    filterBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            filterBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            currentFilter = this.getAttribute('data-filter');
            displayedProducts = 8;
            displayProducts();
        });
    });
    
    // Load more button
    loadMoreBtn.addEventListener('click', function() {
        displayedProducts += 4;
        displayProducts();
    });
    
    // Affiliate link clicks
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('btn-buy') || e.target.closest('.btn-buy')) {
            const button = e.target.classList.contains('btn-buy') ? e.target : e.target.closest('.btn-buy');
            const affiliateLink = button.getAttribute('data-link');
            
            // Track click and open affiliate link
            console.log('Affiliate link clicked:', affiliateLink);
            window.open(affiliateLink, '_blank');
            showNotification('Opening TikTok Shop...');
        }
    });
    
    // Wishlist functionality
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('btn-save') || e.target.closest('.btn-save')) {
            const button = e.target.classList.contains('btn-save') ? e.target : e.target.closest('.btn-save');
            const icon = button.querySelector('i');
            const isSaved = icon.classList.contains('fas');
            
            icon.classList.toggle('far', isSaved);
            icon.classList.toggle('fas', !isSaved);
            icon.style.color = !isSaved ? 'var(--primary-color)' : '';
            
            showNotification(!isSaved ? 'Added to wishlist!' : 'Removed from wishlist');
        }
    });
}

// Simple notification system
function showNotification(message) {
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: var(--primary-color);
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 12px;
        box-shadow: 0 8px 30px rgba(0, 0, 0, 0.12);
        z-index: 1000;
        animation: slideIn 0.3s ease;
    `;
    notification.textContent = message;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.remove();
    }, 3000);
}

// Add CSS animation for notifications
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from { transform: translateX(100%); }
        to { transform: translateX(0); }
    }
`;
document.head.appendChild(style);
