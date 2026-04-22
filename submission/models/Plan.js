const mongoose = require('mongoose');

const planSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  name: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100
  },
  goal: {
    type: String,
    trim: true,
    maxlength: 200
  },
  level: {
    type: String,
    enum: ['beginner', 'intermediate', 'advanced'],
    default: 'beginner'
  },
  daysPerWeek: {
    type: Number,
    min: 1,
    max: 7,
    default: 3
  },
  notes: {
    type: String,
    trim: true,
    maxlength: 500
  },
  days: [{
    dayNumber: {
      type: Number,
      required: true,
      min: 1,
      max: 7
    },
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 50
    },
    exercises: [{
      exercise: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Exercise',
        required: true
      },
      sets: {
        type: Number,
        required: true,
        min: 1,
        max: 10
      },
      reps: {
        type: Number,
        required: true,
        min: 1,
        max: 100
      }
    }]
  }],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Index for efficient queries
planSchema.index({ user: 1, createdAt: -1 });

module.exports = mongoose.model('Plan', planSchema);