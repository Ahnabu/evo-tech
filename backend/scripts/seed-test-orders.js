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

// Define schemas (simplified versions)
const userSchema = new mongoose.Schema({
  uuid: String,
  firstName: String,
  lastName: String,
  email: String,
  userType: String,
});

const productSchema = new mongoose.Schema({
  name: String,
  price: Number,
  stock: Number,
});

const orderSchema = new mongoose.Schema({
  orderNumber: String,
  user: String,
  firstname: String,
  lastname: String,
  email: String,
  phone: String,
  address: String,
  city: String,
  country: String,
  postalCode: String,
  subtotal: Number,
  deliveryCharge: Number,
  discount: Number,
  totalPayable: Number,
  orderStatus: {
    type: String,
    enum: ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'],
    default: 'pending'
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'paid', 'failed', 'refunded'],
    default: 'pending'
  },
  paymentMethod: String,
  createdAt: { type: Date, default: Date.now },
  deliveredAt: Date,
});

const orderItemSchema = new mongoose.Schema({
  order: { type: mongoose.Schema.Types.ObjectId, ref: 'Order' },
  product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
  productName: String,
  productPrice: Number,
  quantity: Number,
  subtotal: Number,
});

const User = mongoose.model('User', userSchema);
const Product = mongoose.model('Product', productSchema);
const Order = mongoose.model('Order', orderSchema);
const OrderItem = mongoose.model('OrderItem', orderItemSchema);

// Helper function to generate order number
const generateOrderNumber = () => {
  const timestamp = Date.now().toString();
  const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
  return `ORD-${timestamp}-${random}`;
};

// Sample data
const createTestOrders = async () => {
  try {
    console.log('🔄 Creating test orders...');

    // Get or create test users
    let testUsers = await User.find({ userType: 'user' }).limit(3);
    
    if (testUsers.length === 0) {
      console.log('📝 Creating test users...');
      testUsers = await User.create([
        {
          uuid: uuidv4(),
          firstName: 'John',
          lastName: 'Doe',
          email: 'john.doe@example.com',
          userType: 'user'
        },
        {
          uuid: uuidv4(),
          firstName: 'Jane',
          lastName: 'Smith',
          email: 'jane.smith@example.com',
          userType: 'user'
        },
        {
          uuid: uuidv4(),
          firstName: 'Mike',
          lastName: 'Johnson',
          email: 'mike.johnson@example.com',
          userType: 'user'
        }
      ]);
      console.log(`✅ Created ${testUsers.length} test users`);
    }

    // Get or create test products
    let testProducts = await Product.find({ published: true }).limit(5);
    
    if (testProducts.length === 0) {
      console.log('📝 Creating test products...');
      testProducts = await Product.create([
        { name: '3D Printer Pro Max', price: 599.99, stock: 20, published: true, isActive: true },
        { name: 'Arduino Starter Kit', price: 89.99, stock: 50, published: true, isActive: true },
        { name: 'Raspberry Pi 5', price: 129.99, stock: 30, published: true, isActive: true },
        { name: 'Filament Bundle Pack', price: 199.99, stock: 40, published: true, isActive: true },
        { name: 'Smart Sensor Kit', price: 149.99, stock: 25, published: true, isActive: true }
      ]);
      console.log(`✅ Created ${testProducts.length} test products`);
    }

    // Create test orders with different statuses and dates
    const orderStatuses = ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'];
    const paymentStatuses = ['pending', 'paid', 'failed'];
    const orders = [];

    const now = new Date();
    
    // Create 20 orders with various dates (last 30 days)
    for (let i = 0; i < 20; i++) {
      const user = testUsers[i % testUsers.length];
      const numItems = Math.floor(Math.random() * 3) + 1;
      const orderItems = [];
      let subtotal = 0;

      // Random items for this order
      for (let j = 0; j < numItems; j++) {
        const product = testProducts[Math.floor(Math.random() * testProducts.length)];
        const quantity = Math.floor(Math.random() * 3) + 1;
        const itemSubtotal = product.price * quantity;
        subtotal += itemSubtotal;

        orderItems.push({
          product: product._id,
          productName: product.name,
          productPrice: product.price,
          quantity,
          subtotal: itemSubtotal
        });
      }

      const deliveryCharge = 50;
      const discount = i % 5 === 0 ? 20 : 0;
      const totalPayable = subtotal + deliveryCharge - discount;

      // Spread orders over last 30 days
      const daysAgo = Math.floor(Math.random() * 30);
      const createdAt = new Date(now.getTime() - daysAgo * 24 * 60 * 60 * 1000);

      const orderStatus = orderStatuses[Math.floor(Math.random() * orderStatuses.length)];
      const paymentStatus = orderStatus === 'cancelled' ? 'failed' : paymentStatuses[Math.floor(Math.random() * paymentStatuses.length)];

      const order = {
        orderNumber: generateOrderNumber(),
        user: user.uuid,
        firstname: user.firstName,
        lastname: user.lastName,
        email: user.email,
        phone: `+880${Math.floor(Math.random() * 10000000000)}`,
        address: `${Math.floor(Math.random() * 999) + 1} Test Street`,
        city: ['Dhaka', 'Chittagong', 'Sylhet'][Math.floor(Math.random() * 3)],
        country: 'Bangladesh',
        postalCode: `${Math.floor(Math.random() * 9000) + 1000}`,
        subtotal,
        deliveryCharge,
        discount,
        totalPayable,
        orderStatus,
        paymentStatus,
        paymentMethod: ['Cash on Delivery', 'Bkash', 'Nagad'][Math.floor(Math.random() * 3)],
        createdAt,
        deliveredAt: orderStatus === 'delivered' ? new Date(createdAt.getTime() + 5 * 24 * 60 * 60 * 1000) : null,
      };

      orders.push({ order, items: orderItems });
    }

    // Insert orders
    for (const { order, items } of orders) {
      const createdOrder = await Order.create(order);
      
      // Add order reference to items
      const orderItemsWithRef = items.map(item => ({
        ...item,
        order: createdOrder._id
      }));
      
      await OrderItem.insertMany(orderItemsWithRef);
      console.log(`✅ Created order: ${createdOrder.orderNumber} (${createdOrder.orderStatus})`);
    }

    console.log(`\n🎉 Successfully created ${orders.length} test orders!`);
    console.log('\n📊 Order Status Distribution:');
    for (const status of orderStatuses) {
      const count = orders.filter(o => o.order.orderStatus === status).length;
      console.log(`   ${status}: ${count}`);
    }

  } catch (error) {
    console.error('❌ Error creating test orders:', error);
    throw error;
  }
};

// Main execution
const main = async () => {
  await connectDB();
  await createTestOrders();
  await mongoose.connection.close();
  console.log('\n✅ Database connection closed');
  process.exit(0);
};

main();
