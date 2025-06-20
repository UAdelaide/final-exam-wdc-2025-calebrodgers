var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

const db = mysql.createConnection({
    host: "localhost",
    database: "DogWalkService"
});

db.connect((err) => {
    if (err) {
        process.exit(1);
    }
});

app.get('/', async (req, res) => {
    try {
        const [users] = await db.execute('SELECT * FROM Users');
        res.json(uers);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch users' });
    }
});

module.exports = app;
