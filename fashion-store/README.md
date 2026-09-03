# ATELIER — Haute Couture & Ready-to-Wear E-Commerce Platform

A premier, full-featured, responsive e-commerce web platform for luxury fashion apparel and accessories across all categories.

---

## 🌟 Departments & Collections
- **Women's Studio**: Evening gowns, double-breasted cashmere trenches, pleated high-rise trousers, knitwear, French flax corset tops, Japanese denim flare jeans.
- **Men's Sartorial**: Neapolitan half-canvas wool blazers, Egyptian Giza cotton shirts, heavyweight French terry hoodies, tailored chinos, suede cafe racer jackets, Kuroki raw selvedge denim.
- **Kids & Teens**: Organic Breton stripe tees, chunky corduroy overalls, 650-fill power down snow jackets, floral embroidered party dresses.
- **Footwear Atelier**: Handcrafted Goodyear-welted Chelsea boots, minimalist white Nappa leather sneakers, sculpted kitten heel sandals, heritage horsebit penny loafers.
- **Bags & Accessories**: Italian palmellato leather box crossbody bags, Como silk twill square scarves, sapphire crystal chronograph watches, handcrafted acetate sunglasses, reversible Saffiano dress belts.

---

## 🚀 Key Features

1. **Modern Editorial Aesthetic**:
   - High-fashion typography (Cormorant Garamond & Plus Jakarta Sans).
   - Full responsive layout across Mobile, Tablet, and Desktop screens.
   - Dark Mode / Light Mode with seamless transition and persistence.
   - Multi-currency switcher ($ USD, € EUR, £ GBP, ₹ INR) with instant price recalculation.

2. **Catalog & Intelligent Filter Engine**:
   - Dynamic department & subcategory filtering.
   - Price range slider with live feedback.
   - Size chips (XS, S, M, L, XL, XXL, shoe sizes) and color swatches.
   - In-stock availability toggle.
   - Instant live search with highlights.
   - Multi-layout toggle (3-column / 4-column).

3. **Product Experience**:
   - Quick View dialog (`<dialog>`) with multi-angle high-res photo gallery and thumbnails.
   - Interactive color swatches and size selector with real-time stock alert.
   - International Size Guide modal with US, UK, and EU measurement conversion charts.
   - Customer ratings, verified review counts, and fabric/care details.

4. **Cart & Wishlist System**:
   - Slide-out Mini-Cart drawer with real-time quantity adjustments.
   - Dynamic Free Express Delivery meter (shows progress towards $150 threshold).
   - Promo code engine with instant discount calculations:
     - `STYLE20`: 20% discount on all garments
     - `VOGUE30`: 30% VIP flash discount
     - `FIRST10`: 10% welcome discount
     - `FREESHIP`: Complimentary Express Shipping
   - Wishlist drawer with saved items count and one-click "Move to Bag".

5. **Multi-Step Checkout & Live Tracking**:
   - 3-step checkout modal (1. Contact & Shipping Address -> 2. Delivery Courier -> 3. Payment).
   - Realistic live credit card preview that reflects user input in real-time.
   - Simulated order authorization generating unique tracking numbers (e.g. `ATL-94820-US`).
   - Live 5-stage shipment tracking timeline (Placed -> Quality Check -> In Transit -> Out for Delivery -> Delivered).
   - Printable order receipt.

6. **Store Manager / Admin Dashboard (`admin.html`)**:
   - Real-time business metrics (Gross Revenue, Orders Processed, Active Garments, Low Stock Alerts).
   - Inventory table with live inline stock count adjustment (+/-) and status toggle.
   - "Add New Fashion Piece" modal to introduce new garments directly into the catalog (persisted via `localStorage`).
   - Recent client orders table with simulated order generation.

---

## 💻 How to Run

### Option 1: Direct in Browser (Zero Dependencies)
Simply double-click or open `index.html` directly in any modern web browser (Chrome, Edge, Firefox, Safari).

### Option 2: Python Web Server
Open a terminal in the `fashion-store` directory and run:

```bash
# Using Python's built-in HTTP server
python -m http.server 5000

# Or using the included Flask server with REST API
python app.py
```

Then navigate to:
- **Storefront**: [http://localhost:5000](http://localhost:5000)
- **Store Manager**: [http://localhost:5000/admin.html](http://localhost:5000/admin.html)

---

## 📁 Directory Structure
```
fashion-store/
├── index.html        # Main e-commerce storefront
├── admin.html        # Store manager inventory & metrics dashboard
├── README.md         # Documentation & guide
├── app.py            # Python Flask backend & REST API
├── css/
│   └── styles.css    # Custom styles, luxury typography & dark theme
└── js/
    ├── data.js       # Complete product catalog across all categories
    ├── store.js      # Reactive state store (Cart, Wishlist, Currency, Theme)
    └── app.js        # Application controller, modal controllers, filters
```

