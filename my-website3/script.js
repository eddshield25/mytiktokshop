// Dynamic Product Management System
let affiliateProducts = JSON.parse(localStorage.getItem('tiktrendProducts')) || [];

// DOM Elements
const productsGrid = document.getElementById('productsGrid');
const filterBtns = document.querySelectorAll('.filter-btn');
const loadMoreBtn = document.getElementById('loadMore');
const adminPanel = document.getElementById('adminPanel');
const adminToggle = document.getElementById('adminToggle');
const productForm = document.getElementById('productForm');
let currentFilter = 'all';
let displayedProducts = 8;

// Initialize the website
document.addEventListener('DOMContentLoaded', function() {
    initializeAdminPanel();
    displayProducts();
    setupEventListeners();
    console.log('TikTrend Shop loaded with', affiliateProducts.length, 'products');
});

// Initialize Admin Panel
function initializeAdminPanel() {
    // Create admin panel if it doesn't exist
    if (!adminPanel) {
        createAdminPanel();
    }
}

// Create Admin Panel
function createAdminPanel() {
    const panel = document.createElement('div');
    panel.id = 'adminPanel';
    panel.style.cssText = `
        position: fixed;
        top: 0;
        right: -400px;
        width: 400px;
        height: 100vh;
        background: white;
        box-shadow: -5px 0 15px rgba(0,0,0,0.1);
        z-index: 10000;
        transition: right 0.3s ease;
        padding: 20px;
        overflow-y: auto;
    `;

    panel.innerHTML = `
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
            <h3 style="margin: 0; color: var(--primary-color);">Product Manager</h3>
            <button id="closeAdmin" style="background: none; border: none; font-size: 1.5rem; cursor: pointer;">×</button>
        </div>
        
        <form id="productForm">
            <div style="margin-bottom: 15px;">
                <label style="display: block; margin-bottom: 5px; font-weight: bold;">Affiliate Link *</label>
                <input type="url" id="affiliateLink" required 
                       style="width: 100%; padding: 10px; border: 2px solid #ddd; border-radius: 8px;"
                       placeholder="https://www.tiktok.com/affiliate/your-link">
            </div>
            
            <div style="margin-bottom: 15px;">
                <label style="display: block; margin-bottom: 5px; font-weight: bold;">Product Title *</label>
                <input type="text" id="productTitle" required 
                       style="width: 100%; padding: 10px; border: 2px solid #ddd; border-radius: 8px;"
                       placeholder="Viral Hair Growth Serum">
            </div>
            
            <div style="margin-bottom: 15px;">
                <label style="display: block; margin-bottom: 5px; font-weight: bold;">Description *</label>
                <textarea id="productDescription" required 
                          style="width: 100%; padding: 10px; border: 2px solid #ddd; border-radius: 8px; height: 80px;"
                          placeholder="This amazing product is going viral on TikTok..."></textarea>
            </div>
            
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin-bottom: 15px;">
                <div>
                    <label style="display: block; margin-bottom: 5px; font-weight: bold;">Price *</label>
                    <input type="text" id="productPrice" required 
                           style="width: 100%; padding: 10px; border: 2px solid #ddd; border-radius: 8px;"
                           placeholder="$24.99">
                </div>
                <div>
                    <label style="display: block; margin-bottom: 5px; font-weight: bold;">Original Price</label>
                    <input type="text" id="productOriginalPrice" 
                           style="width: 100%; padding: 10px; border: 2px solid #ddd; border-radius: 8px;"
                           placeholder="$39.99">
                </div>
            </div>
            
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin-bottom: 20px;">
                <div>
                    <label style="display: block; margin-bottom: 5px; font-weight: bold;">Category *</label>
                    <select id="productCategory" required 
                            style="width: 100%; padding: 10px; border: 2px solid #ddd; border-radius: 8px;">
                        <option value="beauty">Beauty</option>
                        <option value="tech">Tech Gadgets</option>
                        <option value="home">Home & Living</option>
                        <option value="fashion">Fashion</option>
                    </select>
                </div>
                <div>
                    <label style="display: block; margin-bottom: 5px; font-weight: bold;">Badge</label>
                    <select id="productBadge" 
                            style="width: 100%; padding: 10px; border: 2px solid #ddd; border-radius: 8px;">
                        <option value="">No Badge</option>
                        <option value="Viral">Viral</option>
                        <option value="Trending">Trending</option>
                        <option value="Bestseller">Bestseller</option>
                        <option value="New">New</option>
                        <option value="Hot">Hot</option>
                    </select>
                </div>
            </div>
            
            <button type="submit" 
                    style="width: 100%; padding: 12px; background: var(--primary-color); color: white; border: none; border-radius: 8px; font-size: 1.1rem; cursor: pointer;">
                Add Product
            </button>
        </form>
        
        <div style="margin-top: 30px;">
            <h4 style="margin-bottom: 15px;">Existing Products (${affiliateProducts.length})</h4>
            <div id="productList" style="max-height: 300px; overflow-y: auto;">
                ${generateProductList()}
            </div>
        </div>
        
        <div style="margin-top: 20px; padding: 15px; background: #f8f9fa; border-radius: 8px;">
            <button id="exportProducts" style="width: 100%; padding: 10px; margin-bottom: 10px; background: #28a745; color: white; border: none; border-radius: 6px; cursor: pointer;">
                Export Products
            </button>
            <button id="importProducts" style="width: 100%; padding: 10px; background: #17a2b8; color: white; border: none; border-radius: 6px; cursor: pointer;">
                Import Products
            </button>
            <input type="file" id="importFile" accept=".json" style="display: none;">
        </div>
    `;

    document.body.appendChild(panel);

    // Add admin toggle button
    const toggleBtn = document.createElement('button');
    toggleBtn.id = 'adminToggle';
    toggleBtn.innerHTML = '⚙️ Manage Products';
    toggleBtn.style.cssText = `
        position: fixed;
        top: 50%;
        right: 0;
        transform: translateY(-50%) rotate(90deg);
        background: var(--primary-color);
        color: white;
        border: none;
        padding: 10px 15px;
        border-radius: 8px 8px 0 0;
        cursor: pointer;
        z-index: 9999;
        font-weight: bold;
        transform-origin: right bottom;
    `;
    document.body.appendChild(toggleBtn);

    setupAdminEvents();
}

// Generate product list for admin panel
function generateProductList() {
    if (affiliateProducts.length === 0) {
        return '<p style="text-align: center; color: #666;">No products added yet</p>';
    }

    return affiliateProducts.map((product, index) => `
        <div style="display: flex; justify-content: between; align-items: center; padding: 10px; border-bottom: 1px solid #eee;">
            <div style="flex: 1;">
                <strong>${product.title}</strong><br>
                <small style="color: #666;">${product.category} • ${product.price}</small>
            </div>
            <button onclick="deleteProduct(${index})" style="background: #dc3545; color: white; border: none; border-radius: 4px; padding: 5px 10px; cursor: pointer; margin-left: 10px;">
                Delete
            </button>
        </div>
    `).join('');
}

// Setup admin panel events
function setupAdminEvents() {
    const adminToggle = document.getElementById('adminToggle');
    const adminPanel = document.getElementById('adminPanel');
    const closeAdmin = document.getElementById('closeAdmin');
    const productForm = document.getElementById('productForm');
    const exportBtn = document.getElementById('exportProducts');
    const importBtn = document.getElementById('importProducts');
    const importFile = document.getElementById('importFile');

    adminToggle.addEventListener('click', () => {
        adminPanel.style.right = adminPanel.style.right === '0px' ? '-400px' : '0px';
    });

    closeAdmin.addEventListener('click', () => {
        adminPanel.style.right = '-400px';
    });

    productForm.addEventListener('submit', function(e) {
        e.preventDefault();
        addProductFromForm();
    });

    exportBtn.addEventListener('click', exportProducts);
    importBtn.addEventListener('click', () => importFile.click());
    importFile.addEventListener('change', importProducts);
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
    updateAdminPanel();
    
    // Reset form
    document.getElementById('productForm').reset();
    showNotification('Product added successfully!');
}

// Delete product
function deleteProduct(index) {
    if (confirm('Are you sure you want to delete this product?')) {
        affiliateProducts.splice(index, 1);
        saveProducts();
        displayProducts();
        updateAdminPanel();
        showNotification('Product deleted successfully!');
    }
}

// Update admin panel
function updateAdminPanel() {
    const productList = document.getElementById('productList');
    if (productList) {
        productList.innerHTML = generateProductList();
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
                updateAdminPanel();
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

// Display products based on filter
function displayProducts() {
    const filteredProducts = currentFilter === 'all' 
        ? affiliateProducts 
        : affiliateProducts.filter(product => product.category === currentFilter);
    
    const productsToShow = filteredProducts.slice(0, displayedProducts);
    
    productsGrid.innerHTML = '';
    
    if (productsToShow.length === 0) {
        productsGrid.innerHTML = '<p class="no-products">No products found. Add some products using the admin panel!</p>';
        loadMoreBtn.style.display = 'none';
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
    
    .no-products {
        grid-column: 1 / -1;
        text-align: center;
        padding: 3rem;
        color: #666;
        font-size: 1.1rem;
    }
`;
document.head.appendChild(style);
