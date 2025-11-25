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

// Terms model
const termsSchema = new mongoose.Schema({
  content: {
    type: String,
    required: true,
  },
  version: {
    type: String,
    required: true,
    default: '1.0',
  },
  isActive: {
    type: Boolean,
    default: true,
  },
}, { timestamps: true });

const Terms = mongoose.model('Terms', termsSchema);

// Default Terms and Conditions content
const defaultTermsContent = `# Terms and Conditions

Welcome to Evo-TechBD! These terms and conditions outline the rules and regulations for the use of our website and services.

## 1. Introduction

By accessing this website, we assume you accept these terms and conditions. Do not continue to use Evo-TechBD if you do not agree to all of the terms and conditions stated on this page.

## 2. Definitions

- **Company**, **We**, **Us**, **Our**: Refers to Evo-TechBD
- **Customer**, **You**, **Your**: Refers to the individual accessing or using the Service
- **Website**: Refers to Evo-TechBD's e-commerce platform
- **Products**: Refers to 3D printers, filaments, accessories, and related items sold on our platform
- **Service**: Refers to the website and all services provided by Evo-TechBD

## 3. Products and Services

### 3.1 Product Information
We make every effort to display our products accurately, including descriptions, images, and pricing. However, we do not warrant that product descriptions or other content on this site is accurate, complete, reliable, current, or error-free.

### 3.2 Pricing
All prices are listed in Bangladesh Taka (BDT) and are subject to change without notice. We reserve the right to modify prices at any time.

### 3.3 Availability
All products are subject to availability. We reserve the right to discontinue any product at any time without notice.

## 4. Orders and Payment

### 4.1 Order Acceptance
We reserve the right to refuse or cancel any order for any reason, including but not limited to:
- Product unavailability
- Errors in product or pricing information
- Suspected fraudulent activity
- Credit or payment issues

### 4.2 Payment Methods
We accept the following payment methods:
- Credit/Debit Cards (Visa, Mastercard)
- Mobile Banking (bKash, Nagad)
- Bank Transfer (NPSB)

### 4.3 Payment Security
All payment transactions are processed securely. We do not store your complete credit card information on our servers.

## 5. Shipping and Delivery

### 5.1 Shipping Policy
We ship to locations within Bangladesh. Shipping times and costs vary based on location and product size.

### 5.2 Delivery
Delivery times are estimates and not guaranteed. We are not liable for delays caused by shipping carriers or circumstances beyond our control.

### 5.3 Risk of Loss
All items purchased from Evo-TechBD are made pursuant to a shipment contract. Risk of loss and title for items pass to you upon delivery to the carrier.

## 6. Returns and Refunds

### 6.1 Return Policy
Customers may return products within 7 days of delivery, provided:
- Products are in original condition with all packaging
- Products have not been used or damaged
- Proof of purchase is provided

### 6.2 Defective Products
If you receive a defective product, please contact us within 48 hours of delivery. We will arrange for replacement or refund as appropriate.

### 6.3 Refund Processing
Approved refunds will be processed within 7-14 business days to the original payment method.

## 7. Warranty

### 7.1 Manufacturer's Warranty
Products sold on our platform may come with manufacturer warranties. Warranty terms vary by product and manufacturer.

### 7.2 Warranty Claims
Warranty claims must be submitted with proof of purchase and within the warranty period specified by the manufacturer.

## 8. User Accounts

### 8.1 Account Creation
You may be required to create an account to access certain features. You are responsible for:
- Maintaining the confidentiality of your account credentials
- All activities that occur under your account
- Notifying us immediately of any unauthorized access

### 8.2 Account Termination
We reserve the right to terminate or suspend accounts that violate these terms or engage in fraudulent activity.

## 9. Intellectual Property

### 9.1 Ownership
All content on this website, including text, graphics, logos, images, and software, is the property of Evo-TechBD or its content suppliers and is protected by copyright and intellectual property laws.

### 9.2 License
You are granted a limited license to access and use the website for personal, non-commercial purposes. You may not:
- Reproduce, distribute, or create derivative works
- Reverse engineer or attempt to extract source code
- Remove copyright or proprietary notices

## 10. Privacy

Your privacy is important to us. Please review our Privacy Policy to understand how we collect, use, and protect your personal information.

## 11. Limitation of Liability

### 11.1 Disclaimer
The website and all products and services are provided "as is" without warranties of any kind, either express or implied.

### 11.2 Liability Cap
To the maximum extent permitted by law, Evo-TechBD shall not be liable for any indirect, incidental, special, consequential, or punitive damages, or any loss of profits or revenues.

## 12. Indemnification

You agree to indemnify and hold Evo-TechBD harmless from any claims, losses, damages, liabilities, and expenses arising from:
- Your use of the website
- Your violation of these terms
- Your violation of any rights of another party

## 13. Dispute Resolution

### 13.1 Governing Law
These terms shall be governed by and construed in accordance with the laws of Bangladesh.

### 13.2 Jurisdiction
Any disputes arising from these terms shall be subject to the exclusive jurisdiction of the courts in Dhaka, Bangladesh.

## 14. Changes to Terms

We reserve the right to update these terms and conditions at any time. Changes will be effective immediately upon posting to the website. Your continued use of the website constitutes acceptance of the updated terms.

## 15. Contact Information

If you have any questions about these Terms and Conditions, please contact us:

**Evo-TechBD**
- Email: evotech.bd22@gmail.com
- Phone: +880 1799 424854
- Address: Tonartek, Vasantek, Dhaka-1206, Bangladesh

## 16. Severability

If any provision of these terms is found to be invalid or unenforceable, the remaining provisions shall continue in full force and effect.

## 17. Entire Agreement

These terms constitute the entire agreement between you and Evo-TechBD regarding the use of the website and supersede all prior agreements.

---

**Last Updated:** ${new Date().toLocaleDateString()}
**Version:** 1.0

By using our website, you acknowledge that you have read, understood, and agree to be bound by these Terms and Conditions.`;

// Seed terms
const seedTerms = async () => {
  try {
    console.log('🔄 Seeding Terms and Conditions...');
    
    // Check if terms already exist
    const existingTerms = await Terms.findOne({ isActive: true });
    if (existingTerms) {
      console.log('⚠️  Active terms already exist. Skipping...');
      console.log(`   Version: ${existingTerms.version}`);
      console.log(`   Last updated: ${existingTerms.updatedAt}`);
      return;
    }
    
    // Deactivate all existing terms
    await Terms.updateMany({}, { isActive: false });
    
    // Create new terms
    const terms = await Terms.create({
      content: defaultTermsContent,
      version: '1.0',
      isActive: true,
    });
    
    console.log('✅ Terms and Conditions created successfully!');
    console.log(`   Version: ${terms.version}`);
    console.log(`   Content length: ${terms.content.length} characters`);
    console.log(`   Created at: ${terms.createdAt}`);
    
  } catch (error) {
    console.error('❌ Error seeding terms and conditions:', error);
    throw error;
  }
};

// Main execution
const main = async () => {
  await connectDB();
  await seedTerms();
  await mongoose.connection.close();
  console.log('\n✅ Database connection closed');
  process.exit(0);
};

main();
