const express = require('express');
const router = express.Router();

//fetch admin api
const productApi = require('../../../controllers/api/v1/product_api');

//router for adding a dealership
router.get('/locate-dealerships', productApi.locateDealerships);

module.exports = router;