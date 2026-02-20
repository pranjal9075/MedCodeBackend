const express = require("express");
const router = express.Router();
const demoController = require("../controllers/demoController");

// VERIFY USER
router.post("/verify-user", demoController.verifyUser);

// BOOK DEMO (will also check user)
router.post("/book-demo", demoController.bookDemo);

// GET ALL DEMOS
router.get("/demo-requests", demoController.getAllDemos);

// DELETE DEMO
router.delete("/demo-requests/:id", demoController.deleteDemo);

// UPDATE DEMO
router.put("/demo-requests/:id", demoController.updateDemo);

module.exports = router;