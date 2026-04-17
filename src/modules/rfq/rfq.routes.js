/**
 * RFQ Routes
 * ----------------------------------------
 * Defines all HTTP endpoints related to RFQs.
 *
 * Product Context:
 * This module handles the interaction between:
 * - Buyer → creates RFQs
 * - Supplier → views RFQs and responds
 *
 * Flow:
 * Buyer creates RFQ → stored in DB
 * Supplier fetches RFQs → views → responds
 */

const express = require("express");
const router = express.Router();

const rfqController = require("./rfq.controller");

// NOTE:
// Middleware (auth, role-based access) is currently disabled.
// Will be added later when authentication is implemented.


/**
 * GET /rfq
 * ----------------------------------------
 * Supplier endpoint → fetch all available RFQs
 *
 * Use case:
 * Supplier dashboard showing all open opportunities
 *
 * Supports filters via query params:
 * - process
 * - location
 */
router.get("/", rfqController.getRFQs);


/**
 * GET /rfq/my
 * ----------------------------------------
 * Buyer endpoint → fetch RFQs created by logged-in buyer
 *
 * IMPORTANT:
 * This route MUST come before /:id
 * Otherwise "my" will be treated as an ID
 *
 * Use case:
 * Buyer dashboard (track their RFQs)
 */
router.get("/my", rfqController.getMyRFQs);


/**
 * GET /rfq/:id
 * ----------------------------------------
 * Shared endpoint (Buyer + Supplier)
 *
 * Use case:
 * - Supplier → view RFQ details before responding
 * - Buyer → open their own RFQ
 */
router.get("/:id", rfqController.getRFQById);


/**
 * POST /rfq
 * ----------------------------------------
 * Buyer endpoint → create new RFQ
 *
 * Use case:
 * Buyer submits manufacturing requirement
 */
router.post("/", rfqController.createRFQ);


/**
 * POST /rfq/:id/respond
 * ----------------------------------------
 * Supplier endpoint → respond to RFQ
 *
 * Body:
 * - status: "interested" | "rejected"
 *
 * Use case:
 * Supplier decides whether to participate
 */
router.post("/:id/respond", rfqController.respondToRFQ);


/**
 * POST /rfq/:id/questions
 * ----------------------------------------
 * Supplier endpoint → ask clarification about RFQ
 *
 * Body:
 * - message: string
 *
 * Use case:
 * Supplier requests more details before quoting
 */
router.post("/:id/questions", rfqController.askQuestion);

module.exports = router;