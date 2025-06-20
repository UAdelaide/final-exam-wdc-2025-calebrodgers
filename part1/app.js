var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var mysql = require('mysql2/promise');

var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

let db;

(async () => {
    try{
    db = await mysql.createConnection({
        host: "localhost",
        user: 'root',
        password: '',
        database: "DogWalkService"
    });
} catch (err) {
    console.error('Error setting up database. Ensure Mysql is running: service mysql start', err);
  }
});

// db.connect((err) => {
//     if (err) {
//         process.exit(1);
//     }
// });

app.get('/', async (req, res) => {
    try {
        const result = await db.execute('SELECT * FROM Users');
        console.log(result);
        const [users] = await db.execute('SELECT * FROM Users');
        res.json(users);
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: 'Failed to fetch users' });
    }
});

module.exports = app;
