const express = require('express');
const router = express.Router();

const usersApi = require('../../../controllers/api/v1/users_api');

router.post('/sign-up', usersApi.signUp);

router.get('/verify-email/:id', usersApi.verifyAccount);

module.exports = router;