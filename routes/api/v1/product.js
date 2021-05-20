const express = require('express');
const router = express.Router();
const passport = require('passport');

//fetch admin api
const productApi = require('../../../controllers/api/v1/product_api');

//router for adding a dealership
router.get('/locate-dealerships', productApi.locateDealerships);

//router for booking a testride
router.post('/testride', passport.authenticate('jwt', {session: 'false'}), productApi.testride);

module.exports = router;