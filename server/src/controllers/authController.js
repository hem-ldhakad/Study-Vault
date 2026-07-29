const jwt = require('jsonwebtoken');
const User = require('../models/User');
const AppError = require('../utils/appError');
const asyncHandler = require('../utils/asyncHandler');
const { generateAccessToken, generateRefreshToken } = require('../utils/generateToken');

// @desc    Register a new user (Requires adminSecret for Admin role)
// @route   POST /api/auth/register
// @access  Public
const registerUser = asyncHandler(async (req, res, next) => {
  const { name, email, password, role, adminSecret } = req.body;

  if (!name || !email || !password) {
    return next(new AppError('Please provide name, email, and password', 400));
  }

  const normalizedEmail = email.trim().toLowerCase();

  // Check if user already exists
  const existingUser = await User.findOne({ email: normalizedEmail });
  if (existingUser) {
    return next(new AppError('User with this email address already exists. Please sign in instead.', 400));
  }

  let userRole = 'user';

  // Admin secret validation with whitespace trimming
  if (role === 'admin') {
    const requiredSecret = (process.env.ADMIN_SECRET_KEY || 'hemal').trim();
    if (!adminSecret || adminSecret.trim() !== requiredSecret) {
      return next(new AppError('Invalid Admin Secret Key. Registration as Administrator denied.', 400));
    }
    userRole = 'admin';
  }

  const user = await User.create({
    name: name.trim(),
    email: normalizedEmail,
    password,
    role: userRole,
  });

  const accessToken = generateAccessToken(user._id);
  const refreshToken = generateRefreshToken(user._id);

  // Save refresh token to user document
  user.refreshToken = refreshToken;
  await user.save({ validateBeforeSave: false });

  res.status(201).json({
    status: 'success',
    message: 'Account registered successfully',
    data: {
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        bookmarks: user.bookmarks,
      },
      accessToken,
      refreshToken,
    },
  });
});

// @desc    Login user directly (returns tokens for both User and Admin)
// @route   POST /api/auth/login
// @access  Public
const loginUser = asyncHandler(async (req, res, next) => {
  const { email, password, adminSecret } = req.body;

  if (!email || !password) {
    return next(new AppError('Please provide email and password', 400));
  }

  const normalizedEmail = email.trim().toLowerCase();
  const user = await User.findOne({ email: normalizedEmail });

  if (!user) {
    return next(new AppError('No account found with this email. Please register first.', 404));
  }

  if (!(await user.matchPassword(password))) {
    return next(new AppError('Incorrect password. Please check your credentials.', 401));
  }

  // If Admin role, validate adminSecret if provided or required
  if (user.role === 'admin' && adminSecret) {
    const requiredSecret = (process.env.ADMIN_SECRET_KEY || 'hemal').trim();
    if (adminSecret.trim() !== requiredSecret) {
      return next(new AppError('Invalid Admin Secret Key', 400));
    }
  }

  // Generate tokens directly for User and Admin
  const accessToken = generateAccessToken(user._id);
  const refreshToken = generateRefreshToken(user._id);

  user.refreshToken = refreshToken;
  await user.save({ validateBeforeSave: false });

  res.status(200).json({
    status: 'success',
    message: 'Logged in successfully',
    data: {
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        bookmarks: user.bookmarks,
      },
      accessToken,
      refreshToken,
    },
  });
});

// @desc    Refresh Access Token using Refresh Token
// @route   POST /api/auth/refresh-token
// @access  Public
const refreshToken = asyncHandler(async (req, res, next) => {
  const { refreshToken: token } = req.body;

  if (!token) {
    return next(new AppError('Refresh Token is required', 400));
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET || 'studyvault_jwt_refresh_secret');
    const user = await User.findById(decoded.id);

    if (!user || user.refreshToken !== token) {
      return next(new AppError('Invalid refresh token or session revoked', 401));
    }

    const newAccessToken = generateAccessToken(user._id);

    res.status(200).json({
      status: 'success',
      data: {
        accessToken: newAccessToken,
      },
    });
  } catch (error) {
    return next(new AppError('Invalid or expired refresh token', 401));
  }
});

// @desc    Logout user & clear refresh token
// @route   POST /api/auth/logout
// @access  Private
const logoutUser = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.userId);
  if (user) {
    user.refreshToken = null;
    await user.save({ validateBeforeSave: false });
  }

  res.status(200).json({
    status: 'success',
    message: 'Logged out successfully',
  });
});

// @desc    Get Current Logged In User Profile
// @route   GET /api/auth/me
// @access  Private
const getMe = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.userId).select('-password');
  if (!user) {
    return next(new AppError('User not found', 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        bookmarks: user.bookmarks,
        createdAt: user.createdAt,
      },
    },
  });
});

module.exports = {
  registerUser,
  loginUser,
  refreshToken,
  logoutUser,
  getMe,
};
