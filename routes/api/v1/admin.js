const express = require('express');
const router = express.Router();

//fetch admin api
const adminApi = require('../../../controllers/api/v1/admin_api');

//router for adding a dealership
router.post('/add-dealership', adminApi.addDealership);

module.exports = router;