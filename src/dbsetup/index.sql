-- -----------------------------
-- RFQs
-- -----------------------------
-- Optimizes:
-- WHERE status = 'open'
-- ORDER BY created_at DESC
CREATE INDEX IF NOT EXISTS idx_rfqs_status_created_at 
ON rfqs(status, created_at DESC);

-- Buyer dashboard (GET /rfq/my)
CREATE INDEX IF NOT EXISTS idx_rfqs_created_by 
ON rfqs(created_by);

-- Optional filters
CREATE INDEX IF NOT EXISTS idx_rfqs_process 
ON rfqs(process);

CREATE INDEX IF NOT EXISTS idx_rfqs_location 
ON rfqs(location);


-- -----------------------------
-- RFQ FILES
-- -----------------------------
-- Fetch files for RFQ
CREATE INDEX IF NOT EXISTS idx_rfq_files_rfq_id 
ON rfq_files(rfq_id);


-- -----------------------------
-- RFQ RESPONSES
-- -----------------------------
-- Note:
-- UNIQUE (rfq_id, supplier_id) already creates a composite index

-- Used when querying supplier activity
CREATE INDEX IF NOT EXISTS idx_rfq_responses_supplier 
ON rfq_responses(supplier_id);


-- -----------------------------
-- QUOTES
-- -----------------------------
-- Fetch all quotes for an RFQ
CREATE INDEX IF NOT EXISTS idx_quotes_rfq_id 
ON quotes(rfq_id);