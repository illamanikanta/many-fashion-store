/**
 * ATELIER Fashion House - Reactive State Store
 * Handles Cart, Wishlist, Currency, Filters, Theme, and LocalStorage persistence
 */

class FashionStore {
  constructor() {
    this.listeners = new Map();
    this.FREE_SHIPPING_THRESHOLD = 150; // USD

    // Load initial state from LocalStorage or defaults
    this.currency = localStorage.getItem('atelier_currency') || 'USD';
    this.theme = localStorage.getItem('atelier_theme') || (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
    
    // Load cart
    try {
      this.cart = JSON.parse(localStorage.getItem('atelier_cart')) || [];
    } catch (e) {
      this.cart = [];
    }

    // Load wishlist
    try {
      this.wishlist = JSON.parse(localStorage.getItem('atelier_wishlist')) || [];
    } catch (e) {
      this.wishlist = [];
    }

    // Applied promo code
    this.appliedPromo = null;
    try {
      const savedPromo = localStorage.getItem('atelier_promo');
      if (savedPromo && PROMO_CODES[savedPromo]) {
        this.appliedPromo = { code: savedPromo, ...PROMO_CODES[savedPromo] };
      }
    } catch (e) {
      this.appliedPromo = null;
    }

    // Active filters
    this.filters = {
      category: 'all',
      subcategories: [],
      priceRange: [0, 600],
      sizes: [],
      colors: [],
      inStockOnly: false,
      sortBy: 'featured',
      searchQuery: ''
    };

    // Apply saved theme to DOM
    this.applyTheme();
  }

  // --- PUB/SUB EVENT SYSTEM ---
  subscribe(event, callback) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, []);
    }
    this.listeners.get(event).push(callback);
    return () => {
      const arr = this.listeners.get(event) || [];
      this.listeners.set(event, arr.filter(cb => cb !== callback));
    };
  }

  emit(event, data) {
    const arr = this.listeners.get(event);
    if (arr) {
      arr.forEach(cb => cb(data));
    }
  }

  // --- CURRENCY & FORMATTING ---
  setCurrency(currencyCode) {
    if (CURRENCIES[currencyCode]) {
      this.currency = currencyCode;
      localStorage.setItem('atelier_currency', currencyCode);
      this.emit('currency:changed', currencyCode);
      this.emit('cart:updated', this.getCartSummary());
    }
  }

  formatPrice(priceInUSD) {
    const cur = CURRENCIES[this.currency] || CURRENCIES.USD;
    const converted = priceInUSD * cur.rate;
    if (this.currency === 'INR') {
      return `${cur.symbol}${Math.round(converted).toLocaleString('en-IN')}`;
    }
    return `${cur.symbol}${converted.toFixed(2)}`;
  }

  // --- THEME ---
  toggleTheme() {
    this.theme = this.theme === 'dark' ? 'light' : 'dark';
    localStorage.setItem('atelier_theme', this.theme);
    this.applyTheme();
    this.emit('theme:changed', this.theme);
  }

  applyTheme() {
    const root = document.documentElement;
    if (this.theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }

  // --- CART MANAGEMENT ---
  addToCart(productId, size = null, color = null, quantity = 1) {
    const product = PRODUCTS.find(p => p.id === productId);
    if (!product) return false;

    // Pick defaults if not specified
    const selectedSize = size || (product.sizes && product.sizes.length > 0 ? product.sizes[0] : 'Standard');
    const selectedColor = color || (product.colors && product.colors.length > 0 ? product.colors[0].name : 'Default');

    // Cart item identifier includes product + variant
    const cartItemId = `${productId}-${selectedSize}-${selectedColor}`;
    const existingIndex = this.cart.findIndex(item => item.cartItemId === cartItemId);

    if (existingIndex > -1) {
      this.cart[existingIndex].quantity += quantity;
    } else {
      this.cart.push({
        cartItemId,
        productId,
        title: product.title,
        price: product.price,
        originalPrice: product.originalPrice,
        image: product.images[0],
        category: product.category,
        size: selectedSize,
        color: selectedColor,
        quantity: Math.max(1, quantity)
      });
    }

    this.saveCart();
    this.emit('cart:updated', this.getCartSummary());
    this.emit('notification', {
      type: 'success',
      message: `Added "${product.title}" (${selectedSize}, ${selectedColor}) to your shopping bag.`
    });
    return true;
  }

  updateCartQuantity(cartItemId, newQty) {
    const item = this.cart.find(i => i.cartItemId === cartItemId);
    if (!item) return;

    if (newQty <= 0) {
      this.removeFromCart(cartItemId);
      return;
    }

    item.quantity = newQty;
    this.saveCart();
    this.emit('cart:updated', this.getCartSummary());
  }

  removeFromCart(cartItemId) {
    const item = this.cart.find(i => i.cartItemId === cartItemId);
    this.cart = this.cart.filter(i => i.cartItemId !== cartItemId);
    this.saveCart();
    this.emit('cart:updated', this.getCartSummary());
    if (item) {
      this.emit('notification', {
        type: 'info',
        message: `Removed "${item.title}" from your bag.`
      });
    }
  }

  clearCart() {
    this.cart = [];
    this.appliedPromo = null;
    localStorage.removeItem('atelier_promo');
    this.saveCart();
    this.emit('cart:updated', this.getCartSummary());
  }

  saveCart() {
    localStorage.setItem('atelier_cart', JSON.stringify(this.cart));
  }

  applyPromoCode(code) {
    const cleanCode = (code || '').trim().toUpperCase();
    if (!cleanCode) return { success: false, message: 'Please enter a valid coupon code.' };

    const promo = PROMO_CODES[cleanCode];
    if (promo) {
      this.appliedPromo = { code: cleanCode, ...promo };
      localStorage.setItem('atelier_promo', cleanCode);
      this.emit('cart:updated', this.getCartSummary());
      this.emit('notification', {
        type: 'success',
        message: `Coupon "${cleanCode}" applied: ${promo.description}!`
      });
      return { success: true, promo: this.appliedPromo };
    }

    return { success: false, message: 'Invalid or expired promo code. Try "STYLE20" or "FREESHIP".' };
  }

  removePromoCode() {
    this.appliedPromo = null;
    localStorage.removeItem('atelier_promo');
    this.emit('cart:updated', this.getCartSummary());
    this.emit('notification', { type: 'info', message: 'Promo code removed.' });
  }

  getCartCount() {
    return this.cart.reduce((sum, item) => sum + item.quantity, 0);
  }

  getCartSummary() {
    const rawSubtotal = this.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    
    // Promo calculations
    let discountAmount = 0;
    let isFreeShippingPromo = false;

    if (this.appliedPromo) {
      if (this.appliedPromo.discountPercent) {
        discountAmount = (rawSubtotal * this.appliedPromo.discountPercent) / 100;
      }
      if (this.appliedPromo.freeShipping) {
        isFreeShippingPromo = true;
      }
    }

    const discountedSubtotal = Math.max(0, rawSubtotal - discountAmount);

    // Free shipping threshold check ($150 USD)
    const qualifiesForFreeShipping = isFreeShippingPromo || (rawSubtotal >= this.FREE_SHIPPING_THRESHOLD);
    const standardShippingFee = (rawSubtotal > 0 && !qualifiesForFreeShipping) ? 15 : 0;
    const freeShippingProgress = Math.min(100, Math.round((rawSubtotal / this.FREE_SHIPPING_THRESHOLD) * 100));
    const amountNeededForFreeShipping = Math.max(0, this.FREE_SHIPPING_THRESHOLD - rawSubtotal);

    // Estimated tax (7%)
    const tax = discountedSubtotal > 0 ? discountedSubtotal * 0.07 : 0;
    const total = discountedSubtotal + standardShippingFee + tax;

    return {
      items: this.cart,
      itemCount: this.getCartCount(),
      rawSubtotal,
      discountAmount,
      discountedSubtotal,
      appliedPromo: this.appliedPromo,
      shippingFee: standardShippingFee,
      qualifiesForFreeShipping,
      freeShippingProgress,
      amountNeededForFreeShipping,
      tax,
      total
    };
  }

  // --- WISHLIST MANAGEMENT ---
  toggleWishlist(productId) {
    const product = PRODUCTS.find(p => p.id === productId);
    const index = this.wishlist.indexOf(productId);
    let added = false;

    if (index > -1) {
      this.wishlist.splice(index, 1);
      added = false;
    } else {
      this.wishlist.push(productId);
      added = true;
    }

    localStorage.setItem('atelier_wishlist', JSON.stringify(this.wishlist));
    this.emit('wishlist:updated', this.wishlist);
    
    if (product) {
      this.emit('notification', {
        type: added ? 'success' : 'info',
        message: added 
          ? `Saved "${product.title}" to your Wishlist.` 
          : `Removed "${product.title}" from your Wishlist.`
      });
    }
    return added;
  }

  isInWishlist(productId) {
    return this.wishlist.includes(productId);
  }

  getWishlistItems() {
    return PRODUCTS.filter(p => this.wishlist.includes(p.id));
  }

  // --- FILTERING & SEARCH ---
  setFilter(key, value) {
    this.filters[key] = value;
    this.emit('filters:changed', this.filters);
  }

  resetFilters() {
    this.filters = {
      category: 'all',
      subcategories: [],
      priceRange: [0, 600],
      sizes: [],
      colors: [],
      inStockOnly: false,
      sortBy: 'featured',
      searchQuery: ''
    };
    this.emit('filters:changed', this.filters);
  }

  getFilteredProducts() {
    let result = [...PRODUCTS];

    // Category
    if (this.filters.category && this.filters.category !== 'all') {
      result = result.filter(p => p.category === this.filters.category);
    }

    // Subcategories
    if (this.filters.subcategories && this.filters.subcategories.length > 0) {
      result = result.filter(p => this.filters.subcategories.includes(p.subcategory));
    }

    // Price range
    if (this.filters.priceRange) {
      const [min, max] = this.filters.priceRange;
      result = result.filter(p => p.price >= min && p.price <= max);
    }

    // Sizes
    if (this.filters.sizes && this.filters.sizes.length > 0) {
      result = result.filter(p => p.sizes && p.sizes.some(s => this.filters.sizes.includes(s)));
    }

    // Colors
    if (this.filters.colors && this.filters.colors.length > 0) {
      result = result.filter(p => p.colors && p.colors.some(c => this.filters.colors.includes(c.name)));
    }

    // Stock
    if (this.filters.inStockOnly) {
      result = result.filter(p => p.stock > 0);
    }

    // Search query
    if (this.filters.searchQuery && this.filters.searchQuery.trim()) {
      const q = this.filters.searchQuery.toLowerCase().trim();
      result = result.filter(p => 
        p.title.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        p.subcategory.toLowerCase().includes(q) ||
        (p.badge && p.badge.toLowerCase().includes(q))
      );
    }

    // Sorting
    switch (this.filters.sortBy) {
      case 'price-asc':
        result.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        result.sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        result.sort((a, b) => b.rating - a.rating);
        break;
      case 'newest':
        result.sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0));
        break;
      case 'featured':
      default:
        result.sort((a, b) => (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0));
        break;
    }

    return result;
  }
}

// Global store singleton
const store = new FashionStore();
if (typeof window !== 'undefined') {
  window.store = store;
}

