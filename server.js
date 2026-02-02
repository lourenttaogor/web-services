require('dotenv').config();
const express = require('express');
const cors = require('cors');
const contactdb = require('./contacts/database');
const bodyParser = require('body-parser');
const passport = require('passport');
const session = require('express-session');
const GithubStrategy = require('passport-github2').Strategy;


const app = express();



app.use(cors({methods: ['GET, POST, PUT, DELETE, UPDATE, PATCH']}));
app.use(cors({origin: '*'}))

const PORT = process.env.PORT || 8080;

// Serve static files from public folder
app.use(express.static('public'));
// Serve static files from public folder
app.use(express.static('public'));

app.use(session({
  secret: 'secret',
  resave: false,
  saveUninitialized: true
}));

app.use(passport.initialize());
app.use(passport.session());


// Use routes
app.use(bodyParser.json());
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'Origin, X-requested-With, Content-Type, Accept, z-key'
  );
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  next();
})

app.use(bodyParser.json());
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'Origin, X-requested-With, Content-Type, Accept, z-key'
  );
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  next();
});

passport.use(new GithubStrategy({
  clientID: process.env.GITHUB_CLIENT_ID,
  clientSecret: process.env.GITHUB_CLIENT_SECRET,
  callbackURL: process.env.CALLBACK_URL
},
function(accessToken, refreshToken, profile, done) {
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
  failureRedirect: '/api-docs', session: false}),
  (req, res) => {
      req.session.user = req.user;
      res.redirect('/');
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

