const express = require('express');
const router = express.Router();
const passport = require('passport');

//fetch order api
const preorderApi = require('../../../controllers/api/v1/preorder_api');

router.get('/view-orders', passport.authenticate('jwt', {session: 'false'} ), preorderApi.viewOrders);

module.exports = router;