/**
 * RFQ Controller
 * ----------------------------------------
 * Handles all HTTP requests related to RFQs.
 *
 * Product Context:
 * RFQ = Request For Quotation created by Buyer.
 * Suppliers can view RFQs and respond with interest.
 *
 * Flow:
 * Buyer creates RFQ → stored in DB
 * Supplier views RFQs → responds (interested/rejected)
 */

const rfqService = require("./rfq.service");


/**
 * GET /rfq
 * ----------------------------------------
 * Supplier endpoint → fetch all available RFQs
 *
 * Use case:
 * Supplier dashboard where they browse opportunities.
 *
 * Supports optional filters:
 * - process (e.g. CNC, Assembly)
 * - location (e.g. Pune)
 */
exports.getRFQs = async (req, res) => {
  try {
    const data = await rfqService.getRFQs(req.query);
    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching RFQs" });
  }
};


/**
 * GET /rfq/:id
 * ----------------------------------------
 * Used by both Buyer & Supplier → fetch RFQ details
 *
 * Use case:
 * - Supplier views full RFQ before deciding
 * - Buyer opens their own RFQ
 *
 * Includes:
 * - RFQ details
 * - Attached files (designs, etc.)
 */
exports.getRFQById = async (req, res) => {
  try {
    const data = await rfqService.getRFQById(req.params.id);

    if (!data) {
      return res.status(404).json({ message: "RFQ not found" });
    }

    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching RFQ" });
  }
};


/**
 * POST /rfq
 * ----------------------------------------
 * Buyer endpoint → create a new RFQ
 *
 * Use case:
 * Buyer submits manufacturing requirement:
 * - part details
 * - quantity
 * - process
 * - timeline
 *
 * Note:
 * userId is hardcoded for now (auth not implemented yet)
 */
exports.createRFQ = async (req, res) => {
  try {
    const userId = 1; // TEMP (replace with req.user.id after auth)

    const data = await rfqService.createRFQ(req.body, userId);

    res.status(201).json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: "Error creating RFQ",
      error: err.message
    });
  }
};


/**
 * POST /rfq/:id/respond
 * ----------------------------------------
 * Supplier endpoint → express interest in RFQ
 *
 * Use case:
 * Supplier decides:
 * - interested → will submit quote later
 * - rejected → not interested
 *
 * Important:
 * One supplier → one response per RFQ
 */
exports.respondToRFQ = async (req, res) => {
  try {
    const supplierId = 1; // TEMP (replace with req.user.id later)

    const data = await rfqService.respondToRFQ(
      req.params.id,
      supplierId,
      req.body.status
    );

    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error responding to RFQ" });
  }
};


/**
 * POST /rfq/:id/questions
 * ----------------------------------------
 * Supplier endpoint → ask clarification about RFQ
 *
 * Use case:
 * Supplier needs more info before quoting
 * (e.g. missing specs, unclear drawings)
 *
 * Note:
 * Currently dummy implementation (no DB storage yet)
 */
exports.askQuestion = async (req, res) => {
  try {
    const data = await rfqService.askQuestion(
      req.params.id,
      1,
      req.body.message
    );

    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error asking question" });
  }
};


/**
 * GET /rfq/my
 * ----------------------------------------
 * Buyer endpoint → fetch all RFQs created by the buyer
 *
 * Use case:
 * Buyer dashboard:
 * - track RFQs
 * - monitor responses (later)
 *
 * Note:
 * userId is hardcoded for now
 */
exports.getMyRFQs = async (req, res) => {
  try {
    const userId = 1; // TEMP (replace after auth)

    const data = await rfqService.getMyRFQs(userId);

    res.json(data);
  } catch (err) {
    console.error("GET MY RFQs error:", err);
    res.status(500).json({ message: "Error fetching buyer RFQs" });
  }
};