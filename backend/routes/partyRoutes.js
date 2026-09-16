const express = require("express");
const {
  addParty,
  getParty,
  getPartyById,
  updateParty,
  deleteParty,
} = require("../controller/PartyController.js");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

// Protect all party routes
router.use(protect);

router.post("/", addParty);
router.get("/", getParty);
router.get("/:id", getPartyById);
router.put("/:id", updateParty);
router.delete("/:id", deleteParty);

module.exports = router;
