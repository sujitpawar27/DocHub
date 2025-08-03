const DoctorSlot = require("../models/DoctorSlot");
const Doctor = require("../models/User");

// Helper: Map weekday names to JS Date numbers
const weekdayMap = {
  Sunday: 0,
  Monday: 1,
  Tuesday: 2,
  Wednesday: 3,
  Thursday: 4,
  Friday: 5,
  Saturday: 6,
};

function parseTimeString(timeStr) {
  // Handles '10:00', '18:00', '10am', '6pm', etc.
  if (timeStr.includes(":")) {
    // '10:00'
    const [h, m] = timeStr.split(":").map(Number);
    return { h, m: m || 0 };
  } else if (
    timeStr.toLowerCase().includes("am") ||
    timeStr.toLowerCase().includes("pm")
  ) {
    let h = parseInt(timeStr, 10);
    let m = 0;
    if (timeStr.toLowerCase().includes("pm") && h !== 12) h += 12;
    if (timeStr.toLowerCase().includes("am") && h === 12) h = 0;
    return { h, m };
  }
  // fallback
  return { h: Number(timeStr) || 0, m: 0 };
}

async function generateSlotsInternal({
  doctorId,
  availability,
  slotDuration = 30,
  weeks = 2,
  type = "inperson",
}) {
  // Clean up old slots for the next N weeks
  const start = new Date();
  const end = new Date();
  end.setDate(start.getDate() + weeks * 7);
  end.setHours(23, 59, 59, 999);

  await DoctorSlot.deleteMany({
    doctorId,
    datetime: { $gte: start, $lte: end },
  });

  // Generate slots
  const slots = [];
  for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
    const dayNum = d.getDay();
    const dayName = Object.keys(weekdayMap).find(
      (key) => weekdayMap[key] === dayNum
    );
    // Find availability for this day
    const dayAvailability = availability.find((av) => av.day === dayName);
    if (!dayAvailability || !Array.isArray(dayAvailability.slots)) continue;

    for (const range of dayAvailability.slots) {
      const { start: startTime, end: endTime } = range;
      if (!startTime || !endTime) continue;
      const { h: sh, m: sm } = parseTimeString(startTime);
      const { h: eh, m: em } = parseTimeString(endTime);

      let slotStart = new Date(d);
      slotStart.setHours(sh, sm, 0, 0);
      let slotEnd = new Date(d);
      slotEnd.setHours(eh, em, 0, 0);

      // Validate: start must be before end
      if (slotStart >= slotEnd) {
        console.warn(
          `Invalid time range: ${startTime}-${endTime} on ${dayName}. Skipping.`
        );
        continue;
      }

      while (slotStart < slotEnd) {
        slots.push({
          doctorId,
          datetime: new Date(slotStart),
          type,
          available: true,
        });
        slotStart = new Date(slotStart.getTime() + slotDuration * 60000);
      }
    }
  }
  await DoctorSlot.insertMany(slots);
  return slots;
}

exports.generateSlotsInternal = generateSlotsInternal;

exports.generateSlots = async (req, res) => {
  try {
    const { doctorId, startDate, endDate, availability, type, slotDuration } =
      req.body;
    const slots = await generateSlotsInternal({
      doctorId,
      startDate,
      endDate,
      availability,
      type,
      slotDuration,
    });
    res.json({ slots });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message || "Server error" });
  }
};

exports.getSlotsbyId = async (req, res) => {
  try {
    const doctorId = req.query.doctorId;
    console.log("DoctorId", doctorId);

    const days = parseInt(req.query.days || "7");

    const start = new Date();
    const end = new Date();
    end.setDate(start.getDate() + days);

    const slots = await DoctorSlot.find({
      doctorId,
      datetime: { $gte: start, $lt: end },
      available: true,
    }).sort({ datetime: 1 });
    console.log("DoctorId", doctorId, "Start", start, "End", end);
    console.log("Found slots:", slots.length);
    res.json({ slots });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch upcoming slots" });
  }
};

exports.getOrGenerateSlotsForDate = async (req, res) => {
  try {
    const { doctorId, date, type = "inperson", slotDuration = 30 } = req.query;
    if (!doctorId || !date) {
      return res.status(400).json({ error: "doctorId and date are required" });
    }
    console.log("getOrGenerateSlotsForDate", req.query);
    const dayStart = new Date(date);
    dayStart.setHours(0, 0, 0, 0);
    const dayEnd = new Date(date);
    dayEnd.setHours(23, 59, 59, 999);

    // Fetch all slots of the day (both types)
    let allSlots = await DoctorSlot.find({
      doctorId,
      datetime: { $gte: dayStart, $lte: dayEnd },
    }).sort({ datetime: 1 });

    // If none exist, try generating
    if (allSlots.length === 0) {
      const doctor = await Doctor.findById(doctorId);
      if (!doctor || !Array.isArray(doctor.availability)) {
        return res
          .status(404)
          .json({ error: "Doctor not found or no availability set" });
      }
      const weekday = dayStart.toLocaleDateString("en-US", { weekday: "long" });
      const dayAvailability = doctor.availability.find((av) => {
        const obj = av.toObject();
        return obj.day.toLowerCase() === weekday.toLowerCase();
      });

      console.log("Day availabilty", dayAvailability);

      if (
        !dayAvailability ||
        !Array.isArray(dayAvailability.slots) ||
        dayAvailability.slots.length === 0
      ) {
        return res
          .status(404)
          .json({
            error: `Doctor is not available on ${weekday}. Please select a different date.`,
          });
      }

      const generatedSlots = [];
      for (const range of dayAvailability.slots) {
        const { start: startTime, end: endTime } = range;
        if (!startTime || !endTime) continue;

        const { h: sh, m: sm } = parseTimeString(startTime);
        const { h: eh, m: em } = parseTimeString(endTime);

        let slotStart = new Date(dayStart);
        slotStart.setHours(sh, sm, 0, 0);
        let slotEnd = new Date(dayStart);
        slotEnd.setHours(eh, em, 0, 0);
        if (slotStart >= slotEnd) {
          console.warn(
            `⚠️ Skipping invalid slot range for ${obj.day}: ${startTime} - ${endTime}`
          );
          continue;
        }
        while (slotStart < slotEnd) {
          generatedSlots.push({
            doctorId,
            datetime: new Date(slotStart),
            type,
            available: true,
          });
          slotStart = new Date(slotStart.getTime() + slotDuration * 60000);
        }
      }

      if (generatedSlots.length === 0) {
        return res
          .status(404)
          .json({ error: "No slots could be generated for this date" });
      }

      await DoctorSlot.insertMany(generatedSlots);

      // Re-fetch all slots after generation
      allSlots = await DoctorSlot.find({
        doctorId,
        datetime: { $gte: dayStart, $lte: dayEnd },
      }).sort({ datetime: 1 });
    }

    // Find all already booked slot timestamps
    const bookedTimes = new Set(
      allSlots
        .filter((slot) => slot.available === false)
        .map((slot) => new Date(slot.datetime).getTime())
    );

    // Filter only slots of requested type & update their availability status
    const filteredSlots = allSlots
      .filter((slot) => slot.type === type)
      .map((slot) => ({
        ...slot.toObject(),
        available: !bookedTimes.has(new Date(slot.datetime).getTime()),
      }));

    return res.json({ slots: filteredSlots });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message || "Server error" });
  }
};
