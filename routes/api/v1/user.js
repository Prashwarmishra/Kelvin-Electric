const express = require('express');
const router = express.Router();

const usersApi = require('../../../controllers/api/v1/users_api');

router.get('/sign-up', usersApi.signUp);

module.exports = router;