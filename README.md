# FitTrack — Workout Builder & Grading App

> **INFSCI 1570 Final Project** | University of Pittsburgh  
> Team: gminni26

---

## Overview

FitTrack is a full-stack workout planning and analysis application. Users can log workouts, build training plans, and receive a data-driven grade (A+ through D) on their workout quality based on volume, rep range alignment, muscle group balance, intensity, and more.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Runtime | Node.js |
| Framework | Express.js |
| Templating | EJS |
| Database | MongoDB Atlas + Mongoose |
| Auth | bcryptjs + express-session |
| Styling | Vanilla CSS (responsive) |
| Charts | Chart.js |

---

## Setup Instructions

### 1. Clone the repo
```bash
git clone https://github.com/gminni26/INFSCI1570-FINAL.git
cd INFSCI1570-FINAL
```

### 2. Install dependencies
```bash
npm install
```

### 3. Configure environment
```bash
cp .env.example .env
```
Edit `.env` and add your MongoDB Atlas connection string:
```
MONGO_URI=mongodb+srv://USERNAME:PASSWORD@cluster0.xxxxx.mongodb.net/fittrack
SESSION_SECRET=your_secret_here
PORT=3000
```

### 4. Seed the database
```bash
npm run seed
```
This creates:
- 45+ exercises in the library
- Admin account: `admin` / `admin123`
- Demo account: `gavin` / `demo123`
- 3 sample workouts and 1 sample plan

### 5. Start the app
```bash
npm run dev    # development (nodemon)
npm start      # production
```
Visit: **http://localhost:3000**

---

## Project Structure

```
fittrack/
├── models/
│   ├── User.js          # User schema (auth, API key, profile)
│   ├── Exercise.js      # Exercise schema (MEV, MRV, RIR, muscles)
│   ├── Workout.js       # Workout schema (exercises, grade, score)
│   └── Plan.js          # Plan schema (multi-day, goals)
├── controllers/
│   ├── authController.js
│   ├── workoutController.js
│   ├── planController.js
│   └── adminController.js
├── routes/
│   ├── index.js         # Landing + dashboard
│   ├── auth.js          # Signup / login / logout
│   ├── workouts.js      # Workout CRUD
│   ├── plans.js         # Plan CRUD
│   ├── exercises.js     # Exercise library
│   ├── admin.js         # Admin panel
│   └── api/
│       └── index.js     # REST API (API key protected)
├── middleware/
│   ├── authMiddleware.js    # requireLogin, requireAdmin
│   └── apiKeyMiddleware.js  # requireApiKey
├── views/               # EJS templates
├── public/              # Static CSS + JS
├── seed.js              # Database seeder
├── app.js               # Entry point
└── .env.example
```

---

## REST API Documentation

All API routes are prefixed with `/api` and require the header:
```
x-api-key: YOUR_API_KEY
```
Your API key is shown on your profile page after signing up.

---

### Exercises

#### `GET /api/exercises`
Returns all exercises. Optional query params: `group`, `type`, `difficulty`

**Example:**
```
GET /api/exercises?group=Chest&difficulty=Beginner
```

**Response:**
```json
{
  "success": true,
  "count": 3,
  "data": [
    {
      "_id": "...",
      "name": "Barbell Bench Press",
      "group": "Chest",
      "type": "Compound",
      "difficulty": "Intermediate",
      "muscles": ["Chest", "Triceps", "Front Delts"],
      "setsMin": 3, "setsMax": 5,
      "repsMin": 4, "repsMax": 8,
      "rir": 2, "mev": 2, "mrv": 8
    }
  ]
}
```

#### `GET /api/exercises/:id`
Returns a single exercise by ID.

**Response 404:**
```json
{ "success": false, "error": "Exercise not found" }
```

#### `POST /api/exercises`
Creates a new exercise.

**Request body:**
```json
{
  "name": "Cable Fly",
  "group": "Chest",
  "type": "Isolation",
  "difficulty": "Beginner",
  "muscles": ["Chest"],
  "setsMin": 3, "setsMax": 4,
  "repsMin": 12, "repsMax": 15,
  "rir": 1, "mev": 1, "mrv": 5,
  "isCompound": false,
  "note": "Great finishing movement."
}
```

**Response:** `201 Created` with created exercise object.

#### `PUT /api/exercises/:id`
Updates an exercise by ID.

**Request body:** Any fields to update.

**Response:** Updated exercise object.

#### `DELETE /api/exercises/:id`
Deletes an exercise by ID.

**Response:**
```json
{ "success": true, "message": "Exercise deleted" }
```

---

### Workouts

#### `GET /api/workouts`
Returns all workouts for the authenticated user (via API key).

#### `GET /api/workouts/:id`
Returns a single workout with populated exercise data.

#### `POST /api/workouts`
Creates a new workout.

**Request body:**
```json
{
  "name": "Push Day A",
  "goal": "hypertrophy",
  "duration": 60,
  "notes": "Felt strong today",
  "exercises": [
    { "exercise": "<exercise_id>", "sets": 4, "reps": 6, "weightLbs": 185 },
    { "exercise": "<exercise_id>", "sets": 3, "reps": 10, "weightLbs": 65 }
  ]
}
```

#### `PUT /api/workouts/:id`
Updates a workout's metadata (name, goal, duration, notes).

#### `DELETE /api/workouts/:id`
Deletes a workout.

---

### Plans

#### `GET /api/plans`
Returns all plans for the authenticated user.

#### `GET /api/plans/:id`
Returns a single plan by ID.

#### `POST /api/plans`
Creates a new training plan.

**Request body:**
```json
{
  "name": "3-Day PPL",
  "goal": "hypertrophy",
  "level": "intermediate",
  "daysPerWeek": 3,
  "notes": "Classic push/pull/legs split"
}
```

#### `PUT /api/plans/:id`
Updates a plan.

#### `DELETE /api/plans/:id`
Deletes a plan.

---

## HTTP Response Codes

| Code | Meaning |
|---|---|
| `200` | OK — request succeeded |
| `201` | Created — resource created successfully |
| `400` | Bad Request — validation error or missing fields |
| `401` | Unauthorized — missing API key |
| `403` | Forbidden — invalid API key or insufficient permissions |
| `404` | Not Found — resource doesn't exist |
| `500` | Server Error — something went wrong on the server |

---

## User Roles

| Role | Access |
|---|---|
| `user` | Own workouts, plans, exercises library |
| `admin` | All of the above + manage all users and exercises via `/admin` |

---

## Testing the API with Postman

1. Download [Postman](https://www.postman.com/downloads/)
2. Run `npm run seed` to get your API key (printed in terminal)
3. Create a new request, set the URL to `http://localhost:3000/api/exercises`
4. Under **Headers**, add: `x-api-key` → `<your key>`
5. Hit **Send**

---

## Contributors

| Name | Pitt ID | Role |
|---|---|---|
| Gavin Minni | gminni26 | Project Lead / Full Stack |
| Teammate 2 | — | Backend / Database |
| Teammate 3 | — | Frontend / Views |
| Teammate 4 | — | JS / Charts / Design |
