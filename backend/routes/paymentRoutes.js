const express = require("express");

const {
  addPayment,
  getPaymentsByChallan,
} = require("../controllers/paymentController");

const router = express.Router();

router.post("/", addPayment);

router.get("/challan/:challanId", getPaymentsByChallan);

module.exports = router;
