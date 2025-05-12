require('dotenv').config();
const express = require('express');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const jwt = require('jsonwebtoken');
const cors = require('cors');

const app = express();

// Middleware
app.use(cors({ origin: 'http://localhost:3000', credentials: true }));
app.use(passport.initialize());

// JWT Verification Middleware
const verifyToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

  if (!token) {
    return res.status(401).json({ message: 'No token provided' });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ message: 'Invalid or expired token' });
    }
    req.user = user;
    next();
  });
};

// Passport Google Strategy
passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: 'http://localhost:5000/auth/google/callback',
}, (accessToken, refreshToken, profile, done) => {
  console.log('Google Profile:', profile); // Debug
  if (!profile.emails || !profile.emails.length) {
    return done(new Error('No email provided by Google'));
  }
  const user = {
    googleId: profile.id,
    displayName: profile.displayName,
    email: profile.emails[0].value,
  };
  return done(null, user);
}));

// Routes
app.get('/auth/google', passport.authenticate('google', {
  scope: ['profile', 'email'],
  session: false,
}));

app.get('/auth/google/callback', 
  passport.authenticate('google', { session: false, failureRedirect: '/' }),
  (req, res) => {
    // Generate JWT with flattened payload
    const token = jwt.sign(
      req.user,
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );
    console.log('Generated JWT:', token); // Debug
    res.redirect(`http://localhost:3000/dashboard?token=${token}`);
  }
);

app.get('/api/user', verifyToken, (req, res) => {
  console.log('User in /api/user:', req.user); // Debug
  res.json(req.user);
});

app.get('/logout', (req, res) => {
  res.redirect('http://localhost:3000');
});

app.listen(5000, () => console.log('Backend running on http://localhost:5000'));