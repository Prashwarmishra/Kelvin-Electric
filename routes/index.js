const express = require('express');
const router = express.Router();

const homeController = require('../controllers/home_controller');

router.get('/', homeController.home);

router.get('/ping', homeController.ping);

//manage route for api calls
router.use('/api', require('./api'));

module.exports = router;