# AXO Backend — RFQ Supplier Module

## 📌 Overview

This repository contains the backend implementation for the **Supplier-side RFQ (Request for Quotation) system** of AXO Networks.

The goal of this module is to enable suppliers to:

* Discover manufacturing opportunities (RFQs)
* View RFQ details and attachments
* Express interest (or reject)
* Prepare for the next stage: quoting

---

## 🧠 System Flow

```
Buyer creates RFQ
        ↓
RFQ stored in database
        ↓
Supplier fetches RFQs
        ↓
Supplier views details
        ↓
Supplier responds (interested / rejected)
        ↓
(Next stage → Quote submission)
```

---

## 🧱 Database Schema

### 1. Users

Stores system users (buyer/supplier)

```
users
- id
- email
- password
- role (buyer / supplier / both)
```

---

### 2. RFQs

Core table storing buyer requirements

```
rfqs
- id
- title
- description
- part_name
- process
- material
- quantity
- location
- timeline_days
- ppap_level
- created_by (FK → users.id)
- status (open / closed)
- created_at
- updated_at
```

---

### 3. RFQ Files

Stores attachments (design files, etc.)

```
rfq_files
- id
- rfq_id (FK)
- file_url
- created_at
```

---

### 4. RFQ Responses

Tracks supplier decisions

```
rfq_responses
- id
- rfq_id (FK)
- supplier_id (FK)
- status (interested / rejected)
- created_at
```

> Constraint: One supplier can respond only once per RFQ

---

## 🔌 API Endpoints

### 🏭 Supplier APIs

#### Get all RFQs

```
GET /rfq
```

---

#### Get RFQ details

```
GET /rfq/:id
```

---

#### Respond to RFQ

```
POST /rfq/:id/respond
```

Body:

```json
{
  "status": "interested"
}
```

---

#### Ask clarification (dummy)

```
POST /rfq/:id/questions
```

---

### 🧑‍💼 Buyer APIs (handled separately)

```
POST /rfq
GET /rfq/my
```

---

## ⚙️ Tech Stack

* Node.js
* Express.js
* PostgreSQL
* pg (node-postgres)

---

## 🚀 Project Setup

Follow these steps to run locally:

---

### 1. Clone repository

```
git clone https://github.com/Muntazir17/axo-backend.git
cd axo-backend
```

---

### 2. Install dependencies

```
npm install
```

---

### 3. Setup environment variables

Create `.env` in root:

```
DB_PASSWORD=your_postgres_password
PORT=3000
```

---

### 4. Setup database

Open PostgreSQL and run:

```
CREATE DATABASE dbnamehere;
```

Then run your schema file:

```
\i db/setup.sql
```

---

### 5. Start server

```
npm run dev
```

---

### 6. Test API

```
curl http://localhost:3000/rfq
```

---

## 🧪 Sample RFQ Creation

```
POST /rfq
```

```json
{
  "title": "Motor Housing",
  "description": "Need CNC machining",
  "part_name": "Housing",
  "process": "CNC",
  "quantity": 500,
  "location": "Pune",
  "timeline_days": 14,
  "ppap_level": "Level 3",
  "files": ["https://test.com/file1.pdf"]
}
```

---

## 🔐 Notes

* Authentication is currently mocked (userId = 1)
* Middleware will be added later
* File upload currently uses URL (S3 integration planned)

---

## 🧠 Architecture Note

This module follows a **feature-based modular structure**:

```
modules/
 └── rfq/
     ├── rfq.routes.js
     ├── rfq.controller.js
     └── rfq.service.js
```

---

## 🤝 Contribution

Coordinate schema and API contracts before making changes to avoid breaking integrations.

---

## 📌 Status

✅ RFQ Supplier Flow Completed
🚀 Moving to Quotes Module




---
---
# API
```
GET  /rfq
GET  /rfq/:id
POST /rfq/:id/respond
POST /rfq/:id/questions
```

---
Good — now let’s make this **crystal clear like an API contract** (this is what real teams align on) 🔥

I’ll list:

* API
* Who uses it
* Request params/body
* Response

---

# 🧱 RFQ MODULE — FINAL API LIST

---

# 🏭 1. GET /rfq

👉 **Supplier → view all RFQs**

---

## 🔌 Request

### Query params (optional):

```text id="63nfha"
?process=CNC
?location=Pune
```

---

## Example:

```bash id="5ny3rj"
GET /rfq?process=CNC&location=Pune
```

---

## ✅ Response

```json id="6g0xji"
[
  {
    "id": 3,
    "title": "Motor Housing",
    "process": "CNC",
    "quantity": 500,
    "location": "Pune",
    "status": "open"
  }
]
```

---

# 🏭 2. GET /rfq/:id

👉 **Supplier → view RFQ details**

---

## 🔌 Request

```text id="k3ypn1"
Path param:
:id (RFQ ID)
```

---

## Example:

```bash id="e9lrzr"
GET /rfq/3
```

---

## ✅ Response

```json id="7xpx85"
{
  "id": 3,
  "title": "Motor Housing",
  "description": "Need CNC machining",
  "part_name": "Housing",
  "process": "CNC",
  "quantity": 500,
  "location": "Pune",
  "timeline_days": 14,
  "ppap_level": "Level 3",
  "files": [
    "https://test.com/file1.pdf"
  ]
}
```

---

# 🤝 3. POST /rfq/:id/respond

👉 **Supplier → interested / rejected**

---

## 🔌 Request

### Path:

```text id="g2z6vz"
:id (RFQ ID)
```

---

### Body:

```json id="cz36zo"
{
  "status": "interested"
}
```

---

### Allowed values:

```text id="6k5h5k"
interested
rejected
```

---

## Example:

```bash id="ztlfnt"
POST /rfq/3/respond
```

---

## ✅ Response

```json id="sxzfpk"
{
  "id": 1,
  "rfq_id": 3,
  "supplier_id": 1,
  "status": "interested"
}
```

---

# 💬 4. POST /rfq/:id/questions

👉 **Supplier → ask clarification (dummy for now)**

---

## 🔌 Request

### Path:

```text id="glkfwb"
:id (RFQ ID)
```

---

### Body:

```json id="r5pb8h"
{
  "message": "Can you share CAD file?"
}
```

---

## ✅ Response

```json id="pdq7y8"
{
  "rfqId": 3,
  "supplierId": 1,
  "message": "Can you share CAD file?"
}
```

---

# 🧑‍💼 5. POST /rfq  (Buyer — for alignment)

👉 You may not own this, but MUST match structure

---

## 🔌 Request Body

```json id="7dklcd"
{
  "title": "Motor Housing",
  "description": "Need CNC machining",
  "part_name": "Housing",
  "process": "CNC",
  "material": "Aluminum",
  "quantity": 500,
  "location": "Pune",
  "timeline_days": 14,
  "ppap_level": "Level 3",
  "files": ["https://test.com/file1.pdf"]
}
```

---

## ✅ Response

```json id="ahw0kv"
{
  "id": 3,
  "title": "Motor Housing",
  "created_by": 1
}
```

---

# 🧠 Summary (clean view)

---

## 🏭 Supplier APIs (YOUR WORK)

```text id="3m7s92"
GET  /rfq
GET  /rfq/:id
POST /rfq/:id/respond
POST /rfq/:id/questions
```

---

## 🧑‍💼 Buyer APIs (teammate)

```text id="tkrqwi"
POST /rfq
GET  /rfq/my
```

---

# ⚠️ Important constraints

---

## 🔒 1. Response rule

```text id="8h8t0i"
One supplier → one response per RFQ
```

---

## 🔒 2. Only valid statuses

```text id="ez5h4y"
interested / rejected
```

---

## 🔒 3. RFQ visibility

```text id="rc20bb"
Supplier sees only "open" RFQs
```

---

# 🧠 What this API set enables

```text id="rwblxh"
RFQ → Supplier sees → Supplier decides
```

👉 Foundation for:

```text id="y6j5fx"
Quote → Order → Execution
```

---

