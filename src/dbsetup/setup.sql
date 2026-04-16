--- dummy users for use
CREATE TABLE users (
    id SERIAL PRIMARY KEY,

    email VARCHAR(255) UNIQUE NOT NULL,
    password TEXT NOT NULL,

    role VARCHAR(50) NOT NULL, -- supplier / buyer / both

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- create RFQs table
CREATE TABLE rfqs (
    id SERIAL PRIMARY KEY,

    title TEXT NOT NULL,
    description TEXT,

    part_name TEXT,
    process TEXT,          -- CNC / casting / etc
    material TEXT,

    quantity INT NOT NULL,
    location TEXT,

    timeline_days INT,     -- delivery expectation
    ppap_level VARCHAR(50),

    created_by INT REFERENCES users(id),

    status VARCHAR(20) DEFAULT 'open', -- open / closed

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


--- create RFQ files

CREATE TABLE rfq_files (
    id SERIAL PRIMARY KEY,

    rfq_id INT REFERENCES rfqs(id) ON DELETE CASCADE,

    file_url TEXT NOT NULL,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- create RFQ response 

CREATE TABLE rfq_responses (
    id SERIAL PRIMARY KEY,

    rfq_id INT REFERENCES rfqs(id) ON DELETE CASCADE,
    supplier_id INT REFERENCES users(id),

    status VARCHAR(20) NOT NULL, -- interested / rejected

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    UNIQUE (rfq_id, supplier_id)
);

--- indexing

CREATE INDEX idx_rfqs_status ON rfqs(status);
CREATE INDEX idx_rfqs_created_by ON rfqs(created_by);

CREATE INDEX idx_rfq_responses_supplier ON rfq_responses(supplier_id);
CREATE INDEX idx_rfq_responses_rfq ON rfq_responses(rfq_id);