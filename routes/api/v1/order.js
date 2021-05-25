const express = require('express');
const router = express.Router();
const passport = require('passport');

//fetch order api
const preorderApi = require('../../../controllers/api/v1/preorder_api');

//router for viewing user orders
router.get('/view-orders', passport.authenticate('jwt', {session: 'false'} ), preorderApi.viewOrders);

//router for cancelling user orders
router.get('/cancel-order/:id', passport.authenticate('jwt', {session: 'false'} ), preorderApi.cancelOrders);

module.exports = router;