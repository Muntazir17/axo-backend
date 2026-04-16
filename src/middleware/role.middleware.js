exports.requireRole = (role) => {
  return (req, res, next) => {
    // TEMP: allow everything for now
    // (since auth not fully ready)

    if (!req.user) {
      req.user = { role: "supplier" }; // TEMP fallback
    }

    if (req.user.role !== role && req.user.role !== "both") {
      return res.status(403).json({ message: "Forbidden" });
    }

    next();
  };
};