const { Client } = require('pg');
const fs = require('fs');

async function run() {
  const client = new Client({
    connectionString: "postgresql://postgres.lfyizvwmssgdeshvklzp:ajKVZSwfNBglmLO4@aws-1-ap-northeast-1.pooler.supabase.com:6543/postgres?pgbouncer=true"
  });

  await client.connect();
  const sql = fs.readFileSync('database/life_tips.sql', 'utf8');
  
  try {
    await client.query(sql);
    console.log("SQL executed successfully!");
  } catch (e) {
    console.error("Error executing SQL:", e);
  } finally {
    await client.end();
  }
}

run();
