const path = require('path');
const express = require('express');
const app = express();
const apiRouter = require('./routers/api');
const PORT = 3000;
const cors = require('cors');
const session = require('express-session');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;

app.use(express.urlencoded({extended: true}));
app.use(express.json());
app.use(cors());

app.use(session({
    name:'sessionId',
    secret: process.env.SESSION_SECRET || 'default_session_secret', // Replace with your session secret
    resave: false,
    saveUninitialized: true,
    cookie: { 
        httpOnly: true,
        secure: true,
        sameSite: 'Strict',
        maxAge: 100000
    }
}));

// Initialize Passport
app.use(passport.initialize());
app.use(passport.session());
passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID || '232840471473-ahk4ppges7oqaklig8ql1cuqtn9fkgmn.apps.googleusercontent.com',
    clientSecret: process.env.GOOGLE_CLIENT_SECRET || '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',
    callbackURL: 'http://localhost:3000/auth/google/callback'
}, (accessToken, refreshToken, profile, done) => {
    // Handle user data, e.g., find or create user in the database
    return done(null, profile);
}));

// Serialize and deserialize user for session management
passport.serializeUser((user, done) => {
    done(null, user);
});

passport.deserializeUser((user, done) => {
    done(null, user);
});
app.use('/api', apiRouter);

app.get('/auth/google', passport.authenticate('google', {
    scope: ['profile', 'email']
}));

app.get('/auth/google/callback',
    passport.authenticate('google', { failureRedirect: '/api/login' }),
    (req, res) => {
        // Successful authentication, redirect to your desired route
        res.redirect('/api/users');
    }
);

app.get('/logout', (req, res) => {
    req.logout((err) => {
        if (err) { return next(err); }
        res.redirect('/');
    });
});

app.use('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'build', 'index.html'))
});

app.use((err, req, res, next) => {
    const defaultErr = {
        log: 'Express error handler caught unknown middleware',
        status: 500,
        message: {err: 'An error occured'}
    } 
    const errorObj = Object.assign({}, defaultErr, err);
    console.log('why its getting error:', errorObj.log)
    return res.status(errorObj.status).json(errorObj.message)
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`)
});

module.exports = app;