const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  passwordHash: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    default: 'candidate',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Transform _id to id and remove __v and passwordHash when converting to JSON
userSchema.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform: function (doc, ret) {
    ret.id = ret._id;
    delete ret._id;
    // Map camelCase to snake_case if necessary for frontend compatibility,
    // but auth routes explicitly construct the response, so it's less critical here
    // except for consistency.
    // However, the User model prompt specifically asked for camelCase fields.
    // We'll keep the internal fields camelCase.
    delete ret.passwordHash; // Don't return password hash
  },
});

module.exports = mongoose.model('User', userSchema);
