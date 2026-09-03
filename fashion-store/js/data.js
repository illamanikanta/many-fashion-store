/**
 * ATELIER Fashion House - Product Catalog Data
 * Comprehensive catalog across Women, Men, Kids, Footwear, and Accessories
 */

const FASHION_CATEGORIES = [
  { id: 'all', name: 'All Collections', icon: 'sparkles' },
  { id: 'women', name: "Women's Fashion", icon: 'user' },
  { id: 'men', name: "Men's Fashion", icon: 'user-check' },
  { id: 'kids', name: "Kids & Teens", icon: 'smile' },
  { id: 'footwear', name: "Shoes & Footwear", icon: 'footprints' },
  { id: 'accessories', name: "Bags & Accessories", icon: 'watch' }
];

const CURRENCIES = {
  USD: { symbol: '$', rate: 1.0, label: 'USD ($)' },
  EUR: { symbol: '€', rate: 0.92, label: 'EUR (€)' },
  GBP: { symbol: '£', rate: 0.79, label: 'GBP (£)' },
  INR: { symbol: '₹', rate: 83.5, label: 'INR (₹)' }
};

const PROMO_CODES = {
  'STYLE20': { discountPercent: 20, description: '20% off all orders' },
  'FIRST10': { discountPercent: 10, description: '10% off your first order' },
  'VOGUE30': { discountPercent: 30, description: 'VIP Flash 30% discount' },
  'FREESHIP': { freeShipping: true, description: 'Complimentary Express Shipping' }
};

const PRODUCTS = [
  // --- WOMEN'S FASHION ---
  {
    id: 'w-1',
    title: 'Silk Slip Evening Gown',
    category: 'women',
    subcategory: 'Dresses',
    price: 245,
    originalPrice: 320,
    badge: 'Bestseller',
    rating: 4.9,
    reviewCount: 142,
    images: [
      'https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1566174053879-31528523f8ae?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?auto=format&fit=crop&w=1000&q=80'
    ],
    colors: [
      { name: 'Champagne Gold', hex: '#D4AF37' },
      { name: 'Midnight Noir', hex: '#1C1C1E' },
      { name: 'Emerald Forest', hex: '#0B4F37' }
    ],
    sizes: ['XS', 'S', 'M', 'L'],
    stock: 18,
    isFeatured: true,
    isNew: false,
    description: 'Crafted from 100% Grade 6A mulberry silk with an elegant bias-cut silhouette that drapes gracefully along natural contours. Features delicate adjustable spaghetti straps and a subtle cowl neckline.',
    details: [
      '100% Mulberry Silk (22 Momme)',
      'Dry clean only',
      'Concealed side zipper closure',
      'Bias cut for natural fluid movement'
    ]
  },
  {
    id: 'w-2',
    title: 'Double-Breasted Cashmere Trench',
    category: 'women',
    subcategory: 'Outerwear',
    price: 495,
    originalPrice: 620,
    badge: 'Signature',
    rating: 4.8,
    reviewCount: 98,
    images: [
      'https://images.unsplash.com/photo-1544441893-675973e31985?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=1000&q=80'
    ],
    colors: [
      { name: 'Camel Tan', hex: '#C19A6B' },
      { name: 'Charcoal Grey', hex: '#36454F' },
      { name: 'Bone White', hex: '#E3DAC9' }
    ],
    sizes: ['S', 'M', 'L', 'XL'],
    stock: 12,
    isFeatured: true,
    isNew: true,
    description: 'A timeless cold-weather masterpiece blending ultra-soft Mongolian cashmere with structured virgin wool. Features storm flap detailing, horn buttons, and an adjustable waist belt.',
    details: [
      '70% Virgin Wool, 30% Mongolian Cashmere',
      'Satin cupro lining for smooth layering',
      'Detachable waist belt with buckle',
      'Deep welt storm pockets'
    ]
  },
  {
    id: 'w-3',
    title: 'Pleated High-Rise Wide Trousers',
    category: 'women',
    subcategory: 'Pants',
    price: 165,
    originalPrice: 195,
    badge: 'Trending',
    rating: 4.7,
    reviewCount: 84,
    images: [
      'https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1551803091-e20673f15770?auto=format&fit=crop&w=1000&q=80'
    ],
    colors: [
      { name: 'Oatmeal', hex: '#E0D6C6' },
      { name: 'Black', hex: '#111111' },
      { name: 'Olive Green', hex: '#556B2F' }
    ],
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    stock: 24,
    isFeatured: false,
    isNew: true,
    description: 'Sartorial tailoring meets relaxed modern volume. Cut from fluid suiting twill with front double pleats, structured waistband, and floor-skimming wide-leg drape.',
    details: [
      '68% Polyester, 28% Viscose, 4% Elastane',
      'Hook and bar closure with interior jigger button',
      'Slash side pockets, welt back pockets',
      'Machine wash gentle cold or dry clean'
    ]
  },
  {
    id: 'w-4',
    title: 'Cable-Knit Cashmere Turtleneck',
    category: 'women',
    subcategory: 'Knitwear',
    price: 210,
    originalPrice: 260,
    badge: 'Winter Cozy',
    rating: 4.9,
    reviewCount: 110,
    images: [
      'https://images.unsplash.com/photo-1576871337622-98d48d1cf531?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?auto=format&fit=crop&w=1000&q=80'
    ],
    colors: [
      { name: 'Ivory Cream', hex: '#FFFFF0' },
      { name: 'Soft Rose', hex: '#DCAE96' },
      { name: 'Muted Slate', hex: '#708090' }
    ],
    sizes: ['XS', 'S', 'M', 'L'],
    stock: 15,
    isFeatured: true,
    isNew: false,
    description: 'Artisanal cable-knit detailing in an elevated relaxed cut. Spun from sustainably sourced 2-ply pure cashmere that delivers featherweight warmth and cloud-like softness.',
    details: [
      '100% Sustainable Cashmere',
      'Ribbed turtleneck collar, cuffs, and hem',
      'Dropped shoulder seam for an effortless drape',
      'Hand wash cold or dry clean'
    ]
  },
  {
    id: 'w-5',
    title: 'Structured Corset Linen Top',
    category: 'women',
    subcategory: 'Tops',
    price: 120,
    originalPrice: 145,
    badge: 'Hot',
    rating: 4.6,
    reviewCount: 76,
    images: [
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1502716119720-b23a93e5fe1b?auto=format&fit=crop&w=1000&q=80'
    ],
    colors: [
      { name: 'Terracotta', hex: '#E2725B' },
      { name: 'Pure White', hex: '#FFFFFF' },
      { name: 'Sage Green', hex: '#9CAF88' }
    ],
    sizes: ['XS', 'S', 'M', 'L'],
    stock: 20,
    isFeatured: false,
    isNew: true,
    description: 'Feminine architectural boning woven with breathable European flax linen. Accentuates the waistline with sculpted bust cups and smocked stretch back panel for comfort.',
    details: [
      '100% French Flax Linen',
      'Internal flexible boning structure',
      'Smocked elastic back with exposed zip',
      'Breathable, pre-washed for softness'
    ]
  },
  {
    id: 'w-6',
    title: 'Japanese Denim Flare Trousers',
    category: 'women',
    subcategory: 'Jeans',
    price: 185,
    originalPrice: 220,
    badge: 'Popular',
    rating: 4.8,
    reviewCount: 92,
    images: [
      'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1582418702059-97ebafb35d09?auto=format&fit=crop&w=1000&q=80'
    ],
    colors: [
      { name: 'Vintage Indigo', hex: '#264E7A' },
      { name: 'Washed Black', hex: '#2C2C2C' }
    ],
    sizes: ['25', '26', '27', '28', '29', '30', '31'],
    stock: 22,
    isFeatured: false,
    isNew: false,
    description: 'Woven in Okayama, Japan on vintage shuttle looms. Offers authentic vintage character with 2% comfort stretch, ultra-high rise, and a sculpted 70s-inspired kick-flare leg.',
    details: [
      '98% BCI Cotton, 2% Elastane (12.5oz Japanese denim)',
      'Custom brushed nickel hardware',
      'Copper rivets at stress points',
      'Reinforced chain-stitched hems'
    ]
  },

  // --- MEN'S FASHION ---
  {
    id: 'm-1',
    title: 'Neapolitan Tailored Wool Blazer',
    category: 'men',
    subcategory: 'Suits & Blazers',
    price: 450,
    originalPrice: 560,
    badge: 'Luxury',
    rating: 4.9,
    reviewCount: 128,
    images: [
      'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&w=1000&q=80'
    ],
    colors: [
      { name: 'Navy Blue', hex: '#002244' },
      { name: 'Charcoal Houndstooth', hex: '#3B3C36' },
      { name: 'Tobacco Brown', hex: '#714B23' }
    ],
    sizes: ['38R', '40R', '42R', '44R'],
    stock: 14,
    isFeatured: true,
    isNew: true,
    description: 'Crafted using traditional Neapolitan tailoring techniques with unpadded spalla camicia shirt shoulders and a lightweight half-canvas construction for relaxed, natural elegance.',
    details: [
      '100% Super 130s Italian Wool (Vitale Barberis Canonico)',
      'Half-canvas floating chest piece',
      'Genuine corozo nut buttons with working cuffs',
      'Double back vents and unlined back for breathability'
    ]
  },
  {
    id: 'm-2',
    title: 'Egyptian Cotton Poplin Shirt',
    category: 'men',
    subcategory: 'Shirts',
    price: 110,
    originalPrice: 135,
    badge: 'Essential',
    rating: 4.8,
    reviewCount: 165,
    images: [
      'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1620012253295-c15c429fcc71?auto=format&fit=crop&w=1000&q=80'
    ],
    colors: [
      { name: 'Crisp White', hex: '#FFFFFF' },
      { name: 'Sky Blue', hex: '#87CEEB' },
      { name: 'Fine Stripe', hex: '#B0C4DE' }
    ],
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    stock: 35,
    isFeatured: false,
    isNew: false,
    description: 'The foundation of modern menswear. Spun from extra-long staple Giza Egyptian cotton with a silky hand-feel, semi-spread collar, and mother-of-pearl buttons.',
    details: [
      '100% Long-Staple Egyptian Cotton (120/2 ply)',
      'Mother-of-pearl buttons cross-stitched for durability',
      'Single-needle tailoring with 22 stitches per inch',
      'Removable brass collar stays included'
    ]
  },
  {
    id: 'm-3',
    title: 'Heavyweight Heavy Terry Hoodie',
    category: 'men',
    subcategory: 'Hoodies',
    price: 140,
    originalPrice: 170,
    badge: 'Streetwear',
    rating: 4.9,
    reviewCount: 204,
    images: [
      'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1509967419530-da38b4704bc6?auto=format&fit=crop&w=1000&q=80'
    ],
    colors: [
      { name: 'Washed Ash Grey', hex: '#A8A9AD' },
      { name: 'Vintage Black', hex: '#222222' },
      { name: 'Forest Moss', hex: '#2E473B' }
    ],
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    stock: 28,
    isFeatured: true,
    isNew: true,
    description: 'Substantial 500 GSM French Terry knit with a double-layered structured hood, no drawstrings for clean minimalism, and ribbed side gussets for enhanced freedom of movement.',
    details: [
      '100% Combed Organic Cotton (500 GSM)',
      'Pre-shrunk custom wash treatment',
      'Seamless kangaroo pocket with reinforced bar-tacks',
      'Double-needle coverstitching on all seams'
    ]
  },
  {
    id: 'm-4',
    title: 'Pleated Tapered Chino Trousers',
    category: 'men',
    subcategory: 'Pants',
    price: 135,
    originalPrice: 160,
    badge: 'Smart Casual',
    rating: 4.7,
    reviewCount: 89,
    images: [
      'https://images.unsplash.com/photo-1473966968600-fa801b869a1a?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?auto=format&fit=crop&w=1000&q=80'
    ],
    colors: [
      { name: 'Khaki Stone', hex: '#BDB76B' },
      { name: 'Deep Navy', hex: '#1B263B' },
      { name: 'Espresso', hex: '#3E2723' }
    ],
    sizes: ['30', '32', '34', '36', '38'],
    stock: 20,
    isFeatured: false,
    isNew: false,
    description: 'Engineered for all-day comfort with subtle single forward pleats, tapered ankle crop, and an interior elasticated curtain waistband for effortless sophistication.',
    details: [
      '97% Supima Cotton, 3% Spandex',
      'Enzyme-washed for a peach-skin handfeel',
      'Concealed coin pocket and twin back jetted pockets',
      'YKK zip fly with horn button closure'
    ]
  },
  {
    id: 'm-5',
    title: 'Suede Leather Cafe Racer Jacket',
    category: 'men',
    subcategory: 'Outerwear',
    price: 520,
    originalPrice: 650,
    badge: 'VIP Limited',
    rating: 4.9,
    reviewCount: 73,
    images: [
      'https://images.unsplash.com/photo-1487222477894-8943e31ef7b2?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1520975916090-3105956dac38?auto=format&fit=crop&w=1000&q=80'
    ],
    colors: [
      { name: 'Cognac Suede', hex: '#9A463D' },
      { name: 'Midnight Onyx', hex: '#1A1A1A' }
    ],
    sizes: ['M', 'L', 'XL'],
    stock: 8,
    isFeatured: true,
    isNew: true,
    description: 'Buttery-soft calfskin suede treated with a water-repellent finish. Features two-way brushed silver zippers, band collar with snap closure, and tailored ergonomic sleeves.',
    details: [
      '100% Genuine Calf Suede Leather',
      'Full cupro silk lining with interior security pocket',
      'Two-way heavy duty YKK Excella zippers',
      'Professional leather specialist clean only'
    ]
  },
  {
    id: 'm-6',
    title: 'Raw Selvedge Denim Slim Jeans',
    category: 'men',
    subcategory: 'Jeans',
    price: 190,
    originalPrice: 230,
    badge: 'Crafted',
    rating: 4.8,
    reviewCount: 115,
    images: [
      'https://images.unsplash.com/photo-1542272604-780c96856592?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1582552938357-32b906df40cb?auto=format&fit=crop&w=1000&q=80'
    ],
    colors: [
      { name: 'Raw Indigo ID', hex: '#102A43' },
      { name: 'Overdyed Black', hex: '#121212' }
    ],
    sizes: ['30', '31', '32', '33', '34', '36'],
    stock: 19,
    isFeatured: false,
    isNew: false,
    description: '14.5oz Kuroki red-line selvedge denim. Unwashed and rigid, designed to develop personalized, high-contrast fades and honeycombs with authentic daily wear.',
    details: [
      '100% Zimbabwe Long-Staple Cotton (14.5oz)',
      'Red and white selvedge ID line',
      'Custom gunmetal donut button fly',
      'Tucked belt loops and hidden back pocket rivets'
    ]
  },

  // --- KIDS & TEENS ---
  {
    id: 'k-1',
    title: 'Kids Organic Cotton Breton Stripe Tee',
    category: 'kids',
    subcategory: 'Tops',
    price: 38,
    originalPrice: 48,
    badge: 'Organic',
    rating: 4.9,
    reviewCount: 86,
    images: [
      'https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1503944583220-79d8926ad5e2?auto=format&fit=crop&w=1000&q=80'
    ],
    colors: [
      { name: 'Navy/White Stripe', hex: '#1B365D' },
      { name: 'Red/White Stripe', hex: '#B22222' }
    ],
    sizes: ['3-4Y', '5-6Y', '7-8Y', '9-10Y', '11-12Y'],
    stock: 40,
    isFeatured: true,
    isNew: false,
    description: 'Soft, GOTS-certified organic jersey cotton that is hypoallergenic and gentle on young sensitive skin. Features reinforced shoulder snaps for little ones and flatlock itch-free seams.',
    details: [
      '100% GOTS Certified Organic Cotton (200 GSM)',
      'Non-toxic reactive dyes',
      'Pre-shrunk for machine wash durability',
      'Tagless printed neck label'
    ]
  },
  {
    id: 'k-2',
    title: 'Kids Corduroy Utility Overalls',
    category: 'kids',
    subcategory: 'Dresses & Overalls',
    price: 65,
    originalPrice: 80,
    badge: 'Playproof',
    rating: 4.8,
    reviewCount: 64,
    images: [
      'https://images.unsplash.com/photo-1622290291468-a28f7a7dc6a8?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1522771930-78848d9293e8?auto=format&fit=crop&w=1000&q=80'
    ],
    colors: [
      { name: 'Caramel Rust', hex: '#AF4035' },
      { name: 'Forest Green', hex: '#228B22' },
      { name: 'Dusty Mustard', hex: '#FFDB58' }
    ],
    sizes: ['2-3Y', '4-5Y', '6-7Y', '8-9Y'],
    stock: 25,
    isFeatured: false,
    isNew: true,
    description: 'Durable chunky corduroy with adjustable brass buckle straps that grow with your child. Features double-reinforced knee patches for endless playground adventures.',
    details: [
      '100% Heavy Wale Cotton Corduroy',
      'Adjustable sliding shoulder straps',
      'Spacious front kangaroo chest pocket',
      'Double knee reinforcement layers'
    ]
  },
  {
    id: 'k-3',
    title: 'Kids Puffer Down Snow Jacket',
    category: 'kids',
    subcategory: 'Outerwear',
    price: 95,
    originalPrice: 125,
    badge: 'Warmth 10/10',
    rating: 4.9,
    reviewCount: 94,
    images: [
      'https://images.unsplash.com/photo-1519457431-44ccd64a579b?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1514090458221-65bb69cf63e6?auto=format&fit=crop&w=1000&q=80'
    ],
    colors: [
      { name: 'Electric Yellow', hex: '#FFD700' },
      { name: 'Royal Sapphire', hex: '#0F52BA' },
      { name: 'Berry Pink', hex: '#D1526D' }
    ],
    sizes: ['4Y', '6Y', '8Y', '10Y', '12Y'],
    stock: 22,
    isFeatured: true,
    isNew: false,
    description: 'Ultra-warm 650-fill power recycled down insulation wrapped in a water-repellent ripstop shell. Includes reflective safety trims and fleece-lined handwarmer pockets.',
    details: [
      'Shell: 100% Recycled Nylon with DWR finish',
      'Fill: 90% Recycled Down, 10% Feathers',
      'Fleece chin guard and storm hood',
      '360-degree reflective low-light safety strips'
    ]
  },
  {
    id: 'k-4',
    title: 'Kids Floral Embroidered Party Dress',
    category: 'kids',
    subcategory: 'Dresses',
    price: 72,
    originalPrice: 90,
    badge: 'Special Occasion',
    rating: 4.7,
    reviewCount: 52,
    images: [
      'https://images.unsplash.com/photo-1518831959646-742c3a14ebf7?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1485546246426-74dc88dec4d9?auto=format&fit=crop&w=1000&q=80'
    ],
    colors: [
      { name: 'Blush Pink', hex: '#FFB6C1' },
      { name: 'Pale Mint', hex: '#98FF98' }
    ],
    sizes: ['3-4Y', '5-6Y', '7-8Y', '9-10Y'],
    stock: 16,
    isFeatured: false,
    isNew: true,
    description: 'Enchanting floral embroidery delicately stitched across lightweight layered tulle with a 100% soft cotton underslip for itch-free elegance at birthday parties and weddings.',
    details: [
      'Upper: Embroidered English Tulle',
      'Lining: 100% Breathable Combed Cotton',
      'Concealed back zip with satin ribbon sash',
      'Gentle hand wash or delicate cycle'
    ]
  },

  // --- FOOTWEAR ---
  {
    id: 'f-1',
    title: 'Handmade Italian Leather Chelsea Boots',
    category: 'footwear',
    subcategory: 'Boots',
    price: 320,
    originalPrice: 395,
    badge: 'Goodyear Welted',
    rating: 4.9,
    reviewCount: 178,
    images: [
      'https://images.unsplash.com/photo-1638247025967-b4e38f787b76?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=1000&q=80'
    ],
    colors: [
      { name: 'Espresso Calfskin', hex: '#3B2F2F' },
      { name: 'Pitch Black', hex: '#111111' },
      { name: 'Snuff Suede', hex: '#8B6508' }
    ],
    sizes: ['EU 40 / US 7', 'EU 41 / US 8', 'EU 42 / US 9', 'EU 43 / US 10', 'EU 44 / US 11', 'EU 45 / US 12'],
    stock: 14,
    isFeatured: true,
    isNew: false,
    description: 'Artisanal Goodyear-welted construction handcrafted in Tuscany. Built to last a lifetime with full-grain French calf leather, Dainite studded rubber sole, and elastic side gussets.',
    details: [
      'Full-grain French Box Calf leather',
      'Traditional 360-degree Goodyear welted construction (resoleable)',
      'British Dainite studded rubber outsole',
      'Cork footbed that molds to the contours of your foot'
    ]
  },
  {
    id: 'f-2',
    title: 'Minimalist Clean White Leather Sneaker',
    category: 'footwear',
    subcategory: 'Sneakers',
    price: 195,
    originalPrice: 240,
    badge: 'Iconic',
    rating: 4.8,
    reviewCount: 312,
    images: [
      'https://images.unsplash.com/photo-1560769629-975ec94e6a86?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?auto=format&fit=crop&w=1000&q=80'
    ],
    colors: [
      { name: 'Triple White', hex: '#FDFDFD' },
      { name: 'White / Gum', hex: '#FAF0E6' },
      { name: 'White / Forest', hex: '#2E8B57' }
    ],
    sizes: ['US 6', 'US 7', 'US 8', 'US 9', 'US 10', 'US 11', 'US 12'],
    stock: 45,
    isFeatured: true,
    isNew: true,
    description: 'The epitome of understated luxury footwear. Clean monochrome lines with gold foil numbering on the heel, supple Nappa leather uppers, and Margom Italian rubber cupsole.',
    details: [
      'Premium Italian Nappa full-grain leather',
      'Stitched Margom rubber cupsole',
      'Calfskin lined interior with removable memory foam insole',
      'Waxed cotton tonal laces'
    ]
  },
  {
    id: 'f-3',
    title: 'Strappy Sculpted Kitten Heel Sandal',
    category: 'footwear',
    subcategory: 'Heels & Sandals',
    price: 215,
    originalPrice: 270,
    badge: 'Trending',
    rating: 4.7,
    reviewCount: 93,
    images: [
      'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1535043934128-cf0b28d52f95?auto=format&fit=crop&w=1000&q=80'
    ],
    colors: [
      { name: 'Metallic Silver', hex: '#C0C0C0' },
      { name: 'Black Patent', hex: '#1B1B1B' },
      { name: 'Nude Almond', hex: '#EFDECD' }
    ],
    sizes: ['US 5', 'US 6', 'US 7', 'US 8', 'US 9', 'US 10'],
    stock: 18,
    isFeatured: false,
    isNew: true,
    description: 'Architectural 50mm curved kitten heel that marries modern runway silhouettes with walkable all-evening comfort. Features delicate crossover ankle straps with gold hardware.',
    details: [
      '100% Metallic Mirror / Patent Leather',
      'Padded memory foam insole with arch support',
      '50mm (2-inch) sculpted hourglass heel',
      'Adjustable ankle buckle with concealed elastic'
    ]
  },
  {
    id: 'f-4',
    title: 'Heritage Bit Penny Loafers',
    category: 'footwear',
    subcategory: 'Loafers',
    price: 280,
    originalPrice: 340,
    badge: 'Classic',
    rating: 4.9,
    reviewCount: 88,
    images: [
      'https://images.unsplash.com/photo-1614252235316-8c857d38b5f4?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1533867617858-e7b97e060509?auto=format&fit=crop&w=1000&q=80'
    ],
    colors: [
      { name: 'Burgundy Cordovan', hex: '#58111A' },
      { name: 'Classic Black', hex: '#0A0A0A' }
    ],
    sizes: ['US 7', 'US 8', 'US 9', 'US 10', 'US 11', 'US 12'],
    stock: 15,
    isFeatured: false,
    isNew: false,
    description: 'A collegiate staple re-imagined with polished brush-off leather, antiqued gold horsebit buckle across the vamp, and a channel-stitched leather sole.',
    details: [
      'Polished calfskin leather upper',
      'Antiqued gold-plated horsebit detail',
      'Hand-stitched apron toe',
      'Stacked leather heel with protective rubber tap'
    ]
  },

  // --- ACCESSORIES ---
  {
    id: 'a-1',
    title: 'Structured Box Leather Crossbody Bag',
    category: 'accessories',
    subcategory: 'Bags',
    price: 360,
    originalPrice: 440,
    badge: 'It Bag',
    rating: 5.0,
    reviewCount: 220,
    images: [
      'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=1000&q=80'
    ],
    colors: [
      { name: 'Caramel Saddle', hex: '#A0522D' },
      { name: 'Noir Black', hex: '#1C1C1E' },
      { name: 'Sage Celadon', hex: '#B2AC88' }
    ],
    sizes: ['One Size'],
    stock: 11,
    isFeatured: true,
    isNew: true,
    description: 'Clean architectural lines meet everyday practicality. Sculpted from scratch-resistant palmellato Italian calf leather with an accordion interior and gold magnetic clasp closure.',
    details: [
      'Full-grain Italian Palmellato Calf Leather',
      '24k gold-plated brass lock hardware',
      'Three interior compartments with center zip pouch',
      'Adjustable and detachable shoulder strap (48cm - 56cm drop)'
    ]
  },
  {
    id: 'a-2',
    title: 'Printed Mulberry Silk Twill Scarf',
    category: 'accessories',
    subcategory: 'Scarves',
    price: 95,
    originalPrice: 120,
    badge: 'Artisanal',
    rating: 4.9,
    reviewCount: 145,
    images: [
      'https://images.unsplash.com/photo-1601924994987-69e26d50dc26?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1584030373081-f37b7bb4fa8e?auto=format&fit=crop&w=1000&q=80'
    ],
    colors: [
      { name: 'Baroque Flora', hex: '#D4AF37' },
      { name: 'Geometric Azure', hex: '#007791' }
    ],
    sizes: ['90 x 90 cm'],
    stock: 30,
    isFeatured: false,
    isNew: true,
    description: 'An art piece for your wardrobe. Generous 90cm square silk twill scarf illustrated with hand-painted botanical motifs and finished with meticulous hand-rolled edges.',
    details: [
      '100% Pure Mulberry Silk Twill (18 Momme)',
      'Hand-rolled and hand-stitched borders',
      'Dimensions: 90 cm x 90 cm (35.4" x 35.4")',
      'Made in Como, Italy'
    ]
  },
  {
    id: 'a-3',
    title: 'Minimalist Chronograph Sapphire Watch',
    category: 'accessories',
    subcategory: 'Watches',
    price: 260,
    originalPrice: 325,
    badge: 'Precision',
    rating: 4.8,
    reviewCount: 97,
    images: [
      'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1524805444758-089113d48a6d?auto=format&fit=crop&w=1000&q=80'
    ],
    colors: [
      { name: 'Silver / Tan Leather', hex: '#C0C0C0' },
      { name: 'Rose Gold / Black', hex: '#B76E79' },
      { name: 'Gunmetal Steel', hex: '#4A4A4A' }
    ],
    sizes: ['40mm Dial'],
    stock: 14,
    isFeatured: true,
    isNew: false,
    description: 'Clean Bauhaus-inspired 40mm dial powered by a high-precision Japanese Miyota quartz chronograph movement. Encased in 316L stainless steel with scratch-proof sapphire crystal glass.',
    details: [
      '316L Surgical Grade Stainless Steel Case',
      'Scratch-resistant Sapphire Crystal Glass with AR coating',
      '5 ATM (50 Meters) Water Resistance',
      'Interchangeable vegetable-tanned Italian leather strap'
    ]
  },
  {
    id: 'a-4',
    title: 'Polarized Handcrafted Acetate Sunglasses',
    category: 'accessories',
    subcategory: 'Eyewear',
    price: 155,
    originalPrice: 190,
    badge: 'UV400',
    rating: 4.8,
    reviewCount: 112,
    images: [
      'https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1508296695146-257a814070b4?auto=format&fit=crop&w=1000&q=80'
    ],
    colors: [
      { name: 'Havana Tortoise', hex: '#634226' },
      { name: 'Glossy Onyx', hex: '#111111' },
      { name: 'Crystal Champagne', hex: '#F7E7CE' }
    ],
    sizes: ['Standard Fit (50-21-145)'],
    stock: 26,
    isFeatured: false,
    isNew: true,
    description: 'Carved from premium Italian Mazzucchelli cellulose acetate with custom wire core temples and category 3 polarized lenses providing 100% UVA/UVB eye protection.',
    details: [
      'Mazzucchelli Bio-Acetate frames',
      'Japanese 7-barrel hinges with Teflon coated screws',
      'Polarized CR-39 scratch-resistant lenses',
      'Includes hard magnetic case and microfiber cloth'
    ]
  },
  {
    id: 'a-5',
    title: 'Reversible Saffiano Leather Dress Belt',
    category: 'accessories',
    subcategory: 'Belts',
    price: 85,
    originalPrice: 105,
    badge: '2-in-1',
    rating: 4.9,
    reviewCount: 160,
    images: [
      'https://images.unsplash.com/photo-1624222247344-550fb60583dc?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=1000&q=80'
    ],
    colors: [
      { name: 'Black / Dark Brown', hex: '#1F1F1F' }
    ],
    sizes: ['32', '34', '36', '38', '40'],
    stock: 35,
    isFeatured: false,
    isNew: false,
    description: 'Double your styling versatility with a twist-mechanism buckle. Flip effortlessly between refined Saffiano crosshatch black leather and smooth mocha brown leather.',
    details: [
      'Full-grain Tuscan Saffiano Leather',
      '35mm width (standard formal dress fit)',
      'Brushed palladium rotating buckle',
      'Beveled edges with tonal perimeter stitching'
    ]
  }
];

// Extract subcategories dynamically
try {
  if (typeof localStorage !== 'undefined') {
    const custom = JSON.parse(localStorage.getItem('atelier_custom_products')) || [];
    if (Array.isArray(custom) && custom.length > 0) {
      PRODUCTS.unshift(...custom);
    }
  }
} catch (e) {}

const ALL_SUBCATEGORIES = Array.from(new Set(PRODUCTS.map(p => p.subcategory)));
const ALL_SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL', '28', '30', '32', '34', '36', 'US 7', 'US 8', 'US 9', 'US 10', 'US 11'];

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { PRODUCTS, FASHION_CATEGORIES, CURRENCIES, PROMO_CODES, ALL_SUBCATEGORIES, ALL_SIZES };
}
