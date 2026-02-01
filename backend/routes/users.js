const express = require('express');
const { supabase } = require('../config/supabase');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

router.get('/:id/applications', authMiddleware, async (req, res) => {
  try {
    const requestedUserId = req.params.id;
    const currentUserId = req.user.id;

    if (requestedUserId !== currentUserId) {
      return res.status(403).json({ error: 'Access denied' });
    }

    const { data: applications, error } = await supabase
      .from('applications')
      .select(`
        id,
        applied_at,
        jobs (
          id,
          title,
          company,
          location,
          type,
          salary,
          description,
          tags
        )
      `)
      .eq('user_id', currentUserId)
      .order('applied_at', { ascending: false });

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    res.json(applications);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
