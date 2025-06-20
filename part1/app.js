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

// Set up a connection with the DogWalkService databse
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

// Route to return a list of all dogs with their size and owner's username.
app.get('/api/dogs', async (req, res) => {
    try {
        const [dogs] = await db.query('SELECT Dogs.name AS dog_name, Dogs.size, Users.username AS owner_username FROM Dogs JOIN Users On Dogs.owner_id = Users.user_id');
        res.json(dogs);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch dogs' });
    }
});

// Route to return all open walk requests, including the dog name, requested time, location, and owner's username.
app.get('/api/walkrequests/open', async (req, res) => {
    try {
        const [requests] = await db.query(`SELECT w.request_id, d.name AS dog_name, w.requested_time, w.duration_minutes, w.location, u.username AS owner_username fROM WalkRequests w JOIN Dogs d ON w.dog_id = d.dog_id JOIN Users u ON d.owner_id = u.user_id WHERE w.status = 'open'`);
        res.json(requests);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch open walk requests' });
    }
});

// Route to return a summary of each walker with their average rating and number of completed walks.
app.get('/api/walkers/summary', async (req, res) => {
    try {
        const [walkers_summary] = await db.query(`SELECT u.username AS walker_username, COUNT(req.request_id) FILTER (WHERE req.status = 'completed') AS completed_walks, COUNT(r.rating_id)`);
        res.json(walkers_summary);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch walkers summary' });
    }
});

module.exports = app;