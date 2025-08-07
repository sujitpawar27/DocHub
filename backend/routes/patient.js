// backend/routes/profile.js
const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const multer = require("multer");
const path = require("path");
const patientController = require("../controllers/patientController");

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) =>
    cb(null, req.user.id + path.extname(file.originalname)),
});
const upload = multer({ storage });

router.get("/me", auth, patientController.getProfile);
router.put("/me", auth, patientController.updateProfile);
router.post(
  "/me/avatar",
  auth,
  upload.single("avatar"),
  patientController.uploadAvatar
);
router.get("/doctors", patientController.getAllDoctors);
router.get("/health-history", auth, patientController.getHealthHistory);
router.get("/prescription/:id", auth, patientController.getPrescriptionById);
router.get(
  "/recent-doctors",
  auth,
  patientController.getRecentConsultedDoctors
);

module.exports = router;
