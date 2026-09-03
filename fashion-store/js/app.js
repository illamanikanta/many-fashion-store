/**
 * ATELIER Fashion House - Main Application Controller
 * Handles UI rendering, filters, quick view, size guide, cart, checkout, and tracking
 */

let activeQvProduct = null;
let activeQvColor = null;
let activeQvSize = null;
let activeQvQty = 1;

document.addEventListener('DOMContentLoaded', () => {
  initIcons();
  initEventListeners();
  initFilterUI();
  renderProducts();
  renderCart();
  renderWishlist();
  startFlashCountdown();

  // Subscribe to store events
  store.subscribe('cart:updated', () => renderCart());
  store.subscribe('wishlist:updated', () => {
    renderWishlist();
    renderProducts(); // Refresh heart states on cards
  });
  store.subscribe('filters:changed', () => renderProducts());
  store.subscribe('currency:changed', () => {
    renderProducts();
    renderCart();
    renderWishlist();
    if (activeQvProduct) updateQuickViewModal(activeQvProduct);
  });
  store.subscribe('notification', (toast) => showToast(toast.message, toast.type));
});

function initIcons() {
  if (typeof lucide !== 'undefined') {
    lucide.createIcons();
  }
}

// --- FILTER & NAVIGATION UI INITIALIZATION ---
function initFilterUI() {
  // Populate Category List in Sidebar
  const catContainer = document.getElementById('category-filter-list');
  if (catContainer) {
    catContainer.innerHTML = FASHION_CATEGORIES.map(cat => {
      const count = cat.id === 'all' 
        ? PRODUCTS.length 
        : PRODUCTS.filter(p => p.category === cat.id).length;
      const isActive = store.filters.category === cat.id;

      return `
        <button 
          onclick="filterByCategory('${cat.id}')"
          class="w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-all ${
            isActive 
              ? 'bg-black text-white dark:bg-gold-500 dark:text-black font-semibold shadow-sm' 
              : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-zinc-800'
          }"
        >
          <span>${cat.name}</span>
          <span class="text-[11px] opacity-75">(${count})</span>
        </button>
      `;
    }).join('');
  }

  // Populate Subcategory Checkboxes
  const subcatContainer = document.getElementById('subcategory-filter-list');
  if (subcatContainer) {
    subcatContainer.innerHTML = ALL_SUBCATEGORIES.map(sub => {
      return `
        <label class="flex items-center gap-2 text-xs text-gray-700 dark:text-gray-300 cursor-pointer hover:text-black dark:hover:text-white">
          <input 
            type="checkbox" 
            value="${sub}" 
            onchange="handleSubcategoryToggle('${sub}', this.checked)"
            class="accent-gold-500 rounded"
          >
          <span>${sub}</span>
        </label>
      `;
    }).join('');
  }

  // Populate Size Filter Chips
  const sizeContainer = document.getElementById('size-filter-list');
  if (sizeContainer) {
    const popularSizes = ['XS', 'S', 'M', 'L', 'XL', '30', '32', '34', 'US 8', 'US 9', 'US 10'];
    sizeContainer.innerHTML = popularSizes.map(size => {
      return `
        <button 
          id="size-chip-${size.replace(/\s+/g, '')}"
          onclick="handleSizeToggle('${size}')"
          class="px-2.5 py-1 text-xs border border-gray-300 dark:border-zinc-700 rounded text-gray-700 dark:text-gray-300 hover:border-gold-500 transition-colors"
        >
          ${size}
        </button>
      `;
    }).join('');
  }

  // Currency select init
  const currencySelect = document.getElementById('currency-select');
  if (currencySelect) {
    currencySelect.value = store.currency;
    currencySelect.addEventListener('change', (e) => {
      store.setCurrency(e.target.value);
    });
  }
}

// --- GLOBAL EVENT LISTENERS ---
function initEventListeners() {
  // Theme Toggle
  const themeBtn = document.getElementById('btn-theme-toggle');
  if (themeBtn) {
    themeBtn.addEventListener('click', () => {
      store.toggleTheme();
      initIcons();
    });
  }

  // Cart Drawer open/close
  document.getElementById('btn-open-cart')?.addEventListener('click', openCart);
  document.getElementById('btn-close-cart')?.addEventListener('click', closeCart);
  document.getElementById('cart-drawer-backdrop')?.addEventListener('click', closeCart);

  // Wishlist Drawer open/close
  document.getElementById('btn-open-wishlist')?.addEventListener('click', openWishlist);
  document.getElementById('btn-close-wishlist')?.addEventListener('click', closeWishlist);
  document.getElementById('wishlist-drawer-backdrop')?.addEventListener('click', closeWishlist);

  // Mobile Menu open/close
  document.getElementById('btn-open-mobile-menu')?.addEventListener('click', openMobileMenu);
  document.getElementById('btn-close-mobile-menu')?.addEventListener('click', closeMobileMenu);
  document.getElementById('mobile-nav-backdrop')?.addEventListener('click', closeMobileMenu);

  // Mobile Filters toggle
  document.getElementById('btn-toggle-mobile-filters')?.addEventListener('click', () => {
    const sidebar = document.getElementById('filters-sidebar');
    if (sidebar) {
      sidebar.classList.toggle('hidden');
      if (!sidebar.classList.contains('hidden')) {
        sidebar.scrollIntoView({ behavior: 'smooth' });
      }
    }
  });

  // Search Inputs (Desktop & Mobile)
  const headerSearch = document.getElementById('header-search-input');
  const headerSearchClear = document.getElementById('header-search-clear');
  const mobileSearch = document.getElementById('mobile-search-input');

  const onSearchInput = (value) => {
    store.setFilter('searchQuery', value);
    if (headerSearchClear) {
      headerSearchClear.classList.toggle('hidden', !value);
    }
    scrollToCatalog();
  };

  if (headerSearch) {
    headerSearch.addEventListener('input', (e) => onSearchInput(e.target.value));
  }
  if (headerSearchClear) {
    headerSearchClear.addEventListener('click', () => {
      if (headerSearch) headerSearch.value = '';
      onSearchInput('');
    });
  }
  if (mobileSearch) {
    mobileSearch.addEventListener('input', (e) => onSearchInput(e.target.value));
  }

  // Price Range Slider
  const priceSlider = document.getElementById('price-range-slider');
  const priceLabel = document.getElementById('price-range-label');
  if (priceSlider) {
    priceSlider.addEventListener('input', (e) => {
      const max = parseInt(e.target.value, 10);
      priceLabel.textContent = `$0 - $${max}`;
      store.setFilter('priceRange', [0, max]);
    });
  }

  // In-Stock Only Switch
  const stockToggle = document.getElementById('stock-toggle');
  if (stockToggle) {
    stockToggle.addEventListener('change', (e) => {
      store.setFilter('inStockOnly', e.target.checked);
    });
  }

  // Sort Select
  const sortSelect = document.getElementById('sort-select');
  if (sortSelect) {
    sortSelect.addEventListener('change', (e) => {
      store.setFilter('sortBy', e.target.value);
    });
  }

  // Reset Filters Button
  document.getElementById('btn-reset-filters-sidebar')?.addEventListener('click', () => {
    store.resetFilters();
    resetFilterInputs();
  });
  document.getElementById('btn-clear-all-filters')?.addEventListener('click', () => {
    store.resetFilters();
    resetFilterInputs();
  });

  // Grid Switcher
  const btnGrid3 = document.getElementById('btn-grid-3');
  const btnGrid4 = document.getElementById('btn-grid-4');
  const gridContainer = document.getElementById('product-grid');

  btnGrid3?.addEventListener('click', () => {
    gridContainer.classList.remove('xl:grid-cols-4');
    gridContainer.classList.add('xl:grid-cols-3');
    btnGrid3.classList.add('bg-gray-100', 'dark:bg-zinc-800', 'text-black', 'dark:text-white');
    btnGrid4.classList.remove('bg-gray-100', 'dark:bg-zinc-800', 'text-black', 'dark:text-white');
  });

  btnGrid4?.addEventListener('click', () => {
    gridContainer.classList.remove('xl:grid-cols-3');
    gridContainer.classList.add('xl:grid-cols-4');
    btnGrid4.classList.add('bg-gray-100', 'dark:bg-zinc-800', 'text-black', 'dark:text-white');
    btnGrid3.classList.remove('bg-gray-100', 'dark:bg-zinc-800', 'text-black', 'dark:text-white');
  });

  // Promo Code in Cart
  document.getElementById('btn-apply-promo')?.addEventListener('click', () => {
    const input = document.getElementById('cart-promo-input');
    if (input) {
      store.applyPromoCode(input.value);
      input.value = '';
    }
  });

  // Checkout Trigger from Cart Drawer
  document.getElementById('btn-checkout-from-cart')?.addEventListener('click', () => {
    if (store.getCartCount() === 0) {
      showToast('Your shopping bag is empty. Add garments first.', 'info');
      return;
    }
    closeCart();
    openCheckoutModal();
  });

  // Quick View Dialog Events
  document.getElementById('btn-close-quick-view')?.addEventListener('click', () => {
    document.getElementById('quick-view-dialog')?.close();
  });

  document.getElementById('qv-qty-minus')?.addEventListener('click', () => {
    if (activeQvQty > 1) {
      activeQvQty--;
      document.getElementById('qv-qty-val').textContent = activeQvQty;
    }
  });

  document.getElementById('qv-qty-plus')?.addEventListener('click', () => {
    activeQvQty++;
    document.getElementById('qv-qty-val').textContent = activeQvQty;
  });

  document.getElementById('qv-btn-add-cart')?.addEventListener('click', () => {
    if (activeQvProduct) {
      store.addToCart(activeQvProduct.id, activeQvSize, activeQvColor, activeQvQty);
      document.getElementById('quick-view-dialog')?.close();
      openCart();
    }
  });

  document.getElementById('qv-btn-add-wishlist')?.addEventListener('click', () => {
    if (activeQvProduct) {
      store.toggleWishlist(activeQvProduct.id);
      updateQuickViewWishlistBtn(activeQvProduct.id);
    }
  });
}

function resetFilterInputs() {
  const slider = document.getElementById('price-range-slider');
  if (slider) slider.value = 600;
  const label = document.getElementById('price-range-label');
  if (label) label.textContent = '$0 - $600';
  const stock = document.getElementById('stock-toggle');
  if (stock) stock.checked = false;
  const search = document.getElementById('header-search-input');
  if (search) search.value = '';
  const searchM = document.getElementById('mobile-search-input');
  if (searchM) searchM.value = '';

  // Uncheck subcategories
  document.querySelectorAll('#subcategory-filter-list input[type="checkbox"]').forEach(c => c.checked = false);
  // Reset size chips
  document.querySelectorAll('#size-filter-list button').forEach(b => {
    b.classList.remove('bg-gold-500', 'text-black', 'border-gold-500', 'font-semibold');
  });

  initFilterUI();
}

// --- PRODUCT GRID RENDERING ---
function renderProducts() {
  const container = document.getElementById('product-grid');
  const emptyState = document.getElementById('empty-state');
  const countLabel = document.getElementById('catalog-count');
  const breadcrumb = document.getElementById('catalog-breadcrumb');
  const catalogTitle = document.getElementById('catalog-title');

  if (!container) return;

  const products = store.getFilteredProducts();

  // Update counts and titles
  if (countLabel) countLabel.textContent = `Showing ${products.length} garments`;
  if (breadcrumb) {
    const currentCatObj = FASHION_CATEGORIES.find(c => c.id === store.filters.category);
    breadcrumb.textContent = currentCatObj ? currentCatObj.name : 'All Garments';
  }
  if (catalogTitle) {
    const titles = {
      all: 'All Garments & Accessories',
      women: "Women's Runway Collection",
      men: "Men's Sartorial & Tailoring",
      kids: 'Kids & Teens Wardrobe',
      footwear: 'Footwear & Tuscan Leather Shoes',
      accessories: 'Luxury Handbags & Accents'
    };
    catalogTitle.textContent = titles[store.filters.category] || 'Garments & Accessories';
  }

  // Update Nav links active indicator
  document.querySelectorAll('.nav-cat-link').forEach(link => {
    const cat = link.getAttribute('data-cat');
    if (cat === store.filters.category) {
      link.classList.add('text-gray-900', 'dark:text-white', 'font-semibold', 'border-b-2', 'border-gold-500');
      link.classList.remove('text-gray-500', 'dark:text-gray-400');
    } else {
      link.classList.remove('text-gray-900', 'dark:text-white', 'font-semibold', 'border-b-2', 'border-gold-500');
      link.classList.add('text-gray-500', 'dark:text-gray-400');
    }
  });

  // Active filter tags row
  renderActiveFilterChips();

  if (products.length === 0) {
    container.innerHTML = '';
    emptyState?.classList.remove('hidden');
    return;
  }

  emptyState?.classList.add('hidden');

  container.innerHTML = products.map(product => {
    const inWishlist = store.isInWishlist(product.id);
    const hasDiscount = product.originalPrice && product.originalPrice > product.price;
    const discountPercent = hasDiscount ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100) : 0;

    const colorsHtml = (product.colors || []).map(c => `
      <span 
        class="color-dot" 
        style="background-color: ${c.hex};" 
        title="${c.name}"
        onclick="event.stopPropagation(); openQuickView('${product.id}', '${c.name}');"
      ></span>
    `).join('');

    return `
      <article class="product-card group bg-white dark:bg-[#161619] rounded-xl overflow-hidden border border-gray-200/80 dark:border-zinc-800/80 flex flex-col justify-between cursor-pointer" onclick="openQuickView('${product.id}')">
        
        <!-- Image & Actions Wrap -->
        <div class="product-image-wrap">
          <img src="${product.images[0]}" alt="${product.title}" loading="lazy">
          
          <!-- Badges -->
          <div class="absolute top-3 left-3 flex flex-col gap-1 z-10">
            ${product.badge ? `
              <span class="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 bg-black text-white dark:bg-gold-500 dark:text-black rounded shadow">
                ${product.badge}
              </span>
            ` : ''}
            ${hasDiscount ? `
              <span class="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 bg-rose-600 text-white rounded shadow">
                -${discountPercent}%
              </span>
            ` : ''}
          </div>

          <!-- Wishlist Heart Button -->
          <button 
            onclick="event.stopPropagation(); store.toggleWishlist('${product.id}');"
            aria-label="Toggle Wishlist"
            class="absolute top-3 right-3 z-10 w-8 h-8 rounded-full bg-white/90 dark:bg-black/80 flex items-center justify-center text-gray-700 dark:text-gray-200 hover:text-rose-500 transition-colors shadow"
          >
            <i data-lucide="heart" class="w-4 h-4 ${inWishlist ? 'fill-rose-500 text-rose-500' : ''}"></i>
          </button>

          <!-- Hover Action Overlay -->
          <div class="product-overlay-actions">
            <button 
              onclick="event.stopPropagation(); openQuickView('${product.id}');"
              class="w-full py-2.5 bg-white text-black font-semibold text-xs tracking-wider uppercase rounded shadow hover:bg-gold-500 hover:text-black transition-colors flex items-center justify-center gap-1.5"
            >
              <i data-lucide="eye" class="w-3.5 h-3.5"></i> Quick View
            </button>
            <button 
              onclick="event.stopPropagation(); store.addToCart('${product.id}');"
              aria-label="Quick Add to Bag"
              class="px-3 py-2.5 bg-black dark:bg-zinc-800 text-white hover:bg-gold-600 rounded shadow transition-colors flex items-center justify-center"
            >
              <i data-lucide="shopping-bag" class="w-4 h-4"></i>
            </button>
          </div>
        </div>

        <!-- Meta Content -->
        <div class="p-4 flex flex-col flex-grow justify-between">
          <div>
            <div class="flex items-center justify-between text-[11px] uppercase tracking-wider text-gray-400 mb-1">
              <span>${product.subcategory}</span>
              <span class="flex items-center gap-0.5 text-gold-500 font-semibold">
                ★ ${product.rating}
              </span>
            </div>
            <h3 class="font-serif text-lg font-medium text-black dark:text-white line-clamp-1 group-hover:text-gold-600 dark:group-hover:text-gold-400 transition-colors">
              ${product.title}
            </h3>
          </div>

          <div class="mt-3 pt-3 border-t border-gray-100 dark:border-zinc-800/80 flex items-center justify-between">
            <div class="flex items-baseline gap-2">
              <span class="text-sm font-semibold text-black dark:text-white">
                ${store.formatPrice(product.price)}
              </span>
              ${hasDiscount ? `
                <span class="text-xs text-gray-400 line-through">
                  ${store.formatPrice(product.originalPrice)}
                </span>
              ` : ''}
            </div>

            <!-- Color swatches snippet -->
            <div class="flex items-center gap-1">
              ${colorsHtml}
            </div>
          </div>
        </div>

      </article>
    `;
  }).join('');

  initIcons();
}

function renderActiveFilterChips() {
  const container = document.getElementById('active-filter-tags');
  const chips = document.getElementById('filter-chips-container');
  if (!container || !chips) return;

  const tags = [];

  if (store.filters.category !== 'all') {
    const cat = FASHION_CATEGORIES.find(c => c.id === store.filters.category);
    tags.push({ label: `Category: ${cat ? cat.name : store.filters.category}`, clear: () => filterByCategory('all') });
  }

  if (store.filters.subcategories.length > 0) {
    store.filters.subcategories.forEach(sub => {
      tags.push({ label: `Subcategory: ${sub}`, clear: () => handleSubcategoryToggle(sub, false) });
    });
  }

  if (store.filters.sizes.length > 0) {
    store.filters.sizes.forEach(sz => {
      tags.push({ label: `Size: ${sz}`, clear: () => handleSizeToggle(sz) });
    });
  }

  if (store.filters.priceRange && store.filters.priceRange[1] < 600) {
    tags.push({ label: `Under $${store.filters.priceRange[1]}`, clear: () => {
      document.getElementById('price-range-slider').value = 600;
      document.getElementById('price-range-label').textContent = '$0 - $600';
      store.setFilter('priceRange', [0, 600]);
    }});
  }

  if (store.filters.inStockOnly) {
    tags.push({ label: `In Stock Only`, clear: () => {
      document.getElementById('stock-toggle').checked = false;
      store.setFilter('inStockOnly', false);
    }});
  }

  if (store.filters.searchQuery) {
    tags.push({ label: `"${store.filters.searchQuery}"`, clear: () => {
      document.getElementById('header-search-input').value = '';
      store.setFilter('searchQuery', '');
    }});
  }

  if (tags.length === 0) {
    container.classList.add('hidden');
    return;
  }

  container.classList.remove('hidden');
  chips.innerHTML = tags.map((t, idx) => `
    <span class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-gray-200 dark:bg-zinc-800 text-[11px] font-medium text-gray-800 dark:text-gray-200">
      ${t.label}
      <button onclick="window.__activeFilterTags[${idx}].clear()" class="hover:text-rose-500">✕</button>
    </span>
  `).join('');

  window.__activeFilterTags = tags;
}

// --- FILTER DISPATCHERS ---
function filterByCategory(catId) {
  store.setFilter('category', catId);
  initFilterUI();
  scrollToCatalog();
}

function handleSubcategoryToggle(subcat, isChecked) {
  let list = [...store.filters.subcategories];
  if (isChecked) {
    if (!list.includes(subcat)) list.push(subcat);
  } else {
    list = list.filter(s => s !== subcat);
  }
  store.setFilter('subcategories', list);
}

function handleSizeToggle(size) {
  let list = [...store.filters.sizes];
  const idx = list.indexOf(size);
  const chip = document.getElementById(`size-chip-${size.replace(/\s+/g, '')}`);

  if (idx > -1) {
    list.splice(idx, 1);
    chip?.classList.remove('bg-gold-500', 'text-black', 'border-gold-500', 'font-semibold');
  } else {
    list.push(size);
    chip?.classList.add('bg-gold-500', 'text-black', 'border-gold-500', 'font-semibold');
  }
  store.setFilter('sizes', list);
}

function scrollToCatalog() {
  const section = document.getElementById('catalog-section');
  if (section) {
    section.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}

// --- QUICK VIEW MODAL CONTROLLER ---
function openQuickView(productId, defaultColor = null) {
  const product = PRODUCTS.find(p => p.id === productId);
  if (!product) return;

  activeQvProduct = product;
  activeQvColor = defaultColor || (product.colors && product.colors.length > 0 ? product.colors[0].name : null);
  activeQvSize = product.sizes && product.sizes.length > 0 ? product.sizes[0] : null;
  activeQvQty = 1;

  updateQuickViewModal(product);

  const dialog = document.getElementById('quick-view-dialog');
  if (dialog) {
    dialog.showModal();
    initIcons();
  }
}

function updateQuickViewModal(product) {
  document.getElementById('qv-title').textContent = product.title;
  document.getElementById('qv-category').textContent = product.category.toUpperCase();
  document.getElementById('qv-description').textContent = product.description;
  document.getElementById('qv-price').textContent = store.formatPrice(product.price);
  
  const originalPriceEl = document.getElementById('qv-original-price');
  const savePill = document.getElementById('qv-save-pill');
  if (product.originalPrice && product.originalPrice > product.price) {
    originalPriceEl.textContent = store.formatPrice(product.originalPrice);
    originalPriceEl.classList.remove('hidden');
    savePill.textContent = `SAVE ${store.formatPrice(product.originalPrice - product.price)}`;
    savePill.classList.remove('hidden');
  } else {
    originalPriceEl.classList.add('hidden');
    savePill.classList.add('hidden');
  }

  const badgeEl = document.getElementById('qv-badge');
  if (product.badge) {
    badgeEl.textContent = product.badge;
    badgeEl.classList.remove('hidden');
  } else {
    badgeEl.classList.add('hidden');
  }

  document.getElementById('qv-rating-text').textContent = `${product.rating} (${product.reviewCount} reviews)`;
  document.getElementById('qv-main-image').src = product.images[0];
  document.getElementById('qv-main-image').alt = product.title;
  document.getElementById('qv-qty-val').textContent = activeQvQty;

  // Render Thumbnails
  const thumbContainer = document.getElementById('qv-thumbnails');
  thumbContainer.innerHTML = product.images.map((img, idx) => `
    <button 
      onclick="document.getElementById('qv-main-image').src = '${img}'"
      class="w-14 h-16 rounded-md overflow-hidden border-2 hover:border-gold-500 focus:border-gold-500 transition-colors flex-shrink-0"
    >
      <img src="${img}" alt="" class="w-full h-full object-cover">
    </button>
  `).join('');

  // Render Color Swatches
  const colorNameEl = document.getElementById('qv-color-name');
  colorNameEl.textContent = activeQvColor || '';
  const swatchesContainer = document.getElementById('qv-color-swatches');
  swatchesContainer.innerHTML = (product.colors || []).map(c => `
    <button 
      onclick="selectQvColor('${c.name}')"
      class="color-dot w-6 h-6 rounded-full border-2 ${activeQvColor === c.name ? 'ring-2 ring-gold-500 scale-110' : ''}" 
      style="background-color: ${c.hex};" 
      title="${c.name}"
    ></button>
  `).join('');

  // Render Sizes
  const sizeContainer = document.getElementById('qv-sizes');
  sizeContainer.innerHTML = (product.sizes || []).map(s => `
    <button 
      onclick="selectQvSize('${s}')"
      class="px-3.5 py-1.5 text-xs rounded border transition-colors ${
        activeQvSize === s 
          ? 'bg-black text-white dark:bg-gold-500 dark:text-black border-transparent font-semibold shadow-sm' 
          : 'border-gray-300 dark:border-zinc-700 hover:border-gray-500'
      }"
    >
      ${s}
    </button>
  `).join('');

  // Stock alert
  const stockEl = document.getElementById('qv-stock-alert');
  if (product.stock > 0) {
    stockEl.textContent = `✓ In Stock (${product.stock} pieces crafted)`;
    stockEl.className = 'text-[11px] text-emerald-600 dark:text-emerald-400 mt-2 font-medium';
  } else {
    stockEl.textContent = `✕ Out of Stock (Made to order available)`;
    stockEl.className = 'text-[11px] text-rose-600 dark:text-rose-400 mt-2 font-medium';
  }

  updateQuickViewWishlistBtn(product.id);
}

function selectQvColor(colorName) {
  activeQvColor = colorName;
  document.getElementById('qv-color-name').textContent = colorName;
  if (activeQvProduct) updateQuickViewModal(activeQvProduct);
}

function selectQvSize(sizeName) {
  activeQvSize = sizeName;
  if (activeQvProduct) updateQuickViewModal(activeQvProduct);
}

function updateQuickViewWishlistBtn(productId) {
  const btn = document.getElementById('qv-btn-add-wishlist');
  if (!btn) return;
  const isSaved = store.isInWishlist(productId);
  btn.innerHTML = isSaved 
    ? `<i data-lucide="heart" class="w-4 h-4 fill-rose-500 text-rose-500"></i> Saved in Wishlist`
    : `<i data-lucide="heart" class="w-4 h-4"></i> Save to Wishlist`;
  initIcons();
}

// --- CART DRAWER RENDERING ---
function openCart() {
  document.getElementById('cart-drawer-backdrop')?.classList.add('active');
  document.getElementById('cart-drawer')?.classList.add('active');
  document.body.style.overflow = 'hidden';
  initIcons();
}

function closeCart() {
  document.getElementById('cart-drawer-backdrop')?.classList.remove('active');
  document.getElementById('cart-drawer')?.classList.remove('active');
  document.body.style.overflow = '';
}

function renderCart() {
  const summary = store.getCartSummary();
  const badge = document.getElementById('cart-badge');
  const countLabel = document.getElementById('cart-drawer-count');
  const container = document.getElementById('cart-items-container');
  const emptyState = document.getElementById('cart-empty-state');
  const footer = document.getElementById('cart-footer');

  // Badges
  if (badge) {
    badge.textContent = summary.itemCount;
    badge.classList.toggle('hidden', summary.itemCount === 0);
  }
  if (countLabel) countLabel.textContent = `${summary.itemCount} items`;

  // Free shipping meter
  const meterBar = document.getElementById('free-shipping-bar');
  const meterPercent = document.getElementById('free-shipping-percent');
  const meterText = document.getElementById('free-shipping-text');

  if (meterBar && meterPercent && meterText) {
    meterBar.style.width = `${summary.freeShippingProgress}%`;
    meterPercent.textContent = `${summary.freeShippingProgress}%`;

    if (summary.qualifiesForFreeShipping) {
      meterText.innerHTML = '🎉 <strong class="text-emerald-700 dark:text-emerald-400">Complimentary Express Shipping Unlocked!</strong>';
    } else {
      meterText.textContent = `Add ${store.formatPrice(summary.amountNeededForFreeShipping)} more for Free Shipping`;
    }
  }

  // If empty
  if (summary.items.length === 0) {
    if (container) container.innerHTML = '';
    emptyState?.classList.remove('hidden');
    footer?.classList.add('hidden');
    return;
  }

  emptyState?.classList.add('hidden');
  footer?.classList.remove('hidden');

  // Render items
  if (container) {
    container.innerHTML = summary.items.map(item => `
      <div class="flex gap-3.5 pb-4 border-b border-gray-200 dark:border-zinc-800 text-xs">
        <img src="${item.image}" alt="${item.title}" class="w-16 h-20 object-cover rounded-lg bg-gray-100 flex-shrink-0">
        
        <div class="flex-grow flex flex-col justify-between">
          <div>
            <div class="flex items-start justify-between gap-2">
              <h4 class="font-serif text-sm font-medium text-black dark:text-white line-clamp-1">${item.title}</h4>
              <button onclick="store.removeFromCart('${item.cartItemId}')" class="text-gray-400 hover:text-rose-500">✕</button>
            </div>
            <p class="text-[11px] text-gray-500 mt-0.5">${item.size} • ${item.color}</p>
          </div>

          <div class="flex items-center justify-between mt-2">
            <!-- Qty controller -->
            <div class="flex items-center border border-gray-300 dark:border-zinc-700 rounded overflow-hidden">
              <button onclick="store.updateCartQuantity('${item.cartItemId}', ${item.quantity - 1})" class="px-2 py-0.5 hover:bg-gray-100 dark:hover:bg-zinc-800">-</button>
              <span class="px-2 text-xs font-semibold">${item.quantity}</span>
              <button onclick="store.updateCartQuantity('${item.cartItemId}', ${item.quantity + 1})" class="px-2 py-0.5 hover:bg-gray-100 dark:hover:bg-zinc-800">+</button>
            </div>

            <!-- Price -->
            <span class="font-semibold text-black dark:text-white">
              ${store.formatPrice(item.price * item.quantity)}
            </span>
          </div>
        </div>
      </div>
    `).join('');
  }

  // Update summary breakdown
  document.getElementById('cart-subtotal').textContent = store.formatPrice(summary.rawSubtotal);
  
  const discountRow = document.getElementById('cart-discount-row');
  const discountVal = document.getElementById('cart-discount');
  const appliedPromoTag = document.getElementById('applied-promo-tag');
  const appliedPromoName = document.getElementById('applied-promo-code-name');

  if (summary.appliedPromo) {
    appliedPromoTag?.classList.remove('hidden');
    if (appliedPromoName) appliedPromoName.textContent = summary.appliedPromo.code;
  } else {
    appliedPromoTag?.classList.add('hidden');
  }

  if (summary.discountAmount > 0) {
    discountRow?.classList.remove('hidden');
    discountVal.textContent = `-${store.formatPrice(summary.discountAmount)}`;
  } else {
    discountRow?.classList.add('hidden');
  }

  document.getElementById('cart-shipping').textContent = summary.shippingFee === 0 ? 'Complimentary' : store.formatPrice(summary.shippingFee);
  document.getElementById('cart-tax').textContent = store.formatPrice(summary.tax);
  document.getElementById('cart-total').textContent = store.formatPrice(summary.total);
}

// --- WISHLIST DRAWER RENDERING ---
function openWishlist() {
  document.getElementById('wishlist-drawer-backdrop')?.classList.add('active');
  document.getElementById('wishlist-drawer')?.classList.add('active');
  document.body.style.overflow = 'hidden';
  initIcons();
}

function closeWishlist() {
  document.getElementById('wishlist-drawer-backdrop')?.classList.remove('active');
  document.getElementById('wishlist-drawer')?.classList.remove('active');
  document.body.style.overflow = '';
}

function renderWishlist() {
  const items = store.getWishlistItems();
  const badge = document.getElementById('wishlist-badge');
  const countLabel = document.getElementById('wishlist-drawer-count');
  const container = document.getElementById('wishlist-items-container');
  const emptyState = document.getElementById('wishlist-empty-state');

  if (badge) {
    badge.textContent = items.length;
    badge.classList.toggle('hidden', items.length === 0);
  }
  if (countLabel) countLabel.textContent = `${items.length} items`;

  if (items.length === 0) {
    if (container) container.innerHTML = '';
    emptyState?.classList.remove('hidden');
    return;
  }

  emptyState?.classList.add('hidden');

  if (container) {
    container.innerHTML = items.map(p => `
      <div class="flex gap-3.5 pb-4 border-b border-gray-200 dark:border-zinc-800 text-xs">
        <img src="${p.images[0]}" alt="${p.title}" class="w-16 h-20 object-cover rounded-lg bg-gray-100 flex-shrink-0">
        <div class="flex-grow flex flex-col justify-between">
          <div>
            <div class="flex items-start justify-between gap-2">
              <h4 class="font-serif text-sm font-medium text-black dark:text-white line-clamp-1">${p.title}</h4>
              <button onclick="store.toggleWishlist('${p.id}')" class="text-gray-400 hover:text-rose-500">✕</button>
            </div>
            <p class="font-semibold text-black dark:text-white mt-1">${store.formatPrice(p.price)}</p>
          </div>
          <button 
            onclick="store.addToCart('${p.id}'); store.toggleWishlist('${p.id}');" 
            class="w-full py-1.5 bg-black dark:bg-gold-500 text-white dark:text-black text-[11px] font-semibold uppercase tracking-wider rounded mt-2 flex items-center justify-center gap-1.5"
          >
            <i data-lucide="shopping-bag" class="w-3.5 h-3.5"></i> Move to Bag
          </button>
        </div>
      </div>
    `).join('');
  }

  initIcons();
}

// --- MOBILE MENU ---
function openMobileMenu() {
  document.getElementById('mobile-nav-backdrop')?.classList.add('active');
  document.getElementById('mobile-nav-drawer')?.classList.add('active');
}

function closeMobileMenu() {
  document.getElementById('mobile-nav-backdrop')?.classList.remove('active');
  document.getElementById('mobile-nav-drawer')?.classList.remove('active');
}

// --- SIZE GUIDE MODAL ---
function openSizeGuideModal() {
  const dialog = document.getElementById('size-guide-dialog');
  if (dialog) dialog.showModal();
}

// --- MULTI-STEP CHECKOUT CONTROLLER ---
function openCheckoutModal() {
  const dialog = document.getElementById('checkout-dialog');
  if (!dialog) return;

  goToCheckoutStep(1);
  updateCheckoutSummary();
  dialog.showModal();
  initIcons();
}

function goToCheckoutStep(step) {
  const s1 = document.getElementById('checkout-step-1');
  const s2 = document.getElementById('checkout-step-2');
  const s3 = document.getElementById('checkout-step-3');

  const dot1 = document.getElementById('step-dot-1');
  const dot2 = document.getElementById('step-dot-2');
  const dot3 = document.getElementById('step-dot-3');

  s1?.classList.add('hidden');
  s2?.classList.add('hidden');
  s3?.classList.add('hidden');

  if (step === 1) {
    s1?.classList.remove('hidden');
    dot1.className = 'w-7 h-7 rounded-full bg-gold-500 text-black text-xs font-bold flex items-center justify-center';
    dot2.className = 'w-7 h-7 rounded-full bg-gray-200 dark:bg-zinc-800 text-gray-500 text-xs font-bold flex items-center justify-center';
    dot3.className = 'w-7 h-7 rounded-full bg-gray-200 dark:bg-zinc-800 text-gray-500 text-xs font-bold flex items-center justify-center';
  } else if (step === 2) {
    s2?.classList.remove('hidden');
    dot1.className = 'w-7 h-7 rounded-full bg-emerald-500 text-white text-xs font-bold flex items-center justify-center';
    dot2.className = 'w-7 h-7 rounded-full bg-gold-500 text-black text-xs font-bold flex items-center justify-center';
    dot3.className = 'w-7 h-7 rounded-full bg-gray-200 dark:bg-zinc-800 text-gray-500 text-xs font-bold flex items-center justify-center';
  } else if (step === 3) {
    s3?.classList.remove('hidden');
    dot1.className = 'w-7 h-7 rounded-full bg-emerald-500 text-white text-xs font-bold flex items-center justify-center';
    dot2.className = 'w-7 h-7 rounded-full bg-emerald-500 text-white text-xs font-bold flex items-center justify-center';
    dot3.className = 'w-7 h-7 rounded-full bg-gold-500 text-black text-xs font-bold flex items-center justify-center';
    updateCardPreview();
  }
}

function updateCardPreview() {
  const name = document.getElementById('chk-card-name')?.value || 'ELENA ROSTOVA';
  const number = document.getElementById('chk-card-number')?.value || '•••• •••• •••• 4242';
  const exp = document.getElementById('chk-card-exp')?.value || '12/28';

  const previewName = document.getElementById('card-preview-name');
  const previewNumber = document.getElementById('card-preview-number');
  const previewExpiry = document.getElementById('card-preview-expiry');

  if (previewName) previewName.textContent = name.toUpperCase();
  if (previewNumber) previewNumber.textContent = number;
  if (previewExpiry) previewExpiry.textContent = exp;
}

function updateCheckoutSummary() {
  const summary = store.getCartSummary();
  const finalTotal = document.getElementById('chk-final-total');
  if (finalTotal) finalTotal.textContent = store.formatPrice(summary.total);
}

function processOrderPayment() {
  const btn = document.getElementById('btn-complete-order');
  if (btn) {
    btn.disabled = true;
    btn.innerHTML = `<span class="animate-spin mr-2">⚙</span> Securing Payment with Bank...`;
  }

  setTimeout(() => {
    // Generate simulated order confirmation
    const orderId = `ATL-${Math.floor(10000 + Math.random() * 90000)}-${store.currency}`;
    const cartSummary = store.getCartSummary();
    const orderedItems = [...cartSummary.items];

    // Clear cart
    store.clearCart();

    // Close checkout dialog
    document.getElementById('checkout-dialog')?.close();
    if (btn) {
      btn.disabled = false;
      btn.innerHTML = `<i data-lucide="check-circle" class="w-4 h-4"></i> Place Order Now`;
    }

    // Open order tracking dialog
    openOrderTrackerModal(orderId, orderedItems);
  }, 1400);
}

// --- ORDER TRACKING MODAL ---
function openOrderTrackerModal(orderId = 'ATL-74291-US', items = null) {
  const dialog = document.getElementById('order-tracking-dialog');
  if (!dialog) return;

  document.getElementById('track-order-id').textContent = orderId;
  
  const arrivalDate = new Date();
  arrivalDate.setDate(arrivalDate.getDate() + 3);
  const options = { weekday: 'long', month: 'short', day: 'numeric' };
  document.getElementById('track-order-arrival').textContent = arrivalDate.toLocaleDateString('en-US', options);

  // Render receipt items
  const itemsContainer = document.getElementById('track-order-items');
  const displayItems = items || PRODUCTS.slice(0, 2);
  if (itemsContainer) {
    itemsContainer.innerHTML = displayItems.map(item => `
      <div class="flex items-center justify-between py-1.5 border-b border-gray-100 dark:border-zinc-800">
        <span class="text-gray-700 dark:text-gray-300">${item.title} (${item.size || 'M'}, ${item.color || 'Default'}) × ${item.quantity || 1}</span>
        <span class="font-semibold text-black dark:text-white">${store.formatPrice(item.price * (item.quantity || 1))}</span>
      </div>
    `).join('');
  }

  dialog.showModal();
  initIcons();
}

// --- FLASH SALE COUNTDOWN TIMER ---
function startFlashCountdown() {
  let secondsLeft = 14 * 3600 + 42 * 60 + 18;

  setInterval(() => {
    if (secondsLeft <= 0) return;
    secondsLeft--;

    const hours = Math.floor(secondsLeft / 3600);
    const mins = Math.floor((secondsLeft % 3600) / 60);
    const secs = secondsLeft % 60;

    const elH = document.getElementById('countdown-hours');
    const elM = document.getElementById('countdown-minutes');
    const elS = document.getElementById('countdown-seconds');

    if (elH) elH.textContent = String(hours).padStart(2, '0');
    if (elM) elM.textContent = String(mins).padStart(2, '0');
    if (elS) elS.textContent = String(secs).padStart(2, '0');
  }, 1000);
}

function applyFlashPromo() {
  store.applyPromoCode('VOGUE30');
  openCart();
}

function handleNewsletter() {
  const emailInput = document.getElementById('newsletter-email');
  if (emailInput && emailInput.value) {
    showToast(`Welcome to The Atelier Circle! $25 privilege voucher dispatched to ${emailInput.value}.`, 'success');
    emailInput.value = '';
  }
}

// --- TOAST NOTIFICATIONS ---
function showToast(message, type = 'info') {
  const container = document.getElementById('toast-container');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = 'toast';

  const iconName = type === 'success' ? 'check-circle-2' : 'info';
  const iconColor = type === 'success' ? 'text-emerald-500' : 'text-gold-500';

  toast.innerHTML = `
    <i data-lucide="${iconName}" class="w-5 h-5 ${iconColor} flex-shrink-0"></i>
    <span class="flex-grow">${message}</span>
    <button onclick="this.parentElement.remove()" class="text-gray-400 hover:text-black dark:hover:text-white ml-2 text-xs">✕</button>
  `;

  container.appendChild(toast);
  initIcons();

  setTimeout(() => {
    toast.classList.add('toast-leave');
    setTimeout(() => toast.remove(), 300);
  }, 4000);
}

// Window global helper bindings
window.openQuickView = openQuickView;
window.selectQvColor = selectQvColor;
window.selectQvSize = selectQvSize;
window.openSizeGuideModal = openSizeGuideModal;
window.openOrderTrackerModal = openOrderTrackerModal;
window.openCart = openCart;
window.closeCart = closeCart;
window.openWishlist = openWishlist;
window.closeWishlist = closeWishlist;
window.openMobileMenu = openMobileMenu;
window.closeMobileMenu = closeMobileMenu;
window.filterByCategory = filterByCategory;
window.handleSubcategoryToggle = handleSubcategoryToggle;
window.handleSizeToggle = handleSizeToggle;
window.goToCheckoutStep = goToCheckoutStep;
window.updateCardPreview = updateCardPreview;
window.processOrderPayment = processOrderPayment;
window.applyFlashPromo = applyFlashPromo;
window.handleNewsletter = handleNewsletter;

