const express = require("express");
const router = express.Router();
const {
  requestBrochure,
  getBrochureRequests,
  deleteBrochureRequest,
  updateBrochureRequest,
} = require("../controllers/brochureController");

// POST -> save a brochure request
router.post("/brochure", requestBrochure);

// GET -> fetch all brochure requests
router.get("/brochure-requests", getBrochureRequests);

// DELETE -> delete a brochure request
router.delete("/brochure-requests/:id", deleteBrochureRequest);

// PUT -> update a brochure request
router.put("/brochure-requests/:id", updateBrochureRequest);

module.exports = router;
