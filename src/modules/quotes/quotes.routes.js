/*
Supplier APIs
POST /quotes        → submit quote
GET  /quotes/my     → my quotes

Buyer APIs
GET /quotes/rfq/:id → view quotes (anonymised)

**** Flow mapping ****
Supplier
RFQ → Interested → Submit Quote
Buyer
RFQ → View Quotes → Compare → Select
*/


const express = require("express");
const router = express.Router();

const controller = require("./quotes.controller");

// NOTE:
// Authentication & role-based middleware not yet added
// Future:
// - Only suppliers can POST /quotes
// - Only buyers can GET /quotes/rfq/:id


/**
 * POST /quotes
 * ----------------------------------------
 * Supplier endpoint → submit quote
 *
 * Body:
 * - rfq_id
 * - price
 * - delivery_days
 * - notes
 *
 * Flow:
 * Supplier → submits quote → validated in service → saved
 */
router.post("/", controller.createQuote);


/**
 * GET /quotes/rfq/:id
 * ----------------------------------------
 * Buyer endpoint → fetch all quotes for a given RFQ
 *
 * IMPORTANT:
 * - Returns anonymised data
 * - No supplier identity exposed
 *
 * Use case:
 * Buyer compares quotes before selecting supplier
 */
router.get("/rfq/:id", controller.getQuotesForRFQ);


module.exports = router;


