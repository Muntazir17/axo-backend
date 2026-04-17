
/**
 * RFQ Service Layer
 * ----------------------------------------
 * Contains all business logic and database interactions for RFQs.
 *
 * Responsibilities:
 * - Query DB
 * - Apply filters
 * - Enforce constraints
 * - Shape data before returning to controller
 *
 * Product Context:
 * RFQ = demand created by Buyer
 * Supplier interacts with RFQ (view, respond)
 */

const db = require("../../config/db");

/**
 * GET /rfq
 * ----------------------------------------
 * Fetch all OPEN RFQs (for supplier marketplace view)
 *
 * Use case:
 * Supplier dashboard → browse opportunities
 *
 * Supports optional filters:
 * - process (e.g. CNC, Assembly)
 * - location (e.g. Pune)
 *
 * Notes:
 * - Only RFQs with status = 'open' are visible
 * - Sorted by newest first
 */
exports.getRFQs = async (query) => {
  let baseQuery = `SELECT * FROM rfqs WHERE status = 'open'`;
  const values = [];

  // Filter by manufacturing process
  if (query.process) {
    values.push(query.process);
    baseQuery += ` AND process = $${values.length}`;
  }

  // Filter by location
  if (query.location) {
    values.push(query.location);
    baseQuery += ` AND location = $${values.length}`;
  }

  // Show latest RFQs first
  baseQuery += ` ORDER BY created_at DESC`;

  const res = await db.query(baseQuery, values);

  return res.rows;
};


/**
 * GET /rfq/:id
 * ----------------------------------------
 * Fetch a single RFQ along with its attached files
 *
 * Use case:
 * - Supplier → needs full details before responding
 * - Buyer → views their own RFQ
 *
 * Includes:
 * - RFQ metadata
 * - File URLs (designs, specs, etc.)
 */
exports.getRFQById = async (rfqId) => {
  // Fetch RFQ
  const rfqRes = await db.query(
    `SELECT * FROM rfqs WHERE id = $1`,
    [rfqId]
  );

  if (!rfqRes.rows.length) return null;

  const rfq = rfqRes.rows[0];

  // Fetch associated files
  const filesRes = await db.query(
    `SELECT file_url FROM rfq_files WHERE rfq_id = $1`,
    [rfqId]
  );

  // Attach files array to response
  rfq.files = filesRes.rows.map(f => f.file_url);

  return rfq;
};


/**
 * POST /rfq
 * ----------------------------------------
 * Create a new RFQ (Buyer action)
 *
 * Use case:
 * Buyer submits requirement for manufacturing
 *
 * Steps:
 * 1. Insert RFQ into rfqs table
 * 2. Insert associated files into rfq_files table
 *
 * Notes:
 * - created_by links RFQ to buyer (users table)
 * - files are optional (empty array allowed)
 */
exports.createRFQ = async (body, userId) => {
  const {
    title,
    description,
    part_name,
    process,
    material,
    quantity,
    location,
    timeline_days,
    ppap_level,
    files = []
  } = body;

  // Insert RFQ
  const rfqRes = await db.query(
    `INSERT INTO rfqs
     (title, description, part_name, process, material,
      quantity, location, timeline_days, ppap_level, created_by)
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)
     RETURNING *`,
    [
      title,
      description,
      part_name,
      process,
      material,
      quantity,
      location,
      timeline_days,
      ppap_level,
      userId
    ]
  );

  const rfq = rfqRes.rows[0];

  // Insert files (if any)
  for (let file of files) {
    await db.query(
      `INSERT INTO rfq_files (rfq_id, file_url)
       VALUES ($1, $2)`,
      [rfq.id, file]
    );
  }

  return rfq;
};

/**
 * POST /rfq/:id/respond
 * ----------------------------------------
 * Supplier responds to RFQ
 *
 * Use case:
 * Supplier marks:
 * - interested → will submit quote later
 * - rejected → not interested
 *
 * DB Logic:
 * - UNIQUE constraint on (rfq_id, supplier_id)
 * - Ensures one response per supplier per RFQ
 *
 * ON CONFLICT:
 * - If response already exists → update status
 * - Prevents duplicate rows
 */
exports.respondToRFQ = async (rfqId, supplierId, status) => {
  const res = await db.query(
    `INSERT INTO rfq_responses (rfq_id, supplier_id, status)
     VALUES ($1, $2, $3)
     ON CONFLICT (rfq_id, supplier_id)
     DO UPDATE SET status = EXCLUDED.status
     RETURNING *`,
    [rfqId, supplierId, status]
  );

  return res.rows[0];
};

/**
 * POST /rfq/:id/questions
 * ----------------------------------------
 * Supplier asks clarification about RFQ
 *
 * Use case:
 * Supplier needs more info before quoting
 * (e.g. missing dimensions, unclear specs)
 *
 * Current state:
 * - Dummy implementation (no DB storage)
 *
 * Future:
 * - Will connect to chat/messages table
 */
exports.askQuestion = async (rfqId, supplierId, message) => {
  return {
    rfqId,
    supplierId,
    message,
    created_at: new Date()
  };
};


/**
 * GET /rfq/my
 * ----------------------------------------
 * Fetch RFQs created by a specific buyer
 *
 * Use case:
 * Buyer dashboard → track their RFQs
 *
 * Notes:
 * - Filtered by created_by (userId)
 * - Sorted by latest first
 */
exports.getMyRFQs = async (userId) => {
  const res = await db.query(
    `SELECT * FROM rfqs 
     WHERE created_by = $1 
     ORDER BY created_at DESC`,
    [userId]
  );

  return res.rows;
};