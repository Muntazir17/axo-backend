
---

# 🧪 FULL DRY RUN (END-TO-END)

---

# 🎯 Scenario

```text id="8j8x5s"
Buyer: EV Motors
Requirement: CNC machining for Motor Bracket
Supplier: Alpha Manufacturing
```

---

# 🚀 STEP 1 — Buyer creates RFQ

```bash id="k0t3v4"
curl -X POST http://localhost:3000/rfq \
-H "Content-Type: application/json" \
-d '{
  "title": "Motor Bracket",
  "description": "Need CNC machining for EV motor bracket",
  "part_name": "Bracket",
  "process": "CNC",
  "material": "Aluminum",
  "quantity": 300,
  "location": "Pune",
  "timeline_days": 10,
  "ppap_level": "Level 2"
}'
```

---

## ✅ Response

```json id="ifbq0c"
{
    "id":6,"title":"Motor Bracket",
    "description":"Need CNC machining for EV motor bracket",
    "part_name":"Bracket",
    "process":"CNC",
    "material":"Aluminum",
    "quantity":300,
    "location":"Pune",
    "timeline_days":10,
    "ppap_level":"Level 2",
    "created_by":1,
    "status":"open",
    "created_at":"2026-04-17T10:15:53.338Z","updated_at":"2026-04-17T10:15:53.338Z"
}
```

---

# 🚀 STEP 2 — Supplier views RFQs

```bash id="cx9c4c"
curl http://localhost:3000/rfq
```

---

## ✅ Response

```json id="p1m1nl"
[
{"id":6,"title":"Motor Bracket","description":"Need CNC machining for EV motor bracket","part_name":"Bracket","process":"CNC","material":"Aluminum","quantity":300,"location":"Pune","timeline_days":10,"ppap_level":"Level 2","created_by":1,"status":"open","created_at":"2026-04-17T10:15:53.338Z","updated_at":"2026-04-17T10:15:53.338Z"},

{"id":5,"title":"Motor Housing","description":"Need CNC machining","part_name":"Housing","process":"CNC","material":null,"quantity":500,"location":"Pune","timeline_days":14,"ppap_level":"Level 3","created_by":1,"status":"open","created_at":"2026-04-17T03:54:06.681Z","updated_at":"2026-04-17T03:54:06.681Z"},

{"id":4,"title":"Battery Pack","description":"Need assembly","part_name":"Battery","process":"Assembly","material":null,"quantity":200,"location":"Bangalore","timeline_days":20,"ppap_level":"Level 2","created_by":1,"status":"open","created_at":"2026-04-17T03:11:40.872Z","updated_at":"2026-04-17T03:11:40.872Z"},

{"id":3,"title":"Motor Housing","description":"Need CNC machining","part_name":"Housing","process":"CNC","material":null,"quantity":500,"location":"Pune","timeline_days":14,"ppap_level":"Level 3","created_by":1,"status":"open","created_at":"2026-04-16T09:26:32.120Z","updated_at":"2026-04-16T09:26:32.120Z"}

]
```

---

# 🚀 STEP 3 — Supplier checks details

```bash id="n7p1mn"
curl http://localhost:3000/rfq/6
```

---

## ✅ Response

```json id="y8jv38"
{
"id":6,"title":"Motor Bracket","description":"Need CNC machining for EV motor bracket","part_name":"Bracket","process":"CNC","material":"Aluminum","quantity":300,"location":"Pune","timeline_days":10,"ppap_level":"Level 2","created_by":1,"status":"open","created_at":"2026-04-17T10:15:53.338Z","updated_at":"2026-04-17T10:15:53.338Z","files":[]
}
```

---

# 🚀 STEP 4 — Supplier responds (INTERESTED)

```bash id="qvfhq3"
curl -X POST http://localhost:3000/rfq/6/respond \
-H "Content-Type: application/json" \
-d '{"status":"interested"}'
```

---

## ✅ Response

```
{
"id":5,
"rfq_id":6,
"supplier_id":1,
"status":"interested",
"created_at":"2026-04-17T10:31:07.913Z"
}
```

---

# 🚀 STEP 5 — Supplier submits quote

```bash id="4u9g45"
curl -X POST http://localhost:3000/quotes \
-H "Content-Type: application/json" \
-d '{
  "rfq_id": 6,
  "price": 42000,
  "delivery_days": 8,
  "notes": "High precision CNC, fast delivery"
}'
```

---

## ✅ Response

```json id="5s2i2c"
{"id":5,"rfq_id":6,"supplier_id":1,"price":"42000","delivery_days":8,"notes":"High precision CNC, fast delivery","created_at":"2026-04-17T10:33:43.969Z","updated_at":"2026-04-17T10:34:01.425Z"}
```

---

# 🚀 STEP 6 — Buyer views quotes (ANONYMISED)

```bash id="41dnq2"
curl http://localhost:3000/quotes/rfq/6
```

---

## ✅ Response

```json id="xhv4je"
[{"quote_id":5,"price":"42000","delivery_days":8,"notes":"High precision CNC, fast delivery","created_at":"2026-04-17T10:33:43.969Z"}]
```

---

# 🧠 IMPORTANT OBSERVATION 
```
✔ Buyer cannot see supplier identity
✔ Only sees price + delivery + notes
✔ Ensures unbiased comparison
```

---

# 🔥 FULL FLOW SUMMARY

```
Buyer creates RFQ
        ↓
Supplier sees RFQ
        ↓
Supplier responds (interested)
        ↓
Supplier submits quote
        ↓
Buyer sees anonymised quotes
```

---


## ❌ Try quoting without interest

```bash id="k9pb7h"
curl -X POST http://localhost:3000/quotes \
-H "Content-Type: application/json" \
-d '{
  "rfq_id": 7,
  "price": 30000
}'
```

---

## ✅ Response

```json id="93m1e4"
{
  "message": "Supplier not allowed to quote"
}
---

# 🚀 What this gives you

```text id="4l7q4g"
✔ Demo-ready system
✔ Easy onboarding for teammate
✔ Clear product explanation
✔ Zero confusion
```