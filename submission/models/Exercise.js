const mongoose = require('mongoose');

const exerciseSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  group: {
    type: String,
    required: true,
    enum: ['Chest', 'Back', 'Shoulders', 'Legs', 'Arms', 'Core', 'Cardio']
  },
  type: {
    type: String,
    required: true,
    enum: ['Compound', 'Isolation', 'Isometric', 'Cardio', 'Power']
  },
  difficulty: {
    type: String,
    required: true,
    enum: ['Beginner', 'Intermediate', 'Advanced']
  },
  muscles: [{
    type: String,
    required: true
  }],
  setsMin: {
    type: Number,
    required: true,
    min: 1
  },
  setsMax: {
    type: Number,
    required: true,
    min: 1
  },
  repsMin: {
    type: Number,
    required: true,
    min: 1
  },
  repsMax: {
    type: Number,
    required: true,
    min: 1
  },
  rir: {
    type: Number,
    required: true,
    min: 0,
    max: 5
  },
  mev: {
    type: Number,
    required: true,
    min: 1
  },
  mrv: {
    type: Number,
    required: true,
    min: 1
  },
  isCompound: {
    type: Boolean,
    required: true
  },
  note: {
    type: String,
    trim: true
  }
});

module.exports = mongoose.model('Exercise', exerciseSchema);