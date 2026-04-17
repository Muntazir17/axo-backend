const express = require("express");
const app = express();

const rfqRoutes = require("./modules/rfq/rfq.routes");
const quotesRoutes = require("./modules/quotes/quotes.routes");

app.use(express.json());

app.use("/rfq", rfqRoutes);
app.use("/quotes", quotesRoutes);

module.exports = app;