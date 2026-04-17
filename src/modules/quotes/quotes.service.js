/**
 * Quotes Service Layer
 * ----------------------------------------
 * Handles all business logic related to quotes.
 *
 * Product Context:
 * Quotes are submitted by suppliers for a specific RFQ.
 * Buyers use quotes to compare and select suppliers.
 *
 * Core Rules enforced here:
 * 1. Only "interested" suppliers can submit quotes
 * 2. One supplier → one quote per RFQ
 * 3. Buyer sees anonymised quotes (handled in fetch)
 */

const db = require("../../config/db");


/**
 * POST /quotes
 * ----------------------------------------
 * Supplier submits a quote for an RFQ
 *
 * Flow:
 * RFQ → Supplier marks "interested" → Supplier submits quote
 *
 * Steps:
 * 1. Validate supplier has responded "interested"
 * 2. Insert quote OR update existing one
 *
 * Important:
 * - Prevents unauthorized quoting
 * - Prevents duplicate quotes (uses UNIQUE constraint)
 */
exports.createQuote = async (rfqId, supplierId, body) => {
  const { price, delivery_days, notes } = body;

  /**
   * Step 1: Validate supplier is allowed to quote
   * ----------------------------------------
   * Check rfq_responses table for:
   * - matching rfq_id
   * - matching supplier_id
   * - status = 'interested'
   */
  const check = await db.query(
    `SELECT * FROM rfq_responses
     WHERE rfq_id = $1 
     AND supplier_id = $2 
     AND status = 'interested'`,
    [rfqId, supplierId]
  );

  if (!check.rows.length) {
    // Business rule violation
    throw new Error("Supplier not allowed to quote");
  }

  /**
   * Step 2: Insert or update quote
   * ----------------------------------------
   * UNIQUE constraint on (rfq_id, supplier_id)
   *
   * ON CONFLICT ensures:
   * - If quote exists → update it
   * - If not → create new
   */
  const res = await db.query(
    `INSERT INTO quotes (rfq_id, supplier_id, price, delivery_days, notes)
     VALUES ($1, $2, $3, $4, $5)
     ON CONFLICT (rfq_id, supplier_id)
     DO UPDATE SET
       price = EXCLUDED.price,
       delivery_days = EXCLUDED.delivery_days,
       notes = EXCLUDED.notes,
       updated_at = CURRENT_TIMESTAMP
     RETURNING *`,
    [rfqId, supplierId, price, delivery_days, notes]
  );

  return res.rows[0];
};


/**
 * GET /quotes/rfq/:id
 * ----------------------------------------
 * Buyer fetches all quotes for a specific RFQ
 *
 * Use case:
 * Buyer compares multiple suppliers before selecting one
 *
 * IMPORTANT:
 * - Supplier identity is NOT returned (anonymised)
 * - Only quote data is visible
 *
 * This ensures fair competition and unbiased selection
 */
exports.getQuotesForRFQ = async (rfqId) => {
  const res = await db.query(
    `SELECT 
        id AS quote_id,
        price,
        delivery_days,
        notes,
        created_at
     FROM quotes
     WHERE rfq_id = $1
     ORDER BY created_at ASC`,
    [rfqId]
  );

  return res.rows;
};

