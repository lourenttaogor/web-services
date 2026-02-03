require('dotenv').config();
const express = require('express');
const cors = require('cors');
const contactdb = require('./contacts/database');
const bodyParser = require('body-parser');
const passport = require('passport');
const session = require('express-session');
const GithubStrategy = require('passport-github2').Strategy;
const MongoStore = require('connect-mongo').default;

const app = express();

// CORS configuration that preserves credentials for sessions
app.use(cors({
  origin: process.env.NODE_ENV === 'production'
    ? 'https://invidividual-project.onrender.com'
    : ['http://localhost:8080', 'http://127.0.0.1:8080'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'UPDATE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

const PORT = process.env.PORT || 8080;

// Serve static files from public folder
app.use(express.static('public'));

// Session configuration with MongoDB store for production
const sessionConfig = {
  secret: process.env.SESSION_SECRET || 'dev-secret-change-in-production',
  resave: false,
  saveUninitialized: false,
  store: new MongoStore({
    mongoUrl: process.env.MONGO_URL,
    dbName: process.env.MONGO_DB_NAME || 'contact-project',
    touchAfter: 24 * 3600 // Lazy session update
  }),
  cookie: {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production', // HTTPS only in production
    sameSite: 'lax',
    maxAge: 1000 * 60 * 60 * 24 * 7 // 1 week
  }
};

app.use(session(sessionConfig));

app.use(passport.initialize());
app.use(passport.session());

// Body parser
app.use(bodyParser.json());

passport.use(new GithubStrategy({
  clientID: process.env.GITHUB_CLIENT_ID,
  clientSecret: process.env.GITHUB_CLIENT_SECRET,
  callbackURL: process.env.CALLBACK_URL
},
  function (accessToken, refreshToken, profile, done) {
    return done(null, profile);
  }
));

passport.serializeUser((user, done) => {
  done(null, user);
});
passport.deserializeUser((user, done) => {
  done(null, user);
});

app.get('/', (res, req) => {
  res.send(req.session.user !== undefined ? `Logged in as ${req.session.user.professionalName}` : 'Logged out')
})

app.get('/github/callback', passport.authenticate('github', {
  failureRedirect: '/login-page',
  session: true
}),
  (req, res) => {
    // Store user info in session
    req.session.user = {
      id: req.user.id,
      displayName: req.user.displayName,
      username: req.user.username,
      photos: req.user.photos,
      profileUrl: req.user.profileUrl,
      authType: 'github'
    };
    res.redirect('/subscriptions');
  })

app.use('/', require('./routes/index.js'));


contactdb.initdb((err) => {
  if (err) {
    console.log(err)
  } else {
    app.listen(PORT, () => {
      console.log(`Database is connected, node is running at ${PORT}`);
      console.log(`Available endpoints:`);
      console.log(`  GET /professional`);
      console.log(`  GET /contacts`);
      console.log(`  GET /users`);
      console.log(`  GET /subscriptions`);
    })
  }
})

