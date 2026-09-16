const express = require("express");

const {
  addChallan,
  getChallans,
  getChallanById,
  updateChallan,
  deleteChallan,
} = require("../controller/challanController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

// Protect all challan routes
router.use(protect);

router.post("/", addChallan);
router.get("/", getChallans);
router.get("/:id", getChallanById);
router.put("/:id", updateChallan);
router.delete("/:id", deleteChallan);

module.exports = router;
