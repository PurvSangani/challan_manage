const Challan = require("../models/Challan");
const Party = require("../models/Party");

const addChallan = async (req, res) => {
  try {
    const { challanNo, party, challanDate, amount, paidAmount } = req.body;

    // Find selected party
    const selectedParty = await Party.findById(party);

    if (!selectedParty) {
      return res.status(404).json({
        message: "Party not found",
      });
    }

    // Calculate due date
    const dueDate = new Date(challanDate);

    dueDate.setDate(dueDate.getDate() + Number(selectedParty.paymentDays));

    // Calculate payment status
    let paymentStatus = "Pending";

    if (Number(paidAmount) >= Number(amount)) {
      paymentStatus = "Paid";
    } else if (Number(paidAmount) > 0) {
      paymentStatus = "Partial";
    }

    // Create challan
    const newChallan = await Challan.create({
      challanNo,
      party,
      challanDate,
      amount: Number(amount),
      paidAmount: Number(paidAmount) || 0,
      dueDate,
      status: paymentStatus,
    });

    res.status(201).json({
      message: "Challan added successfully",
      challan: newChallan,
    });
  } catch (error) {
    console.log("ADD CHALLAN ERROR:", error);

    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

const getChallans = async (req, res) => {
  try {
    const challans = await Challan.find()
      .populate("party")
      .sort({ createdAt: -1 });

    res.status(200).json(challans);
  } catch (error) {
    console.log("========== ADD CHALLAN ERROR ==========");
    console.log(error);
    console.log("=======================================");

    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

const getChallanById = async (req, res) => {
  try {
    const challan = await Challan.findById(req.params.id).populate("party");

    if (!challan) {
      return res.status(404).json({
        message: "Challan not found",
      });
    }

    res.status(200).json(challan);
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

const updateChallan = async (req, res) => {
  try {
    const challan = await Challan.findById(req.params.id);

    if (!challan) {
      return res.status(404).json({
        message: "Challan not found"
      });
    }

    const {
      challanNo,
      challanDate,
      amount,
      paidAmount
    } = req.body;

    const newAmount =
      amount !== undefined
        ? Number(amount)
        : challan.amount;

    const newPaidAmount =
      paidAmount !== undefined
        ? Number(paidAmount)
        : challan.paidAmount;

    if (newPaidAmount > newAmount) {
      return res.status(400).json({
        message:
          "Paid amount cannot be greater than challan amount"
      });
    }

    // Get party
    const selectedParty =
      await Party.findById(challan.party);

    if (!selectedParty) {
      return res.status(404).json({
        message: "Party not found"
      });
    }

    // Calculate new due date
    const newChallanDate =
      challanDate || challan.challanDate;

    const dueDate = new Date(newChallanDate);

    dueDate.setDate(
      dueDate.getDate() +
      Number(selectedParty.paymentDays)
    );

    // Calculate status
    let paymentStatus = "Pending";

    if (newPaidAmount >= newAmount) {
      paymentStatus = "Paid";
    } else if (newPaidAmount > 0) {
      paymentStatus = "Partial";
    }

    challan.challanNo =
      challanNo || challan.challanNo;

    challan.challanDate =
      newChallanDate;

    challan.amount =
      newAmount;

    challan.paidAmount =
      newPaidAmount;

    challan.dueDate =
      dueDate;

    challan.status =
      paymentStatus;

    await challan.save();

    res.status(200).json({
      message: "Challan updated successfully",
      challan
    });

  } catch (error) {
    console.log("UPDATE CHALLAN ERROR:", error);

    res.status(500).json({
      message: "Server error",
      error: error.message
    });
  }
};

const deleteChallan = async (req, res) => {
  try {
    const challan = await Challan.findByIdAndDelete(req.params.id);

    if (!challan) {
      return res.status(404).json({
        message: "Challan not found",
      });
    }

    res.status(200).json({
      message: "Challan deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};
module.exports = {
  addChallan,
  getChallans,
  getChallanById,
  updateChallan,
  deleteChallan,
};
