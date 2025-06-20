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
    try {
        db = await mysql.createConnection({
            host: 'localhost',
            user: 'root',
            password: '',
            database: 'DogWalkService'
        });
    } catch (err) {
        console.error('Error connecting to database', err);
    }
})();

app.get('/api/dogs', async (req, res) => {
    try {
        const [dogs] = await db.query('SELECT * FROM Dogs');
        res.json(dogs);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch dogs' });
    }
});

module.exports = app;
