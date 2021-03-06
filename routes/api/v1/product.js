const express = require("express");
const router = express.Router();
const passport = require("passport");

//fetch admin api
const productApi = require("../../../controllers/api/v1/product_api");

//router for adding a dealership
router.get("/locate-dealerships", productApi.locateDealerships);

//router for booking a testride
router.post(
  "/testride",
  passport.authenticate("jwt", { session: "false" }),
  productApi.testride
);

//router for cancelling a testride
router.get("/testride-cancellation/:id", productApi.cancelTestride);

//router for collecting payments
router.post("/payment", productApi.payment);

//router for verifying payments
router.post("/payment-verification", productApi.paymentVerification);

//router for preordering the product
router.post(
  "/preorder",
  passport.authenticate("jwt", { session: "false" }),
  productApi.preorder
);

//router for cancelling the product
router.get(
  "/cancel-order/:id",
  passport.authenticate("jwt", { session: "false" }),
  productApi.cancelOrder
);

module.exports = router;
