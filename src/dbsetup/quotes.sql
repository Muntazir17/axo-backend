CREATE TABLE quotes (
    id SERIAL PRIMARY KEY,
    rfq_id INT REFERENCES rfqs(id) ON DELETE CASCADE,
    supplier_id INT REFERENCES users(id),

    price NUMERIC NOT NULL,
    delivery_days INT,
    notes TEXT,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    UNIQUE (rfq_id, supplier_id)
);

-- One supplier → one quote per RFQ
-- Quotes linked to RFQ
-- Clean data