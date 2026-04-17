
/**
 * Quotes Controller
 * ----------------------------------------
 * Handles incoming HTTP requests related to quotes.
 *
 * Responsibilities:
 * - Receive request
 * - Call service layer
 * - Return response
 *
 * Note:
 * Business logic is handled in service layer
 */

const quotesService = require("./quotes.service");


/**
 * POST /quotes
 * ----------------------------------------
 * Supplier submits a quote for an RFQ
 *
 * Use case:
 * Supplier provides:
 * - price
 * - delivery timeline
 * - additional notes
 *
 * Flow:
 * Supplier → submits quote → validated → stored in DB
 *
 * Note:
 * supplierId is hardcoded for now (until auth is implemented)
 */
exports.createQuote = async (req, res) => {
  try {
    const supplierId = 1; // TEMP (replace with req.user.id after auth)

    const data = await quotesService.createQuote(
      req.body.rfq_id,
      supplierId,
      req.body
    );

    res.status(201).json(data);
  } catch (err) {
    console.error(err);

    // Business errors (like "not allowed to quote")
    res.status(400).json({ message: err.message });
  }
};


/**
 * GET /quotes/rfq/:id
 * ----------------------------------------
 * Buyer fetches all quotes for a specific RFQ
 *
 * Use case:
 * Buyer compares multiple supplier quotes
 *
 * IMPORTANT:
 * - Response is anonymised (no supplier identity)
 */
exports.getQuotesForRFQ = async (req, res) => {
  try {
    const data = await quotesService.getQuotesForRFQ(
      req.params.id
    );

    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching quotes" });
  }
};

