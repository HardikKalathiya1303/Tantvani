require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

async function seed() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log('Connected to MongoDB');

  const User = require('../models/User');
  const Category = require('../models/Category');

  // Create admin user
  const existing = await User.findOne({ email: 'admin@tantvani.com' });
  if (!existing) {
    const admin = await User.create({
      name: 'Tantvani Admin',
      email: 'admin@tantvani.com',
      password: 'Admin@123',
      role: 'admin',
    });
    console.log('✅ Admin created: admin@tantvani.com / Admin@123');
  } else {
    console.log('ℹ️  Admin already exists');
  }

  // Create sample categories
  const cats = ['Silk Sarees', 'Banarasi', 'Kanjivaram', 'Chanderi', 'Cotton', 'Linen'];
  for (const name of cats) {
    const ex = await Category.findOne({ name });
    if (!ex) {
      await Category.create({ name, description: `Premium ${name} collection`, isActive: true });
      console.log(`✅ Category: ${name}`);
    }
  }

  console.log('\n🎉 Seed complete!');
  process.exit(0);
}

seed().catch(err => { console.error(err); process.exit(1); });
