const express = require("express");
const router = express.Router();

const rfqController = require("./rfq.controller");

// TEMP: no middleware

router.get("/", rfqController.getRFQs);
router.get("/my", rfqController.getMyRFQs);
router.get("/:id", rfqController.getRFQById);
router.post("/", rfqController.createRFQ);
router.post("/:id/respond", rfqController.respondToRFQ);
router.post("/:id/questions", rfqController.askQuestion);

module.exports = router;