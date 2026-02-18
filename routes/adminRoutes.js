const express = require("express");
const router = express.Router();
const adminController = require("../controllers/adminController");

const multer = require("multer");
const path = require("path");
const os = require("os");
const fs = require("fs");

const desktopDir = path.join(os.homedir(), "Desktop", "MedcodeUploads");

if (!fs.existsSync(desktopDir)) {
  fs.mkdirSync(desktopDir, { recursive: true });
}

// ===============================
// MULTER STORAGE
// ===============================

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, desktopDir);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, "avatar_" + Date.now() + ext);
  },
});

const upload = multer({ storage });

// ===============================
// ROUTES
// ===============================

router.post("/login", adminController.adminLogin);
router.get("/", adminController.getAdminProfile);
router.put("/:id", upload.single("avatar"), adminController.updateAdminProfile);

module.exports = router;
