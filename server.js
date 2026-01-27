require('dotenv').config();
const express = require('express');
const cors = require('cors');
const contactdb = require('./contacts/database');
const bodyParser = require('body-parser');


const app = express();



app.use(cors());

const PORT = process.env.PORT || 8080;

// Serve static files from public folder
app.use(express.static('public'));
// Serve static files from public folder
app.use(express.static('public'));


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

app.use('/', require('./routes'));


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

