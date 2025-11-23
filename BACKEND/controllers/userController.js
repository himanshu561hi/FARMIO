

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Otp = require('../models/Otp');
const ResetOtp = require('../models/ResetOtp');
const Withdrawal = require('../models/Withdrawal');
const cloudinary = require('cloudinary').v2;
const nodemailer = require('nodemailer');

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const generateOtp = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

const sendOtp = async (req, res) => {  // Ensure async
  const { email } = req.body;
  console.log('=== OTP SEND START === Email:', email);
  try {
    console.log('Step 1: Checking existing user...');
    const existingUser = await User.findOne({ email });  // Await inside async
    if (existingUser) {
      console.log('User exists, returning 400');
      return res.status(400).json({ message: 'Email already registered' });
    }

    console.log('Step 2: Generating OTP...');
    const otp = generateOtp();
    console.log('Generated OTP (temp log):', otp);  // Remove in prod

    console.log('Step 3: Saving to DB...');
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000);  // 5 min
    const otpUpdate = await Otp.findOneAndUpdate(  // Await inside async
      { email },
      { email, otp, createdAt: new Date(), expiresAt },
      { upsert: true, new: true }
    );
    console.log('DB Save Success:', otpUpdate);

    console.log('Step 4: Preparing email...');
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Email Verification OTP - Farmers Market',
      html: `
        <h2>Email Verification</h2>
        <p>Your OTP for email verification is: <strong>${otp}</strong></p>
        <p>This OTP is valid for 5 minutes.</p>
      `,
    };

    console.log('Step 5: Sending email via Nodemailer...');
    console.log('Transporter auth check:', {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS ? 'SET' : 'MISSING'  // Hide pass
    });

    const info = await transporter.sendMail(mailOptions);  // Await inside async
    console.log('=== EMAIL SUCCESS === ID:', info.messageId);
    res.json({ message: 'OTP sent to your email' });
  } catch (error) {
    console.error('=== OTP SEND ERROR === Full Details:', {
      message: error.message,
      code: error.code,
      response: error.response ? error.response.data : 'No response',
      stack: error.stack
    });
    res.status(500).json({ message: 'Error sending OTP', error: error.message });
  }
};

const verifyOtp = async (req, res) => {  // Ensure async
  const { email, otp } = req.body;
  try {
    const otpRecord = await Otp.findOne({ email, otp });  // Await inside
    if (!otpRecord || otpRecord.expiresAt < new Date()) {
      return res.status(400).json({ message: 'Invalid or expired OTP' });
    }
    res.json({ message: 'OTP verified successfully' });
  } catch (error) {
    console.error('Error verifying OTP:', error);
    res.status(500).json({ message: 'Error verifying OTP', error: error.message });
  }
};

const sendResetOtp = async (req, res) => {  // Ensure async
  const { email } = req.body;
  try {
    const user = await User.findOne({ email });  // Await inside
    if (!user) return res.status(400).json({ message: 'Email not registered' });

    const otp = generateOtp();
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000);
    await ResetOtp.findOneAndUpdate(  // Await inside
      { email },
      { email, otp, createdAt: new Date(), expiresAt },
      { upsert: true, new: true }
    );

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Password Reset OTP - Farmers Market',
      html: `
        <h2>Password Reset</h2>
        <p>Your OTP for password reset is: <strong>${otp}</strong></p>
        <p>This OTP is valid for 5 minutes.</p>
      `,
    };

    const info = await transporter.sendMail(mailOptions);  // Await inside
    console.log('Reset Email sent:', info.messageId);
    res.json({ message: 'OTP sent to your email' });
  } catch (error) {
    console.error('Error sending reset OTP:', error);
    res.status(500).json({ message: 'Error sending reset OTP', error: error.message });
  }
};

const verifyResetOtp = async (req, res) => {  // Ensure async
  const { email, otp } = req.body;
  try {
    const otpRecord = await ResetOtp.findOne({ email, otp });  // Await inside
    if (!otpRecord || otpRecord.expiresAt < new Date()) {
      return res.status(400).json({ message: 'Invalid or expired OTP' });
    }
    res.json({ message: 'OTP verified successfully' });
  } catch (error) {
    console.error('Error verifying reset OTP:', error);
    res.status(500).json({ message: 'Error verifying reset OTP', error: error.message });
  }
};

const resetPassword = async (req, res) => {  // Ensure async
  const { email, otp, newPassword } = req.body;
  try {
    const otpRecord = await ResetOtp.findOne({ email, otp });  // Await inside
    if (!otpRecord || otpRecord.expiresAt < new Date()) return res.status(400).json({ message: 'Invalid or expired OTP' });

    const user = await User.findOne({ email });  // Await inside
    if (!user) return res.status(400).json({ message: 'User not found' });

    const hashedPassword = await bcrypt.hash(newPassword, 10);  // Await inside
    user.password = hashedPassword;
    await user.save();  // Await inside

    await ResetOtp.deleteOne({ email });  // Await inside
    res.json({ message: 'Password reset successfully' });
  } catch (error) {
    console.error('Error resetting password:', error);
    res.status(500).json({ message: 'Error resetting password', error: error.message });
  }
};

const register = async (req, res) => {  // Ensure async
  const { name, email, password, role, location, otp } = req.body;
  try {
    const otpRecord = await Otp.findOne({ email, otp });  // Await inside
    if (!otpRecord || otpRecord.expiresAt < new Date()) return res.status(400).json({ message: 'Invalid or expired OTP' });

    const existingUser = await User.findOne({ email });  // Await inside
    if (existingUser) return res.status(400).json({ message: 'User already exists' });
    const hashedPassword = await bcrypt.hash(password, 10);  // Await inside

    let profileImageUrl = null;
    if (req.file) {
      const result = await new Promise((resolve, reject) => {  // Await inside Promise
        const stream = cloudinary.uploader.upload_stream(
          { folder: 'farmers-market/profiles', use_filename: true, unique_filename: false },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        );
        stream.end(req.file.buffer);
      });
      profileImageUrl = result.secure_url;
    }

    const user = new User({
      name,
      email,
      password: hashedPassword,
      role,
      location,
      profileImage: profileImageUrl,
    });
    await user.save();  // Await inside
    await Otp.deleteOne({ email });  // Await inside
    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    console.error('Error registering user:', error);
    res.status(500).json({ message: 'Error registering user', error: error.message });
  }
};

const login = async (req, res) => {  // Ensure async
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });  // Await inside
    if (!user) return res.status(400).json({ message: 'User not found' });
    const isMatch = await bcrypt.compare(password, user.password);  // Await inside
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );
    res.json({ token, user: { id: user._id, name: user.name, role: user.role } });
  } catch (error) {
    res.status(500).json({ message: 'Error logging in', error: error.message });
  }
};

const getProfile = async (req, res) => {  // Ensure async
  try {
    const user = await User.findById(req.user.id).select('-password');  // Await inside
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (error) {
    console.error('Error fetching profile:', error);
    res.status(500).json({ message: 'Error fetching profile', error: error.message });
  }
};

const updateUpiId = async (req, res) => {  // Ensure async
  const { upiId } = req.body;
  try {
    const user = await User.findById(req.user.id);  // Await inside
    if (!user) return res.status(404).json({ message: 'User not found' });
    user.upiId = upiId;
    await user.save();  // Await inside
    res.json({ message: 'UPI ID updated successfully' });
  } catch (error) {
    console.error('Error updating UPI ID:', error);
    res.status(500).json({ message: 'Error updating UPI ID', error: error.message });
  }
};

const updateFarmLocation = async (req, res) => {  // Ensure async
  const { coordinates, pinCode } = req.body;
  try {
    const user = await User.findById(req.user.id);  // Await inside
    if (!user) return res.status(404).json({ message: 'User not found' });
    user.farmLocation = { coordinates, pinCode };
    await user.save();  // Await inside
    res.json({ message: 'Farm location updated successfully' });
  } catch (error) {
    console.error('Error updating farm location:', error);
    res.status(500).json({ message: 'Error updating farm location', error: error.message });
  }
};

const requestWithdrawal = async (req, res) => {  // Ensure async
  const { amount } = req.body;
  try {
    const user = await User.findById(req.user.id);  // Await inside
    if (!user) return res.status(404).json({ message: 'User not found' });
    if (!user.upiId) return res.status(400).json({ message: 'UPI ID not linked' });
    const withdrawal = new Withdrawal({
      farmer: user._id,
      amount,
      upiId: user.upiId,
    });
    await withdrawal.save();  // Await inside
    res.json({ message: 'Withdrawal request submitted successfully' });
  } catch (error) {
    console.error('Error requesting withdrawal:', error);
    res.status(500).json({ message: 'Error requesting withdrawal', error: error.message });
  }
};

module.exports = { 
  register, 
  login, 
  getProfile, 
  sendOtp, 
  verifyOtp, 
  updateUpiId, 
  updateFarmLocation, 
  requestWithdrawal, 
  sendResetOtp, 
  verifyResetOtp, 
  resetPassword 
};
