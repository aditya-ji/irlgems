require("dotenv").config();
const express = require('express');
const app = express();
const ejs = require('ejs');
const expressejs = require('express-ejs-layouts');
const path = require('path');
const session = require('express-session');
const PORT = process.env.PORT || 3000
const mongoose = require('mongoose');
const flash = require('express-flash');
const MongoStore = require('connect-mongo')(session);
const passport = require('passport');
const bodyParser = require('body-parser');


app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json());


// database conection
mongoose.connect(process.env.MONGODB_URI, {
}).then(() => {
  console.log("Connected to MongoDB database");
}).catch((error) => {
  console.error("Error connecting to MongoDB database:", error);
});

// session configuration and store in db

app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  store: new MongoStore({
    url: process.env.MONGODB_URI,
    dbName: 'dimond_igl', // Replace with your actual database name
    collection: 'sessions' // Optional. Replace with your preferred collection name
  }),
  cookie: {
    maxAge: 1000 * 60 * 60 * 24 * 7
  }
}));

//passport config
const passportInit = require('./app/config/passport.js');
passportInit(passport)
app.use(passport.initialize());
app.use(passport.session());






// assets path
app.use(express.static('assets'));

app.use(express.urlencoded())
app.use(flash());
// set templating engine
app.use(expressejs);
app.set('views', path.join(__dirname, '/views'));
app.set('view engine', 'ejs');

//routes
require('./routes/web')(app)
app.use((req, res) =>{
  res.status(404).send('<h1>404, Page not found</h1>')
})

app.listen(PORT, () => {
  console.log('Server is running on port http://localhost:3000/');
})