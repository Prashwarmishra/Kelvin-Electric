const mongoose = require("mongoose");

const preorderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    color: {
      type: String,
      required: true,
    },
    shippingCity: {
      type: String,
      required: true,
    },
    shippingDealershipName: {
      type: String,
      required: true,
    },
    shippingAddress: {
      type: String,
      required: true,
    },
    shippingLandmark: {
      type: String,
      required: true,
    },
    payment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Payment",
    },
    cancelled: {
      type: Boolean,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Preorder = mongoose.model("Preorder", preorderSchema);

module.exports = Preorder;
