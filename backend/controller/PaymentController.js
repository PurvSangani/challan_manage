const Payment = require("../models/Payment");
const Challan = require("../models/Challan");

// Add payment
const addPayment = async (req, res) => {
  try {
    const { challan, amount, paymentDate } = req.body;

    // Find challan
    const selectedChallan = await Challan.findById(challan);

    if (!selectedChallan) {
      return res.status(404).json({
        message: "Challan not found",
      });
    }

    const paymentAmount = Number(amount);

    if (!paymentAmount || paymentAmount <= 0) {
      return res.status(400).json({
        message: "Enter a valid payment amount",
      });
    }

    const currentPaid = Number(selectedChallan.paidAmount || 0);

    const remaining = Number(selectedChallan.amount) - currentPaid;

    // Payment cannot be greater than remaining
    if (paymentAmount > remaining) {
      return res.status(400).json({
        message: "Payment cannot be greater than remaining amount",
      });
    }

    // Create payment history
    const payment = await Payment.create({
      challan,
      amount: paymentAmount,
      paymentDate: paymentDate || new Date(),
    });

    // Update challan paid amount
    const newPaidAmount = currentPaid + paymentAmount;

    selectedChallan.paidAmount = newPaidAmount;

    // Update status
    if (newPaidAmount >= Number(selectedChallan.amount)) {
      selectedChallan.status = "Paid";
    } else {
      selectedChallan.status = "Partial";
    }

    await selectedChallan.save();

    res.status(201).json({
      message: "Payment added successfully",
      payment,
      challan: selectedChallan,
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

// Get payment history
const getPaymentsByChallan = async (req, res) => {
  try {
    const payments = await Payment.find({
      challan: req.params.challanId,
    }).sort({
      paymentDate: -1,
    });

    res.status(200).json(payments);
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

module.exports = {
  addPayment,
  getPaymentsByChallan,
};
