const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const slotController = require('./slotController');


exports.register = async (req, res) => {
  try {
    const {
      fullName,
      email,
      password,
      role,
      phone,
      gender,
      age,
      address,
      specialization,
      qualifications,
      experience,
      availability,
      medicalHistory,
      bloodGroup,
     timeSlots,
    } = req.body;

    // Basic validation
    if (!fullName || !email || !password || !role) {
      return res.status(400).json({ message: 'Required fields are missing' });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: 'Email already registered' });
    }


    // Prepare user object
    const newUser = new User({
      fullName,
      email,
      password,
      role,
      phone,
      gender,
      age,
      address,
    });

    // Attach role-specific fields
    if (role === 'doctor') {
      newUser.specialization = specialization;
      newUser.qualifications = qualifications;
      newUser.experience = experience;
      newUser.availability = availability;
    } else if (role === 'patient') {
      newUser.medicalHistory = medicalHistory;
      newUser.bloodGroup = bloodGroup;
    }

   
    console.log('Saving new user...');
    await newUser.save();      
    // if (role === 'doctor' && availability && Array.isArray(availability) && availability.length > 0) {
    //   try {
    //     await slotController.generateSlotsInternal({
    //       doctorId: newUser._id,
    //       availability,
    //     });
    //     console.log('Slots generated successfully');
    //   } catch (slotErr) {
    //     console.error('Slot generation error:', slotErr);
    //   }
    // }

    console.log('Sending success response');

    res.status(201).json({
      message: `${role} registered successfully`,
      user: {
        _id: newUser._id,
        fullName: newUser.fullName,
        email: newUser.email,
        role: newUser.role,
      }
    });

  } catch (error) {
    console.log('Register error:', error.message);
    res.status(500).json({ message: 'Server error during registration' });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user || user.password !== password) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { userId: user._id, role: user.role, fullName: user.fullName },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    // Build the user response object
    const userResponse = {
      id: user._id,
      fullName: user.fullName,
      email: user.email,
      role: user.role,
      avtarUrl: user.avatarUrl,
    };

    // Include specialization if user is a doctor
    if (user.role === "doctor" && user.specialization) {
      userResponse.specialization = user.specialization;
    }

    res.status(200).json({
      data: {
        token,
        user: userResponse,
      }
    });

  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};



// exports.login = async (req, res) => {

//   try {
//     const { email, password } = req.body;
    
//     const user = await User.findOne({ email });
//     if (!user || user.password !== password) {
//       return res.status(400).json({ message: "Invalid credentials" });
//     }
//     const token = jwt.sign({ userId: user._id, role: user.role, fullName: user.fullName }, process.env.JWT_SECRET, { expiresIn: '1d' });
//     res.status(200).json({
//       data:{
//       token,
//       user: {
//         id: user._id,
//         fullName: user.fullName,
//         email: user.email,
//         role: user.role,
//       },
//     }
//     }); 
//    } catch (err) {
//     res.status(500).json({ message: 'Server error', error: err.message });
//   }
// }; 