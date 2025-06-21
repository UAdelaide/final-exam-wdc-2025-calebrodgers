const express = require('express');
const path = require('path');
require('dotenv').config();
const session = require("express-session");

const app = express();

// Middleware
app.use(express.json());

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
// to their respective dashboards
app.use((req, res, next) => {
    // Allow allrequests to exposed paths through
    const exposedPaths = ["/index.html", "/api/users/login", "/api/dogs"];

    if (exposedPaths.includes(req.path)) {
        return next();
    }


    // Redirect all other requests by unauthenticated users to index.html
    if (!req.session.user) {
        return res.redirect('/index.html');
    }

    // Redirect all requests from owners that are not API calls or requests for the owner-dashboard
    // to the owner-dashboard
    if (req.session.user.role === 'owner') {
        const ownerPaths = ["/owner-dashboard.html", "/api/walks", "/api/users", "/api/dogs"];
        if (!ownerPaths.some((p) => req.path.startsWith(p))) {
            return res.redirect('/owner-dashboard.html');
        }
    }

    // Redirect all requests from walkers that are not API calls or requests for the
    // walker-dashboard to the walker-dashboard
    if (req.session.user.role === 'walker') {
        const walkerPaths = ["/walker-dashboard.html", "/api/walks", "/api/users", "/api/dogs"];
        if (!walkerPaths.some((p) => req.path.startsWith(p))) {
            return res.redirect('/walker-dashboard.html');
        }
    }

    return next();
});

app.use(express.static(path.join(__dirname, '/public')));

// Routes
const walkRoutes = require('./routes/walkRoutes');
const userRoutes = require('./routes/userRoutes');
const dogRoutes = require('./routes/dogRoutes');

app.use('/api/walks', walkRoutes);
app.use('/api/users', userRoutes);
app.use('/api/dogs', dogRoutes);

// Export the app instead of listening here
module.exports = app;
