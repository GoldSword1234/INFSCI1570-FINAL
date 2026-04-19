const mongoose = require('mongoose');

const workoutSchema = new mongoose.Schema({
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
  duration: {
    type: Number, // in minutes
    default: 0,
    min: 0
  },
  notes: {
    type: String,
    trim: true,
    maxlength: 500
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
    },
    weightLbs: {
      type: Number,
      default: 0,
      min: 0
    },
    notes: {
      type: String,
      trim: true,
      maxlength: 200
    }
  }],
  date: {
    type: Date,
    default: Date.now
  }
});

// Index for efficient queries
workoutSchema.index({ user: 1, date: -1 });

module.exports = mongoose.model('Workout', workoutSchema);