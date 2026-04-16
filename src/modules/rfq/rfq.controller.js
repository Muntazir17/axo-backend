
const rfqService = require("./rfq.service");

exports.getRFQs = async (req, res) => {
  try {
    const data = await rfqService.getRFQs(req.query);
    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching RFQs" });
  }
};

exports.getRFQById = async (req, res) => {
  try {
    const data = await rfqService.getRFQById(req.params.id);

    if (!data) {
      return res.status(404).json({ message: "RFQ not found" });
    }

    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching RFQ" });
  }
};

exports.createRFQ = async (req, res) => {
  try {
    const userId = 1; // TEMP (until auth ready)

    const data = await rfqService.createRFQ(req.body, userId);

    res.status(201).json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({
  message: "Error creating RFQ",
  error: err.message
});
  }
};

exports.respondToRFQ = async (req, res) => {
  try {
    const supplierId = 1; // TEMP

    const data = await rfqService.respondToRFQ(
      req.params.id,
      supplierId,
      req.body.status
    );

    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error responding to RFQ" });
  }
};

exports.askQuestion = async (req, res) => {
  try {
    const data = await rfqService.askQuestion(
      req.params.id,
      1,
      req.body.message
    );

    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error asking question" });
  }
};