const express = require('express');
const passport = require('passport');
const router = express.Router();
const User =  require('../controllers/users');
const wrapAsync = require('../utils/wrapAsync');

router.route('/register')
.get(User.renderRegisterForm)
.post(wrapAsync(User.registerUser));

router.route('/login')
.get(User.renderLoginForm)
.post(passport.authenticate('local',{failureFlash:true,failureRedirect:'/login'}),User.loggedInUser);

router.get('/logout',User.loggedOutUser);

module.exports = router;