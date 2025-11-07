// ----------------------------------------------------------------------

export const PRODUCT_GENDER_OPTIONS = [
  { label: 'Men', value: 'Men' },
  { label: 'Women', value: 'Women' },
  { label: 'Kids', value: 'Kids' },
];

export const PRODUCT_CATEGORY_OPTIONS = ['Shose', 'Apparel', 'Accessories'];

export const PRODUCT_RATING_OPTIONS = ['up4Star', 'up3Star', 'up2Star', 'up1Star'];

export const PRODUCT_COLOR_OPTIONS = [
  '#00AB55',
  '#000000',
  '#FFFFFF',
  '#FFC0CB',
  '#FF4842',
  '#1890FF',
  '#94D82D',
  '#FFC107',
];

export const PRODUCT_COLOR_NAME_OPTIONS = [
  // Basic Colors
  { value: 'red', label: 'Red' },
  { value: 'blue', label: 'Blue' },
  { value: 'green', label: 'Green' },
  { value: 'yellow', label: 'Yellow' },
  { value: 'orange', label: 'Orange' },
  { value: 'purple', label: 'Purple' },
  { value: 'pink', label: 'Pink' },
  { value: 'brown', label: 'Brown' },
  { value: 'black', label: 'Black' },
  { value: 'white', label: 'White' },
  { value: 'gray', label: 'Gray' },
  { value: 'cyan', label: 'Cyan' },
  { value: 'magenta', label: 'Magenta' },
  { value: 'violet', label: 'Violet' },

  // Neutral & Earth Tones
  { value: 'beige', label: 'Beige' },
  { value: 'cream', label: 'Cream' },
  { value: 'ivory', label: 'Ivory' },
  { value: 'taupe', label: 'Taupe' },
  { value: 'khaki', label: 'Khaki' },
  { value: 'olive', label: 'Olive' },
  { value: 'navy', label: 'Navy Blue' },
  { value: 'charcoal', label: 'Charcoal Gray' },
  { value: 'camel', label: 'Camel' },
  { value: 'tan', label: 'Tan' },

  // Pastel Colors
  { value: 'pastelPink', label: 'Pastel Pink' },
  { value: 'pastelBlue', label: 'Pastel Blue' },
  { value: 'mintGreen', label: 'Mint Green' },
  { value: 'lavender', label: 'Lavender' },
  { value: 'babyYellow', label: 'Baby Yellow' },
  { value: 'peach', label: 'Peach' },
  { value: 'skyBlue', label: 'Sky Blue' },
  { value: 'coral', label: 'Coral' },

  // Metallic & Special Finishes
  { value: 'gold', label: 'Gold' },
  { value: 'silver', label: 'Silver' },
  { value: 'bronze', label: 'Bronze' },
  { value: 'copper', label: 'Copper' },
  { value: 'roseGold', label: 'Rose Gold' },
  { value: 'metallicGray', label: 'Metallic Gray' },
  { value: 'champagne', label: 'Champagne' },

  // Dark & Deep Tones
  { value: 'burgundy', label: 'Burgundy' },
  { value: 'maroon', label: 'Maroon' },
  { value: 'forestGreen', label: 'Forest Green' },
  { value: 'midnightBlue', label: 'Midnight Blue' },
  { value: 'darkBrown', label: 'Dark Brown' },

  // Patterned / Mixed
  { value: 'multicolor', label: 'Multicolor' },
  { value: 'transparent', label: 'Transparent' },
  { value: 'gradient', label: 'Gradient' },
  { value: 'camouflage', label: 'Camouflage' },
  { value: 'floral', label: 'Floral' },
  { value: 'striped', label: 'Striped' },
  { value: 'checkered', label: 'Checkered' },
];


export const PRODUCT_SIZE_OPTIONS = [
  // Clothing sizes
  { value: 'S', label: 'S' },
  { value: 'M', label: 'M' },
  { value: 'L', label: 'L' },
  { value: 'XL', label: 'XL' },
  { value: '2XL', label: '2XL' }, 
  { value: '3XL', label: '3XL' },
  { value: '4XL', label: '4XL' },
  // Numeric sizes from 30 to 45
  { value: '30', label: '30' },
  { value: '31', label: '31' },
  { value: '32', label: '32' },
  { value: '33', label: '33' },
  { value: '34', label: '34' },
  { value: '35', label: '35' },
  { value: '36', label: '36' },
  { value: '37', label: '37' },
  { value: '38', label: '38' },
  { value: '39', label: '39' },
  { value: '40', label: '40' },
  { value: '41', label: '41' },
  { value: '42', label: '42' },
  { value: '43', label: '43' },
  { value: '44', label: '44' },
  { value: '45', label: '45' },
];

export const PRODUCT_STOCK_OPTIONS = [
  { value: 'in stock', label: 'In stock' },
  { value: 'low stock', label: 'Low stock' },
  { value: 'out of stock', label: 'Out of stock' },
];

export const PRODUCT_PUBLISH_OPTIONS = [
  {
    value: 'published',
    label: 'Published',
  },
  {
    value: 'draft',
    label: 'Draft',
  },
];

export const PRODUCT_SORT_OPTIONS = [
  { value: 'featured', label: 'Featured' },
  { value: 'newest', label: 'Newest' },
  { value: 'priceDesc', label: 'Price: High - Low' },
  { value: 'priceAsc', label: 'Price: Low - High' },
];

export const PRODUCT_CATEGORY_GROUP_OPTIONS = [
  {
    group: 'Clothing & Fashion',
    classify: [
      'T-shirts',
      'Shirts',
      'Jeans',
      'Pants',
      'Jackets',
      'Coats',
      'Dresses',
      'Skirts',
      'Hijabs & Abayas',
      'Traditional Wear (Gandoura, Karakou, etc.)',
      'Shoes',
      'Sandals',
      'Bags',
      'Accessories',
      'Belts',
      'Scarves',
      'Hats & Caps',
      'Sunglasses',
      'Watches',
    ],
  },
  {
    group: 'Beauty & Personal Care',
    classify: [
      'Perfumes',
      'Makeup',
      'Skincare',
      'Hair Care',
      'Beard Care',
      'Bath & Body',
      'Nail Products',
      'Men Grooming',
      'Health Supplements',
      'Personal Hygiene',
    ],
  },
  {
    group: 'Electronics & Technology',
    classify: [
      'Smartphones',
      'Tablets',
      'Laptops',
      'Desktop PCs',
      'Televisions',
      'Cameras',
      'Smartwatches',
      'Headphones & Earphones',
      'Gaming Consoles',
      'Home Appliances',
      'Refrigerators',
      'Washing Machines',
      'Air Conditioners',
      'Kitchen Appliances',
    ],
  },
  {
    group: 'Home & Furniture',
    classify: [
      'Living Room Furniture',
      'Bedroom Furniture',
      'Office Furniture',
      'Home Décor',
      'Lighting',
      'Curtains & Carpets',
      'Kitchenware',
      'Cookware',
      'Storage & Organization',
      'Bathroom Accessories',
    ],
  },
  {
    group: 'Food & Beverages',
    classify: [
      'Coffee & Tea',
      'Dates & Nuts',
      'Honey',
      'Spices & Condiments',
      'Canned Goods',
      'Snacks & Biscuits',
      'Juices & Drinks',
      'Organic Products',
      'Local Specialties',
      'Halal Meat',
    ],
  },
  {
    group: 'Health & Pharmacy',
    classify: [
      'Vitamins & Supplements',
      'Medical Equipment',
      'Face Masks',
      'Sanitizers',
      'First Aid',
      'Herbal Medicine',
      'Fitness Products',
    ],
  },
  {
    group: 'Sports & Outdoors',
    classify: [
      'Sportswear',
      'Gym Equipment',
      'Bicycles',
      'Camping Gear',
      'Footwear',
      'Outdoor Accessories',
    ],
  },
  {
    group: 'Automotive',
    classify: [
      'Car Accessories',
      'Motorbike Accessories',
      'Oils & Fluids',
      'Car Electronics',
      'Tires & Wheels',
      'Cleaning Products',
    ],
  },
  {
    group: 'Baby & Kids',
    classify: [
      'Baby Clothing',
      'Toys',
      'Strollers',
      'Baby Food',
      'Diapers',
      'Child Furniture',
      'Educational Products',
    ],
  },
  {
    group: 'Office & Stationery',
    classify: [
      'Notebooks',
      'Pens & Pencils',
      'Printers',
      'Ink & Toner',
      'Office Furniture',
      'School Supplies',
    ],
  },
  {
    group: 'Construction & Tools',
    classify: [
      'Building Materials',
      'Hand Tools',
      'Power Tools',
      'Electrical Equipment',
      'Plumbing Supplies',
      'Paint & Finishing',
      'Safety Equipment',
    ],
  },
  {
    group: 'Agriculture & Garden',
    classify: [
      'Seeds & Plants',
      'Fertilizers',
      'Irrigation Equipment',
      'Garden Tools',
      'Agricultural Machinery',
      'Animal Feed',
    ],
  },
  {
    group: 'Art & Handcrafts',
    classify: [
      'Traditional Crafts',
      'Paintings',
      'Ceramics',
      'Jewelry Making',
      'Handmade Decor',
      'Cultural Artifacts',
    ],
  },
];


export const PRODUCT_CHECKOUT_STEPS = ['Cart', 'Billing & address', 'Payment'];
