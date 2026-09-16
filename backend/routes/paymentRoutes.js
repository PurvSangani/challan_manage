const express = require("express");

const {
  addPayment,
  getPaymentsByChallan,
} = require("../controller/PaymentController.js");

const router = express.Router();

router.post("/", addPayment);

router.get("/challan/:challanId", getPaymentsByChallan);

module.exports = router;
