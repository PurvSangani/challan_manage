const express = require("express");

const {
  addChallan,
  getChallans,
  getChallanById,
  updateChallan,
  deleteChallan,
} = require("../controller/challanController");

const router = express.Router();

router.post("/", addChallan);
router.get("/", getChallans);
router.get("/:id", getChallanById);
router.put("/:id", updateChallan);
router.delete("/:id", deleteChallan);

module.exports = router;
