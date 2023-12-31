require('dotenv').config()
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const nodemailer = require('nodemailer');
const cookie = require('cookie-parser');
const db = require('./config/mongoose');
const bodyParser = require('body-parser');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const passport = require('passport');
const passportLocal = require('./config/passport-local-streegy');
const passportGoogle = require('./config/passport-google-oauth2-strategy');
const app = express();
const port = process.env.PORT || 4000;


app.use(cors());
const corsOptions = {
    origin: [process.env.CORS_URL, process.env.CORS_URL1],  // Allow only requests from this domain
    optionsSuccessStatus: 200 // Some legacy browsers (IE11, various SmartTVs) choke on 204
};
app.use(cors(corsOptions));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookie());// Use cookie-parser middleware


// setup the chat server to be used with socket.io
const chatServer = require('http').createServer(app);
const chatSockets = require('./config/socket').chatSockets(chatServer);
chatServer.listen(5000);
console.log('chat server is listening on port 5000');


// Initialize Passport and session middleware
app.use(
    session({
        name: 'Alston',
        secret: process.env.SESSION_SECRET,
        saveUninitialized: false,
        resave: false,
        cookie: {
            maxAge: (1000 * 60 * 100)
        },

        store: MongoStore.create({
            mongoUrl: process.env.MONGO_URL,
            autoRemove: 'disabled'
        },
            (err) => {
                console.log(err || 'connect-mongo setup ok')
            }
        )
    })
);
app.use(passport.initialize());
app.use(passport.session());
app.use(passport.setAuthenticatedUser);

// Set routes
app.use('/user', require('./routes/user'));
app.use('/', require('./routes/home'));
app.use('/toggle', require('./routes/post'));

//Set Server
app.listen(port, (err) => {
    if (err) {
        console.log('Error in server run:', err);
        return;
    }
    console.log('Server run successful for port', port);
});
