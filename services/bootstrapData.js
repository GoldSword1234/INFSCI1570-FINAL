const Exercise = require('../models/Exercise');
const Workout = require('../models/Workout');
const Plan = require('../models/Plan');
const User = require('../models/User');

const starterExercises = [
  {
    name: 'Barbell Bench Press',
    group: 'Chest',
    type: 'Compound',
    difficulty: 'Intermediate',
    muscles: ['Chest', 'Triceps', 'Front Delts'],
    setsMin: 3,
    setsMax: 5,
    repsMin: 4,
    repsMax: 8,
    rir: 2,
    mev: 2,
    mrv: 8,
    isCompound: true,
    note: 'Classic upper-body press.'
  },
  {
    name: 'Barbell Row',
    group: 'Back',
    type: 'Compound',
    difficulty: 'Intermediate',
    muscles: ['Lats', 'Traps', 'Biceps'],
    setsMin: 3,
    setsMax: 4,
    repsMin: 6,
    repsMax: 10,
    rir: 2,
    mev: 2,
    mrv: 7,
    isCompound: true,
    note: 'Heavy horizontal pull.'
  },
  {
    name: 'Barbell Squat',
    group: 'Legs',
    type: 'Compound',
    difficulty: 'Advanced',
    muscles: ['Quads', 'Glutes', 'Hamstrings', 'Core'],
    setsMin: 3,
    setsMax: 5,
    repsMin: 4,
    repsMax: 8,
    rir: 2,
    mev: 2,
    mrv: 6,
    isCompound: true,
    note: 'Lower-body strength staple.'
  },
  {
    name: 'Overhead Press',
    group: 'Shoulders',
    type: 'Compound',
    difficulty: 'Intermediate',
    muscles: ['Front Delts', 'Triceps', 'Traps'],
    setsMin: 3,
    setsMax: 4,
    repsMin: 6,
    repsMax: 10,
    rir: 2,
    mev: 2,
    mrv: 6,
    isCompound: true,
    note: 'Standing shoulder press.'
  },
  {
    name: 'Tricep Pushdown',
    group: 'Arms',
    type: 'Isolation',
    difficulty: 'Beginner',
    muscles: ['Triceps'],
    setsMin: 3,
    setsMax: 4,
    repsMin: 10,
    repsMax: 15,
    rir: 1,
    mev: 2,
    mrv: 8,
    isCompound: false,
    note: 'Simple triceps isolation movement.'
  },
  {
    name: 'Plank',
    group: 'Core',
    type: 'Isometric',
    difficulty: 'Beginner',
    muscles: ['Core', 'Lower Back'],
    setsMin: 3,
    setsMax: 4,
    repsMin: 30,
    repsMax: 60,
    rir: 0,
    mev: 2,
    mrv: 8,
    isCompound: false,
    note: 'Reps are measured in seconds.'
  }
];

async function createUser({ username, email, password, role = 'user' }) {
  const existingUser = await User.findOne({ username });
  if (existingUser) {
    return existingUser;
  }

  const user = new User({ username, email, passwordHash: password, role });
  user.generateApiKey();
  await user.save();
  return user;
}

async function ensureBootstrapData() {
  const exerciseCount = await Exercise.countDocuments();
  if (exerciseCount === 0) {
    await Exercise.insertMany(starterExercises);
  }

  const demoUser = await createUser({
    username: 'demo',
    email: 'demo@fittrack.com',
    password: 'demo123'
  });

  await createUser({
    username: 'admin',
    email: 'admin@fittrack.com',
    password: 'admin123',
    role: 'admin'
  });

  const workoutCount = await Workout.countDocuments({ user: demoUser._id });
  const planCount = await Plan.countDocuments({ user: demoUser._id });

  if (workoutCount > 0 || planCount > 0) {
    return;
  }

  const exerciseMap = {};
  const savedExercises = await Exercise.find({
    name: { $in: starterExercises.map(exercise => exercise.name) }
  });

  savedExercises.forEach(exercise => {
    exerciseMap[exercise.name] = exercise;
  });

  await Workout.insertMany([
    {
      user: demoUser._id,
      name: 'Push Day Starter',
      goal: 'hypertrophy',
      duration: 60,
      notes: 'Starter upper-body workout.',
      exercises: [
        { exercise: exerciseMap['Barbell Bench Press']._id, sets: 4, reps: 6, weightLbs: 135 },
        { exercise: exerciseMap['Overhead Press']._id, sets: 3, reps: 8, weightLbs: 75 },
        { exercise: exerciseMap['Tricep Pushdown']._id, sets: 3, reps: 12, weightLbs: 45 }
      ]
    },
    {
      user: demoUser._id,
      name: 'Pull and Legs Starter',
      goal: 'strength',
      duration: 70,
      notes: 'Starter full-body session.',
      exercises: [
        { exercise: exerciseMap['Barbell Row']._id, sets: 4, reps: 8, weightLbs: 115 },
        { exercise: exerciseMap['Barbell Squat']._id, sets: 4, reps: 5, weightLbs: 185 },
        { exercise: exerciseMap['Plank']._id, sets: 3, reps: 45, weightLbs: 0 }
      ]
    }
  ]);

  await Plan.create({
    user: demoUser._id,
    name: '3-Day Starter Split',
    goal: 'general fitness',
    level: 'beginner',
    daysPerWeek: 3,
    notes: 'Sample plan inserted automatically on first launch.',
    days: [
      {
        dayNumber: 1,
        name: 'Push',
        exercises: [
          { exercise: exerciseMap['Barbell Bench Press']._id, sets: 4, reps: 6 },
          { exercise: exerciseMap['Overhead Press']._id, sets: 3, reps: 8 },
          { exercise: exerciseMap['Tricep Pushdown']._id, sets: 3, reps: 12 }
        ]
      },
      {
        dayNumber: 2,
        name: 'Pull',
        exercises: [
          { exercise: exerciseMap['Barbell Row']._id, sets: 4, reps: 8 },
          { exercise: exerciseMap['Plank']._id, sets: 3, reps: 45 }
        ]
      },
      {
        dayNumber: 3,
        name: 'Legs',
        exercises: [
          { exercise: exerciseMap['Barbell Squat']._id, sets: 4, reps: 5 },
          { exercise: exerciseMap['Plank']._id, sets: 3, reps: 45 }
        ]
      }
    ]
  });
}

module.exports = { ensureBootstrapData };
