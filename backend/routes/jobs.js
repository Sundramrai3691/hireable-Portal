const express = require('express');
const { supabase } = require('../config/supabase');
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

    const { data: job, error } = await supabase
      .from('jobs')
      .insert([{
        title,
        company,
        location: location || 'Remote',
        type: type || 'Full-time',
        salary: salary || 'Not specified',
        description: description || '',
        tags: tagsArray,
        posted_by: req.user.id,
        is_active: true
      }])
      .select()
      .single();

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    res.status(201).json(job);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/', async (req, res) => {
  try {
    const { location, tag, type } = req.query;

    let query = supabase
      .from('jobs')
      .select('*')
      .eq('is_active', true)
      .order('created_at', { ascending: false });

    if (location && location !== 'All') {
      query = query.ilike('location', `%${location}%`);
    }

    if (type && type !== 'All') {
      query = query.eq('type', type);
    }

    if (tag) {
      query = query.contains('tags', [tag]);
    }

    const { data: jobs, error } = await query;

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    res.json(jobs);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/:id/apply', authMiddleware, async (req, res) => {
  try {
    const jobId = req.params.id;
    const userId = req.user.id;

    const { data: existingApplication } = await supabase
      .from('applications')
      .select('id')
      .eq('user_id', userId)
      .eq('job_id', jobId)
      .single();

    if (existingApplication) {
      return res.status(400).json({ error: 'Already applied to this job' });
    }

    const { data: application, error } = await supabase
      .from('applications')
      .insert([{
        user_id: userId,
        job_id: jobId
      }])
      .select()
      .single();

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    res.status(201).json(application);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
