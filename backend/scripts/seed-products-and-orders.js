require('dotenv').config();
const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

// MongoDB connection
const connectDB = async () => {
  try {
    const dbUrl = process.env.MONGODB_URI || process.env.DATABASE_URL || 'mongodb://localhost:27017/evotech';
    await mongoose.connect(dbUrl);
    console.log('✅ MongoDB Connected');
  } catch (error) {
    console.error('❌ MongoDB connection error:', error);
    process.exit(1);
  }
};

// Import models (using existing models from the database)
const User = mongoose.model('User', new mongoose.Schema({}, { strict: false }));
const Product = mongoose.model('Product', new mongoose.Schema({}, { strict: false }));
const Category = mongoose.model('Category', new mongoose.Schema({}, { strict: false }));
const Subcategory = mongoose.model('Subcategory', new mongoose.Schema({}, { strict: false }));
const Brand = mongoose.model('Brand', new mongoose.Schema({}, { strict: false }));
const Order = mongoose.model('Order', new mongoose.Schema({}, { strict: false }));
const OrderItem = mongoose.model('OrderItem', new mongoose.Schema({}, { strict: false }));

// Sample product data
const sampleProducts = [
  {
    name: 'Dell XPS 15 Laptop',
    slug: 'dell-xps-15-laptop',
    price: 185000,
    previousPrice: 199000,
    inStock: true,
    features: ['Intel Core i7', '16GB RAM', '512GB SSD', '15.6" 4K Display'],
    colors: ['Silver', 'Black'],
    description: 'Powerful laptop for professionals with stunning display and performance.',
    shortDescription: 'Premium laptop with i7 processor and 4K display',
    sku: 'DELL-XPS15-001',
    stock: 15,
    mainImage: 'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=800',
    weight: 2000,
    published: true,
    isFeatured: true,
  },
  {
    name: 'Logitech MX Master 3S Wireless Mouse',
    slug: 'logitech-mx-master-3s-mouse',
    price: 12500,
    previousPrice: 14000,
    inStock: true,
    features: ['8K DPI', 'Quiet Clicks', 'USB-C Charging', 'Multi-device'],
    colors: ['Black', 'Graphite'],
    description: 'Advanced wireless mouse with precision tracking and ergonomic design.',
    shortDescription: 'Professional wireless mouse with 8K DPI',
    sku: 'LOGI-MX3S-001',
    stock: 45,
    mainImage: 'https://images.unsplash.com/photo-1527814050087-3793815479db?w=800',
    weight: 150,
    published: true,
    isFeatured: true,
  },
  {
    name: 'Keychron K8 Mechanical Keyboard',
    slug: 'keychron-k8-mechanical-keyboard',
    price: 9500,
    previousPrice: 11000,
    inStock: true,
    features: ['Hot-swappable', 'RGB Backlight', 'Wireless & Wired', 'TKL Design'],
    colors: ['Black', 'White'],
    description: 'Versatile mechanical keyboard with hot-swappable switches for ultimate customization.',
    shortDescription: 'Hot-swappable mechanical keyboard',
    sku: 'KEY-K8-001',
    stock: 30,
    mainImage: 'https://images.unsplash.com/photo-1595225476474-87563907a212?w=800',
    weight: 800,
    published: true,
  },
  {
    name: 'LG 27" 4K UHD Monitor',
    slug: 'lg-27-4k-uhd-monitor',
    price: 42000,
    previousPrice: 48000,
    inStock: true,
    features: ['4K UHD', 'IPS Panel', 'HDR10', 'USB-C', 'Height Adjustable'],
    colors: ['Black'],
    description: 'Professional-grade 4K monitor with excellent color accuracy and USB-C connectivity.',
    shortDescription: '27" 4K monitor with USB-C',
    sku: 'LG-27UK-001',
    stock: 20,
    mainImage: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=800',
    weight: 5500,
    published: true,
    isFeatured: true,
  },
  {
    name: 'Samsung 970 EVO Plus 1TB NVMe SSD',
    slug: 'samsung-970-evo-plus-1tb-ssd',
    price: 14500,
    previousPrice: 16500,
    inStock: true,
    features: ['Read: 3500 MB/s', 'Write: 3300 MB/s', 'V-NAND', '5 Year Warranty'],
    colors: [],
    description: 'High-performance NVMe SSD for faster boot times and data transfers.',
    shortDescription: '1TB NVMe SSD with 3500MB/s read speed',
    sku: 'SAMS-970EP-1TB',
    stock: 60,
    mainImage: 'https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?w=800',
    weight: 50,
    published: true,
  },
  {
    name: 'Corsair Vengeance RGB Pro 32GB DDR4 RAM',
    slug: 'corsair-vengeance-rgb-32gb-ram',
    price: 18000,
    previousPrice: 20000,
    inStock: true,
    features: ['32GB (2x16GB)', 'DDR4 3200MHz', 'RGB Lighting', 'XMP 2.0'],
    colors: ['Black'],
    description: 'High-performance DDR4 RAM with dynamic RGB lighting effects.',
    shortDescription: '32GB DDR4 RAM with RGB',
    sku: 'CORS-VRGB-32G',
    stock: 35,
    mainImage: 'https://images.unsplash.com/photo-1541345378-eeebf86e2c80?w=800',
    weight: 200,
    published: true,
  },
  {
    name: 'Razer DeathAdder V3 Gaming Mouse',
    slug: 'razer-deathadder-v3-gaming-mouse',
    price: 7500,
    previousPrice: 8500,
    inStock: true,
    features: ['30K DPI', 'Focus Pro Sensor', 'Ergonomic', 'Chroma RGB'],
    colors: ['Black', 'White'],
    description: 'Professional gaming mouse with industry-leading sensor technology.',
    shortDescription: 'Gaming mouse with 30K DPI sensor',
    sku: 'RAZ-DAV3-001',
    stock: 50,
    mainImage: 'https://images.unsplash.com/photo-1563297007-0686b7003af7?w=800',
    weight: 85,
    published: true,
  },
  {
    name: 'Sony WH-1000XM5 Headphones',
    slug: 'sony-wh-1000xm5-headphones',
    price: 32000,
    previousPrice: 36000,
    inStock: true,
    features: ['Active Noise Cancelling', '30hr Battery', 'LDAC Support', 'Multipoint'],
    colors: ['Black', 'Silver'],
    description: 'Industry-leading noise cancelling headphones with exceptional sound quality.',
    shortDescription: 'Premium ANC headphones',
    sku: 'SONY-WH1KXM5',
    stock: 25,
    mainImage: 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=800',
    weight: 250,
    published: true,
    isFeatured: true,
  },
  {
    name: 'Lenovo ThinkPad X1 Carbon Gen 11',
    slug: 'lenovo-thinkpad-x1-carbon-gen11',
    price: 165000,
    previousPrice: 180000,
    inStock: true,
    features: ['Intel Core i7-1355U', '16GB RAM', '512GB SSD', '14" WUXGA'],
    colors: ['Black'],
    description: 'Ultra-light business laptop with legendary ThinkPad durability.',
    shortDescription: 'Business laptop with 14" display',
    sku: 'LEN-X1C11-001',
    stock: 12,
    mainImage: 'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=800',
    weight: 1200,
    published: true,
  },
  {
    name: 'ASUS ROG Strix RTX 4070 Graphics Card',
    slug: 'asus-rog-strix-rtx-4070-gpu',
    price: 95000,
    previousPrice: 105000,
    inStock: true,
    features: ['12GB GDDR6X', 'DLSS 3', 'Ray Tracing', 'Axial-tech Fans'],
    colors: [],
    description: 'High-performance graphics card for gaming and content creation.',
    shortDescription: 'RTX 4070 graphics card',
    sku: 'ASUS-RTX4070',
    stock: 8,
    mainImage: 'https://images.unsplash.com/photo-1591488320449-011701bb6704?w=800',
    weight: 1500,
    published: true,
    isFeatured: true,
  },
];

async function seedData() {
  try {
    await connectDB();

    console.log('\n🔍 Checking for existing data...\n');

    // Find or create categories
    let electronicsCategory = await Category.findOne({ slug: 'electronics' });
    if (!electronicsCategory) {
      electronicsCategory = await Category.create({
        name: 'Electronics',
        slug: 'electronics',
        description: 'Electronic devices and accessories',
        isActive: true,
        sortOrder: 1,
      });
      console.log('✅ Created Electronics category');
    }

    let computersCategory = await Category.findOne({ slug: 'computers' });
    if (!computersCategory) {
      computersCategory = await Category.create({
        name: 'Computers',
        slug: 'computers',
        description: 'Computer hardware and peripherals',
        isActive: true,
        sortOrder: 2,
      });
      console.log('✅ Created Computers category');
    }

    // Find or create subcategories
    let laptopsSubcat = await Subcategory.findOne({ slug: 'laptops' });
    if (!laptopsSubcat) {
      laptopsSubcat = await Subcategory.create({
        name: 'Laptops',
        slug: 'laptops',
        category: computersCategory._id,
        isActive: true,
        sortOrder: 1,
      });
      console.log('✅ Created Laptops subcategory');
    }

    let peripheralsSubcat = await Subcategory.findOne({ slug: 'peripherals' });
    if (!peripheralsSubcat) {
      peripheralsSubcat = await Subcategory.create({
        name: 'Peripherals',
        slug: 'peripherals',
        category: computersCategory._id,
        isActive: true,
        sortOrder: 2,
      });
      console.log('✅ Created Peripherals subcategory');
    }

    let componentsSubcat = await Subcategory.findOne({ slug: 'components' });
    if (!componentsSubcat) {
      componentsSubcat = await Subcategory.create({
        name: 'Components',
        slug: 'components',
        category: computersCategory._id,
        isActive: true,
        sortOrder: 3,
      });
      console.log('✅ Created Components subcategory');
    }

    let audioSubcat = await Subcategory.findOne({ slug: 'audio' });
    if (!audioSubcat) {
      audioSubcat = await Subcategory.create({
        name: 'Audio',
        slug: 'audio',
        category: electronicsCategory._id,
        isActive: true,
        sortOrder: 1,
      });
      console.log('✅ Created Audio subcategory');
    }

    // Find or create brands
    const brandData = [
      { name: 'Dell', slug: 'dell' },
      { name: 'Logitech', slug: 'logitech' },
      { name: 'Keychron', slug: 'keychron' },
      { name: 'LG', slug: 'lg' },
      { name: 'Samsung', slug: 'samsung' },
      { name: 'Corsair', slug: 'corsair' },
      { name: 'Razer', slug: 'razer' },
      { name: 'Sony', slug: 'sony' },
      { name: 'Lenovo', slug: 'lenovo' },
      { name: 'ASUS', slug: 'asus' },
    ];

    const brands = {};
    for (const brandInfo of brandData) {
      let brand = await Brand.findOne({ slug: brandInfo.slug });
      if (!brand) {
        brand = await Brand.create({
          name: brandInfo.name,
          slug: brandInfo.slug,
          isActive: true,
        });
        console.log(`✅ Created ${brandInfo.name} brand`);
      }
      brands[brandInfo.slug] = brand;
    }

    console.log('\n📦 Creating products...\n');

    // Map products to categories, subcategories, and brands
    const productMappings = [
      { product: sampleProducts[0], category: computersCategory, subcategory: laptopsSubcat, brand: brands['dell'] },
      { product: sampleProducts[1], category: computersCategory, subcategory: peripheralsSubcat, brand: brands['logitech'] },
      { product: sampleProducts[2], category: computersCategory, subcategory: peripheralsSubcat, brand: brands['keychron'] },
      { product: sampleProducts[3], category: computersCategory, subcategory: peripheralsSubcat, brand: brands['lg'] },
      { product: sampleProducts[4], category: computersCategory, subcategory: componentsSubcat, brand: brands['samsung'] },
      { product: sampleProducts[5], category: computersCategory, subcategory: componentsSubcat, brand: brands['corsair'] },
      { product: sampleProducts[6], category: computersCategory, subcategory: peripheralsSubcat, brand: brands['razer'] },
      { product: sampleProducts[7], category: electronicsCategory, subcategory: audioSubcat, brand: brands['sony'] },
      { product: sampleProducts[8], category: computersCategory, subcategory: laptopsSubcat, brand: brands['lenovo'] },
      { product: sampleProducts[9], category: computersCategory, subcategory: componentsSubcat, brand: brands['asus'] },
    ];

    const createdProducts = [];
    for (const mapping of productMappings) {
      // Check if product already exists
      let existingProduct = await Product.findOne({ slug: mapping.product.slug });
      if (!existingProduct) {
        const newProduct = await Product.create({
          ...mapping.product,
          category: mapping.category._id,
          subcategory: mapping.subcategory._id,
          brand: mapping.brand._id,
        });
        createdProducts.push(newProduct);
        console.log(`✅ Created product: ${newProduct.name}`);
      } else {
        createdProducts.push(existingProduct);
        console.log(`ℹ️  Product already exists: ${existingProduct.name}`);
      }
    }

    console.log(`\n✅ Total products available: ${createdProducts.length}\n`);

    // Find test user
    const testUser = await User.findOne({ email: 'testuser1@example.com' });
    if (!testUser) {
      console.log('⚠️  Test user not found. Please create testuser1@example.com first.');
      return;
    }

    console.log(`✅ Found test user: ${testUser.firstName} ${testUser.lastName}\n`);

    // Create orders for test user
    console.log('📝 Creating orders...\n');

    const orderStatuses = ['processing', 'shipped', 'delivered', 'pending'];
    const paymentMethods = ['bKash', 'Nagad', 'Cash on Delivery', 'Card'];
    
    const ordersToCreate = 5;
    
    for (let i = 0; i < ordersToCreate; i++) {
      // Random products for this order (2-4 products)
      const numProducts = Math.floor(Math.random() * 3) + 2;
      const orderProducts = [];
      const usedIndexes = new Set();
      
      while (orderProducts.length < numProducts) {
        const randomIndex = Math.floor(Math.random() * createdProducts.length);
        if (!usedIndexes.has(randomIndex)) {
          usedIndexes.add(randomIndex);
          orderProducts.push(createdProducts[randomIndex]);
        }
      }

      // Calculate order totals
      let subtotal = 0;
      const orderItems = orderProducts.map(product => {
        const quantity = Math.floor(Math.random() * 2) + 1; // 1-2 items
        const itemSubtotal = product.price * quantity;
        subtotal += itemSubtotal;
        
        return {
          product: product._id,
          productName: product.name,
          productPrice: product.price,
          quantity: quantity,
          selectedColor: product.colors && product.colors.length > 0 
            ? product.colors[Math.floor(Math.random() * product.colors.length)] 
            : null,
          subtotal: itemSubtotal,
        };
      });

      const deliveryCharge = 100;
      const discount = i === 0 ? 1000 : 0; // First order has discount
      const totalPayable = subtotal + deliveryCharge - discount;

      // Random order status
      const orderStatus = orderStatuses[Math.floor(Math.random() * orderStatuses.length)];
      const paymentStatus = orderStatus === 'delivered' ? 'paid' : (Math.random() > 0.5 ? 'paid' : 'pending');

      // Create order date (within last 30 days)
      const daysAgo = Math.floor(Math.random() * 30);
      const createdAt = new Date();
      createdAt.setDate(createdAt.getDate() - daysAgo);

      const deliveredAt = orderStatus === 'delivered' 
        ? new Date(createdAt.getTime() + (Math.random() * 7 * 24 * 60 * 60 * 1000)) 
        : null;

      // Create order
      const order = await Order.create({
        orderNumber: `ORD-${Date.now()}-${uuidv4().substring(0, 8).toUpperCase()}`,
        user: testUser.uuid,
        firstname: testUser.firstName,
        lastname: testUser.lastName,
        email: testUser.email,
        phone: testUser.phone || '+8801799424854',
        houseStreet: 'House 123, Road 45',
        city: 'Dhaka',
        subdistrict: 'Mirpur',
        postcode: '1216',
        subtotal: subtotal,
        deliveryCharge: deliveryCharge,
        discount: discount,
        totalPayable: totalPayable,
        orderStatus: orderStatus,
        paymentStatus: paymentStatus,
        paymentMethod: paymentMethods[Math.floor(Math.random() * paymentMethods.length)],
        terms: 'Standard terms and conditions apply',
        createdAt: createdAt,
        deliveredAt: deliveredAt,
      });

      // Create order items
      for (const item of orderItems) {
        await OrderItem.create({
          ...item,
          order: order._id,
        });
      }

      console.log(`✅ Created order ${order.orderNumber} - Status: ${orderStatus}, Total: ৳${totalPayable}`);
    }

    console.log(`\n✅ Successfully created ${ordersToCreate} orders for test user!\n`);
    console.log('📊 Summary:');
    console.log(`   - Products: ${createdProducts.length}`);
    console.log(`   - Orders: ${ordersToCreate}`);
    console.log(`   - User: ${testUser.email}`);

  } catch (error) {
    console.error('❌ Error seeding data:', error);
  } finally {
    await mongoose.connection.close();
    console.log('\n✅ Database connection closed');
  }
}

// Run the seed script
seedData();
