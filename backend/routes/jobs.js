const express = require('express');
const Job = require('../models/Job');
const Application = require('../models/Application');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

router.post('/', authMiddleware, async (req, res) => {
  try {
    const { title, company, location, type, salary, description, skills } = req.body;

    if (!title || !company) {
      return res.status(400).json({ error: 'Title and company are required' });
    }

    let tagsArray = [];
    if (skills) {
      tagsArray = typeof skills === 'string'
        ? skills.split(',').map(s => s.trim()).filter(Boolean)
        : skills;
    }

    const job = new Job({
      title,
      company,
      location: location || 'Remote',
      type: type || 'Full-time',
      salary: salary || 'Not specified',
      description: description || '',
      tags: tagsArray,
      postedBy: req.user.id,
      isActive: true
    });

    await job.save();

    res.status(201).json(job);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/', async (req, res) => {
  try {
    const { location, tag, type } = req.query;

    let query = { isActive: true };

    if (location && location !== 'All') {
      query.location = { $regex: location, $options: 'i' };
    }

    if (type && type !== 'All') {
      query.type = type;
    }

    if (tag) {
      query.tags = tag;
    }

    const jobs = await Job.find(query).sort({ createdAt: -1 });

    res.json(jobs);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/:id/apply', authMiddleware, async (req, res) => {
  try {
    const jobId = req.params.id;
    const userId = req.user.id;

    const existingApplication = await Application.findOne({
      user: userId,
      job: jobId
    });

    if (existingApplication) {
      return res.status(400).json({ error: 'Already applied to this job' });
    }

    const application = new Application({
      user: userId,
      job: jobId
    });

    await application.save();

    res.status(201).json(application);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
