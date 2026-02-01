const mongoose = require('mongoose');

const applicationSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  job: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Job',
    required: true,
  },
  appliedAt: {
    type: Date,
    default: Date.now,
  },
});

// Transform to match frontend expectations
applicationSchema.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform: function (doc, ret) {
    ret.id = ret._id;
    delete ret._id;
    
    ret.user_id = ret.user; // Supabase likely returned user_id
    delete ret.user;
    
    ret.job_id = ret.job; // Supabase likely returned job_id
    // We don't delete ret.job here if we want to support populated 'job' field,
    // but usually population replaces the ID. 
    // If populated, ret.job is an object.
    
    ret.applied_at = ret.appliedAt;
    delete ret.appliedAt;
  },
});

module.exports = mongoose.model('Application', applicationSchema);
