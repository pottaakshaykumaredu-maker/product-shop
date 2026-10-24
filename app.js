// app.js - Product Store Core Logic (Multi-Page E-Commerce Controller)

// 1. Product Icons & SVG Visuals
const ICONS = { electronics: '<svg viewBox="0 0 100 100" class="prod-svg"><rect x="30" y="10" width="40" height="80" rx="6" fill="#0f172a" stroke="#38bdf8" stroke-width="2.5"/><circle cx="50" cy="82" r="3" fill="#38bdf8"/><rect x="35" y="20" width="30" height="55" rx="2" fill="#0284c7"/></svg>', fashion: '<svg viewBox="0 0 100 100" class="prod-svg"><path d="M30 25 L42 35 L50 25 L58 35 L70 25 L85 45 L72 55 L72 85 L28 85 L28 55 L15 45 Z" fill="#4338ca" stroke="#818cf8" stroke-width="2.5"/></svg>', home: '<svg viewBox="0 0 100 100" class="prod-svg"><path d="M40 20 L60 20 L60 30 L68 40 L68 85 L32 85 L32 40 L40 30 Z" fill="#b45309" stroke="#fbbf24" stroke-width="2.5"/></svg>', appliances: '<svg viewBox="0 0 100 100" class="prod-svg"><rect x="30" y="45" width="40" height="40" rx="4" fill="#334155" stroke="#94a3b8" stroke-width="2.5"/><path d="M35 45 L40 18 L60 18 L65 45 Z" fill="#0ea5e9"/></svg>', books: '<svg viewBox="0 0 100 100" class="prod-svg"><rect x="25" y="20" width="50" height="65" rx="3" fill="#047857" stroke="#34d399" stroke-width="2.5"/><line x1="33" y1="20" x2="33" y2="85" stroke="#ffffff" stroke-width="2"/></svg>' };
const getProductSvg = (cat) => ICONS[cat] || ICONS.electronics;

// 2. Product Catalog Data
const P = (id, name, cat, slug, brand, price, orig, rating, count, badge, desc, specs, feats, del) => ({ id, name, category: cat, categorySlug: slug, brand, price, originalPrice: orig, rating, ratingCount: count, badge, desc, specs, feats, delivery: del });
const PRODUCTS = [
  P('prod-001', 'NeoPro Titanium 5G (128GB)', 'Electronics', 'electronics', 'NeoTech', 18999, 24999, 4.5, 14820, 'Store Assured', '6.7" 120Hz AMOLED display, 64MP OIS camera, 5000mAh battery with 67W Turbo charge.', { 'Display': '6.7" AMOLED 120Hz', 'RAM': '8 GB', 'Storage': '128 GB', 'Battery': '5000 mAh' }, ['120Hz AMOLED Screen', '67W Turbo Charger', 'Dual Stereo Speakers'], 'Free Delivery Tomorrow'),
  P('prod-002', 'AeroTune ANC Wireless Earbuds', 'Electronics', 'electronics', 'AeroSound', 2499, 4999, 4.3, 8940, 'Bestseller', '35dB Hybrid ANC, 11mm titanium drivers, 42h playtime, Type-C fast charge.', { 'Driver': '11mm Titanium', 'Battery': '42 Hours total', 'Rating': 'IPX5' }, ['35dB Hybrid ANC', 'Ultra-low 45ms gaming latency'], 'Free Delivery Tomorrow'),
  P('prod-003', 'Velocity Surge Running Sneakers', 'Fashion & Wear', 'fashion', 'Velocity', 1599, 3499, 4.2, 5410, 'Store Assured', 'Breathable engineered jacquard mesh upper paired with high-rebound cushioning.', { 'Material': 'Breathable Mesh', 'Sole': 'Rubber', 'Weight': '240g' }, ['Memory foam insole', 'Reinforced heel counter'], 'Free Delivery in 2 Days'),
  P('prod-004', 'Classic Oxford Cotton Shirt', 'Fashion & Wear', 'fashion', 'UrbanThread', 899, 1999, 4.1, 3820, 'Hot Deal', '100% premium combed cotton oxford weave, tailored slim fit.', { 'Fabric': '100% Cotton', 'Fit': 'Slim Fit' }, ['Breathable all-weather fabric', 'Pre-washed anti-shrink'], 'Free Delivery in 2 Days'),
  P('prod-005', 'Copper Thermosteel Flask 1000ml', 'Home & Kitchen', 'home', 'CelloLife', 649, 1299, 4.4, 4120, 'Eco Friendly', 'Double-walled vacuum insulated SUS304 stainless steel bottle keeping drinks hot/cold.', { 'Capacity': '1000 ml', 'Material': 'SUS304 Steel' }, ['100% leak-proof lid', 'BPA-free stainless steel'], 'Free Delivery in 3 Days'),
  P('prod-006', 'MasterGrind 750W Mixer Grinder', 'Appliances', 'appliances', 'TurboChef', 2999, 5499, 4.6, 7890, 'Store Assured', 'Heavy duty 750W pure copper motor with 3 stainless steel jars.', { 'Power': '750 Watts', 'Jars': '3 SS Jars' }, ['Stainless steel blades', 'Overload motor protection'], 'Free Delivery in 2 Days'),
  P('prod-007', 'Modern Web Programming Handbook', 'Books & Notes', 'books', 'TechPress', 599, 999, 4.8, 3100, 'Syllabus Pick', 'Complete practical guide covering HTML5, CSS3, Vanilla JS ES6+, and Node.js.', { 'Pages': '480 Pages', 'Edition': '2026 Academic' }, ['Covers all University EWP lab questions', 'Includes viva guide'], 'Free Delivery Tomorrow'),
  P('prod-008', 'UltraTab Pro 11-inch WiFi Tablet', 'Electronics', 'electronics', 'NeoTech', 28999, 34999, 4.7, 6120, 'Trending', '11" 2.5K 120Hz display with quad stereo speakers and fast processor.', { 'Display': '11" 2.5K 120Hz', 'Storage': '128 GB' }, ['Stylus support', 'Quad stereo speakers'], 'Free Express Delivery')
];
PRODUCTS.forEach(p => { p.discountPercent = Math.round(((p.originalPrice - p.price) / p.originalPrice) * 100); p.reviewCount = Math.round(p.ratingCount / 6); p.svgIcon = getProductSvg(p.categorySlug); p.description = p.desc; p.specifications = p.specs; p.features = p.feats; p.deliveryText = p.delivery; });

// 3. State Management (Cart & User)
let cart = [], currentUser = null;
function initStorage() {
  try { cart = JSON.parse(localStorage.getItem('productstore_cart')) || [{ product: PRODUCTS[0], quantity: 1 }, { product: PRODUCTS[1], quantity: 2 }]; currentUser = JSON.parse(localStorage.getItem('productstore_user')) || null; } catch (e) { cart = [{ product: PRODUCTS[0], quantity: 1 }]; }
}
const saveCart = () => { localStorage.setItem('productstore_cart', JSON.stringify(cart)); updateCartBadge(); }; const saveUser = () => { if (currentUser) localStorage.setItem('productstore_user', JSON.stringify(currentUser)); else localStorage.removeItem('productstore_user'); updateUserUI(); }; const updateCartBadge = () => { const b = document.getElementById('cartBadge'); if (b) b.innerText = cart.reduce((s, i) => s + i.quantity, 0); };
const updateUserUI = () => { const s = document.getElementById('userAccountSection'); if (s) s.innerHTML = currentUser ? `<div class="user-logged-wrap"><span>👤 ${currentUser.name.split(' ')[0]}</span><button type="button" class="btn-logout-mini" onclick="handleLogout()">Logout</button></div>` : `<a href="login.html" class="btn-login-header">Login</a>`; };
window.handleLogout = () => { currentUser = null; saveUser(); showNotification('Logged out successfully.'); };

// 4. Product Card Template & Navigation
function renderProductCardHTML(p) {
  return `<div class="product-card" onclick="goToProductDetails('${p.id}')"><div class="card-visual">${p.badge ? `<span class="assured-badge">✦ ${p.badge}</span>` : ''}${p.discountPercent > 0 ? `<span class="discount-badge">${p.discountPercent}% OFF</span>` : ''}${p.svgIcon}</div><div><div class="card-brand">${p.brand} · ${p.category}</div><h3 class="card-title">${p.name}</h3><div class="card-rating-row"><span class="star-pill">★ ${p.rating}</span><span class="rating-count">(${p.ratingCount.toLocaleString('en-IN')})</span></div><div class="card-price-row"><span class="card-price-main">₹${p.price.toLocaleString('en-IN')}</span>${p.originalPrice > p.price ? `<span class="card-price-mrp">₹${p.originalPrice.toLocaleString('en-IN')}</span>` : ''}<span class="card-discount-txt">${p.discountPercent}% off</span></div><p class="card-delivery">${p.deliveryText}</p></div><div class="card-btn-row"><button type="button" class="btn-add-cart" onclick="event.stopPropagation(); addToCart('${p.id}', 1)">ADD TO CART</button><button type="button" class="btn-view-quick" onclick="event.stopPropagation(); goToProductDetails('${p.id}')">Details</button></div></div>`;
}
window.goToProductDetails = (id) => { localStorage.setItem('selected_product_id', id); window.location.href = `product-details.html?id=${id}`; };

// 5. Home Page Carousel & Deals
let carouselIndex = 0;
const CAROUSEL_DATA = [{ theme: 'slide-theme-1', badge: 'MEGA SAVINGS EVENT', title: 'BIG FESTIVE ELECTRONICS SALE', subtitle: 'Up to 60% Off on Flagship 5G Smartphones, ANC Earbuds & Tech Accessories' }, { theme: 'slide-theme-2', badge: 'COLLEGE FASHION DROP', title: 'TRENDING CASUAL & ATHLETIC WEAR', subtitle: '100% pure combed cotton shirts, high-rebound athletic sneakers & accessories' }, { theme: 'slide-theme-3', badge: 'ACADEMIC EXCELLENCE', title: 'ENGINEERING & STUDY BOOKSHELF', subtitle: 'University textbooks, DSA problem-solving guides, and full-stack web handbooks' }];
window.setCarouselSlide = (idx) => {
  carouselIndex = idx; const slide = document.getElementById('carouselSlide'); if (!slide) return;
  const d = CAROUSEL_DATA[idx]; slide.className = `carousel-slide ${d.theme}`;
  const setE = (id, text) => { const el = document.getElementById(id); if (el) el.innerText = text; };
  setE('slideBadge', d.badge); setE('slideTitle', d.title); setE('slideSubtitle', d.subtitle);
  document.querySelectorAll('.carousel-dots .dot').forEach((dot, i) => dot.classList.toggle('active', i === idx));
};
function initHomePage() {
  const deals = document.getElementById('homeDealsGrid'), elec = document.getElementById('homeElectronicsGrid');
  if (deals) deals.innerHTML = PRODUCTS.slice(0, 4).map(renderProductCardHTML).join('');
  if (elec) elec.innerHTML = PRODUCTS.filter(p => p.categorySlug === 'electronics').slice(0, 4).map(renderProductCardHTML).join('');
  if (document.getElementById('carouselSlide')) setInterval(() => { carouselIndex = (carouselIndex + 1) % CAROUSEL_DATA.length; setCarouselSlide(carouselIndex); }, 5000);
}

// 6. Catalogue Page Logic (Filter, Search, Sort)
let catFilter = 'all', searchQuery = '', sortBy = 'popularity';
function initCataloguePage() {
  const params = new URLSearchParams(window.location.search);
  if (params.get('cat')) catFilter = params.get('cat');
  if (params.get('search')) { searchQuery = params.get('search'); const inp = document.getElementById('searchInput'); if (inp) inp.value = searchQuery; }
  document.querySelectorAll('.cat-pill-btn').forEach(btn => btn.classList.toggle('active', btn.dataset.cat === catFilter));
  renderCatalogueGrid();
}
function renderCatalogueGrid() {
  const grid = document.getElementById('catalogueGrid'); if (!grid) return;
  const notice = document.getElementById('searchNoticeBar'), noticeText = document.getElementById('searchNoticeText');
  if (notice) { notice.style.display = searchQuery ? 'flex' : 'none'; if (noticeText) noticeText.innerHTML = `Showing results for: <strong>"${searchQuery}"</strong>`; }
  let list = PRODUCTS.filter(p => (!searchQuery || `${p.name} ${p.brand} ${p.category} ${p.description}`.toLowerCase().includes(searchQuery.toLowerCase())) && (catFilter === 'all' || p.categorySlug === catFilter));
  const sorters = { 'price-asc': (a, b) => a.price - b.price, 'price-desc': (a, b) => b.price - a.price, 'rating': (a, b) => b.rating - a.rating };
  list.sort(sorters[sortBy] || ((a, b) => b.ratingCount - a.ratingCount));
  const countText = document.getElementById('catalogueCountText'); if (countText) countText.innerText = `Showing ${list.length} of ${PRODUCTS.length} products`;
  grid.innerHTML = list.length ? list.map(renderProductCardHTML).join('') : `<div style="grid-column:1/-1; padding:48px 20px; text-align:center; background:#fff; border:1px solid #e5e7eb; border-radius:4px;"><h3>No matching products found</h3><p style="color:#64748b; font-size:12px; margin: 8px 0 16px;">Try clearing filters or search query.</p><button type="button" class="btn-primary-sm" onclick="resetAllFilters()">Reset All Filters</button></div>`;
}
window.setCatalogueCategory = (cat) => { catFilter = cat; document.querySelectorAll('.cat-pill-btn').forEach(b => b.classList.toggle('active', b.dataset.cat === cat)); renderCatalogueGrid(); }; window.handleSortSelectChange = (val) => { sortBy = val; renderCatalogueGrid(); }; window.clearSearchFilter = () => { searchQuery = ''; const inp = document.getElementById('searchInput'); if (inp) inp.value = ''; renderCatalogueGrid(); }; window.resetAllFilters = () => { catFilter = 'all'; searchQuery = ''; sortBy = 'popularity'; const inp = document.getElementById('searchInput'); if (inp) inp.value = ''; setCatalogueCategory('all'); };
window.handleSearchSubmit = (e) => { e.preventDefault(); const inp = document.getElementById('searchInput'); if (inp && inp.value.trim()) window.location.href = `catalogue.html?search=${encodeURIComponent(inp.value.trim())}`; };

// 7. Product Details Page
function initProductDetailsPage() {
  const c = document.getElementById('productDetailContainer'); if (!c) return;
  const id = new URLSearchParams(window.location.search).get('id') || localStorage.getItem('selected_product_id') || 'prod-001', prod = PRODUCTS.find(p => p.id === id) || PRODUCTS[0];
  const setT = (elemId, val) => { const el = document.getElementById(elemId); if (el) el.innerText = val; };
  setT('detailBreadcrumbCategory', prod.category); setT('detailBreadcrumbName', prod.name);
  const savings = prod.originalPrice - prod.price, specRows = Object.entries(prod.specifications || {}).map(([k, v]) => `<tr><td>${k}</td><td>${v}</td></tr>`).join(''), featList = (prod.features || []).map(f => `<li style="margin-bottom:4px;">• ${f}</li>`).join('');
  c.innerHTML = `<div class="pdp-left"><div class="pdp-image-box">${prod.badge ? `<span class="assured-badge" style="top:12px; left:12px;">✦ ${prod.badge}</span>` : ''}${prod.discountPercent > 0 ? `<span class="discount-badge" style="top:12px; right:12px;">${prod.discountPercent}% OFF</span>` : ''}${prod.svgIcon}</div><div class="pdp-buttons-row"><button type="button" class="btn-pdp-cart" onclick="addToCart('${prod.id}', 1)">🛒 ADD TO CART</button><button type="button" class="btn-pdp-buy" onclick="buyNow('${prod.id}')">⚡ BUY NOW</button></div></div><div class="pdp-right"><div class="pdp-brand-cat">${prod.brand} · ${prod.category}</div><h1 class="pdp-title">${prod.name}</h1><div class="card-rating-row" style="margin-bottom:12px;"><span class="star-pill">★ ${prod.rating}</span><span class="rating-count">${prod.ratingCount.toLocaleString('en-IN')} Ratings & Reviews</span></div><div class="pdp-price-panel"><div class="pdp-price-row"><span class="pdp-price-main">₹${prod.price.toLocaleString('en-IN')}</span><span class="card-price-mrp" style="font-size:15px;">₹${prod.originalPrice.toLocaleString('en-IN')}</span><span class="card-discount-txt" style="font-size:15px;">${prod.discountPercent}% off</span></div><p class="pdp-save-note">You save ₹${savings.toLocaleString('en-IN')} on this order!</p></div><div class="bank-offers-box"><strong>🏷️ Available Bank Offers:</strong><p style="margin-top:4px;">• 10% Instant Discount on HDFC & ICICI Credit Cards</p><p>• Extra 5% Unlimited Cashback on Product Store Axis Card</p></div><div class="pincode-check-box"><strong style="font-size:12px; color:#1e293b;">Check Delivery Availability:</strong><div class="pincode-form-row"><input type="text" id="pincodeInput" maxlength="6" value="500001" placeholder="Enter PIN code" /><button type="button" onclick="checkDeliveryPincode()">Check</button></div><p id="pincodeResultMsg" class="pincode-msg">✓ Available! Free Express Delivery to 500001 by tomorrow.</p></div><div style="margin-bottom:16px;"><strong style="font-size:13px;">Key Highlights:</strong><ul style="font-size:12px; color:#4b5563; list-style:none; padding:0; margin-top:6px;">${featList}</ul></div><div style="margin-bottom:16px;"><strong style="font-size:13px;">Description:</strong><p style="font-size:12px; color:#4b5563; line-height:1.6; margin-top:4px;">${prod.description}</p></div><div><strong style="font-size:13px;">Technical Specifications:</strong><table class="specs-table"><tbody>${specRows}</tbody></table></div></div>`;
}
window.checkDeliveryPincode = () => {
  const pin = (document.getElementById('pincodeInput')?.value || '').trim(), msg = document.getElementById('pincodeResultMsg'); if (!msg) return;
  const valid = /^\d{6}$/.test(pin); msg.innerText = valid ? `✓ Available! Free delivery to PIN ${pin} within 24–48 hours.` : '⚠️ Enter a valid 6-digit Indian PIN code.'; msg.style.color = valid ? '#388e3c' : '#dc2626';
};

// 8. Shopping Cart Operations
window.addToCart = (id, qty = 1) => { const prod = PRODUCTS.find(p => p.id === id); if (!prod) return; const item = cart.find(i => i.product.id === id); if (item) item.quantity += qty; else cart.push({ product: prod, quantity: qty }); saveCart(); showNotification(`Added "${prod.name}" to cart!`); }; window.buyNow = (id) => { addToCart(id, 1); window.location.href = 'cart.html'; }; window.updateCartQuantity = (id, delta) => { const item = cart.find(i => i.product.id === id); if (!item) return; item.quantity += delta; if (item.quantity <= 0) cart = cart.filter(i => i.product.id !== id); saveCart(); renderCart(); }; window.removeFromCart = (id) => { cart = cart.filter(i => i.product.id !== id); saveCart(); renderCart(); showNotification('Item removed from cart.'); };
function renderCart() {
  const list = document.getElementById('cartItemsList'), empty = document.getElementById('cartEmptyState'), layout = document.getElementById('cartMainLayout'); if (!list) return;
  if (!cart.length) { if (empty) empty.style.display = 'block'; if (layout) layout.style.display = 'none'; return; }
  if (empty) empty.style.display = 'none'; if (layout) layout.style.display = 'grid';
  list.innerHTML = cart.map(item => `<div class="cart-item-row"><div class="cart-item-img">${item.product.svgIcon}</div><div class="cart-item-details"><h4 class="cart-item-title">${item.product.name}</h4><div style="font-size:11px; color:#878787;">Category: ${item.product.category} · Seller: Product Store Assured</div><div class="card-price-row" style="margin:8px 0;"><span class="card-price-main">₹${(item.product.price * item.quantity).toLocaleString('en-IN')}</span><span class="card-price-mrp">₹${(item.product.originalPrice * item.quantity).toLocaleString('en-IN')}</span></div><div class="cart-stepper-row"><button type="button" class="stepper-btn" onclick="updateCartQuantity('${item.product.id}', -1)">-</button><span class="stepper-count">${item.quantity}</span><button type="button" class="stepper-btn" onclick="updateCartQuantity('${item.product.id}', 1)">+</button><button type="button" class="btn-cart-remove" onclick="removeFromCart('${item.product.id}')">REMOVE</button></div></div></div>`).join('');
  const count = cart.reduce((s, i) => s + i.quantity, 0), mrp = cart.reduce((s, i) => s + i.product.originalPrice * i.quantity, 0), actual = cart.reduce((s, i) => s + i.product.price * i.quantity, 0), discount = mrp - actual, delivery = actual > 499 ? 0 : 40, finalPayable = actual + delivery;
  const setT = (id, val) => { const el = document.getElementById(id); if (el) el.innerText = val; };
  setT('cartSummaryCount', count); setT('cartSummaryMrp', `₹${mrp.toLocaleString('en-IN')}`); setT('cartSummaryDiscount', `- ₹${discount.toLocaleString('en-IN')}`); setT('cartSummaryDelivery', delivery === 0 ? 'FREE' : `₹${delivery}`); setT('cartSummaryFinal', `₹${finalPayable.toLocaleString('en-IN')}`); setT('cartSummarySavings', `You will save ₹${discount.toLocaleString('en-IN')} on this order`);
}

// 9. Checkout & Order Processing
window.openCheckoutModal = () => { if (!cart.length) return showNotification('Your cart is empty! Add products first.'); const t = cart.reduce((s, i) => s + i.product.price * i.quantity, 0) + (cart.reduce((s, i) => s + i.product.price * i.quantity, 0) > 499 ? 0 : 40); const el = document.getElementById('checkoutTotalVal'); if (el) el.innerText = `₹${t.toLocaleString('en-IN')}`; const n = document.getElementById('checkoutName'); if (n && currentUser) n.value = currentUser.name; const m = document.getElementById('checkoutModalOverlay'); if (m) m.style.display = 'flex'; };
window.closeCheckoutModal = () => { const m = document.getElementById('checkoutModalOverlay'); if (m) m.style.display = 'none'; };
function handleCheckoutSubmit(e) {
  e.preventDefault(); const alert = document.getElementById('checkoutAlert') || document.getElementById('checkoutAlertBox');
  const name = document.getElementById('checkoutName')?.value.trim(), phone = document.getElementById('checkoutPhone')?.value.trim(), pin = (document.getElementById('checkoutPincode') || document.getElementById('checkoutPin'))?.value.trim(), addr = document.getElementById('checkoutAddress')?.value.trim();
  if (!/^[6-9]\d{9}$/.test(phone)) { if (alert) { alert.innerText = 'Enter a valid 10-digit mobile number.'; alert.style.display = 'block'; } return; }
  if (!/^\d{6}$/.test(pin)) { if (alert) { alert.innerText = 'Enter a valid 6-digit Indian PIN code.'; alert.style.display = 'block'; } return; }
  if (alert) alert.style.display = 'none'; closeCheckoutModal();
  const total = cart.reduce((s, i) => s + i.product.price * i.quantity, 0) + (cart.reduce((s, i) => s + i.product.price * i.quantity, 0) > 499 ? 0 : 40), itemsCount = cart.reduce((s, i) => s + i.quantity, 0), orderId = 'ORD-' + Math.floor(100000 + Math.random() * 900000);
  cart = []; saveCart(); renderCart();
  const setT = (id, val) => { const el = document.getElementById(id); if (el) el.innerText = val; };
  setT('successOrderId', orderId); setT('receiptOrderId', orderId); setT('successOrderItemsCount', `${itemsCount} item(s)`); setT('successOrderTotal', `₹${total.toLocaleString('en-IN')}`); setT('receiptTotalAmount', `₹${total.toLocaleString('en-IN')}`); setT('successDeliveryAddress', `${name}, ${addr}, PIN: ${pin}`); setT('receiptAddress', `${name}, ${addr}, PIN: ${pin} (${phone})`);
  const sModal = document.getElementById('orderSuccessModalOverlay'); if (sModal) sModal.style.display = 'flex';
}
window.submitCheckoutOrder = window.handleConfirmOrderSubmit = handleCheckoutSubmit;
window.closeOrderSuccessModal = () => { const m = document.getElementById('orderSuccessModalOverlay'); if (m) m.style.display = 'none'; window.location.href = 'index.html'; };

// 10. Authentication & Utilities
window.handleLoginSubmit = (e) => {
  e.preventDefault(); const alert = document.getElementById('loginAlert') || document.getElementById('loginAlertBox'), input = document.getElementById('loginEmailInput').value.trim(), pass = document.getElementById('loginPasswordInput').value.trim();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input) && !/^[6-9]\d{9}$/.test(input)) { if (alert) { alert.innerText = 'Enter a valid email or 10-digit mobile number.'; alert.style.display = 'block'; } return; }
  if (pass.length < 6) { if (alert) { alert.innerText = 'Password must be at least 6 characters.'; alert.style.display = 'block'; } return; }
  if (alert) alert.style.display = 'none'; const name = input.includes('@') ? input.split('@')[0] : 'User ' + input.slice(-4); currentUser = { name: name.charAt(0).toUpperCase() + name.slice(1), email: input }; saveUser(); showNotification(`Welcome back, ${currentUser.name}!`); setTimeout(() => { window.location.href = 'index.html'; }, 1000);
};
window.handleRegisterSubmit = (e) => {
  e.preventDefault(); const alert = document.getElementById('regAlert') || document.getElementById('regAlertBox'), name = document.getElementById('regNameInput').value.trim(), email = document.getElementById('regEmailInput').value.trim(), phone = document.getElementById('regPhoneInput').value.trim(), pass = document.getElementById('regPassInput').value, cPass = document.getElementById('regConfirmPassInput').value;
  if (name.length < 3 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || !/^[6-9]\d{9}$/.test(phone) || pass.length < 6 || pass !== cPass) {
    if (alert) { alert.innerText = 'Please provide valid details (Name >= 3 chars, valid email, 10-digit phone, password >= 6 chars matching confirm password).'; alert.style.display = 'block'; } return;
  }
  if (alert) alert.style.display = 'none'; currentUser = { name, email }; saveUser(); showNotification(`Account created for ${name}!`); setTimeout(() => { window.location.href = 'index.html'; }, 1000);
};
window.autoFillDemoLogin = () => { const e = document.getElementById('loginEmailInput'), p = document.getElementById('loginPasswordInput'); if (e) e.value = 'student@college.edu'; if (p) p.value = 'CollegeExam2026'; };
window.handleContactSubmit = (e) => { e.preventDefault(); const a = document.getElementById('contactSuccessAlert'); if (a) { a.innerText = 'Thank you! Your message has been sent to our lab desk.'; a.style.display = 'block'; } document.getElementById('contactNameInput').value = ''; document.getElementById('contactEmailInput').value = ''; document.getElementById('contactMessageInput').value = ''; setTimeout(() => { if (a) a.style.display = 'none'; }, 4000); };
window.openExamGuideModal = () => { const m = document.getElementById('examGuideModalOverlay'); if (m) m.style.display = 'flex'; }; window.closeExamGuideModal = () => { const m = document.getElementById('examGuideModalOverlay'); if (m) m.style.display = 'none'; }; window.switchExamTab = (tId) => { document.querySelectorAll('.exam-tab').forEach(t => t.classList.toggle('active', t.dataset.pane === tId)); document.querySelectorAll('.exam-pane').forEach(p => p.classList.toggle('active', p.id === tId)); }; window.showNotification = (msg) => { const toast = document.getElementById('toastNotification'); if (!toast) return; toast.innerText = msg; toast.style.display = 'block'; setTimeout(() => { toast.style.display = 'none'; }, 2500); };

// 11. Page Dispatcher on DOMContentLoaded
document.addEventListener('DOMContentLoaded', () => {
  initStorage(); updateUserUI(); updateCartBadge();
  if (document.getElementById('homeDealsGrid')) initHomePage();
  if (document.getElementById('catalogueGrid')) initCataloguePage();
  if (document.getElementById('productDetailContainer')) initProductDetailsPage();
  if (document.getElementById('cartItemsList')) renderCart();
});
