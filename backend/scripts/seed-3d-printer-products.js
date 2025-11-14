require('dotenv').config();
const mongoose = require('mongoose');

// MongoDB connection
const connectDB = async () => {
  try {
    const dbUrl = process.env.DB_URL || process.env.DATABASE_URL || 'mongodb://localhost:27017/evotech';
    await mongoose.connect(dbUrl);
    console.log('✅ MongoDB Connected');
  } catch (error) {
    console.error('❌ MongoDB connection error:', error);
    process.exit(1);
  }
};

// Import models
const Product = mongoose.model('Product', new mongoose.Schema({}, { strict: false }));
const Category = mongoose.model('Category', new mongoose.Schema({}, { strict: false }));
const Subcategory = mongoose.model('Subcategory', new mongoose.Schema({}, { strict: false }));
const Brand = mongoose.model('Brand', new mongoose.Schema({}, { strict: false }));

// 3D Printer products
const printerProducts = [
  {
    name: 'Bambu Lab X1C 3D Printer (Global Version)',
    slug: 'bambu-lab-x1c-3d-printer',
    price: 187500,
    previousPrice: 225000,
    inStock: true,
    features: ['High Speed Printing', 'Multi-Color Support', 'Auto Bed Leveling', 'AI Camera'],
    colors: [],
    description: 'Professional high-speed 3D printer with multi-material system and advanced features for precise printing.',
    shortDescription: 'Professional high-speed 3D printer',
    sku: 'BAMBU-X1C-GLB',
    stock: 5,
    lowStockThreshold: 2,
    mainImage: 'https://images.unsplash.com/photo-1633357520174-26b0cd4d4c6e?w=800',
    weight: 15000,
    published: true,
    isFeatured: true,
  },
  {
    name: 'Bambu Lab A1 3D Printer (Global Version)',
    slug: 'bambu-lab-a1-3d-printer',
    price: 55500,
    previousPrice: 68500,
    inStock: true,
    features: ['Compact Design', 'Fast Printing', 'Easy Setup', 'WiFi Enabled'],
    colors: [],
    description: 'Affordable and reliable 3D printer perfect for beginners and enthusiasts.',
    shortDescription: 'Compact and affordable 3D printer',
    sku: 'BAMBU-A1-GLB',
    stock: 8,
    lowStockThreshold: 3,
    mainImage: 'https://images.unsplash.com/photo-1612815154858-60aa4c59eaa6?w=800',
    weight: 8000,
    published: true,
    isFeatured: true,
  },
];

// Materials products
const materialProducts = [
  {
    name: 'Sunlu PLA 3D Filament 1KG 1.75mm',
    slug: 'sunlu-pla-filament-1kg-175mm',
    price: 1500,
    previousPrice: 1700,
    inStock: true,
    features: ['PLA Material', '1.75mm Diameter', '1KG Spool', 'High Quality'],
    colors: ['White', 'Black', 'Red', 'Blue', 'Green', 'Yellow'],
    description: 'Premium PLA filament for 3D printing with excellent layer adhesion and minimal warping.',
    shortDescription: 'Premium PLA 3D printing filament',
    sku: 'SUNLU-PLA-1KG',
    stock: 45,
    lowStockThreshold: 10,
    mainImage: 'https://images.unsplash.com/photo-1606836576983-6373c6da9c88?w=800',
    weight: 1000,
    published: true,
  },
  {
    name: 'Sunlu PLA+ 3D Filament 1KG 1.75mm',
    slug: 'sunlu-pla-plus-filament-1kg-175mm',
    price: 1580,
    previousPrice: 1850,
    inStock: true,
    features: ['PLA+ Material', '1.75mm Diameter', '1KG Spool', 'Enhanced Strength'],
    colors: ['Black', 'White', 'Gray', 'Red', 'Blue'],
    description: 'Enhanced PLA+ filament with improved strength and durability for demanding applications.',
    shortDescription: 'Enhanced PLA+ 3D printing filament',
    sku: 'SUNLU-PLA+-1KG',
    stock: 38,
    lowStockThreshold: 10,
    mainImage: 'https://images.unsplash.com/photo-1608889825103-eb5b8a58dc67?w=800',
    weight: 1000,
    published: true,
  },
  {
    name: 'Sunlu PETG 3D Filament 1KG 1.75mm',
    slug: 'sunlu-petg-filament-1kg-175mm',
    price: 1500,
    previousPrice: 1700,
    inStock: true,
    features: ['PETG Material', '1.75mm Diameter', '1KG Spool', 'High Durability'],
    colors: ['Clear', 'Black', 'White', 'Blue'],
    description: 'Durable PETG filament combining the ease of PLA with the strength of ABS.',
    shortDescription: 'Durable PETG 3D printing filament',
    sku: 'SUNLU-PETG-1KG',
    stock: 30,
    lowStockThreshold: 8,
    mainImage: 'https://images.unsplash.com/photo-1608889825271-bb5a0ef2cd8a?w=800',
    weight: 1000,
    published: true,
  },
];

async function seedData() {
  try {
    await connectDB();

    console.log('\n🔍 Setting up 3D Printer and Materials categories...\n');

    // Create or find 3D Printers category
    let printersCategory = await Category.findOne({ slug: '3d-printer' });
    if (!printersCategory) {
      printersCategory = await Category.create({
        name: '3D Printers',
        slug: '3d-printer',
        description: 'Professional and consumer 3D printing solutions',
        isActive: true,
        sortOrder: 1,
        image: 'https://images.unsplash.com/photo-1633356122102-3fe601e05bd2?w=400',
      });
      console.log('✅ Created 3D Printers category');
    } else {
      console.log('ℹ️  3D Printers category already exists');
    }

    // Create or find Materials category
    let materialsCategory = await Category.findOne({ slug: 'materials' });
    if (!materialsCategory) {
      materialsCategory = await Category.create({
        name: 'Materials',
        slug: 'materials',
        description: '3D printing filaments and materials',
        isActive: true,
        sortOrder: 2,
        image: 'https://images.unsplash.com/photo-1606836576983-6373c6da9c88?w=400',
      });
      console.log('✅ Created Materials category');
    } else {
      console.log('ℹ️  Materials category already exists');
    }

    // Create or find Bambu Lab brand
    let bambuBrand = await Brand.findOne({ slug: 'bambu-lab' });
    if (!bambuBrand) {
      bambuBrand = await Brand.create({
        name: 'Bambu Lab',
        slug: 'bambu-lab',
        description: 'Leading 3D printer manufacturer',
        isActive: true,
        image: 'https://via.placeholder.com/200x80/1e3a8a/ffffff?text=Bambu+Lab',
      });
      console.log('✅ Created Bambu Lab brand');
    }

    // Create or find Sunlu brand
    let sunluBrand = await Brand.findOne({ slug: 'sunlu' });
    if (!sunluBrand) {
      sunluBrand = await Brand.create({
        name: 'Sunlu',
        slug: 'sunlu',
        description: '3D printing filament manufacturer',
        isActive: true,
        image: 'https://via.placeholder.com/200x80/059669/ffffff?text=Sunlu',
      });
      console.log('✅ Created Sunlu brand');
    }

    console.log('\n📦 Creating 3D Printer products...\n');

    // Create printer products
    for (const productData of printerProducts) {
      try {
        let existingProduct = await Product.findOne({ slug: productData.slug });
        if (existingProduct) {
          console.log(`🗑️  Deleting existing product: ${existingProduct.name}`);
          await Product.deleteOne({ _id: existingProduct._id });
        }
        const newProduct = await Product.create({
          ...productData,
          category: printersCategory._id,
          brand: bambuBrand._id,
        });
        console.log(`✅ Created product: ${newProduct.name} - ৳${newProduct.price}`);
      } catch (error) {
        console.error(`❌ Error creating product ${productData.name}:`, error.message);
      }
    }

    console.log('\n🎨 Creating Material products...\n');

    // Create material products
    for (const productData of materialProducts) {
      try {
        let existingProduct = await Product.findOne({ slug: productData.slug });
        if (existingProduct) {
          console.log(`🗑️  Deleting existing product: ${existingProduct.name}`);
          await Product.deleteOne({ _id: existingProduct._id });
        }
        const newProduct = await Product.create({
          ...productData,
          category: materialsCategory._id,
          brand: sunluBrand._id,
        });
        console.log(`✅ Created product: ${newProduct.name} - ৳${newProduct.price}`);
      } catch (error) {
        console.error(`❌ Error creating product ${productData.name}:`, error.message);
      }
    }

    console.log('\n✅ Seeding completed successfully!\n');
    console.log('📊 Summary:');
    console.log(`   - 3D Printers: ${printerProducts.length}`);
    console.log(`   - Materials: ${materialProducts.length}`);
    console.log(`   - Total Products: ${printerProducts.length + materialProducts.length}`);

    // Verify products were created
    console.log('\n🔍 Verifying products in database...\n');
    const createdPrinters = await Product.find({ category: printersCategory._id }).select('name');
    const createdMaterials = await Product.find({ category: materialsCategory._id }).select('name');
    
    console.log(`3D Printers in DB: ${createdPrinters.length}`);
    createdPrinters.forEach(p => console.log(`  - ${p.name}`));
    
    console.log(`\nMaterials in DB: ${createdMaterials.length}`);
    createdMaterials.forEach(p => console.log(`  - ${p.name}`));

  } catch (error) {
    console.error('❌ Error seeding data:', error);
  } finally {
    await mongoose.connection.close();
    console.log('\n✅ Database connection closed');
  }
}

// Run the seed script
seedData();
