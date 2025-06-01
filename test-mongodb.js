const mongoose = require('mongoose');
require('dotenv').config({ path: './backend/.env' });

console.log('Testing MongoDB connection...');
console.log('Connection string:', process.env.MONGO_URL ? 'Found' : 'Not found');

mongoose.connect(process.env.MONGO_URL)
  .then(() => {
    console.log('✅ MongoDB connected successfully!');
    console.log('Database name:', mongoose.connection.name);
    process.exit(0);
  })
  .catch((error) => {
    console.log('❌ MongoDB connection failed:');
    console.log('Error:', error.message);
    
    if (error.message.includes('authentication failed')) {
      console.log('\n🔧 Solution: Check your username and password in MongoDB Atlas');
    } else if (error.message.includes('network')) {
      console.log('\n🔧 Solution: Check your internet connection and MongoDB Atlas network access');
    } else if (error.message.includes('timeout')) {
      console.log('\n🔧 Solution: Add your IP address to MongoDB Atlas whitelist');
    }
    
    process.exit(1);
  });
