const express = require('express');
const router = express.Router();
const auth = require('../auth/auth');
const controller = require('../controllers/guestbookControllers');
const {ensureLoggedIn} = require('connect-ensure-login'); 
const guestBook = require('../models/guestbookModel');
const user = require('../models/userModel');


router.get("/", controller.landing_page);

router.get('/guestbook', controller.entries_list);

router.get('/peter', controller.peters_entries);

router.get('/register', controller.show_register_page);

router.get('/new', ensureLoggedIn('/login'), controller.show_new_entries);

router.post('/register', controller.post_new_user); 

router.post('/register', controller.post_new_user);

router.post('/new', ensureLoggedIn('/login'), controller.post_new_entry);

router.get('/login', controller.show_login_page);

router.get('/new', controller.show_new_entries);

router.get("/logout", controller.logout);

router.post('/new', controller.post_new_entry);

router.post("/login", auth.authorize("/login"), controller.post_login);

router.get('/posts/:author', controller.show_user_entries);

router.get('/about', function(req, res) {
    res.redirect('/about.html');
})

router.use(function(req, res) {
    res.status(404);
    res.type('text/plain');
    res.send('404 Not found.');
})

router.use(function(err, req, res, next) {
    res.status(500);
    res.type('text/plain');
    res.send('Internal Server Error.');
})

module.exports = router;