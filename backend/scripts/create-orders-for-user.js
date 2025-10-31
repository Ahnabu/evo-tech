#!/usr/bin/env node

require('dotenv').config();
const mongoose = require('mongoose');

const targetEmail = process.argv[2] || process.env.TARGET_USER_EMAIL || 'testuser1@example.com';
const dbUrl = process.env.MONGODB_URI || process.env.DATABASE_URL || 'mongodb://localhost:27017/evotech';

const userSchema = new mongoose.Schema({
  uuid: String,
  firstName: String,
  lastName: String,
  email: String,
  phone: String,
  userType: String,
}, { collection: 'users' });

const productSchema = new mongoose.Schema({
  name: String,
  price: Number,
  stock: Number,
  published: Boolean,
  isActive: Boolean,
  colors: [String],
}, { collection: 'products' });

const orderSchema = new mongoose.Schema({
  orderNumber: String,
  user: String,
  firstname: String,
  lastname: String,
  phone: String,
  email: String,
  houseStreet: String,
  city: String,
  subdistrict: String,
  postcode: String,
  country: String,
  shippingType: String,
  pickupPointId: String,
  paymentMethod: String,
  transactionId: String,
  terms: Boolean,
  subtotal: Number,
  discount: Number,
  deliveryCharge: Number,
  additionalCharge: Number,
  totalPayable: Number,
  orderStatus: String,
  paymentStatus: String,
  notes: String,
  trackingCode: String,
  viewed: Boolean,
  unpaidNotified: Boolean,
  deliveredAt: Date,
}, { collection: 'orders', timestamps: true });

const orderItemSchema = new mongoose.Schema({
  order: { type: mongoose.Schema.Types.ObjectId, ref: 'Order' },
  product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
  productName: String,
  productPrice: Number,
  quantity: Number,
  selectedColor: String,
  subtotal: Number,
}, { collection: 'orderitems', timestamps: true });

const User = mongoose.model('User', userSchema);
const Product = mongoose.model('Product', productSchema);
const Order = mongoose.model('Order', orderSchema);
const OrderItem = mongoose.model('OrderItem', orderItemSchema);

const generateOrderNumber = () => {
  const timestamp = Date.now().toString();
  const random = Math.floor(Math.random() * 10000)
    .toString()
    .padStart(4, '0');
  return `ORD-${timestamp}-${random}`;
};

async function ensureSampleProducts() {
  let products = await Product.find({ published: true }).limit(5);
  if (products.length) {
    return products;
  }

  console.log('ℹ️  No published products found. Creating a fallback product.');
  const fallback = await Product.create({
    name: 'Demo Product',
    price: 99.99,
    stock: 50,
    published: true,
    isActive: true,
    colors: ['Black', 'Silver'],
  });

  return [fallback];
}

async function createOrdersForUser() {
  await mongoose.connect(dbUrl);
  console.log(`✅ Connected to MongoDB at ${dbUrl}`);

  const user = await User.findOne({ email: targetEmail.toLowerCase() });
  if (!user) {
    console.error(`❌ User with email ${targetEmail} not found.`);
    process.exitCode = 1;
    await mongoose.connection.close();
    return;
  }

  if (!user.uuid) {
    console.error('❌ Target user does not have a UUID.');
    process.exitCode = 1;
    await mongoose.connection.close();
    return;
  }

  const products = await ensureSampleProducts();

  const orderTemplates = [
    { orderStatus: 'processing', paymentStatus: 'paid', shippingType: 'home_delivery' },
    { orderStatus: 'shipped', paymentStatus: 'paid', shippingType: 'express_delivery' },
    { orderStatus: 'delivered', paymentStatus: 'paid', shippingType: 'home_delivery' },
  ];

  for (const template of orderTemplates) {
    const pickedProducts = products
      .sort(() => 0.5 - Math.random())
      .slice(0, Math.min(3, products.length));

    let subtotal = 0;
    const items = pickedProducts.map((product) => {
      const quantity = Math.floor(Math.random() * 3) + 1;
      const lineTotal = product.price * quantity;
      subtotal += lineTotal;
      return {
        product,
        quantity,
        lineTotal,
      };
    });

    const deliveryCharge = 80;
    const discount = 0;
    const totalPayable = subtotal + deliveryCharge - discount;

    const orderDoc = await Order.create({
      orderNumber: generateOrderNumber(),
      user: user.uuid,
      firstname: user.firstName,
      lastname: user.lastName,
      phone: user.phone || `01${Math.floor(Math.random() * 900000000) + 100000000}`,
      email: user.email,
      houseStreet: `${Math.floor(Math.random() * 300) + 1}, Demo Street`,
      city: 'Dhaka',
      subdistrict: 'Dhaka',
      postcode: '1200',
      country: 'Bangladesh',
      shippingType: template.shippingType,
      paymentMethod: 'cash_on_delivery',
      transactionId: template.paymentStatus === 'paid' ? `TXN-${Date.now()}-${Math.floor(Math.random() * 1000)}` : undefined,
      terms: true,
      subtotal,
      discount,
      deliveryCharge,
      additionalCharge: 0,
      totalPayable,
      orderStatus: template.orderStatus,
      paymentStatus: template.paymentStatus,
      notes: 'Sample order generated for dashboard testing.',
      trackingCode: ['shipped', 'delivered'].includes(template.orderStatus)
        ? `TRACK-${Math.random().toString(36).slice(2, 8).toUpperCase()}`
        : undefined,
      viewed: false,
      unpaidNotified: false,
      deliveredAt: template.orderStatus === 'delivered'
        ? new Date(Date.now() - 2 * 24 * 60 * 60 * 1000)
        : undefined,
    });

    await OrderItem.insertMany(
      items.map((item) => ({
        order: orderDoc._id,
        product: item.product._id,
        productName: item.product.name,
        productPrice: item.product.price,
        quantity: item.quantity,
        selectedColor: item.product.colors?.[0] || null,
        subtotal: item.lineTotal,
      }))
    );

    console.log(`✅ Created order ${orderDoc.orderNumber} (${template.orderStatus}) for ${user.email}`);
  }

  await mongoose.connection.close();
  console.log('✅ Orders created and MongoDB connection closed.');
}

createOrdersForUser().catch(async (error) => {
  console.error('❌ Failed to create orders:', error);
  process.exitCode = 1;
  await mongoose.connection.close();
});
