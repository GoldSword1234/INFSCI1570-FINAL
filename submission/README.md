# FitTrack REST API with MongoDB

This project is an Express.js application backed by MongoDB and Mongoose. It models a workout-planning system with three main resources:

- `exercises`
- `workouts`
- `plans`

The REST API supports create, read, update, and delete operations, and the app inserts starter data automatically on first launch so there is already data to test.

## Tech Stack

- Node.js
- Express.js
- MongoDB Atlas or local MongoDB
- Mongoose
- EJS
- `express-session`
- `connect-mongo`

## Setup

1. Install dependencies:

```bash
npm install
```

2. Create a `.env` file from `.env.example` and set either:

```env
MONGO_URI=mongodb+srv://USERNAME:PASSWORD@cluster.mongodb.net/fittrack
SESSION_SECRET=your-secret
PORT=3000
```

or:

```env
DB_USERNAME=your_user
DB_PASSWORD=your_password
HOST=your-cluster-host
DATABASE=fittrack
SESSION_SECRET=your-secret
PORT=3000
```

3. Start the server:

```bash
npm start
```

4. Optional: reset and repopulate the full database with the larger sample dataset:

```bash
npm run seed
```

## Starter Data

When the app starts and the database is empty, it automatically creates:

- sample exercises
- an `admin` account
- a `demo` account
- sample workouts for the demo user
- a sample training plan for the demo user

The manual seeder creates a larger exercise library and additional sample records.

## Authentication for API Requests

All `/api` routes require this header:

```http
x-api-key: YOUR_API_KEY
```

The middleware uses the API key to identify the user. User-owned resources such as workouts and plans only return records belonging to that authenticated user.

## Base URL

All endpoints below are prefixed with:

```http
/api
```

## Resource Index

### `GET /api`

Returns a JSON object that lists the main resource collection endpoints.

Response:

```json
{
  "success": true,
  "data": {
    "resources": {
      "exercises": "/api/exercises",
      "workouts": "/api/workouts",
      "plans": "/api/plans"
    }
  }
}
```

## Exercises Endpoints

### `GET /api/exercises`

Returns all exercises in the database.

Optional query parameters:

- `group`
- `type`
- `difficulty`

Example:

```http
GET /api/exercises?group=Chest&difficulty=Intermediate
```

### `GET /api/exercises/:id`

Returns one exercise by MongoDB ObjectId.

### `POST /api/exercises`

Creates a new exercise.

Example body:

```json
{
  "name": "Cable Fly",
  "group": "Chest",
  "type": "Isolation",
  "difficulty": "Beginner",
  "muscles": ["Chest"],
  "setsMin": 3,
  "setsMax": 4,
  "repsMin": 12,
  "repsMax": 15,
  "rir": 1,
  "mev": 1,
  "mrv": 5,
  "isCompound": false,
  "note": "Chest isolation exercise."
}
```

### `PUT /api/exercises/:id`

Updates an existing exercise. Any schema field may be supplied in the JSON body.

### `DELETE /api/exercises/:id`

Deletes an exercise.

## Workouts Endpoints

### `GET /api/workouts`

Returns all workouts owned by the authenticated API user.

### `GET /api/workouts/:id`

Returns one workout for the authenticated user, including populated exercise references.

### `POST /api/workouts`

Creates a new workout for the authenticated user.

Example body:

```json
{
  "name": "Push Day A",
  "goal": "hypertrophy",
  "duration": 60,
  "notes": "Weekly push session",
  "exercises": [
    {
      "exercise": "EXERCISE_OBJECT_ID",
      "sets": 4,
      "reps": 6,
      "weightLbs": 135
    },
    {
      "exercise": "EXERCISE_OBJECT_ID",
      "sets": 3,
      "reps": 12,
      "weightLbs": 45
    }
  ]
}
```

### `PUT /api/workouts/:id`

Updates an existing workout owned by the authenticated user.

### `DELETE /api/workouts/:id`

Deletes a workout owned by the authenticated user.

## Plans Endpoints

### `GET /api/plans`

Returns all plans owned by the authenticated API user.

### `GET /api/plans/:id`

Returns one plan for the authenticated user, including populated exercise references inside each day.

### `POST /api/plans`

Creates a new training plan for the authenticated user.

Example body:

```json
{
  "name": "3-Day Starter Split",
  "goal": "general fitness",
  "level": "beginner",
  "daysPerWeek": 3,
  "notes": "Simple weekly split",
  "days": [
    {
      "dayNumber": 1,
      "name": "Push",
      "exercises": [
        {
          "exercise": "EXERCISE_OBJECT_ID",
          "sets": 4,
          "reps": 6
        }
      ]
    }
  ]
}
```

### `PUT /api/plans/:id`

Updates an existing plan owned by the authenticated user.

### `DELETE /api/plans/:id`

Deletes a plan owned by the authenticated user.

## Response Codes

- `200 OK` for successful reads, updates, and deletes
- `201 Created` for successful POST requests
- `400 Bad Request` for validation errors or invalid MongoDB ObjectIds
- `401 Unauthorized` for missing or invalid API keys
- `404 Not Found` when a resource does not exist for the authenticated user
- `500 Internal Server Error` for unexpected server failures

## Example Success Response

```json
{
  "success": true,
  "count": 2,
  "data": []
}
```

## Example Error Responses

Missing API key:

```json
{
  "success": false,
  "error": "API key required"
}
```

Invalid resource id:

```json
{
  "success": false,
  "error": "Invalid workout id"
}
```

Not found:

```json
{
  "success": false,
  "error": "Workout not found"
}
```

## Testing the API

You can test the API using Postman, curl, or another REST client.

Example curl request:

```bash
curl -H "x-api-key: YOUR_API_KEY" http://localhost:3000/api/workouts
```

## Notes

- `GET /api/exercises`, `GET /api/workouts`, and `GET /api/plans` each return a JSON list of all records for that resource collection.
- `workouts` and `plans` are user-scoped through the API key.
- `exercises` are shared library records available to all authenticated users.
