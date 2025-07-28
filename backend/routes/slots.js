const express = require('express');
const router = express.Router();
const { generateSlots, getSlotsbyId, getOrGenerateSlotsForDate } = require('../controllers/slotController');

router.post('/generate', generateSlots);
router.get('/getslotsbyid', getSlotsbyId);
router.get('/ondemand', getOrGenerateSlotsForDate);

module.exports = router; 