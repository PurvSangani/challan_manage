const Party = require("../models/Party");
const Challan = require("../models/Challan");

// Add Party
const addParty = async (req, res) => {
  try {
    const { name, whatsapp, paymentDays } = req.body;
    console.log(req.body);
    const existingParty = await Party.findOne({ whatsapp });

    if (existingParty) {
      return res.status(400).json({
        message: "Party already exists",
      });
    }

    const party = await Party.create({
      name,
      whatsapp,
      paymentDays,
    });
    console.log(party);
    res.status(201).json({
      message: "Party added successfully",
      party,
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

// Get All Parties
const getParty = async (req, res) => {
  try {
    const parties = await Party.find().sort({ name: 1 });

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
    const party = await Party.findById(req.params.id);

    if (!party) {
      return res.status(404).json({
        message: "Party not found",
      });
    }

    const challans = await Challan.find({
      party: req.params.id,
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

module.exports = {
  addParty,
  getParty,
  getPartyById,
};
