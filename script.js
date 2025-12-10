// --- DATA ---
const products = [
    { 
        id: 1, 
        name: "REDLOOFI WOMEN", 
        // Default thumbnail
        image: "productimg1.big.jpg", 
        // Specific images for sizes
        images: {
            "Small": "productimg1small.jpg", // Image for Small size
            "Big": "productimg1.big.jpg"    // Image for Big size
        },
        description: "A soft, elegant, and feminine scent with a warm, graceful touch. Ideal for women who love a gentle yet lasting aroma.",
        prices: {
            "Small": 490,
            "Big": 990
        }
    },
    { 
        id: 2, 
        name: "BLAKAZIN MEN", 
        image: "productimg2 big.jpg", 
        images: {
            "Small": "productimg2 small.jpg", 
            "Big": "productimg2 big.jpg"
        },
        description: "A bold and fresh masculine fragrance that gives confidence and long-lasting energy. Perfect for daily wear.",
        prices: {
            "Small": 490,
            "Big": 990
        }
    }
    // Add more products here...
];

// --- STATE --
let cart = [];
let currentProduct = null;
let currentSize = "Small"; // Default is now Small
let currentPrice = 0;

// --- DOM ELEMENTS ---
const grid = document.getElementById('product-grid');
const modal = document.getElementById('product-modal');
const closeModal = document.querySelector('.close-modal');
const navbar = document.getElementById('navbar');
const cartCountEl = document.getElementById('cart-count');
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('navLinks');
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

// Size Buttons (Updated IDs to match generic names)
// Note: You must update your HTML IDs or the JS will break. 
// See step 2 below for HTML update instructions.
const btnSmall = document.getElementById('btn-20ml'); // We reuse the ID but change the text
const btnBig = document.getElementById('btn-50ml');   // We reuse the ID but change the text

const contactForm = document.getElementById('contactForm');
const contactName = document.getElementById('contact-name');
const contactEmail = document.getElementById('contact-email');
const contactMessage = document.getElementById('contact-message');
const successMessage = document.getElementById('successMessage');

// --- INIT ---
function init() {
    // Update Button Labels on Load
    if(btnSmall) { 
        btnSmall.textContent = "Small"; 
        btnSmall.onclick = () => selectSize('Small');
    }
    if(btnBig) { 
        btnBig.textContent = "Big"; 
        btnBig.onclick = () => selectSize('Big');
    }

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
                <p class="card-price">Starting from ₹${product.prices["Small"]}</p>
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

// --- MOBILE MENU ---
function setupMobileMenu() {
    hamburger.addEventListener('click', toggleMobileMenu);
    document.addEventListener('click', (e) => {
        if (!navLinks.contains(e.target) && !hamburger.contains(e.target)) {
            closeMobileMenu();
        }
    });
    window.addEventListener('scroll', () => {
        if (navLinks.classList.contains('active')) closeMobileMenu();
    });
}

function toggleMobileMenu(e) {
    if (e) e.stopPropagation();
    navLinks.classList.toggle('active');
    const icon = hamburger.querySelector('i');
    icon.classList.contains('fa-bars') ? (icon.classList.remove('fa-bars'), icon.classList.add('fa-times')) : (icon.classList.remove('fa-times'), icon.classList.add('fa-bars'));
}

function closeMobileMenu() {
    navLinks.classList.remove('active');
    const icon = hamburger.querySelector('i');
    icon.classList.remove('fa-times');
    icon.classList.add('fa-bars');
}

// --- MODAL & SIZE ---
window.openProduct = (id) => {
    currentProduct = products.find(p => p.id === id);
    selectSize('Small'); // Default to Small
    
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
        
        // SWITCH IMAGE BASED ON SIZE
        if (currentProduct.images && currentProduct.images[size]) {
            modalImg.src = currentProduct.images[size];
        } else {
            modalImg.src = currentProduct.image;
        }
        
        modalImg.onerror = function() { this.src = 'https://images.unsplash.com/photo-1541643600914-78b084683601?q=80&w=1000&auto=format&fit=crop'; }

        // Update Button Styles
        if(size === 'Small') {
            btnSmall.classList.add('active');
            btnBig.classList.remove('active');
        } else {
            btnBig.classList.add('active');
            btnSmall.classList.remove('active');
        }
    }
}

function closeModalFunc() {
    modal.classList.remove('show');
    setTimeout(() => modal.style.display = "none", 300);
}

// --- CART ---
window.toggleCart = () => {
    cartSidebar.classList.toggle('open');
    cartOverlay.classList.toggle('open');
    closeMobileMenu();
    if (cartSidebar.classList.contains('open')) renderCartItems();
}

function addToCart() {
    if(!currentProduct) return;
    
    // Determine which image to save in cart
    let specificImage = currentProduct.image;
    if(currentProduct.images && currentProduct.images[currentSize]) {
        specificImage = currentProduct.images[currentSize];
    }

    const cartItem = {
        ...currentProduct,
        selectedSize: currentSize,
        price: currentPrice,
        image: specificImage
    };

    cart.push(cartItem);
    updateCartCount();
    
    cartCountEl.classList.add('pulse');
    setTimeout(() => cartCountEl.classList.remove('pulse'), 300);
    addToCartBtn.textContent = "Added!";
    setTimeout(() => addToCartBtn.textContent = "Add to Cart", 1500);
    window.toggleCart();
}

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
    
    let imageRef = currentProduct.image;
    if(currentProduct.images && currentProduct.images[currentSize]) {
        imageRef = currentProduct.images[currentSize];
    }

    let fullImageLink = window.location.origin + '/' + imageRef;
    if(window.location.protocol === 'file:') { fullImageLink = imageRef; }

    const message = `Hi! I want to order:%0A%0A*Product:* ${currentProduct.name}%0A*Size:* ${currentSize}%0A*Price:* ₹${currentPrice}%0A*Ref Image:* ${fullImageLink}%0A%0APlease confirm.`;
    
    window.open(`https://wa.me/${phoneNumber}?text=${message}`, '_blank');
}

window.checkoutCart = () => {
    if (cart.length === 0) {
        alert("Your cart is empty!");
        return;
    }

    const phoneNumber = "918075584863";
    let message = "Hi! I want to order these items:%0A%0A";
    let total = 0;

    cart.forEach((item, index) => {
        let fullImageLink = window.location.origin + '/' + item.image;
        if(window.location.protocol === 'file:') { fullImageLink = item.image; }

        message += `${index + 1}. *${item.name}* (${item.selectedSize}) - ₹${item.price}%0A   *Img:* ${fullImageLink}%0A%0A`;
        total += item.price;
    });

    message += `*Total Amount: ₹${total.toLocaleString()}*%0A%0APlease confirm my order.`;
    
    window.open(`https://wa.me/${phoneNumber}?text=${message}`, '_blank');
}

// --- CONTACT FORM ---
window.sendContactMessage = () => {
    const name = contactName.value.trim();
    const email = contactEmail.value.trim();
    const messageText = contactMessage.value.trim();
    
    if (!name || !email || !messageText) { alert("Please fill all fields."); return; }
    
    successMessage.style.display = 'block';
    const phoneNumber = "918075584863";
    const whatsappMessage = `*Contact Form*%0A*Name:* ${name}%0A*Email:* ${email}%0A*Message:* ${messageText}`;
    
    setTimeout(() => {
        window.open(`https://wa.me/${phoneNumber}?text=${whatsappMessage}`, '_blank');
        contactForm.reset();
        successMessage.style.display = 'none';
    }, 2000);
}

// --- EVENT LISTENERS ---
function setupEventListeners() {
    closeModal.addEventListener('click', closeModalFunc);
    window.addEventListener('click', (e) => { if (e.target == modal) closeModalFunc(); });
    addToCartBtn.addEventListener('click', addToCart);
    orderNowBtn.addEventListener('click', orderSingleOnWhatsApp);
    contactForm.addEventListener('keypress', (e) => { if (e.key === 'Enter') { e.preventDefault(); sendContactMessage(); } });
}

init();