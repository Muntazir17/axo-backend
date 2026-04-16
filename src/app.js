const express = require("express");
const app = express();

const rfqRoutes = require("./modules/rfq/rfq.routes");

app.use(express.json());

app.use("/rfq", rfqRoutes);

module.exports = app;