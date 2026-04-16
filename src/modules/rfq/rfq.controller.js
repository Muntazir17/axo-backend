// const rfqService = require("./rfq.service");

// /**
//  * GET /rfq
//  * Supplier → view all RFQs
//  */
// exports.getRFQs = async (req, res) => {
//   try {
//     const data = await rfqService.getRFQs(req.query);
//     res.status(200).json(data);
//   } catch (err) {
//     console.error("GET RFQs error:", err);
//     res.status(500).json({ message: "Server error" });
//   }
// };

// /**
//  * GET /rfq/:id
//  * Supplier → view single RFQ
//  */
// exports.getRFQById = async (req, res) => {
//   try {
//     const rfqId = req.params.id;

//     const data = await rfqService.getRFQById(rfqId);

//     if (!data) {
//       return res.status(404).json({ message: "RFQ not found" });
//     }

//     res.status(200).json(data);
//   } catch (err) {
//     console.error("GET RFQ by ID error:", err);
//     res.status(500).json({ message: "Server error" });
//   }
// };

// /**
//  * POST /rfq
//  * Buyer → create RFQ
//  */
// exports.createRFQ = async (req, res) => {
//   try {
//     const userId = req.user.id; // from JWT
//     const body = req.body;

//     const data = await rfqService.createRFQ(body, userId);

//     res.status(201).json({
//       message: "RFQ created successfully",
//       rfq: data
//     });
//   } catch (err) {
//     console.error("CREATE RFQ error:", err);
//     res.status(500).json({ message: "Server error" });
//   }
// };

// /**
//  * POST /rfq/:id/respond
//  * Supplier → interested / rejected
//  */
// exports.respondToRFQ = async (req, res) => {
//   try {
//     const rfqId = req.params.id;
//     const supplierId = req.user.id;
//     const { status } = req.body;

//     if (!["interested", "rejected"].includes(status)) {
//       return res.status(400).json({
//         message: "Invalid status"
//       });
//     }

//     const data = await rfqService.respondToRFQ(
//       rfqId,
//       supplierId,
//       status
//     );

//     res.status(200).json({
//       message: "Response recorded",
//       data
//     });
//   } catch (err) {
//     console.error("RESPOND RFQ error:", err);
//     res.status(500).json({ message: "Server error" });
//   }
// };

// /**
//  * POST /rfq/:id/questions
//  * Supplier → ask clarification (dummy)
//  */
// exports.askQuestion = async (req, res) => {
//   try {
//     const rfqId = req.params.id;
//     const supplierId = req.user.id;
//     const { message } = req.body;

//     if (!message) {
//       return res.status(400).json({
//         message: "Message is required"
//       });
//     }

//     const data = await rfqService.askQuestion(
//       rfqId,
//       supplierId,
//       message
//     );

//     res.status(200).json({
//       message: "Question submitted",
//       data
//     });
//   } catch (err) {
//     console.error("RFQ QUESTION error:", err);
//     res.status(500).json({ message: "Server error" });
//   }
// };
// console.log({
//   getRFQs,
//   getRFQById,
//   createRFQ,
//   respondToRFQ,
//   askQuestion
// });



// exports.getRFQs = (req, res) => {
//   res.json({ message: "GET RFQs working" });
// };

// exports.getRFQById = (req, res) => {
//   res.json({ message: "GET RFQ by ID working" });
// };

// exports.createRFQ = (req, res) => {
//   res.json({ message: "CREATE RFQ working" });
// };

// exports.respondToRFQ = (req, res) => {
//   res.json({ message: "RESPOND RFQ working" });
// };

// exports.askQuestion = (req, res) => {
//   res.json({ message: "QUESTION working" });
// };


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