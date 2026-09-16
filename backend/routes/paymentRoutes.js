const express = require("express");

const {
  addPayment,
  getPaymentsByChallan,
} = require("../controller/paymentController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

// Protect all payment routes
router.use(protect);

router.post("/", addPayment);
router.get("/challan/:challanId", getPaymentsByChallan);

module.exports = router;
