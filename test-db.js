require('dotenv').config({ path: '.env.local' });
const { Client } = require('pg');

const url = process.env.DATABASE_URL;
console.log('DATABASE_URL set:', !!url);
console.log('URL preview:', url ? url.replace(/:([^:@]+)@/, ':***@') : 'MISSING');

if (!url || url.includes('your_user')) {
  console.error('\nERROR: DATABASE_URL still has placeholder values.');
  console.error('Please update .env.local with your real Neon connection string.');
  process.exit(1);
}

const client = new Client({
  connectionString: url,
  ssl: { rejectUnauthorized: false },
});

client.connect()
  .then(() => {
    console.log('\n✅ Connected to Neon DB successfully!');
    return client.query("SELECT version()");
  })
  .then(res => {
    console.log('PostgreSQL version:', res.rows[0].version);
    return client.end();
  })
  .catch(err => {
    console.error('\n❌ Connection failed:', err.message);
    process.exit(1);
  });
