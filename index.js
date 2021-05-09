const express = require('express');
const session = require('express-session');
const router = require('./routes/guestbookRoutes');
const path = require('path');
const mustache = require('mustache-express');
const bodyParser = require('body-parser');
const auth = require('./auth/auth');
const passport = require('passport');
const Strategy = require('passport-local').Strategy;
const userModel = require('./models/userModel.js');
const bcrypt = require('bcrypt');

const app = express();

const public = path.join(__dirname, 'public');
console.log('public is:', public);
app.use(express.static('public'));

app.engine('mustache', mustache());
app.set('view engine', 'mustache');

app.use(express.urlencoded({ extended: false }));


app.use(session({ secret: 'dont tell anyone', resave: false,saveUninitialized: false }));
app.use(passport.initialize());
app.use(passport.session());


auth.init(app);

app.use('/', router);

app.listen(8000, () => {
    console.log('Server started on port 8000. Ctrl^c to quit.');
    console.log('Course work 2 application sucessfully launched!');
});

exports.init = function() {
   
    passport.use(new Strategy(function(username, password, cb) {userModel.lookup(username, function(err, user) {
    console.log('lookup user', username);
    
        if (err) {
            console.log('error looking up user', err);
            return cb(err);
                 } 
                    if (!user) {
                        console.log('user ', username, ' not found');
                        return cb(null, false);
                               }
    //compare provided password with that in the database
    //if true return the user object
        bcrypt.compare(password, user.password, function(err, result) {
        if (result) {
            cb(null, user);
                    } else {
                        cb(null, false);
                           }
            });
        });
    }));
    
        //req.session.passport.user
        passport.serializeUser(function(user, cb) {
            cb(null, user.user);
            });
    //req.user
        passport.deserializeUser(function(id, cb) {
            userModel.lookup(id, function(err, user) {
                if (err) {
                return cb(err);
                         }
    
                         console.log('user is:', user);
                    cb(null, user);
    });
    });
   }


   //wrapper function for convenient authentication of requests
   exports.authorize = function(redirect) {
    return passport.authenticate('local', { failureRedirect:
   redirect });
   };

