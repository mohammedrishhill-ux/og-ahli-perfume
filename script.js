// --- DATA ---
// ADDED 6 PRODUCTS HERE
const products = [
    { 
        id: 1, 
        name: "REDLOOFI", 
        image: "img1.jpg", 
        description: "A fresh, airy fragrance with notes of sea salt, white musk, and bergamot. Perfect for daily wear.",
        prices: {
            "20ml": 390,
            "50ml": 990
        }
    },
    { 
        id: 2, 
        name: "MIDNIGHT OUD", 
        image: "IMGproduct1.jpg", 
        description: "A deep, woody scent featuring rich agarwood, leather, and spices. An intense choice for evening events.",
        prices: {
            "20ml": 599,
            "50ml": 1199
        }
    },
    // Uncomment and add images for more products
    
    // { 
    //     id: 3, 
    //     name: "ROYAL ROSE", 
    //     image: "img3.jpg", 
    //     description: "A sophisticated floral blend of Bulgarian rose, jasmine, and a hint of vanilla. Elegant and timeless.",
    //     prices: {
    //         "20ml": 449,
    //         "50ml": 899
    //     }
    // },

];

// --- STATE --
let cart = [];
let currentProduct = null;
let currentSize = "20ml";
let currentPrice = 499;

// --- DOM ELEMENTS ---
const grid = document.getElementById('product-grid');
const modal = document.getElementById('product-modal');
const closeModal = document.querySelector('.close-modal');
const navbar = document.getElementById('navbar');
const cartCountEl = document.getElementById('cart-count');
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('navLinks');

// Cart Sidebar Elements
const cartSidebar = document.getElementById('cart-sidebar');
const cartOverlay = document.querySelector('.cart-overlay');
const cartItemsContainer = document.getElementById('cart-items-container');
const cartTotalPriceEl = document.getElementById('cart-total-price');

// Modal Elements
const modalImg = document.getElementById('modal-img');
const modalTitle = document.getElementById('modal-title');
const modalDesc = document.getElementById('modal-desc');
const modalPrice = document.getElementById('modal-price');
const addToCartBtn = document.getElementById('add-to-cart-btn');
const orderNowBtn = document.getElementById('order-now-btn');
const btn20ml = document.getElementById('btn-20ml');
const btn50ml = document.getElementById('btn-50ml');

// Contact Form Elements
const contactForm = document.getElementById('contactForm');
const contactName = document.getElementById('contact-name');
const contactEmail = document.getElementById('contact-email');
const contactMessage = document.getElementById('contact-message');
const successMessage = document.getElementById('successMessage');

// --- INIT ---
function init() {
    renderProducts();
    setupNavbarScroll();
    setupEventListeners();
    setupMobileMenu();
}

function renderProducts() {
    grid.innerHTML = products.map(product => `
        <div class="product-card" onclick="openProduct(${product.id})">
            <div class="card-img-container"><img src="${product.image}" alt="${product.name}" onerror="this.src='https://images.unsplash.com/photo-1541643600914-78b084683601?q=80&w=1000&auto=format&fit=crop'"></div>
            <div class="card-details">
                <h3 class="card-title">${product.name}</h3>
                <p class="card-price">Starting from ₹${product.prices["20ml"]}</p>
            </div>
        </div>
    `).join('');
}

function setupNavbarScroll() {
    let lastScrollTop = 0;
    window.addEventListener('scroll', () => {
        let scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        if (scrollTop > lastScrollTop) {
            navbar.classList.add('nav-hidden');
            navbar.classList.remove('nav-visible');
        } else {
            navbar.classList.remove('nav-hidden');
            navbar.classList.add('nav-visible');
        }
        lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;
    });
}

// --- MOBILE MENU LOGIC ---
function setupMobileMenu() {
    hamburger.addEventListener('click', toggleMobileMenu);
    document.addEventListener('click', (e) => {
        if (!navLinks.contains(e.target) && !hamburger.contains(e.target)) {
            closeMobileMenu();
        }
    });
    window.addEventListener('scroll', () => {
        if (navLinks.classList.contains('active')) {
            closeMobileMenu();
        }
    });
}

function toggleMobileMenu(e) {
    if (e) e.stopPropagation();
    navLinks.classList.toggle('active');
    const icon = hamburger.querySelector('i');
    if (navLinks.classList.contains('active')) {
        icon.classList.remove('fa-bars');
        icon.classList.add('fa-times');
    } else {
        icon.classList.remove('fa-times');
        icon.classList.add('fa-bars');
    }
}

function closeMobileMenu() {
    navLinks.classList.remove('active');
    const icon = hamburger.querySelector('i');
    icon.classList.remove('fa-times');
    icon.classList.add('fa-bars');
}

// --- MODAL LOGIC & SIZE SELECTION ---
// Attached to window to be accessible from HTML onclick attributes
window.openProduct = (id) => {
    currentProduct = products.find(p => p.id === id);
    
    // Reset to default selection (20ml)
    selectSize('20ml');

    modalImg.src = currentProduct.image;
    modalImg.onerror = function() {
        this.src = 'https://images.unsplash.com/photo-1541643600914-78b084683601?q=80&w=1000&auto=format&fit=crop';
    }
    modalTitle.textContent = currentProduct.name;
    modalDesc.textContent = currentProduct.description;
    
    modal.style.display = "flex";
    setTimeout(() => modal.classList.add('show'), 10);
    closeMobileMenu();
};

window.selectSize = (size) => {
    currentSize = size;
    if(currentProduct) {
        currentPrice = currentProduct.prices[size];
        modalPrice.textContent = `₹${currentPrice.toLocaleString()}`;
        
        // Update UI Buttons
        if(size === '20ml') {
            btn20ml.classList.add('active');
            btn50ml.classList.remove('active');
        } else {
            btn50ml.classList.add('active');
            btn20ml.classList.remove('active');
        }
    }
}

function closeModalFunc() {
    modal.classList.remove('show');
    setTimeout(() => modal.style.display = "none", 300);
}

// --- CART LOGIC ---
// Attached to window
window.toggleCart = () => {
    cartSidebar.classList.toggle('open');
    cartOverlay.classList.toggle('open');
    closeMobileMenu();
    if (cartSidebar.classList.contains('open')) {
        renderCartItems();
    }
}

function addToCart() {
    if(!currentProduct) return;
    
    // Create a specific cart item based on selection
    const cartItem = {
        ...currentProduct,
        selectedSize: currentSize,
        price: currentPrice // Use the selected price
    };

    cart.push(cartItem);
    updateCartCount();
    
    // UI Feedback
    cartCountEl.classList.add('pulse');
    setTimeout(() => cartCountEl.classList.remove('pulse'), 300);
    addToCartBtn.textContent = "Added!";
    setTimeout(() => addToCartBtn.textContent = "Add to Cart", 1500);
    
    window.toggleCart();
}

// Attached to window
window.removeFromCart = (index) => {
    cart.splice(index, 1);
    updateCartCount();
    renderCartItems();
}

function updateCartCount() {
    cartCountEl.textContent = cart.length;
}

function renderCartItems() {
    if (cart.length === 0) {
        cartItemsContainer.innerHTML = '<p style="text-align: center; color: #64748b; margin-top: 2rem;">Your cart is empty.</p>';
        cartTotalPriceEl.textContent = '₹0';
        return;
    }

    let total = 0;
    cartItemsContainer.innerHTML = cart.map((item, index) => {
        total += item.price;
        return `
            <div class="cart-item">
                <img src="${item.image}" alt="${item.name}" onerror="this.src='https://images.unsplash.com/photo-1541643600914-78b084683601?q=80&w=1000&auto=format&fit=crop'">
                <div class="cart-item-details">
                    <div class="cart-item-title">${item.name} <span style="font-size:0.8em; color:#666;">(${item.selectedSize})</span></div>
                    <div class="cart-item-price">₹${item.price.toLocaleString()}</div>
                    <div class="remove-item" onclick="removeFromCart(${index})">Remove</div>
                </div>
            </div>
        `;
    }).join('');
    
    cartTotalPriceEl.textContent = `₹${total.toLocaleString()}`;
}

// --- WHATSAPP ORDERING ---
function orderSingleOnWhatsApp() {
    if(!currentProduct) return;
    const phoneNumber = "918075584863";
    
    // Using %0A for line breaks in WhatsApp URL
    const message = `Hi! I want to order from Ahli Perfume:%0A%0A*Product:* ${currentProduct.name}%0A*Size:* ${currentSize}%0A*Price:* ₹${currentPrice}%0A%0APlease confirm my order.`;
    
    window.open(`https://wa.me/${phoneNumber}?text=${message}`, '_blank');
}

window.checkoutCart = () => {
    if (cart.length === 0) {
        alert("Your cart is empty!");
        return;
    }

    const phoneNumber = "918075584863";
    let message = "Hi! I would like to place an order from Ahli Perfume:%0A%0A";
    let total = 0;

    cart.forEach((item, index) => {
        message += `${index + 1}. *${item.name} (${item.selectedSize})* - ₹${item.price}%0A`;
        total += item.price;
    });

    message += `%0A*Total Amount: ₹${total.toLocaleString()}*%0A%0APlease confirm my order.`;
    
    window.open(`https://wa.me/${phoneNumber}?text=${message}`, '_blank');
}

// --- CONTACT FORM WHATSAPP ---
window.sendContactMessage = () => {
    const name = contactName.value.trim();
    const email = contactEmail.value.trim();
    const messageText = contactMessage.value.trim();
    
    if (!name || !email || !messageText) {
        alert("Please fill in all fields.");
        return;
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        alert("Please enter a valid email address.");
        return;
    }
    
    successMessage.style.display = 'block';
    
    const phoneNumber = "918075584863";
    const whatsappMessage = `*New Contact Form Submission - Ahli Perfume*%0A%0A*Name:* ${name}%0A*Email:* ${email}%0A*Message:* ${messageText}%0A%0A*Date:* ${new Date().toLocaleString()}`;
    
    setTimeout(() => {
        window.open(`https://wa.me/${phoneNumber}?text=${whatsappMessage}`, '_blank');
        contactForm.reset();
        successMessage.style.display = 'none';
    }, 2000);
}

// --- EVENT LISTENERS ---
function setupEventListeners() {
    closeModal.addEventListener('click', closeModalFunc);
    window.addEventListener('click', (e) => {
        if (e.target == modal) closeModalFunc();
    });
    addToCartBtn.addEventListener('click', addToCart);
    orderNowBtn.addEventListener('click', orderSingleOnWhatsApp);
    
    contactForm.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            sendContactMessage();
        }
    });
}

init();