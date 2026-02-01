const express = require('express');
const Application = require('../models/Application');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

router.get('/:id/applications', authMiddleware, async (req, res) => {
  try {
    const requestedUserId = req.params.id;
    const currentUserId = req.user.id;

    if (requestedUserId !== currentUserId) {
      return res.status(403).json({ error: 'Access denied' });
    }

    const applications = await Application.find({ user: currentUserId })
      .populate('job')
      .sort({ appliedAt: -1 });

    // Transform result to match previous response structure
    const transformedApplications = applications.map(app => {
      // The Application model toJSON handles user_id, applied_at, id
      // But populate('job') replaces the 'job' ID with the Job document.
      // We need to ensure the structure matches what frontend expects.
      // Supabase returned: { id, applied_at, jobs: { ... } }
      // Mongoose with populate returns: { id, appliedAt, job: { ... } }
      // And our toJSON converts appliedAt -> applied_at
      
      const appJson = app.toJSON();
      
      // Map 'job' to 'jobs' to match Supabase response structure if necessary
      // If Supabase returned 'jobs' object, we should probably return 'jobs' too.
      // Based on previous code: jobs (...) -> returns 'jobs' object
      appJson.jobs = appJson.job_id; // Because toJSON likely renamed 'job' to 'job_id' or kept it?
      
      // Wait, let's look at Application.js toJSON:
      // ret.job_id = ret.job; delete ret.job;
      // If 'job' was populated, ret.job is the object.
      // So ret.job_id will be the Job Object.
      // We want to rename it to 'jobs' to match Supabase.
      
      appJson.jobs = appJson.job_id;
      delete appJson.job_id;
      
      return appJson;
    });

    res.json(transformedApplications);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
