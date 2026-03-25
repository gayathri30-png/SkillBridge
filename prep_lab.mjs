import mysql from 'mysql2/promise';

async function run() {
  const connection = await mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'gayathri',
    database: 'skillbridge'
  });

  const [tablesResult] = await connection.query('SHOW TABLES');
  const tableKey = Object.keys(tablesResult[0])[0];
  const tables = tablesResult.map(t => t[tableKey]);

  for (const table of tables) {
    const [rows] = await connection.query(`SELECT COUNT(*) as count FROM \`${table}\``);
    if (rows[0].count === 0) {
      console.log(`Table ${table} is empty. Analyzing columns to insert a dummy record...`);
      const [cols] = await connection.query(`SHOW COLUMNS FROM \`${table}\``);
      
      let columnsToInsert = [];
      let valuesToInsert = [];
      
      for (const col of cols) {
        if (col.Extra === 'auto_increment') continue;
        columnsToInsert.push(`\`${col.Field}\``);
        
        let val;
        if (col.Type.includes('int')) val = 1;
        else if (col.Type.includes('varchar') || col.Type.includes('text') || col.Type.includes('json') || col.Type.includes('longtext')) val = "'Dummy Data'";
        else if (col.Type.includes('date') || col.Type.includes('time')) val = "NOW()";
        else if (col.Type.includes('decimal') || col.Type.includes('float')) val = 1.0;
        else if (col.Type.includes('enum')) {
            // grab the first enum value
            const match = col.Type.match(/enum\((.*)\)/);
            if (match) {
                const firstVal = match[1].split(',')[0];
                val = firstVal; // already has quotes
            } else {
                val = "'Dummy'";
            }
        }
        else val = "'1'"; // fallback
        
        if (col.Null === 'YES' && !col.Type.includes('enum')) {
            // Just insert dummy so it's not totally empty visually, but skip if complex
        }
        
        valuesToInsert.push(val);
      }
      
      try {
        const query = `INSERT INTO \`${table}\` (${columnsToInsert.join(', ')}) VALUES (${valuesToInsert.join(', ')})`;
        await connection.query(query);
        console.log(`-> Inserted dummy record into ${table}`);
      } catch (e) {
         console.log(`-> Failed to insert into ${table}: ${e.message}`);
         // fallback: just ignore, some tables have complex foreign keys (like user_id)
         // if it fails due to foreign key, we need valid IDs. 
         // Let's assume users and jobs aren't empty, so user_id=1, job_id=1 might work.
      }
    }
  }

  await connection.end();
}
run();
