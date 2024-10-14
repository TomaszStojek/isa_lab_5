const mysql = require('mysql2');

// CREATE TABLE patients (
//     patientid INT(11) AUTO_INCREMENT PRIMARY KEY,
//     name VARCHAR(100),
//     dateOfBirth DATETIME
// );

// INSERT INTO patients (name, dateOfBirth)
// VALUES 
// ('Sara Brown', '1901-01-01'),
// ('John Smith', '1941-01-01'),
// ('Jack Ma', '1961-01-30'),
// ('Elon Musk', '1999-01-01');

// Setup MySQL connection
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'abc123',
  database: 'my_database'
});

// Create the table (you can comment this part after the table is created)
connection.query(`
  CREATE TABLE IF NOT EXISTS patients (
    patientid INT(11) AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100),
    dateOfBirth DATETIME
  )
`, function (error, results, fields) {
  if (error) throw error;
  console.log('Table created or already exists.');
});

// Insert data into the table (comment after the first run if needed)
connection.query(`
  INSERT INTO patients (name, dateOfBirth)
  VALUES 
    ('Sara Brown', '1901-01-01'),
    ('John Smith', '1941-01-01'),
    ('Jack Ma', '1961-01-30'),
    ('Elon Musk', '1999-01-01')
`, function (error, results, fields) {
  if (error) throw error;
  console.log('Data inserted into patients table.');
});

// Query the data from the table
connection.query('SELECT * FROM patients', function (error, results, fields) {
  if (error) throw error;
  console.log(results);  // Display the retrieved data
});

// End the connection
connection.end();
