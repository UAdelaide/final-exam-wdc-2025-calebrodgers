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
    const exposedPaths = ["/", "api/users/login"];
    if (!req.session.user && !exposedPaths.includes(req.path)) {
        return res.redirect('index.html');
    }

    const ownerPaths = ["/owner-dashboard.html", "api"];

    if (req.session.user.role === 'owner' && !ownerPaths) {
        return res.redirect('/owner-dashboard.html')
    }

});

// Routes
const walkRoutes = require('./routes/walkRoutes');
const userRoutes = require('./routes/userRoutes');

app.use('/api/walks', walkRoutes);
app.use('/api/users', userRoutes);

// Export the app instead of listening here
module.exports = app;