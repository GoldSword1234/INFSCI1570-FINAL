const dotenv = require('dotenv');

dotenv.config();

function buildMongoUri() {
  if (process.env.MONGO_URI) {
    return process.env.MONGO_URI;
  }

  const username = process.env.DB_USERNAME;
  const password = process.env.DB_PASSWORD;
  const host = process.env.HOST;
  const database = process.env.DATABASE || 'fittrack';

  if (!username || !password || !host) {
    throw new Error('Missing MongoDB connection settings. Set MONGO_URI or DB_USERNAME, DB_PASSWORD, and HOST in your .env file.');
  }

  return `mongodb+srv://${encodeURIComponent(username)}:${encodeURIComponent(password)}@${host}/${database}?retryWrites=true&w=majority`;
}

module.exports = { buildMongoUri };
