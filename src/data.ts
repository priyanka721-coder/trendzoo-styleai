/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Product, Coupon, Review, ProductCategory } from './types';

// Curated Unsplash product image IDs to cycle for highly realistic visuals per category
const CATEGORY_IMAGES: Record<ProductCategory, string[]> = {
  Clothes: [
    "1544025162-d76694265947", // heavy hoodie
    "1556821840-3a63f95609a7", // street jacket
    "1539571696357-5a69c17a67c6", // outerwear model jacket
    "1483985988355-763728e1935b", // clothing rack store
    "1467043180411-23685e157a4a", // denim clothing array
    "1515886657613-9f3515b0c78f", // bright stylish coat
    "1509319117193-57bab727e09d", // pants wear
    "1548883354-7622d03aca27", // yellow technical anorak
    "1434389677669-e08b4cac3105", // white knit sweater warm
    "1485968579580-b6d095142e6e", // winter jacket
    "1512436991641-6745cdb1723f", // fashion clothes hanging
    "1618220179428-22790b461013"  // techwear jacket coat
  ],
  Shoes: [
    "1542291026-7eec264c27ff", // red stylish sneakers
    "1606107557195-0e29a4b5b4aa", // running yellow sneakers
    "1539185441755-769473a23570", // premium active trail boots
    "1608231387042-66d1773070aa", // pristine white sneakers
    "1549298916-b41d501d3772", // sports retro trainers
    "1595950653106-6c9ebd614d3a", // purple stylish running shoes
    "1600185365483-26d7a4cc7519", // training gym tracks
    "1520256863351-a9fcf784afec", // neon athletic shoes
    "1560769629-97ef31eec241", // high performance orange shoes
    "1525962322637-29d9351e220c"  // modern athletic joggers sneakers
  ],
  Slippers: [
    "1603808033207-2476249d2974", // comfort slides slippers
    "1597043420054-045353beec7a", // relaxed casual slippers
    "1598925407000-e766f103b415", // snug recovery indoor slides
    "1506193029111-d9da1b978c43"  // comfortable slippers walk
  ],
  Jewelry: [
    "1535632066927-ab7c9ab60908", // silver ring aesthetic
    "1599643478518-a784e5dc4c8f", // polished gemstone necklace
    "1605100804763-247f67b3557e", // golden luxury chains
    "1515562141224-2a2a741e3091", // gold wedding band luxury
    "1611085583191-a3b1a1a2941b"  // classic elegant necklace drop
  ]
};

// Handmade seed premium products for initial load
const baseProducts: Product[] = [
  {
    id: "prod-01",
    title: "AeroWeave Organic Carbon Kimono",
    description: "Premium technical cotton oversized kimono jacket with water-repellent shell and modular sleeve snaps.",
    longDescription: "Step into structural elegance with the AeroWeave Organic Carbon Kimono. Handcrafted with high-density organic ripstop cotton fused with lightweight carbon fibers. Offers superior urban insulation and wind resistance. Finished in a modular structure with deep side pockets, magnetic cargo straps, and quick-attach utility loops. Highly customizable silhouette fits both casual and elevated street styles.",
    price: 139.99,
    discountPrice: 119.99,
    rating: 4.8,
    reviewsCount: 342,
    category: "Clothes",
    image: "https://images.unsplash.com/photo-1618220179428-22790b461013?q=80&w=800&auto=format&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1618220179428-22790b461013?q=80&w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1544025162-d76694265947?q=80&w=800&auto=format&fit=crop"
    ],
    specs: {
      "Fabric Composition": "85% Carbon-weave Cotton, 15% Tensile Spandex",
      "Pockets": "4 ergonomic hidden pockets",
      "Coating": "Durable Water Repellent (DWR)",
      "Fit Style": "Oversized silhouette drape",
      "Utility Level": "Technical street ready"
    },
    stock: 24,
    isTrending: true,
    isFlashSale: true,
    colors: ["Stealth Black", "Concrete Gray", "Neon Violet"],
    sizes: ["S", "M", "L", "XL"]
  },
  {
    id: "prod-02",
    title: "Chronos Active Titanium Smart Ring",
    description: "The ultimate rugged companion for sleep scoring, temperature scans, and heart rate tracking styled in high luxury.",
    longDescription: "Reimagine biometric tracker technology with the Chronos Titanium Smart Ring. Engineered using high-grade hypoallergenic grade 5 titanium alloy with an inner technical epoxy casing. Features high-accuracy sleep score modeling, 24/7 heart-rate variations mapping, skin temperature sensors, and NFC token touch links. Merges pristine luxury design with state-of-the-art sensory electronics.",
    price: 249.99,
    discountPrice: 199.99,
    rating: 4.9,
    reviewsCount: 198,
    category: "Jewelry",
    image: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?q=80&w=800&auto=format&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?q=80&w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1515562141224-2a2a741e3091?q=80&w=800&auto=format&fit=crop"
    ],
    specs: {
      "Base Metal": "Grade 5 Aerospace Titanium",
      "Sensor Nodes": "Infrared PPG, NTC skin temperature scan, 3D accelerometer",
      "Bluetooth": "Ultra Low Power Bluetooth 5.2 link",
      "Battery Life": "Up to 10 days continuous backup",
      "Waterproofing": "100m deep pressure seal (dive compliant)"
    },
    stock: 12,
    isBestSeller: true,
    colors: ["Pulse Gold", "Stealth Charcoal", "Pristine Silver"]
  },
  {
    id: "prod-03",
    title: "Apex H-90 Carbon Techwear Hoodie",
    description: "Water-resistant, micro-fibered heavyweight hoodie with cargo accessory straps and double alignment panels.",
    longDescription: "The Apex H-90 Carbon Techwear Hoodie is a masterpiece of modern urban streetwear structure. Woven using highly resilient polymer blends and featuring carbon-reinforced surface overlays, it boasts total wind-proofing and advanced water repellency. Includes internal modular tech pockets, structural utility quick-release harness straps, and an ergonomic oversized hood with adjustable magnetic toggles. It is the gold standard for high-fashion aesthetics and technical insulation.",
    price: 119.99,
    discountPrice: 89.99,
    rating: 4.7,
    reviewsCount: 154,
    category: "Clothes",
    image: "https://images.unsplash.com/photo-1544025162-d76694265947?q=80&w=800&auto=format&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1544025162-d76694265947?q=80&w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1556821840-3a63f95609a7?q=80&w=800&auto=format&fit=crop"
    ],
    specs: {
      "Fabric Weight": "450 GSM Heavyweight fleece liner",
      "Shell Material": "82% Carbon-treated Cotton blends, 18% Hydrophobic Spandex",
      "Straps": "Heavy-duty modular tactical nylon with magnetic snap-locks",
      "Pockets": "9 secure compartments including 1 waterproof phone slider",
      "Fit": "Ergonomic Drop-shoulder Oversized silhouette"
    },
    stock: 45,
    isTrending: true,
    colors: ["Stealth Black", "Concrete Grey", "Electro Purple"],
    sizes: ["S", "M", "L", "XL"]
  },
  {
    id: "prod-04",
    title: "Velocity-9 Air Kushioned Sneakers",
    description: "Futuristic street running shoes featuring adaptive dynamic foam sole and breathable mesh matrices.",
    longDescription: "Step into the future with the Velocity-9 Air Kushioned Sneakers. Merging performance-engineered running support with peak urban streetwear fashion, they feature an outer knit matrix that dynamically wraps around your foot structure. The high-performance midsole is infused with pressurized nitrogen cushions that absorb heavy ground impact and spring back, generating immediate kinetic energy return. Highlighted by high-contrast fluorescent visual accents.",
    price: 199.99,
    discountPrice: 159.99,
    rating: 4.9,
    reviewsCount: 412,
    category: "Shoes",
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=800&auto=format&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?q=80&w=800&auto=format&fit=crop"
    ],
    specs: {
      "Sole Injection": "Velocity Dual-density Nitrogen-infused PEBA foam",
      "Upper Shell": "Breathable 3D jacquard knit thread matrix",
      "Weight": "242 grams (Ultralight active structure)",
      "Drop": "8mm heel-to-toe inclination",
      "Traction": "Reinforced carbon-compound rubber zones"
    },
    stock: 9,
    isFlashSale: true,
    colors: ["Neon Crimson", "Volt Yellow", "Midnight Black"],
    sizes: ["8", "9", "10", "11", "12"]
  },
  {
    id: "prod-05",
    title: "AeroPack Tech Comfort Cloud Slides",
    description: "Anti-slip orthopedic recovery slippers configured with ultra-dense responsive posture foam.",
    longDescription: "Experience absolute therapeutic support with the AeroPack Tech Comfort Cloud Slides. Engineered with high-density premium EVA memory cushion nodes, they alleviate foot and spinal load by dynamically matching your personal arch configuration. Features an ergonomic textured quick-dry slipper strap, continuous anti-slip undersole patterns, and highly responsive cushioning under sports impact.",
    price: 69.99,
    discountPrice: 49.99,
    rating: 4.6,
    reviewsCount: 89,
    category: "Slippers",
    image: "https://images.unsplash.com/photo-1603808033207-2476249d2974?q=80&w=800&auto=format&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1603808033207-2476249d2974?q=80&w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1597043420054-045353beec7a?q=80&w=800&auto=format&fit=crop"
    ],
    specs: {
      "Slipper Material": "Dual-injected Medical grade EVA",
      "Insole Style": "Contoured biomechanical arch support",
      "Weight": "110 grams (hyper-light structure)",
      "Undersole Grip": "Tread pattern anti-slip traction matrix"
    },
    stock: 30,
    colors: ["Shadow Charcoal", "Cyber Slate", "Opal Olive"],
    sizes: ["8", "9", "10", "11"]
  },
  {
    id: "prod-06",
    title: "Vortex Pro Heavy-Knit Utility Cardigan",
    description: "Thick double-ply knit modular heavy cardigan featuring utility steel loops and magnetic zipper grids.",
    longDescription: "A revolutionary aesthetic knitwear piece. The Vortex Cardigan is constructed from double-plied 650 GSM cotton-acrylic fibers that preserve natural insulation while staying extremely breathable. It highlights an oversized geometric cut with high-contrast tactical shoulder patches, magnetic quick-release zipper columns, and multi-functional stainless steel styling loops.",
    price: 149.99,
    rating: 4.8,
    reviewsCount: 227,
    category: "Clothes",
    image: "https://images.unsplash.com/photo-1434389677669-e08b4cac3105?q=80&w=800&auto=format&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1434389677669-e08b4cac3105?q=80&w=800&auto=format&fit=crop"
    ],
    specs: {
      "Knit Weight": "650 GSM Double-ply luxurious knit",
      "Yarn Composition": "70% Organic combed Cotton, 30% Thermal Acrylic base",
      "Clasps": "Premium technical magnetic zipper grid",
      "Hardware": "Tarnish-resistant polished stainless steel loops"
    },
    stock: 14,
    isBestSeller: true,
    colors: ["Retro Cream", "Stealth Ash", "Lumine Green"],
    sizes: ["M", "L", "XL"]
  },
  {
    id: "prod-07",
    title: "HydroFlow Brilliant Sterling Link Bracelet",
    description: "Premium solid sterling silver interlocking bracelet featuring a geometric utility connector lock.",
    longDescription: "An artistic tribute to technical jewelry structures. The HydroFlow Interlocking Bracelet is constructed using 100% fine solid .925 sterling silver, carefully polished to a mirrored visual texture. Merges deep chunky classic cuban linkages with a highly customized cybernetic spring-lock hook. Features an anti-scratch clear protective layer to prevent wear and preserve shine.",
    price: 129.99,
    discountPrice: 109.99,
    rating: 4.5,
    reviewsCount: 112,
    category: "Jewelry",
    image: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?q=80&w=800&auto=format&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1605100804763-247f67b3557e?q=80&w=800&auto=format&fit=crop"
    ],
    specs: {
      "Core Material": "Certified .925 Sterling Silver block",
      "Locking Unit": "Double security mechanical lock hook",
      "Width Dimension": "12 mm broad solid mesh",
      "Weight": "42 grams fine precious metal"
    },
    stock: 50,
    colors: ["Mirror Silver", "Frosted Platinum", "Onyx Black"]
  },
  {
    id: "prod-08",
    title: "Futura Techwear Anorak Jacket",
    description: "Heavy waterproof tactical jacket with magnetic buckles, reflective strips, and a modular hood.",
    longDescription: "The Futura Techwear Anorak is engineered for extreme urban and wilderness survival. Fully waterproof under any monsoon condition, it utilises multi-layered breathable membranes that lock water droplets out while releasing body vapor. Styled with reflective cyberpunk decals, structured tactical utility hooks, dynamic storage pockets, and a modular zip-away storm hood which accommodates headsets cleanly.",
    price: 179.99,
    discountPrice: 139.99,
    rating: 4.7,
    reviewsCount: 121,
    category: "Clothes",
    image: "https://images.unsplash.com/photo-1548883354-7622d03aca27?q=80&w=800&auto=format&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1548883354-7622d03aca27?q=80&w=800&auto=format&fit=crop"
    ],
    specs: {
      "Material": "3-layer Taslan ripstop nylon shell with TPU coating",
      "Waterproofing Index": "15,000mm hydrostatic column pressure resistance",
      "Breathability rating": "10,000 g/m² active heat dissipation rating",
      "Fasteners": "YKK AquaGuard sealed heavy-density zippers",
      "Piping": "High visibility Scotchlite reflective materials"
    },
    stock: 18,
    isTrending: true,
    colors: ["Ghost White", "Coal Ash Black", "Holographic Yellow"],
    sizes: ["M", "L", "XL"]
  },
  {
    id: "prod-09",
    title: "VividLux Gemstone Solas Pendant Necklace",
    description: "Premium hypoallergenic steel cable necklace highlighted by a brilliant-cut custom lab-diamond facet.",
    longDescription: "Radiate dynamic grace with the VividLux Solas Pendant. Handcrafted from heavy-duty, highly bio-compatible industrial steel ropes. Centered with an exquisite, masterfully hand-cut lab-created gemstone with flawless reflective parameters. Styled with an custom-tension adjustable cylinder slider to shift necklace lengths cleanly.",
    price: 159.99,
    discountPrice: 139.99,
    rating: 4.6,
    reviewsCount: 95,
    category: "Jewelry",
    image: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?q=80&w=800&auto=format&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?q=80&w=800&auto=format&fit=crop"
    ],
    specs: {
      "Pendant Facet": "Hearts & Arrows lab-grown sapphire crystal",
      "Metal Wire": "Surgical Grade 316L Stainless Steel cord",
      "Clasp Fastener": "Custom slider magnetic lock",
      "Carat Mass": "2.40 CT equivalent pristine diamond cut"
    },
    stock: 8,
    isFlashSale: true,
    colors: ["Diamond Crystal", "Oceanic Azure", "Emerald Green"]
  },
  {
    id: "prod-10",
    title: "SonicWave Light-up LED Runners",
    description: "True-to-life studio high-performance sneakers built with multi-layered responsive gel buffers.",
    longDescription: "A high-performance visual runner masterpiece. Configured with premium dual-intensity gel capsules that absorb heavy track vibration and spring back active kinetics. Designed with lightweight metal breathable lining thread mesh, dynamic light-up highlights, and an adjustable tactical dial lacing frame.",
    price: 189.99,
    rating: 4.7,
    reviewsCount: 167,
    category: "Shoes",
    image: "https://images.unsplash.com/photo-1549298916-b41d501d3772?q=80&w=800&auto=format&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1549298916-b41d501d3772?q=80&w=800&auto=format&fit=crop"
    ],
    specs: {
      "Buffer Tech": "Gel-infused PEBA cushioning arrays",
      "Upper Shell": "Carbon-stabilized air mesh knit",
      "Weight": "250 grams high performance",
      "Lacing Hardware": "Custom rotary micro cable harness dial"
    },
    stock: 15,
    colors: ["Neon Coral", "Stealth Gray", "Cyber Blue"],
    sizes: ["8", "9", "10", "11"]
  },
  {
    id: "prod-11",
    title: "Futurism Cyber-Slide Orthopedic Slippers",
    description: "Highly cushioned premium slippers with ergonomic panoramic non-slip grip and responsive soles.",
    longDescription: "Add immediate modern rest and recovery to your stride. Built with a continuous panoramic protective foam wall, these active supportive comfort slippers offer robust compression relief alongside impact-resistant sole backing. Specially textured footbeds massage feet and help micro-circulation, keeping your step relaxed.",
    price: 59.99,
    discountPrice: 44.99,
    rating: 4.8,
    reviewsCount: 180,
    category: "Slippers",
    image: "https://images.unsplash.com/photo-1597043420054-045353beec7a?q=80&w=800&auto=format&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1597043420054-045353beec7a?q=80&w=800&auto=format&fit=crop"
    ],
    specs: {
      "Sole Compound": "Shatterproof high-density cellular rubber",
      "Heel Cushion": "Double thick nitrogen injected impact pad",
      "Base Structure": "Deep wrap-around cradle foot base",
      "Grip Lining": "Laser-etched water channel traction tread"
    },
    stock: 22,
    isTrending: true,
    colors: ["Cyber Crimson", "Sand Beige", "Volt Glow Yellow"],
    sizes: ["8", "9", "10", "11"]
  },
  {
    id: "prod-12",
    title: "ZenPod Soft Velvet Indoor Slippers",
    description: "Luxurious indoor thermal comfort slippers constructed with high-pile velvet fleece.",
    longDescription: "The ultimate relaxing item. The ZenPod indoor slippers utilize high-pile velvet wool fleece loops to insulate toes perfectly in nearweightless luxury comfort. Integrating a beautiful memory foam padding that molds to your unique foot posture within minutes, releasing direct strain. Perfect for lazy days in style.",
    price: 45.00,
    discountPrice: 34.99,
    rating: 4.4,
    reviewsCount: 76,
    category: "Slippers",
    image: "https://images.unsplash.com/photo-1598925407000-e766f103b415?q=80&w=800&auto=format&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1598925407000-e766f103b415?q=80&w=800&auto=format&fit=crop"
    ],
    specs: {
      "Inner Lining": "High pile premium velvet shearling thermal wool",
      "Sole Base": "Flexible silent felt with rubber grip stars",
      "Wash Type": "Hand wash flat-dry responsive fleece material",
      "Weight": "85 grams hyper-cozy featherweight"
    },
    stock: 40,
    colors: ["Cozy Cream", "Warm Charcoal", "Calm Indigo"],
    sizes: ["S", "M", "L"]
  },
  {
    id: "prod-13",
    title: "Haute Couture Silk Trench Coat",
    description: "A luxurious, floor-length water-resistant heavy silk trench coat designed for elevated street runways.",
    longDescription: "Designed with an expansive storm flap, adjustable belt cuffs, and a masterfully draped silhouette. Infused with high-grade premium silk threads and finished with organic protective coatings to repel wind and water flawlessly.",
    price: 289.99,
    discountPrice: 249.99,
    rating: 4.9,
    reviewsCount: 145,
    category: "Clothes",
    image: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=800&auto=format&fit=crop",
    images: ["https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=800&auto=format&fit=crop"],
    specs: {
      "Aesthetic Trim": "Tonal horn-finish luxury buttons",
      "Weave Density": "Luxurious heavy silk filament blend",
      "Pockets": "Two deep welt storm pockets"
    },
    stock: 15,
    isTrending: true,
    colors: ["Classic Camel", "Stealth Onyx", "Pure Bone"],
    sizes: ["S", "M", "L"]
  },
  {
    id: "prod-14",
    title: "Cascade Diamond Tear Earrings",
    description: "Premium chandelier earrings featuring brilliant lab-grown round diamonds custom set in 18k white gold.",
    longDescription: "Add breathtaking brilliance to your wardrobe. Features two drops of flawless hand-selected brilliant lab diamonds crafted on certified tarnish-resistant precious metals for safety and everlasting luxury shine.",
    price: 199.99,
    discountPrice: 179.99,
    rating: 4.9,
    reviewsCount: 82,
    category: "Jewelry",
    image: "https://images.unsplash.com/photo-1611085583191-a3b1a1a2941b?q=80&w=800&auto=format&fit=crop",
    images: ["https://images.unsplash.com/photo-1611085583191-a3b1a1a2941b?q=80&w=800&auto=format&fit=crop"],
    specs: {
      "Base Carat": "1.80 total carat weight",
      "Clasp Type": "Hypoallergenic friction post locking mechanism",
      "Shine Level": "VVS1 certified lab diamond facet"
    },
    stock: 11,
    isBestSeller: true,
    colors: ["Platinum White Gold", "Aura Rose Gold"]
  },
  {
    id: "prod-15",
    title: "Svelte Plush Women's Bouclé Slippers",
    description: "Premium slides wrapped in premium buttery textured curly bouclé wool with orthopedic support bases.",
    longDescription: "Pamper your feet. Featuring a contoured cloudbed designed primarily for cozy indoor or light outdoor lounging, bound with dense posture-aligning foam bases designed to relieve heels.",
    price: 75.00,
    discountPrice: 59.99,
    rating: 4.8,
    reviewsCount: 164,
    category: "Slippers",
    image: "https://images.unsplash.com/photo-1608256246200-53e635b5b65f?q=80&w=800&auto=format&fit=crop",
    images: ["https://images.unsplash.com/photo-1608256246200-53e635b5b65f?q=80&w=800&auto=format&fit=crop"],
    specs: {
      "Fabric Material": "Premium organic curly wool bouclé yarn",
      "Arch Comfort": "Deep ergonomic heel cup and sole lining",
      "Outsole": "Durable flexible rubber grid shell"
    },
    stock: 28,
    colors: ["Oatmeal Creampie", "Blush Rose", "Saga Olive Green"],
    sizes: ["S", "M", "L"]
  },
  {
    id: "prod-16",
    title: "Luxe Shearling Comfort slides",
    description: "Cozy open-toe slippers fully lined with sustainable thick high-pile premium natural shearling.",
    longDescription: "The absolute standard in comfort slides. Merging flexible non-slip rubber outsoles with a double padded cloudfoot bed that distributes foot gravity safely across daily surfaces.",
    price: 69.99,
    discountPrice: 49.99,
    rating: 4.7,
    reviewsCount: 110,
    category: "Slippers",
    image: "https://images.unsplash.com/photo-1603561591411-07134e71a2a9?q=80&w=800&auto=format&fit=crop",
    images: ["https://images.unsplash.com/photo-1603561591411-07134e71a2a9?q=80&w=800&auto=format&fit=crop"],
    specs: {
      "Shetland Lining": "Fluffy shearling lining wool loops",
      "Soles": "Tough shock-absorbing lightweight EVA bases"
    },
    stock: 35,
    colors: ["Soft Apricot", "Espresso Black", "Cozy Ivory"],
    sizes: ["S", "M", "L"]
  },
  {
    id: "prod-17",
    title: "Gilded Solstice Aura Choker",
    description: "An elegant, 18k real gold-plated solid collar band with modern minimalist styling.",
    longDescription: "Masterfully crafted neck accessory that contours beautifully to collarbones. Built with a solid spring back structure to slide in place comfortably, completed with mirror polish luster.",
    price: 139.99,
    discountPrice: 119.99,
    rating: 4.8,
    reviewsCount: 94,
    category: "Jewelry",
    image: "https://images.unsplash.com/photo-1515562141224-2a2a741e3091?q=80&w=800&auto=format&fit=crop",
    images: ["https://images.unsplash.com/photo-1515562141224-2a2a741e3091?q=80&w=800&auto=format&fit=crop"],
    specs: {
      "Metal Plating": "18k Heavy Solid Gold Plated silver core",
      "Adjuster": "Spring back flexible contour frame"
    },
    stock: 19,
    isTrending: true,
    colors: ["Aura Gold", "Classic Platinum"]
  },
  {
    id: "prod-18",
    title: "Apex Horizon Streetwear Dunks",
    description: "Premium leather low-top sneakers featuring clean retro panels and high-grip rubber soles.",
    longDescription: "Celebrate original sneaker heritage. The Apex Horizon Dunks prioritize high craftsmanship with micro-stitched full grain premium leather uppers, an ergonomic shock-absorbing mesh liner, and reinforced vulcanized rubber traction pads perfect for active streets.",
    price: 159.00,
    discountPrice: 139.00,
    rating: 4.8,
    reviewsCount: 204,
    category: "Shoes",
    image: "https://images.unsplash.com/photo-1549298916-b41d501d3772?q=80&w=850&auto=format&fit=crop",
    images: ["https://images.unsplash.com/photo-1549298916-b41d501d3772?q=80&w=850&auto=format&fit=crop"],
    specs: {
      "Leather Body": "100% full-grain calf skin leather",
      "Buffer Inner": "Breathable high-bounce EVA mesh",
      "Undersole": "Chunky vulcanized rubber grip panels"
    },
    stock: 16,
    isTrending: true,
    colors: ["Classic Panda Black", "Crimson Rush", "Opal Sage Blue"],
    sizes: ["8", "9", "10", "11", "12"]
  }
];

// Aesthetic Title Components for realistic product naming
const ADJECTIVES = ["Active", "Pro-Tectonic", "Vapor-Dry", "Vortex", "Chroma-Flow", "Spectra", "Aero", "Hyper", "Stealth", "Quantum", "Nexus", "Matrix", "Nomad", "Zenith", "Apex", "Vector", "Titanium", "Carbon-Lite", "Glide", "Phantom", "Pulse", "Helix", "Echo", "Acoustic", "Reflective", "Sleek", "Modulus", "Tactical", "Core", "Thermal", "Oxygen", "Pinnacle"];

const CATEGORY_WORDS: Record<ProductCategory, { nouns: string[], features: string[] }> = {
  Clothes: {
    nouns: ["Cargo Joggers", "Anorak Shell", "Harness Vest", "Windbreaker", "Modular Hoodie", "Thermal Base Layer", "Tectonic Parka", "Utility Overcoat", "Compression Tee", "Strap Pullover", "Modular Cargo Shorts", "Grid Grid Crewneck"],
    features: ["Quick-snap magnetic pockets", "Heavyweight 450 GSM cotton fleece", "Tear-resistant ripstop overlays", "Waterproof YKK zipper linings", "High-visibility scotchlite arrays"]
  },
  Shoes: {
    nouns: ["Nitrogen Runners", "Barefoot Trainers", "All-Terrain Boots", "Court Low Sneakers", "Platform Hype Sneaks", "Aerated Track Grips", "Water-Repellent Trail Boots", "High-Top Streetwear Boots"],
    features: ["Nitrogen-infused dynamic impact PEBA foam", "3D woven jacquard matrix mesh shell", "Reinforced carbon-compound high-traction undersole", "Adjustable tension speed-lace harness", "Responsive springback energy translation"]
  },
  Slippers: {
    nouns: ["Cozy Foam Slides", "Recovery Grip Slippers", "Ergonomic Indoor Slippers", "Translucent Pool Slides", "Warm Fleece Slippers", "Comfy Pillow Slides", "Dual-Strap Slippers"],
    features: ["Orthopedic contour comfort footbeds", "Soft non-slip memory foam cushioning", "Waterproof lightweight ethylene acetate soles", "Anti-friction breathable strap liners"]
  },
  Jewelry: {
    nouns: ["Cybernetic Signet Ring", "Luminescent Halo Band", "Onyx Statement Chain", "Multi-Link Steel Bracelet", "Celestial Droplets Pendant", "Solas Choker Necklace", "Nova Drop Brass Earrings", "Industrial Cuff Bracelet"],
    features: ["Premium tarnish-resistant sterling silver or brass", "Brilliant cut hypoallergenic cubic zirconia", "Magnetic dynamic quick-attach safety clasps", "Beautiful polished high-gloss protective lacquer coating"]
  }
};

/**
 * Dynamically build products to have exactly 30 products in each of the 4 sections,
 * resulting in 120 products total.
 * Ensures the products have realistic pricing, sizing, visual tags, and unique IDs.
 */
function buildExtensiveCatalog(): Product[] {
  const completeList: Product[] = [...baseProducts];
  const categories: ProductCategory[] = [
    'Clothes',
    'Shoes',
    'Slippers',
    'Jewelry'
  ];

  categories.forEach((cat) => {
    // Count how many we already have from handmade base set
    const currentCount = baseProducts.filter(p => p.category === cat).length;
    const itemsToGenerate = 30 - currentCount;

    const dataSet = CATEGORY_WORDS[cat];
    const imagesArray = CATEGORY_IMAGES[cat];

    for (let i = 1; i <= itemsToGenerate; i++) {
      const generatedId = `gen-${cat.toLowerCase().replace(/\s+/g, '-')}-${i}`;
      
      // Select words using deterministic math
      const adj1 = ADJECTIVES[(i * 3 + cat.length) % ADJECTIVES.length];
      const adj2 = ADJECTIVES[(i * 7 + 11) % ADJECTIVES.length];
      const noun = dataSet.nouns[(i * 5) % dataSet.nouns.length];
      
      // Determine unique model suffix to make every product title 100% unique
      let modelSuffix = "";
      if (i % 4 === 0) {
        modelSuffix = `X-${30 + i}`;
      } else if (i % 4 === 1) {
        modelSuffix = `Mk-${i}`;
      } else if (i % 4 === 2) {
        modelSuffix = `GT-${10 + i}`;
      } else {
        modelSuffix = `Pro-${i}`;
      }

      const title = `${adj1} ${adj2} ${noun} ${modelSuffix}`;

      // Realistic price calculation
      const baseUSDPrice = Math.round((45 + (i * 2.37) % 255) * 100) / 100;
      // 30% chance of being on discount sale
      const hasDiscount = (i % 3 === 0);
      const discountUSDPrice = hasDiscount ? Math.round((baseUSDPrice * 0.8) * 100) / 100 : undefined;

      // Select unique image from the expanded category pool
      const imageId = imagesArray[(i - 1) % imagesArray.length];
      
      // Vary focal crop parameters deterministically so each product's picture looks completely different and unique
      const fpX = (((i * 13) % 100) / 200 + 0.35).toFixed(2); // varies between 0.35 and 0.85
      const fpY = (((i * 17) % 100) / 200 + 0.35).toFixed(2); // varies between 0.35 and 0.85
      const zoom = (1.0 + ((i % 5) * 0.15)).toFixed(2);       // zooms from x1.0 to x1.60
      const imageUrl = `https://images.unsplash.com/photo-${imageId}?q=80&w=800&auto=format&fit=crop&crop=focalpoint&fp-x=${fpX}&fp-y=${fpY}&fp-z=${zoom}`;
      
      // Description generator
      const feat1 = dataSet.features[(i * 3) % dataSet.features.length];
      const feat2 = dataSet.features[(i * 4 + 2) % dataSet.features.length];
      const description = `Ultra-premium and styled ${cat.toLowerCase()} hardware featuring ${feat1.toLowerCase()}.`;
      const longDescription = `${title} is engineered for modern style enthusiasts. Highlights a streamlined form constructed from durable elite materials, integrated with ${feat1.toLowerCase()} and optimized with ${feat2.toLowerCase()}. Designed to deliver remarkable ergonomics, high luxury visual textures, and premium daily utilization parameters.`;

      // Rating between 4.1 and 4.9
      const rating = Math.round((4.1 + (i * 0.13) % 0.8) * 10) / 10;
      const reviewsCount = 15 + (i * 7) % 480;

      // Color/Size arrays based on category
      const colorOptions = ["Stealth Black", "Cyber White", "Electro Blue", "Concrete Grey", "Volt Yellow"].slice(0, 2 + (i % 4));
      
      let sizeOptions: string[] | undefined = undefined;
      if (cat === 'Clothes') {
        sizeOptions = ["S", "M", "L", "XL", "XXL"].slice(0, 3 + (i % 3));
      } else if (cat === 'Shoes') {
        sizeOptions = ["7", "8", "9", "10", "11", "12"].slice(0, 3 + (i % 4));
      } else if (cat === 'Slippers') {
        sizeOptions = ["S", "M", "L", "XL"].slice(0, 2 + (i % 3));
      }

      // Specs mapping
      const specs: Record<string, string> = {
        "Product Code": `TZ-${cat.slice(0,3).toUpperCase()}-${1000 + i}`,
        "Material Grid": "Eco-friendly premium composite",
        "Primary Highlight": feat1,
        "Structural Build": "Waterproof modular layer"
      };

      completeList.push({
        id: generatedId,
        title,
        description,
        longDescription,
        price: baseUSDPrice,
        discountPrice: discountUSDPrice,
        rating,
        reviewsCount,
        category: cat,
        image: imageUrl,
        images: [imageUrl],
        specs,
        stock: 5 + (i * 13) % 85,
        isTrending: (i % 7 === 1),
        isFlashSale: (i % 7 === 3),
        isBestSeller: (i % 7 === 5),
        colors: colorOptions,
        sizes: sizeOptions
      });
    }
  });

  return completeList;
}

// Generate the fully expanded catalog list
export const products: Product[] = buildExtensiveCatalog();

// Expanded offers/promo criteria
export const coupons: Coupon[] = [
  {
    code: "GENZ20",
    discountPercent: 20,
    description: "Take 20% off your entire first order checkout! No minimum spend.",
    minimumSpend: 0
  },
  {
    code: "TRENDZZ10",
    discountPercent: 10,
    description: "Sleek discount! Slices 10% off items store-wide.",
    minimumSpend: 50
  },
  {
    code: "FUTURE50",
    discountPercent: 15,
    description: "Special holiday rebate! Take 15% off cart totals above ₹16,600.",
    minimumSpend: 200
  },
  {
    code: "BASH25",
    discountPercent: 25,
    description: "Monsoon Street Bash! Slices flat 25% off high-end tech apparel.",
    minimumSpend: 150
  },
  {
    code: "SUPREME30",
    discountPercent: 30,
    description: "Elite lifestyle upgrade! 30% off your checkout cart over ₹24,900.",
    minimumSpend: 300
  },
  {
    code: "FLASH12",
    discountPercent: 12,
    description: "Midnight flash special! 12% off store-wide items immediately.",
    minimumSpend: 30
  },
  {
    code: "FIRST750",
    discountPercent: 18,
    description: "Personal styling reward! Receive flat 18% rebate off total bills.",
    minimumSpend: 100
  }
];

export const reviews: Review[] = [
  {
    id: "rev-1",
    author: "Kai Vance",
    avatar: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?q=80&w=150&auto=format&fit=crop",
    rating: 5,
    date: "2026-05-18",
    comment: "The transparent earbuds look insane! They paired instantly with my phone, and the Active Noise Cancellation blocks all city bus traffic when heading to campus. Best audio product I have ever owned, period.",
    verified: true
  },
  {
    id: "rev-2",
    author: "Sienna Rossi",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=150&auto=format&fit=crop",
    rating: 5,
    date: "2026-05-29",
    comment: "Apocalypse proof techwear! This anorak has been through multiple downpours and has kept me entirely dry. The pocket placement is extremely smart and fits all my accessories nicely. Generates a ton of compliments too.",
    verified: true
  },
  {
    id: "rev-3",
    author: "Jordan Reed",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=150&auto=format&fit=crop",
    rating: 4,
    date: "2026-06-02",
    comment: "The Chronos Ultra watch is heavy but extremely premium. Display is visible even in direct scorching desert sun. Battery lasts me easily 5-6 days with intensive GPS tracking on hikes.",
    verified: true
  },
  {
    id: "rev-4",
    author: "Mia Tanaka",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=150&auto=format&fit=crop",
    rating: 5,
    date: "2026-06-09",
    comment: "Absolute holy grail sneakers! The cushy feel is unlike standard EVA soles. Energy return is wild, like bouncing off small trampolines on every stride. Plus they shine beautifully in blacklights.",
    verified: true
  }
];

export const FAQData = [
  {
    question: "Is shopping on Trendzz safe and encrypted?",
    answer: "Absolutely! All payment routes and user sessions on Trendzz are fully audited and protected under robust End-to-End SSL encryption protocols. We NEVER store credit card keys; they are safely proxied with zero exposure."
  },
  {
    question: "What is your standard return and exchange policy?",
    answer: "We offer a 30-day, completely free, 'no questions asked' return and swap policy for all unworn apparel, sealed electronic goods, and accessories. Just initiate a request from your Dashboard to print a free shipping label."
  },
  {
    question: "How long does shipping standard order packages take?",
    answer: "We dispatch orders within 12 hours from our centers. Express delivery takes 1-2 business days, while standard free shipping takes 3-5 days. Tracking is live in your dashboard as soon as the package leaves our warehouse."
  },
  {
    question: "Do you ship worldwide?",
    answer: "We currently provide lightning-fast premium shipping across North America, Europe, Australia, and select parts of East and South Asia. Enter your local postal code at checkout to evaluate immediate customs and tax routes."
  },
  {
    question: "Does the AI Shopping Assistant recommend actual inventory?",
    answer: "Yes! Our integrated Gemini AI Stylist examines Trendzz's actual real-time stock codes, prices, and size parameters to find appropriate fashion, footwear, or gadetry combinations fitted perfectly for your budget or styles."
  }
];
