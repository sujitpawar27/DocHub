const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const path = require("path");
const doctorController = require("../controllers/doctorController");

const { suggestDoctor } = require("../controllers/suggestDoctor");

// Doctor Profile
router.get("/me/:id", auth, doctorController.getProfile);
router.put("/me", auth, doctorController.updateProfile);
router.post("/me/avatar", auth, doctorController.uploadAvatar);

// Patients
router.get("/patients", auth, doctorController.getPatients); // ?search=, ?sort=
router.get("/patients/:id/history", auth, doctorController.getPatientHistory);

// Prescription
router.post("/prescription", auth, doctorController.createPrescription);
router.get("/prescription/:id", auth, doctorController.getPrescriptionsbyId);
router.put("/prescription/:id", auth, doctorController.updatePrescriptionbyId);

// Suggest doctor by condition (AI-powered)
router.post("/suggest", async (req, res) => {
  const { condition } = req.body;
  if (!condition)
    return res.status(400).json({ message: "Condition is required" });
  const result = await suggestDoctor({ condition });
  res.json(result);
});

module.exports = router;
