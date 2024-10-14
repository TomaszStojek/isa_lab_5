const mysql = require('mysql2');const mysql = require('mysql');

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

// we will host on the sam server as the band end so host should be fine
// default user is root
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'password',
  database: 'my_database'
});

connection.query('SELECT * FROM users', function (error, results, fields) {
  if (error) throw error;
  console.log(results);
});

connection.end();
