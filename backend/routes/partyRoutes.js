const express = require("express");

const {
  addParty,
  getParty,
  getPartyById,
} = require("../controller/partyController.js");

const router = express.Router();

router.post("/", addParty);

router.get("/", getParty);

router.get("/:id", getPartyById);

module.exports = router;
