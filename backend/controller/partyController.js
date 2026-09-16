const Party = require("../models/Party");
const Challan = require("../models/Challan");
const Payment = require("../models/Payment");

// Add Party
const addParty = async (req, res) => {
  try {
    const { name, whatsapp, paymentDays } = req.body;

    const existingParty = await Party.findOne({
      user: req.user._id,
      whatsapp,
    });

    if (existingParty) {
      return res.status(400).json({
        message: "Party with this WhatsApp number already exists",
      });
    }

    const party = await Party.create({
      user: req.user._id,
      name,
      whatsapp,
      paymentDays: paymentDays ? Number(paymentDays) : 30,
    });

    res.status(201).json({
      message: "Party added successfully",
      party,
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({
        message: "Party with this WhatsApp number already exists",
      });
    }
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

// Get All Parties for Logged-In User
const getParty = async (req, res) => {
  try {
    const parties = await Party.find({ user: req.user._id }).sort({ name: 1 });
    res.status(200).json(parties);
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

// Get Party By ID
const getPartyById = async (req, res) => {
  try {
    const party = await Party.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!party) {
      return res.status(404).json({
        message: "Party not found",
      });
    }

    const challans = await Challan.find({
      party: req.params.id,
      user: req.user._id,
    }).sort({
      challanDate: -1,
    });

    res.status(200).json({
      party,
      challans,
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

// Update Party
const updateParty = async (req, res) => {
  try {
    const { name, whatsapp, paymentDays } = req.body;
    const party = await Party.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!party) {
      return res.status(404).json({
        message: "Party not found",
      });
    }

    // Check if WhatsApp changed and belongs to another party of the same user
    if (whatsapp && whatsapp !== party.whatsapp) {
      const existingParty = await Party.findOne({
        user: req.user._id,
        whatsapp,
      });
      if (existingParty) {
        return res.status(400).json({
          message: "WhatsApp number is already registered with another party",
        });
      }
    }

    party.name = name || party.name;
    party.whatsapp = whatsapp || party.whatsapp;
    if (paymentDays !== undefined) {
      party.paymentDays = Number(paymentDays);
    }

    await party.save();

    res.status(200).json({
      message: "Party updated successfully",
      party,
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

// Delete Party
const deleteParty = async (req, res) => {
  try {
    const party = await Party.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!party) {
      return res.status(404).json({
        message: "Party not found",
      });
    }

    // Find all challans for this party
    const challans = await Challan.find({
      party: req.params.id,
      user: req.user._id,
    });
    const challanIds = challans.map((c) => c._id);

    // Delete associated payments
    if (challanIds.length > 0) {
      await Payment.deleteMany({
        user: req.user._id,
        challan: { $in: challanIds },
      });
    }

    // Delete associated challans
    await Challan.deleteMany({
      party: req.params.id,
      user: req.user._id,
    });

    // Delete party document
    await Party.findByIdAndDelete(party._id);

    res.status(200).json({
      message: "Party deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

module.exports = {
  addParty,
  getParty,
  getPartyById,
  updateParty,
  deleteParty,
};
