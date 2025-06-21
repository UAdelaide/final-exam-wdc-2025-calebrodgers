const express = require('express');
const path = require('path');
require('dotenv').config();
const session = require("express-session");

const app = express();

// Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, '/public')));

// Use express-session middleware
app.use(
    session({
        secret: "WDCTakeHomeExam",
        resave: false,
        saveUninitialized: true,
        cookie: { secure: false }
    })
);

// Redirect all unauthenticated users to index, and owners and walkers
// to their respective pages
app.use((req, res, next) => {
    const exposedPaths = ["/index.html", "api/users/login"];

    if (exposedPaths.includes(req.path)) {
        return next();
    }

    if (!req.session.user.user_id) {
        return res.redirect('/index.html');
    }

    if (req.session.user.role === 'owner') {
        const ownerPaths = ["/owner-dashboard.html", "api/walks", "api/users", "/api/dogs"];
        if (!ownerPaths.some((p) => req.path.startsWith(p))) {
            return res.redirect('/owner-dashboard.html');
        }
    }

    if (req.session.user.role === 'walker') {
        const walkerPaths = ["/walker-dashboard.html", "api/walks", "api/users", "/api/dogs"];
        if (!walkerPaths.some((p) => req.path.startsWith(p))) {
            return res.redirect('/walker-dashboard.html');
        }
    }

    next();
});

// Routes
const walkRoutes = require('./routes/walkRoutes');
const userRoutes = require('./routes/userRoutes');
const dogRoutes = require('./routes/dogRoutes');

app.use('/api/walks', walkRoutes);
app.use('/api/users', userRoutes);
app.use('/api/dogs', dogRoutes);

// Export the app instead of listening here
module.exports = app;