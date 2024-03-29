require('dotenv').config()
const express = require('express')
const app = express()
const db = require('./db')
const bodyParser = require('body-parser')
const cors          = require("cors")
const session       = require('express-session');
const MongoStore    = require('connect-mongo')(session);
const passport      = require("passport");
const LocalStrategy = require("passport-local");
const passportLocalMongoose = require("passport-local-mongoose");

const User = require('./models/user');

app.set("view engine","ejs")

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(express.static('public'));
app.use(cors({origin:true}))

app.use(session({
    secret : process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
	store : new MongoStore({ mongooseConnection: db })
}));

app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
const routes = require('./routes')
app.use(routes)

module.exports = app