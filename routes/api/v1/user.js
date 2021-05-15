const express = require('express');
const router = express.Router();
const passport = require('passport');

const usersApi = require('../../../controllers/api/v1/users_api');
const homeController = require('../../../controllers/home_controller');

router.post('/sign-up', usersApi.signUp);
router.get('/verify-email/:id', usersApi.verifyAccount);

router.post('/sign-in', usersApi.signIn);

router.get('/auth/google', passport.authenticate('google', {scope: ['profile', 'email']}));
router.get('/auth/google/callback', passport.authenticate('google', {failureRedirect: '/api/v1/user/sign-up'}), usersApi.googleSignIn);

module.exports = router;