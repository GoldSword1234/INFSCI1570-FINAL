require('dotenv').config();
const mongoose = require('mongoose');
const { buildMongoUri } = require('./db');
const Exercise = require('./models/Exercise');
const User = require('./models/User');
const Workout = require('./models/Workout');
const Plan = require('./models/Plan');

const exercises = [
  { name:"Barbell Bench Press", group:"Chest", type:"Compound", difficulty:"Intermediate", muscles:["Chest","Triceps","Front Delts"], setsMin:3, setsMax:5, repsMin:4, repsMax:8, rir:2, mev:2, mrv:8, isCompound:true, note:"King of chest exercises. Keep shoulder blades retracted, feet flat. Full ROM critical." },
  { name:"Incline Dumbbell Press", group:"Chest", type:"Compound", difficulty:"Beginner", muscles:["Upper Chest","Triceps","Front Delts"], setsMin:3, setsMax:4, repsMin:8, repsMax:12, rir:2, mev:2, mrv:6, isCompound:true, note:"Best movement for upper chest. Set bench to 30-45 degrees." },
  { name:"Cable Fly", group:"Chest", type:"Isolation", difficulty:"Beginner", muscles:["Chest"], setsMin:3, setsMax:4, repsMin:12, repsMax:15, rir:1, mev:1, mrv:5, isCompound:false, note:"Peak contraction focus. Great finisher after pressing movements." },
  { name:"Dips (Chest Focus)", group:"Chest", type:"Compound", difficulty:"Intermediate", muscles:["Chest","Triceps"], setsMin:3, setsMax:4, repsMin:8, repsMax:12, rir:2, mev:2, mrv:6, isCompound:true, note:"Lean forward to shift emphasis to chest over triceps." },
  { name:"Push-Up", group:"Chest", type:"Compound", difficulty:"Beginner", muscles:["Chest","Triceps","Core"], setsMin:3, setsMax:4, repsMin:10, repsMax:20, rir:2, mev:2, mrv:8, isCompound:true, note:"Elevate feet for upper chest. Add weight plate for load." },
  { name:"Pec Deck Machine", group:"Chest", type:"Isolation", difficulty:"Beginner", muscles:["Chest"], setsMin:3, setsMax:4, repsMin:12, repsMax:15, rir:1, mev:1, mrv:5, isCompound:false, note:"Excellent stretch at end ROM. Safe on shoulders." },
  { name:"Machine Chest Press", group:"Chest", type:"Compound", difficulty:"Beginner", muscles:["Chest","Triceps"], setsMin:3, setsMax:4, repsMin:10, repsMax:14, rir:2, mev:2, mrv:7, isCompound:true, note:"Safer than barbell. Good for beginners learning pressing pattern." },
  { name:"Pull-Up / Chin-Up", group:"Back", type:"Compound", difficulty:"Intermediate", muscles:["Lats","Biceps","Rear Delts"], setsMin:3, setsMax:5, repsMin:5, repsMax:10, rir:2, mev:2, mrv:8, isCompound:true, note:"Chinups emphasize biceps more. Full dead hang each rep." },
  { name:"Barbell Row", group:"Back", type:"Compound", difficulty:"Intermediate", muscles:["Lats","Traps","Biceps","Rear Delts"], setsMin:3, setsMax:4, repsMin:6, repsMax:10, rir:2, mev:2, mrv:7, isCompound:true, note:"Overhand grip hits upper back more. Pull to lower chest." },
  { name:"Cable Row", group:"Back", type:"Compound", difficulty:"Beginner", muscles:["Lats","Traps","Rear Delts"], setsMin:3, setsMax:4, repsMin:10, repsMax:14, rir:2, mev:2, mrv:7, isCompound:true, note:"Constant tension through full ROM. Use various handle attachments." },
  { name:"Lat Pulldown", group:"Back", type:"Compound", difficulty:"Beginner", muscles:["Lats","Biceps"], setsMin:3, setsMax:4, repsMin:10, repsMax:12, rir:2, mev:2, mrv:7, isCompound:true, note:"Wide pronated grip for lat width. Full stretch at top." },
  { name:"Deadlift", group:"Back", type:"Compound", difficulty:"Advanced", muscles:["Back","Glutes","Hamstrings","Traps"], setsMin:2, setsMax:4, repsMin:3, repsMax:6, rir:3, mev:1, mrv:4, isCompound:true, note:"Full body king. Very high CNS demand — limit to 1-2x/week." },
  { name:"Face Pull", group:"Back", type:"Isolation", difficulty:"Beginner", muscles:["Rear Delts","Rotator Cuff"], setsMin:3, setsMax:4, repsMin:15, repsMax:20, rir:1, mev:2, mrv:8, isCompound:false, note:"Essential for shoulder health. Pull to forehead, elbows high." },
  { name:"Dumbbell Row", group:"Back", type:"Compound", difficulty:"Beginner", muscles:["Lats","Biceps"], setsMin:3, setsMax:4, repsMin:10, repsMax:12, rir:2, mev:2, mrv:7, isCompound:true, note:"Unilateral. Let shoulder blade move for full lat ROM." },
  { name:"T-Bar Row", group:"Back", type:"Compound", difficulty:"Intermediate", muscles:["Lats","Traps","Rear Delts"], setsMin:3, setsMax:4, repsMin:8, repsMax:12, rir:2, mev:2, mrv:7, isCompound:true, note:"Heavy mid-back builder. Use a close-grip handle." },
  { name:"Overhead Press", group:"Shoulders", type:"Compound", difficulty:"Intermediate", muscles:["Front Delts","Triceps","Traps"], setsMin:3, setsMax:4, repsMin:6, repsMax:10, rir:2, mev:2, mrv:6, isCompound:true, note:"Best overall shoulder mass builder. Brace core throughout." },
  { name:"Lateral Raise", group:"Shoulders", type:"Isolation", difficulty:"Beginner", muscles:["Side Delts"], setsMin:3, setsMax:5, repsMin:12, repsMax:20, rir:1, mev:3, mrv:10, isCompound:false, note:"Side delts need high volume. Slight forward lean emphasizes lateral head." },
  { name:"Rear Delt Fly", group:"Shoulders", type:"Isolation", difficulty:"Beginner", muscles:["Rear Delts"], setsMin:3, setsMax:4, repsMin:12, repsMax:20, rir:1, mev:2, mrv:8, isCompound:false, note:"Crucial for shoulder balance. Most people underdevelop rear delts." },
  { name:"Arnold Press", group:"Shoulders", type:"Compound", difficulty:"Intermediate", muscles:["Front Delts","Side Delts","Triceps"], setsMin:3, setsMax:4, repsMin:8, repsMax:12, rir:2, mev:2, mrv:6, isCompound:true, note:"Hits all three delt heads through rotation." },
  { name:"Cable Lateral Raise", group:"Shoulders", type:"Isolation", difficulty:"Beginner", muscles:["Side Delts"], setsMin:3, setsMax:4, repsMin:15, repsMax:20, rir:1, mev:2, mrv:10, isCompound:false, note:"Constant tension vs dumbbell. Cross-body version for better stretch." },
  { name:"Barbell Squat", group:"Legs", type:"Compound", difficulty:"Advanced", muscles:["Quads","Glutes","Hamstrings","Core"], setsMin:3, setsMax:5, repsMin:4, repsMax:8, rir:2, mev:2, mrv:6, isCompound:true, note:"King of lower body. Depth below parallel for full activation." },
  { name:"Romanian Deadlift", group:"Legs", type:"Compound", difficulty:"Intermediate", muscles:["Hamstrings","Glutes","Lower Back"], setsMin:3, setsMax:4, repsMin:8, repsMax:12, rir:2, mev:2, mrv:6, isCompound:true, note:"Best hamstring exercise. Feel the stretch — don't round the back." },
  { name:"Leg Press", group:"Legs", type:"Compound", difficulty:"Beginner", muscles:["Quads","Glutes"], setsMin:3, setsMax:4, repsMin:10, repsMax:15, rir:2, mev:2, mrv:7, isCompound:true, note:"Allows heavy loading safely. High foot placement for more glute." },
  { name:"Leg Curl", group:"Legs", type:"Isolation", difficulty:"Beginner", muscles:["Hamstrings"], setsMin:3, setsMax:4, repsMin:10, repsMax:15, rir:1, mev:2, mrv:7, isCompound:false, note:"Best hamstring isolation. Seated version provides better stretch." },
  { name:"Leg Extension", group:"Legs", type:"Isolation", difficulty:"Beginner", muscles:["Quads"], setsMin:3, setsMax:4, repsMin:12, repsMax:15, rir:1, mev:2, mrv:7, isCompound:false, note:"Terminal knee extension. Great for VMO and quad isolation." },
  { name:"Bulgarian Split Squat", group:"Legs", type:"Compound", difficulty:"Advanced", muscles:["Quads","Glutes","Hamstrings"], setsMin:3, setsMax:4, repsMin:8, repsMax:12, rir:2, mev:2, mrv:6, isCompound:true, note:"Best unilateral leg exercise. Rear foot elevation adds hip flexor stretch." },
  { name:"Hip Thrust", group:"Legs", type:"Compound", difficulty:"Intermediate", muscles:["Glutes","Hamstrings"], setsMin:3, setsMax:4, repsMin:10, repsMax:15, rir:1, mev:2, mrv:7, isCompound:true, note:"Peak glute activation. Squeeze at the top and hold 1 second." },
  { name:"Calf Raise", group:"Legs", type:"Isolation", difficulty:"Beginner", muscles:["Calves"], setsMin:3, setsMax:5, repsMin:12, repsMax:20, rir:1, mev:3, mrv:10, isCompound:false, note:"Calves need high volume and frequency. Full stretch at bottom." },
  { name:"Hack Squat", group:"Legs", type:"Compound", difficulty:"Intermediate", muscles:["Quads","Glutes"], setsMin:3, setsMax:4, repsMin:8, repsMax:12, rir:2, mev:2, mrv:6, isCompound:true, note:"Machine-based. Safer for heavy quad work. Vary foot placement." },
  { name:"Walking Lunge", group:"Legs", type:"Compound", difficulty:"Intermediate", muscles:["Quads","Glutes","Hamstrings"], setsMin:3, setsMax:4, repsMin:10, repsMax:14, rir:2, mev:2, mrv:6, isCompound:true, note:"Count per leg. Functional strength and coordination." },
  { name:"Barbell Curl", group:"Arms", type:"Isolation", difficulty:"Beginner", muscles:["Biceps"], setsMin:3, setsMax:4, repsMin:8, repsMax:12, rir:1, mev:2, mrv:8, isCompound:false, note:"Standard bicep mass builder. Avoid swinging — control the eccentric." },
  { name:"Hammer Curl", group:"Arms", type:"Isolation", difficulty:"Beginner", muscles:["Brachialis","Biceps"], setsMin:3, setsMax:4, repsMin:10, repsMax:12, rir:1, mev:2, mrv:7, isCompound:false, note:"Builds overall arm thickness through brachialis." },
  { name:"Incline Dumbbell Curl", group:"Arms", type:"Isolation", difficulty:"Intermediate", muscles:["Biceps Long Head"], setsMin:3, setsMax:4, repsMin:10, repsMax:12, rir:1, mev:2, mrv:7, isCompound:false, note:"Long head stretch maximized. Great for bicep peak." },
  { name:"Tricep Pushdown", group:"Arms", type:"Isolation", difficulty:"Beginner", muscles:["Triceps Lateral Head"], setsMin:3, setsMax:4, repsMin:12, repsMax:15, rir:1, mev:2, mrv:8, isCompound:false, note:"Good pump movement. Use rope for more lateral head activation." },
  { name:"Skull Crusher", group:"Arms", type:"Isolation", difficulty:"Intermediate", muscles:["Triceps Long Head"], setsMin:3, setsMax:4, repsMin:8, repsMax:12, rir:2, mev:2, mrv:7, isCompound:false, note:"Best tricep long head exercise. Let the bar come behind the head." },
  { name:"Overhead Tricep Extension", group:"Arms", type:"Isolation", difficulty:"Beginner", muscles:["Triceps Long Head"], setsMin:3, setsMax:4, repsMin:10, repsMax:15, rir:1, mev:2, mrv:7, isCompound:false, note:"Best long head stretch position. Cable version preferred." },
  { name:"Close Grip Bench Press", group:"Arms", type:"Compound", difficulty:"Intermediate", muscles:["Triceps","Chest"], setsMin:3, setsMax:4, repsMin:6, repsMax:10, rir:2, mev:2, mrv:6, isCompound:true, note:"Heavy tricep compound. Hands shoulder-width, not too narrow." },
  { name:"Plank", group:"Core", type:"Isometric", difficulty:"Beginner", muscles:["Core","Lower Back"], setsMin:3, setsMax:4, repsMin:30, repsMax:60, rir:0, mev:2, mrv:8, isCompound:false, note:"Reps = seconds. Squeeze glutes, brace abs, don't let hips sag." },
  { name:"Cable Crunch", group:"Core", type:"Isolation", difficulty:"Beginner", muscles:["Abs"], setsMin:3, setsMax:4, repsMin:12, repsMax:15, rir:1, mev:2, mrv:8, isCompound:false, note:"Best loaded ab exercise. Pull with abs, not arms." },
  { name:"Hanging Leg Raise", group:"Core", type:"Isolation", difficulty:"Intermediate", muscles:["Abs","Hip Flexors"], setsMin:3, setsMax:4, repsMin:10, repsMax:15, rir:1, mev:2, mrv:7, isCompound:false, note:"Bend knees to reduce hip flexor involvement if needed." },
  { name:"Ab Wheel Rollout", group:"Core", type:"Compound", difficulty:"Advanced", muscles:["Abs","Lats","Shoulders"], setsMin:3, setsMax:4, repsMin:8, repsMax:12, rir:1, mev:2, mrv:6, isCompound:true, note:"Full core tension from anti-extension pattern. Build up from knees." },
  { name:"Pallof Press", group:"Core", type:"Isometric", difficulty:"Intermediate", muscles:["Obliques","Core"], setsMin:3, setsMax:4, repsMin:10, repsMax:12, rir:1, mev:2, mrv:7, isCompound:false, note:"Anti-rotation. Highly functional. Resist the cable throughout." },
  { name:"Running (Moderate)", group:"Cardio", type:"Cardio", difficulty:"Beginner", muscles:["Cardiovascular","Legs"], setsMin:1, setsMax:1, repsMin:20, repsMax:40, rir:0, mev:1, mrv:5, isCompound:false, note:"Reps = minutes. Zone 2 cardio. Builds aerobic base." },
  { name:"HIIT Sprints", group:"Cardio", type:"Cardio", difficulty:"Intermediate", muscles:["Cardiovascular","Legs"], setsMin:6, setsMax:10, repsMin:20, repsMax:30, rir:0, mev:1, mrv:4, isCompound:false, note:"Reps = seconds work. 1:2 work to rest ratio. All-out effort." },
  { name:"Jump Rope", group:"Cardio", type:"Cardio", difficulty:"Beginner", muscles:["Cardiovascular","Calves"], setsMin:3, setsMax:5, repsMin:60, repsMax:120, rir:0, mev:1, mrv:5, isCompound:false, note:"Reps = seconds. Excellent conditioning and coordination." },
  { name:"Box Jump", group:"Cardio", type:"Power", difficulty:"Intermediate", muscles:["Quads","Glutes","Calves"], setsMin:3, setsMax:5, repsMin:5, repsMax:8, rir:3, mev:2, mrv:5, isCompound:true, note:"Always train power when fresh. Step down — never jump down." },
];

async function seed() {
  try {
    await mongoose.connect(buildMongoUri());
    console.log('✅ Connected to MongoDB');

    // Clear existing
    await Exercise.deleteMany({});
    await User.deleteMany({});
    await Workout.deleteMany({});
    await Plan.deleteMany({});
    console.log('🗑️  Cleared existing data');

    // Seed exercises
    const savedExercises = await Exercise.insertMany(exercises);
    console.log(`💪 Seeded ${savedExercises.length} exercises`);

    // Seed admin user
    const admin = new User({
      username: 'admin',
      email: 'admin@fittrack.com',
      passwordHash: 'admin123',
      role: 'admin',
      profile: { firstName: 'Admin', lastName: 'User', goal: 'general', level: 'advanced' }
    });
    admin.generateApiKey();
    await admin.save();

    // Seed demo user
    const demo = new User({
      username: 'gavin',
      email: 'gavin@fittrack.com',
      passwordHash: 'demo123',
      profile: { firstName: 'Gavin', lastName: 'Minni', goal: 'hypertrophy', level: 'intermediate' }
    });
    demo.generateApiKey();
    await demo.save();
    console.log('👤 Seeded admin + demo user');
    console.log(`🔑 Admin API Key: ${admin.apiKey}`);
    console.log(`🔑 Demo API Key:  ${demo.apiKey}`);

    // Seed sample workouts for demo user
    const chest = savedExercises.find(e => e.name === 'Barbell Bench Press');
    const incline = savedExercises.find(e => e.name === 'Incline Dumbbell Press');
    const fly = savedExercises.find(e => e.name === 'Cable Fly');
    const ohp = savedExercises.find(e => e.name === 'Overhead Press');
    const lat = savedExercises.find(e => e.name === 'Lateral Raise');
    const tri = savedExercises.find(e => e.name === 'Tricep Pushdown');
    const pullup = savedExercises.find(e => e.name === 'Pull-Up / Chin-Up');
    const row = savedExercises.find(e => e.name === 'Barbell Row');
    const curl = savedExercises.find(e => e.name === 'Barbell Curl');
    const squat = savedExercises.find(e => e.name === 'Barbell Squat');
    const rdl = savedExercises.find(e => e.name === 'Romanian Deadlift');
    const plank = savedExercises.find(e => e.name === 'Plank');

    await Workout.insertMany([
      {
        user: demo._id, name: 'Push Day A', goal: 'hypertrophy',
        date: new Date(Date.now() - 2 * 86400000), duration: 60, grade: 'A', score: 88,
        exercises: [
          { exercise: chest._id, sets: 4, reps: 6, weightLbs: 185 },
          { exercise: incline._id, sets: 3, reps: 10, weightLbs: 65 },
          { exercise: fly._id, sets: 3, reps: 12, weightLbs: 30 },
          { exercise: ohp._id, sets: 3, reps: 8, weightLbs: 115 },
          { exercise: lat._id, sets: 4, reps: 15, weightLbs: 20 },
          { exercise: tri._id, sets: 3, reps: 12, weightLbs: 50 },
        ]
      },
      {
        user: demo._id, name: 'Pull Day A', goal: 'hypertrophy',
        date: new Date(Date.now() - 4 * 86400000), duration: 55, grade: 'A-', score: 82,
        exercises: [
          { exercise: pullup._id, sets: 4, reps: 8, weightLbs: 0 },
          { exercise: row._id, sets: 4, reps: 8, weightLbs: 155 },
          { exercise: curl._id, sets: 3, reps: 10, weightLbs: 70 },
        ]
      },
      {
        user: demo._id, name: 'Leg Day A', goal: 'strength',
        date: new Date(Date.now() - 6 * 86400000), duration: 70, grade: 'B+', score: 76,
        exercises: [
          { exercise: squat._id, sets: 4, reps: 5, weightLbs: 225 },
          { exercise: rdl._id, sets: 3, reps: 8, weightLbs: 185 },
          { exercise: plank._id, sets: 3, reps: 45, weightLbs: 0 },
        ]
      }
    ]);
    console.log('🏋️  Seeded 3 sample workouts');

    // Seed a sample plan
    await Plan.create({
      user: demo._id,
      name: '3-Day Push/Pull/Legs',
      goal: 'hypertrophy',
      level: 'intermediate',
      daysPerWeek: 3,
      notes: 'Classic PPL for muscle growth. Rest at least 48hrs between sessions.',
      days: [
        { dayNumber: 1, name: 'Push', exercises: [
          { exercise: chest._id, sets: 4, reps: 6 },
          { exercise: incline._id, sets: 3, reps: 10 },
          { exercise: ohp._id, sets: 3, reps: 8 },
          { exercise: lat._id, sets: 4, reps: 15 },
          { exercise: tri._id, sets: 3, reps: 12 },
        ]},
        { dayNumber: 2, name: 'Pull', exercises: [
          { exercise: pullup._id, sets: 4, reps: 8 },
          { exercise: row._id, sets: 4, reps: 8 },
          { exercise: curl._id, sets: 3, reps: 10 },
        ]},
        { dayNumber: 3, name: 'Legs', exercises: [
          { exercise: squat._id, sets: 4, reps: 6 },
          { exercise: rdl._id, sets: 3, reps: 10 },
          { exercise: plank._id, sets: 3, reps: 45 },
        ]},
      ]
    });
    console.log('📋 Seeded 1 sample plan');
    console.log('\n✅ Seed complete!');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('Login:  admin / admin123  (admin)');
    console.log('Login:  gavin / demo123   (user)');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    process.exit(0);
  } catch (err) {
    console.error('❌ Seed error:', err);
    process.exit(1);
  }
}

seed();
