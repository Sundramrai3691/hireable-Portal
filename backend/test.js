const mongoose = require('mongoose');
require('dotenv').config();
const User = require('./models/User');
const Job = require('./models/Job');
const Application = require('./models/Application');

async function testDatabase() {
  console.log('Testing database connection...\n');

  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✓ MongoDB connected');

    // 1. Create User
    console.log('\n1. Creating test user...');
    const testUser = new User({
      email: `test_${Date.now()}@example.com`,
      passwordHash: 'dummyhash123',
      name: 'Test User',
      role: 'candidate'
    });
    await testUser.save();
    console.log('   ✓ User created:', testUser.id);

    // 2. Create Job
    console.log('\n2. Creating test job...');
    const testJob = new Job({
      title: 'Test Software Engineer',
      company: 'Test Corp',
      location: 'Remote',
      postedBy: testUser.id,
      description: 'A test job description',
      tags: ['test', 'nodejs']
    });
    await testJob.save();
    console.log('   ✓ Job created:', testJob.id);

    // 3. Create Application
    console.log('\n3. Creating test application...');
    const testApp = new Application({
      user: testUser.id,
      job: testJob.id
    });
    await testApp.save();
    console.log('   ✓ Application created:', testApp.id);

    // Clean up
    console.log('\nCleaning up test data...');
    await Application.findByIdAndDelete(testApp.id);
    await Job.findByIdAndDelete(testJob.id);
    await User.findByIdAndDelete(testUser.id);
    console.log('✓ Cleanup complete');

  } catch (error) {
    console.error('\n❌ Test failed:', error);
  } finally {
    await mongoose.disconnect();
    console.log('\nDatabase connection closed');
  }
}

testDatabase().catch(console.error);
