// Sample product data - Replace with your actual TikTok affiliate products
const products = [
    {
        id: 1,
        title: "Viral Hair Growth Serum",
        description: "The hair serum that's taking TikTok by storm! Users report incredible growth results in weeks.",
        price: "$24.99",
        originalPrice: "$39.99",
        image: "💇‍♀️",
        category: "beauty",
        badge: "Viral",
        affiliateLink: "https://www.tiktok.com/affiliate/link1",
        trending: true
    },
    {
        id: 2,
        title: "Smart Posture Corrector",
        description: "Wearable device that vibrates when you slouch. Perfect for desk workers and students.",
        price: "$29.99",
        originalPrice: "$49.99",
        image: "📱",
        category: "tech",
        badge: "Trending",
        affiliateLink: "https://www.tiktok.com/affiliate/link2",
        trending: true
    },
    {
        id: 3,
        title: "LED Face Mask Therapy",
        description: "Professional-grade LED light therapy mask for anti-aging and acne treatment at home.",
        price: "$89.99",
        originalPrice: "$129.99",
        image: "🎭",
        category: "beauty",
        badge: "Bestseller",
        affiliateLink: "https://www.tiktok.com/affiliate/link3",
        trending: false
    },
    {
        id: 4,
        title: "Magnetic Phone Grip",
        description: "Strong magnetic phone grip that works with MagSafe and all phone cases. Multiple colors available.",
        price: "$14.99",
        originalPrice: "$24.99",
        image: "📱",
        category: "tech",
        badge: "Popular",
        affiliateLink: "https://www.tiktok.com/affiliate/link4",
        trending: true
    },
    {
        id: 5,
        title: "Glass Skin Moisturizer",
        description: "Korean skincare formula that gives you that glass skin effect everyone wants.",
        price: "$19.99",
        originalPrice: "$34.99",
        image: "💆‍♀️",
        category: "beauty",
        badge: "New",
        affiliateLink: "https://www.tiktok.com/affiliate/link5",
        trending: false
    },
    {
        id: 6,
        title: "Portable Blender",
        description: "Mini wireless blender perfect for smoothies, protein shakes, and mixing drinks on the go.",
        price: "$34.99",
        originalPrice: "$49.99",
        image: "🥤",
        category: "home",
        badge: "Hot",
        affiliateLink: "https://www.tiktok.com/affiliate/link6",
        trending: true
    },
    {
        id: 7,
        title: "Crystal Hair Remover",
        description: "Painless hair removal device that uses crystal technology for smooth skin.",
        price: "$39.99",
        originalPrice: "$59.99",
        image: "💎",
        category: "beauty",
        badge: "Viral",
        affiliateLink: "https://www.tiktok.com/affiliate/link7",
        trending: true
    },
    {
        id: 8,
        title: "Designer Phone Case",
        description: "Aesthetic phone cases with unique designs that protect your phone in style.",
        price: "$22.99",
        originalPrice: "$35.99",
        image: "📱",
        category: "fashion",
        badge: "Trending",
        affiliateLink: "https://www.tiktok.com/affiliate/link8",
        trending: false
    }
];

// DOM Elements
const productsGrid = document.getElementById('productsGrid');
const filterBtns = document.querySelectorAll('.filter-btn');
const loadMoreBtn = document.getElementById('loadMore');
let currentFilter = 'all';
let displayedProducts = 8;
const productsPerLoad = 4;

// Initialize the page
document.addEventListener('DOMContentLoaded', function() {
    displayProducts();
    setupEventListeners();
});

// Display products based on current filter
function displayProducts() {
    const filteredProducts = filterProducts();
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
    
    // Show/hide load more button
    if (displayedProducts >= filteredProducts.length) {
        loadMoreBtn.style.display = 'none';
    } else {
        loadMoreBtn.style.display = 'block';
    }
}

// Filter products based on current selection
function filterProducts() {
    if (currentFilter === 'all') {
        return products;
    }
    return products.filter(product => product.category === currentFilter);
}

// Create product card HTML
function createProductCard(product) {
    const card = document.createElement('div');
    card.className = 'product-card';
    card.innerHTML = `
        ${product.badge ? `<div class="product-badge">${product.badge}</div>` : ''}
        <div class="product-image">
            ${product.image || '<i class="fas fa-shopping-bag"></i>'}
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
            const filter = this.getAttribute('data-filter');
            
            // Update active button
            filterBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            
            // Update filter and reset display count
            currentFilter = filter;
            displayedProducts = 8;
            displayProducts();
        });
    });
    
    // Load more button
    loadMoreBtn.addEventListener('click', function() {
        displayedProducts += productsPerLoad;
        displayProducts();
        
        // Smooth scroll to show new products
        productsGrid.lastElementChild.scrollIntoView({
            behavior: 'smooth',
            block: 'nearest'
        });
    });
    
    // Buy button clicks (affiliate links)
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('btn-buy') || e.target.closest('.btn-buy')) {
            const button = e.target.classList.contains('btn-buy') ? e.target : e.target.closest('.btn-buy');
            const affiliateLink = button.getAttribute('data-link');
            
            // Track the click (you can add analytics here)
            trackAffiliateClick(affiliateLink);
            
            // Open affiliate link in new tab
            window.open(affiliateLink, '_blank');
        }
    });
    
    // Save/wishlist button
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('btn-save') || e.target.closest('.btn-save')) {
            const button = e.target.classList.contains('btn-save') ? e.target : e.target.closest('.btn-save');
            const icon = button.querySelector('i');
            
            if (icon.classList.contains('far')) {
                icon.classList.remove('far');
                icon.classList.add('fas');
                icon.style.color = 'var(--primary-color)';
                showNotification('Product added to wishlist!');
            } else {
                icon.classList.remove('fas');
                icon.classList.add('far');
                icon.style.color = '';
                showNotification('Product removed from wishlist');
            }
        }
    });
    
    // Search functionality
    const searchBtn = document.querySelector('.btn-search');
    searchBtn.addEventListener('click', function() {
        const searchTerm = prompt('What product are you looking for?');
        if (searchTerm) {
            searchProducts(searchTerm);
        }
    });
}

// Track affiliate clicks (you can integrate with analytics)
function trackAffiliateClick(link) {
    console.log('Affiliate link clicked:', link);
    // Add your analytics tracking code here
    // Example: Google Analytics, Facebook Pixel, etc.
}

// Search products
function searchProducts(term) {
    const filtered = products.filter(product => 
        product.title.toLowerCase().includes(term.toLowerCase()) ||
        product.description.toLowerCase().includes(term.toLowerCase())
    );
    
    currentFilter = 'all';
    filterBtns.forEach(btn => btn.classList.remove('active'));
    filterBtns[0].classList.add('active');
    
    // Create temporary display of search results
    const tempProducts = [...filtered];
    displayedProducts = 8;
    
    productsGrid.innerHTML = '';
    
    if (tempProducts.length === 0) {
        productsGrid.innerHTML = `
            <div class="no-products" style="grid-column: 1 / -1; text-align: center; padding: 2rem;">
                <h3>No products found for "${term}"</h3>
                <p>Try searching for something else or browse all categories.</p>
            </div>
        `;
        loadMoreBtn.style.display = 'none';
        return;
    }
    
    const productsToShow = tempProducts.slice(0, displayedProducts);
    productsToShow.forEach(product => {
        const productCard = createProductCard(product);
        productsGrid.appendChild(productCard);
    });
    
    if (displayedProducts >= tempProducts.length) {
        loadMoreBtn.style.display = 'none';
    } else {
        loadMoreBtn.style.display = 'block';
    }
    
    showNotification(`Found ${filtered.length} products for "${term}"`);
}

// Show notification
function showNotification(message) {
    // Create notification element
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: var(--primary-color);
        color: white;
        padding: 1rem 1.5rem;
        border-radius: var(--border-radius);
        box-shadow: var(--box-shadow);
        z-index: 1000;
        transform: translateX(400px);
        transition: transform 0.3s ease;
        max-width: 300px;
    `;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Remove after 3 seconds
    setTimeout(() => {
        notification.style.transform = 'translateX(400px)';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

// Cart functionality (basic)
let cartCount = 0;
const cartBtn = document.querySelector('.btn-cart');
const cartCountEl = document.querySelector('.cart-count');

cartBtn.addEventListener('click', function() {
    showNotification('Cart functionality would open here! This is an affiliate site - products are purchased directly on TikTok.');
});

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Newsletter form submission
const newsletterForm = document.querySelector('.newsletter-form');
if (newsletterForm) {
    newsletterForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const email = this.querySelector('input[type="email"]').value;
        showNotification(`Thank you for subscribing with ${email}! You'll get updates on viral products.`);
        this.reset();
    });
}