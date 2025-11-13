// Dynamic Product Management System
let affiliateProducts = JSON.parse(localStorage.getItem('tiktrendProducts')) || [
    // Sample products
    {
        affiliateLink: "https://www.tiktok.com/affiliate/sample1",
        title: "Viral Hair Growth Serum",
        description: "The hair serum that's taking TikTok by storm! Users report incredible growth results in weeks.",
        price: "$24.99",
        originalPrice: "$39.99",
        category: "beauty",
        badge: "Viral"
    },
    {
        affiliateLink: "https://www.tiktok.com/affiliate/sample2",
        title: "Smart Posture Corrector",
        description: "Wearable device that vibrates when you slouch. Perfect for desk workers and students.",
        price: "$29.99",
        originalPrice: "$49.99",
        category: "tech",
        badge: "Trending"
    }
];

// Display Configuration
const PRODUCTS_PER_PAGE = 20; // 4 products per row × 5 rows
let currentPage = 1;
let currentFilter = 'all';

// DOM Elements
const productsGrid = document.getElementById('productsGrid');
const filterBtns = document.querySelectorAll('.filter-btn');
const loadMoreBtn = document.getElementById('loadMore');
const adminPanel = document.getElementById('adminPanel');
const adminToggle = document.getElementById('adminToggle');
const productForm = document.getElementById('productForm');
const productList = document.getElementById('productList');
const productCount = document.getElementById('productCount');
const paginationContainer = document.createElement('div');

// Initialize the website
document.addEventListener('DOMContentLoaded', function() {
    initializePagination();
    displayProducts();
    setupEventListeners();
    updateProductList();
    console.log('TikTrend Shop loaded with', affiliateProducts.length, 'products');
});

// Initialize Pagination
function initializePagination() {
    paginationContainer.className = 'pagination';
    productsGrid.parentNode.insertBefore(paginationContainer, productsGrid.nextSibling);
}

// Display products with pagination
function displayProducts() {
    const filteredProducts = currentFilter === 'all' 
        ? affiliateProducts 
        : affiliateProducts.filter(product => product.category === currentFilter);
    
    const totalPages = Math.ceil(filteredProducts.length / PRODUCTS_PER_PAGE);
    const startIndex = (currentPage - 1) * PRODUCTS_PER_PAGE;
    const productsToShow = filteredProducts.slice(startIndex, startIndex + PRODUCTS_PER_PAGE);
    
    productsGrid.innerHTML = '';
    
    if (productsToShow.length === 0) {
        productsGrid.innerHTML = `
            <div class="no-products" style="grid-column: 1 / -1; text-align: center; padding: 3rem;">
                <i class="fas fa-shopping-bag" style="font-size: 3rem; color: #ccc; margin-bottom: 1rem;"></i>
                <h3>No products found</h3>
                <p>Add your first product using the admin panel!</p>
                <button class="btn-primary" onclick="openAdminPanel()">
                    <i class="fas fa-plus"></i> Add Product
                </button>
            </div>
        `;
        paginationContainer.style.display = 'none';
        return;
    }
    
    productsToShow.forEach(product => {
        const productCard = createProductCard(product);
        productsGrid.appendChild(productCard);
    });
    
    updatePagination(filteredProducts.length, totalPages);
}

// Update pagination controls
function updatePagination(totalProducts, totalPages) {
    paginationContainer.innerHTML = '';
    
    if (totalPages <= 1) {
        paginationContainer.style.display = 'none';
        return;
    }
    
    paginationContainer.style.display = 'flex';
    
    const prevButton = document.createElement('button');
    prevButton.className = 'pagination-btn';
    prevButton.innerHTML = '<i class="fas fa-chevron-left"></i> Previous';
    prevButton.disabled = currentPage === 1;
    prevButton.addEventListener('click', () => {
        if (currentPage > 1) {
            currentPage--;
            displayProducts();
        }
    });
    
    const nextButton = document.createElement('button');
    nextButton.className = 'pagination-btn';
    nextButton.innerHTML = 'Next <i class="fas fa-chevron-right"></i>';
    nextButton.disabled = currentPage === totalPages;
    nextButton.addEventListener('click', () => {
        if (currentPage < totalPages) {
            currentPage++;
            displayProducts();
        }
    });
    
    const pageInfo = document.createElement('span');
    pageInfo.className = 'page-info';
    pageInfo.textContent = `Page ${currentPage} of ${totalPages} (${totalProducts} products)`;
    
    paginationContainer.appendChild(prevButton);
    paginationContainer.appendChild(pageInfo);
    paginationContainer.appendChild(nextButton);
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
            currentPage = 1;
            displayProducts();
        });
    });
    
    // Admin panel toggle
    adminToggle.addEventListener('click', openAdminPanel);
    
    // Close admin panel
    document.getElementById('closeAdmin').addEventListener('click', closeAdminPanel);
    
    // Product form submission
    productForm.addEventListener('submit', function(e) {
        e.preventDefault();
        addProductFromForm();
    });
    
    // Export/Import buttons
    document.getElementById('exportProducts').addEventListener('click', exportProducts);
    document.getElementById('importProducts').addEventListener('click', () => {
        document.getElementById('importFile').click();
    });
    document.getElementById('importFile').addEventListener('change', importProducts);
    
    // Quick action buttons
    setupQuickActions();
    
    // Affiliate link clicks
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('btn-buy') || e.target.closest('.btn-buy')) {
            const button = e.target.classList.contains('btn-buy') ? e.target : e.target.closest('.btn-buy');
            const affiliateLink = button.getAttribute('data-link');
            
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

// Setup quick actions for form
function setupQuickActions() {
    const quickActions = document.createElement('div');
    quickActions.className = 'quick-actions';
    quickActions.innerHTML = `
        <button type="button" class="quick-btn" onclick="fillSampleData()">Fill Sample</button>
        <button type="button" class="quick-btn" onclick="clearForm()">Clear Form</button>
        <button type="button" class="quick-btn" onclick="addAnother()">Add Another</button>
        <button type="button" class="quick-btn" onclick="addRandomProduct()">Random Product</button>
    `;
    productForm.appendChild(quickActions);
}

// Admin Panel Functions
function openAdminPanel() {
    adminPanel.classList.add('active');
    createOverlay();
}

function closeAdminPanel() {
    adminPanel.classList.remove('active');
    removeOverlay();
}

function createOverlay() {
    const overlay = document.createElement('div');
    overlay.className = 'admin-overlay active';
    overlay.addEventListener('click', closeAdminPanel);
    document.body.appendChild(overlay);
}

function removeOverlay() {
    const overlay = document.querySelector('.admin-overlay');
    if (overlay) {
        overlay.remove();
    }
}

// Add product from form
function addProductFromForm() {
    const product = {
        affiliateLink: document.getElementById('affiliateLink').value,
        title: document.getElementById('productTitle').value,
        description: document.getElementById('productDescription').value,
        price: document.getElementById('productPrice').value,
        originalPrice: document.getElementById('productOriginalPrice').value || '',
        category: document.getElementById('productCategory').value,
        badge: document.getElementById('productBadge').value || ''
    };

    affiliateProducts.push(product);
    saveProducts();
    displayProducts();
    updateProductList();
    
    showSuccessMessage('Product added successfully!');
    
    // Don't clear form by default - allow multiple entries
}

// Update product list in admin panel
function updateProductList() {
    productCount.textContent = affiliateProducts.length;
    
    if (affiliateProducts.length === 0) {
        productList.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-box-open"></i>
                <p>No products added yet</p>
                <p style="font-size: 0.9rem; margin-top: 0.5rem;">Use the form above to add your first product!</p>
            </div>
        `;
        return;
    }

    productList.innerHTML = affiliateProducts.map((product, index) => `
        <div class="product-item">
            <div class="product-info">
                <strong>${product.title}</strong>
                <small>${product.category} • ${product.price}</small>
            </div>
            <button class="delete-btn" onclick="deleteProduct(${index})">
                <i class="fas fa-trash"></i> Delete
            </button>
        </div>
    `).join('');
}

// Delete product
function deleteProduct(index) {
    if (confirm('Are you sure you want to delete this product?')) {
        affiliateProducts.splice(index, 1);
        saveProducts();
        displayProducts();
        updateProductList();
        showNotification('Product deleted successfully!');
    }
}

// Save products to localStorage
function saveProducts() {
    localStorage.setItem('tiktrendProducts', JSON.stringify(affiliateProducts));
}

// Export products
function exportProducts() {
    const dataStr = JSON.stringify(affiliateProducts, null, 2);
    const dataBlob = new Blob([dataStr], {type: 'application/json'});
    
    const link = document.createElement('a');
    link.href = URL.createObjectURL(dataBlob);
    link.download = 'tiktrend-products.json';
    link.click();
    
    showNotification('Products exported successfully!');
}

// Import products
function importProducts(event) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function(e) {
        try {
            const importedProducts = JSON.parse(e.target.result);
            if (Array.isArray(importedProducts)) {
                affiliateProducts = importedProducts;
                saveProducts();
                displayProducts();
                updateProductList();
                showNotification('Products imported successfully!');
            } else {
                throw new Error('Invalid file format');
            }
        } catch (error) {
            showNotification('Error importing products. Please check the file format.');
        }
    };
    reader.readAsText(file);
    event.target.value = '';
}

// Quick Action Functions
function fillSampleData() {
    document.getElementById('affiliateLink').value = 'https://www.tiktok.com/affiliate/your-link-here';
    document.getElementById('productTitle').value = 'Amazing TikTok Product';
    document.getElementById('productDescription').value = 'This product is going viral on TikTok for its incredible results!';
    document.getElementById('productPrice').value = '$29.99';
    document.getElementById('productOriginalPrice').value = '$49.99';
    document.getElementById('productCategory').value = 'beauty';
    document.getElementById('productBadge').value = 'Viral';
}

function clearForm() {
    productForm.reset();
    showNotification('Form cleared!');
}

function addAnother() {
    if (productForm.checkValidity()) {
        addProductFromForm();
        productForm.reset();
    } else {
        productForm.reportValidity();
    }
}

function addRandomProduct() {
    const categories = ['beauty', 'tech', 'home', 'fashion'];
    const badges = ['Viral', 'Trending', 'Bestseller', 'New', 'Hot', ''];
    
    document.getElementById('affiliateLink').value = `https://www.tiktok.com/affiliate/product-${Date.now()}`;
    document.getElementById('productTitle').value = `Awesome ${categories[Math.floor(Math.random() * categories.length)]} Product`;
    document.getElementById('productDescription').value = 'This amazing product is taking TikTok by storm with incredible results that everyone is talking about!';
    document.getElementById('productPrice').value = `$${(Math.random() * 50 + 10).toFixed(2)}`;
    document.getElementById('productOriginalPrice').value = `$${(Math.random() * 100 + 30).toFixed(2)}`;
    document.getElementById('productCategory').value = categories[Math.floor(Math.random() * categories.length)];
    document.getElementById('productBadge').value = badges[Math.floor(Math.random() * badges.length)];
    
    showNotification('Random product data filled!');
}

// Success message
function showSuccessMessage(message) {
    // Remove existing success message
    const existingMessage = document.querySelector('.success-message');
    if (existingMessage) {
        existingMessage.remove();
    }
    
    const successMsg = document.createElement('div');
    successMsg.className = 'success-message';
    successMsg.innerHTML = `<i class="fas fa-check-circle"></i> ${message}`;
    
    // Insert after the form
    productForm.parentNode.insertBefore(successMsg, productForm.nextSibling);
    
    // Auto remove after 3 seconds
    setTimeout(() => {
        successMsg.remove();
    }, 3000);
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
        z-index: 1002;
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
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    
    .no-products {
        grid-column: 1 / -1;
        text-align: center;
        padding: 3rem;
        color: #666;
    }
`;
document.head.appendChild(style);
