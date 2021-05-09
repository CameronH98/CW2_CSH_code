const guestbookDAO = require('../models/guestbookModel');
const userDao = require('../models/userModel.js');
const db = new guestbookDAO();
db.init();

exports.entries_list = function(req, res) {
    res.send('<h1>Not yet implemented: show a list of guest book entries.</h1>');
    db.getAllEntries();
}

exports.show_user_entries = function(req, res) {
    console.log('filtering author name', req.params.author);

    let user = req.params.author;
    db.getEntriesByUser(user).then((entries) => {
        res.render('entries', {
            'title': 'Guest Book',
            'entries': entries
        });
    }).catch((err) => {
        console.log('error handling author posts', err);
    });
}

exports.authorize = function(redirect) {
    return passport.authenticate('local',
{ failureRedirect: redirect});
}; 

exports.post_new_user = function(req, res) {
    const user = req.body.username;
    const password = req.body.pass;
    //console.log("register user", user, "password", password);
    if (!user || !password) {
    res.send(401, 'no user or no password');
    return;
    }

    userDao.lookup(user, function(err, u) {
        if (u) {
        res.send(401, "User exists:", user);
        return;
               }
    
               userDao.create(user, password);
                          res.redirect('/login');
                        });
   }
   
   

exports.peters_entries = function(req, res) {
    res.send('<h1>Processing Peter\'s Entries, see terminal</h1>');
    db.getPetersEntries();
}

exports.landing_page = function(req, res) {


    db.getAllEntries().then((list) => {
        res.render('entries', {
            'title': 'Weekly Excersice Regime',
            'entries': list
        });
        console.log('promise resolved');
    }).catch((err) => {
        console.log('promise rejected', err);
    })
}

exports.post_new_entry = function(req, res) {
    console.log('processing post-new_entry controller');

    if (!req.body.author) {
        response.status(400).send("Entries must have an author.");
        return;
    }
    //console.log('request params is:', req.params);
    //console.log('request query is:', req.query);

    db.addEntry(req.body.author, req.body.subject, req.body.contents);
    res.redirect('/');
}

exports.post_login = function(req, res) {
    response.redirect("/");
   }; 
   

exports.show_new_entries = function(req, res) {
    res.render('newEntry', {
        'title': 'Create New Workout Plan'
    })
}

exports.show_register_page = function(req, res) {
    res.render("user/register");
   } 

exports.show_login_page = function(req, res) {
    res.render("user/login");
   };


exports.server_error = function(err, req, res, next) {
    res.status(500);
    res.type('text/plain');
    res.send('Internal Server Error.');
}

exports.show_new_entries = function(req, res) {
    res.render('newEntry', {
    'title': 'Guest Book',
    'user': req.user
    })
}

exports.show_user_entries = function(req, res) {
    let user = req.params.author;
        db.getEntriesByUser(user)
        .then((entries) => {
            res.render('entries', {
            'title': 'Guest Book',
            'user': req.user,
            'entries': entries 
        });
    })
    .catch((err) => {
    console.log('Error: ')
    console.log(JSON.stringify(err))
    });
   }

   exports.logout = function(req, res) {
    req.logout();
    res.redirect("/");
   }; 

   exports.server_error = function(err, req, res, next) {
    res.status(500);
    res.type('text/plain');
    res.send('Internal Server Error.');
}

exports.not_found = function(err, req, res, next) {
    res.status(404);
    res.type('text/plain');
    res.send('We couldnt find what you were looking for.');
}
