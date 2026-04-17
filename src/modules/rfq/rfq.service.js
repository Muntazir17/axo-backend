const db = require("../../config/db");

/**
 * GET /rfq
 * Fetch all open RFQs (with filters)
 */
exports.getRFQs = async (query) => {
  let baseQuery = `SELECT * FROM rfqs WHERE status = 'open'`;
  const values = [];

  // Optional filters
  if (query.process) {
    values.push(query.process);
    baseQuery += ` AND process = $${values.length}`;
  }

  if (query.location) {
    values.push(query.location);
    baseQuery += ` AND location = $${values.length}`;
  }

  baseQuery += ` ORDER BY created_at DESC`;

  const res = await db.query(baseQuery, values);

  return res.rows;
};

/**
 * GET /rfq/:id
 * Fetch single RFQ with files
 */
exports.getRFQById = async (rfqId) => {
  // RFQ
  const rfqRes = await db.query(
    `SELECT * FROM rfqs WHERE id = $1`,
    [rfqId]
  );

  if (!rfqRes.rows.length) return null;

  const rfq = rfqRes.rows[0];

  // Files
  const filesRes = await db.query(
    `SELECT file_url FROM rfq_files WHERE rfq_id = $1`,
    [rfqId]
  );

  rfq.files = filesRes.rows.map(f => f.file_url);

  return rfq;
};

/**
 * POST /rfq
 * Create RFQ (buyer)
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

  // Insert files
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
 * Supplier responds (interested / rejected)
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
 * Dummy clarification
 */
exports.askQuestion = async (rfqId, supplierId, message) => {
  // Optional: create table if not yet
  // For now just simulate response

  return {
    rfqId,
    supplierId,
    message,
    created_at: new Date()
  };
};
exports.getMyRFQs = async (userId) => {
  const res = await db.query(
    `SELECT * FROM rfqs 
     WHERE created_by = $1 
     ORDER BY created_at DESC`,
    [userId]
  );

  return res.rows;
};