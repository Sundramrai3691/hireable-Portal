const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
require('dotenv').config();
const User = require('./models/User');
const Job = require('./models/Job');

async function run() {
  if (!process.env.MONGO_URI) {
    console.error('MONGO_URI is not set in environment');
    process.exit(1);
  }

  await mongoose.connect(process.env.MONGO_URI);

  try {
    const email = 'demo@example.com';
    const password = 'Demo1234';
    const name = 'Demo User';

    let user = await User.findOne({ email });
    if (!user) {
      const passwordHash = await bcrypt.hash(password, 10);
      user = new User({ email, passwordHash, name, role: 'candidate' });
      await user.save();
    }

    console.log('User ID:', user.id);

    const jobsPayload = [
      {
        title: 'Frontend Engineer',
        company: 'Acme Corp',
        location: 'San Francisco, CA',
        type: 'Full-time',
        salary: '$120k - $150k',
        description: 'Build modern React frontends.',
        tags: ['react', 'typescript', 'ui'],
        postedBy: user._id,
      },
      {
        title: 'Backend Developer',
        company: 'Beta Systems',
        location: 'New York, NY',
        type: 'Contract',
        salary: '$80/hr',
        description: 'Node.js APIs and microservices.',
        tags: ['node', 'express', 'mongodb'],
        postedBy: user._id,
      },
      {
        title: 'DevOps Engineer',
        company: 'CloudWorks',
        location: 'Remote',
        type: 'Full-time',
        salary: '$130k - $160k',
        description: 'CI/CD, Kubernetes, cloud infrastructure.',
        tags: ['aws', 'kubernetes', 'terraform'],
        postedBy: user._id,
      },
    ];

    const created = await Job.insertMany(jobsPayload);
    created.forEach((job, idx) => {
      console.log(`Job ${idx + 1} ID:`, job.id);
    });
  } catch (err) {
    console.error(err);
  } finally {
    await mongoose.disconnect();
  }
}

run();
