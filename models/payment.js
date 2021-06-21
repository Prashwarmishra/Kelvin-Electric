const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema(
  {
    email: {
      type: "String",
      required: true,
    },
    contact: {
      type: "String",
      required: true,
    },
    orderId: {
      type: "String",
      required: true,
    },
    paymentId: {
      type: "String",
      required: true,
    },
    amount: {
      type: "String",
      required: true,
    },
    amountRefunded: {
      type: "String",
      required: true,
    },
    method: {
      type: "String",
      required: true,
    },
    fee: {
      type: "String",
      required: true,
    },
    tax: {
      type: "String",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Payment = mongoose.model("Payment", paymentSchema);
module.exports = Payment;
