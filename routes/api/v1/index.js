const express = require('express');
const router = express.Router();

//manage route for /user
router.use('/user', require('./user'));

//manage route for admin
router.use('/admin', require('./admin'));

//manage route for product
router.use('/product', require('./product'));

//manage route for order
router.use('/order', require('./order'));

module.exports = router;