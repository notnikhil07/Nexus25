import User from "../models/user.model.js";
import bcrypt from "bcrypt";
import crypto from "crypto";
import setCookieAndGenerateToken from "../utilities/setCookieAndGenerateToken.js";
import {
  passwordResetMail,
  userLoggedInMail,
  verificationMail,
  verificationSuccessfullMail,
} from "../services/mail.services.js";

export const signup = async (req, res) => {
  const { fullname, email, password } = req.body;
  try {
    if (!email || !fullname || !password) {
      return res.status(400).json({
        success: false,
        message: "Please provide all required fields",
      });
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: "Please provide a valid email address",
      });
    }

    if (password.length < 8) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 8 characters long",
      });
    }
    const user = await User.findOne({ email: email });
    if (user) {
      return res.status(400).json({
        success: false,
        message: "Email already exists",
      });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const verificationToken = crypto.randomInt(100000, 999999).toString();
    const verificationTokenExpiresIn = Date.now() + 24 * 60 * 60 * 1000;

    const newUser = new User({
      fullname,
      email,
      password: hashedPassword,
      verificationToken,
      verificationTokenExpiresIn,
    });
    await newUser.save();
    await setCookieAndGenerateToken(res, newUser._id);
    verificationMail(email, verificationToken);
    newUser.password = undefined;

    res.status(201).json({
      success: true,
      message: "User signed up successfully",
      data: newUser,
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({
      success: false,
      message: "Couldn't sign up. Please try again later",
    });
  }
};

export const verifyEmail = async (req, res) => {
  const { verificationToken } = req.body;
  try {
    const user = await User.findOne({
      verificationToken: verificationToken,
      verificationTokenExpiresIn: { $gt: Date.now() },
    });
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Invalid verification token",
      });
    }
    if (user.verificationTokenExpiresIn < Date.now()) {
      return res.status(400).json({
        success: false,
        message: "Verification token has expired",
      });
    }
    user.isVerified = true;
    user.verificationToken = null;
    user.verificationTokenExpiresIn = null;
    await user.save();
    res.status(200).json({
      success: true,
      message: "Email verified successfully",
      data: user,
    });

    verificationSuccessfullMail(user.email);
  } catch (error) {
    console.log(error.message);
    res.status(500).json({
      success: false,
      message: "Couldn't verify email. Please try again later",
    });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Please provide all required fields",
      });
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: "Please provide a valid email address",
      });
    }
    if (password.length < 8) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 8 characters long",
      });
    }
    const user = await User.findOne({ email: email });
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Invalid Credentials",
      });
    }
    // if (!user.isVerified) {
    //   return res.status(400).json({
    //     success: false,
    //     message:
    //       "Email is not verified. Please verify your email address first",
    //   });
    // }

    const hashedPassword = await bcrypt.compare(password, user.password);
    if (!hashedPassword) {
      return res.status(400).json({
        success: false,
        message: "Email or password is incorrect",
      });
    }

    await setCookieAndGenerateToken(res, user._id);
    res.status(200).json({
      success: true,
      message: "Logged in successfully",
      data: user,
    });
    const ip =
      req.headers["x-forwarded-for"]?.split(",")[0] || req.socket.remoteAddress;
    await userLoggedInMail(email, ip);
  } catch (error) {
    console.log(error.message);
    res.status(500).json({
      success: false,
      message: "Couldn't log in. Please try again later",
    });
  }
};

export const logout = async (req, res) => {
  try {
    res.clearCookie("Nexus");
    res.status(200).json({
      success: true,
      message: "Logged out successfully",
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({
      success: false,
      message: "Couldn't log out. Please try again later",
    });
  }
};
export const forgotPassword = async (req, res) => {
  const { email } = req.body;
  try {
    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Please provide your email address",
      });
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: "Please provide a valid email address",
      });
    }

    const user = await User.findOne({ email: email });
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "No user found with this email address",
      });
    }
    const resetToken = crypto.randomInt(100000, 999999).toString();
    const resetTokenExpiresIn = Date.now() + 24 * 60 * 60 * 1000; // 1 day in milliseconds
    user.resetToken = resetToken;
    user.resetTokenExpiresIn = resetTokenExpiresIn;
    await user.save();
    passwordResetMail(email, resetToken);
    res.status(200).json({
      success: true,
      message: "Reset password email sent successfully",
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({
      success: false,
      message: "Couldn't send reset password email. Please try again later",
    });
  }
};

export const resetPassword = async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;
  try {
    if (!token || !password) {
      return res.status(400).json({
        success: false,
        message: "Please provide all required fields",
      });
    }
    if (password.length < 8) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 8 characters long",
      });
    }
    const user = await User.findOne({
      resetToken: token,
      resetTokenExpiresIn: { $gt: Date.now() },
    });
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Invalid reset password token or token has expired",
      });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    user.password = hashedPassword;
    user.resetToken = null;
    user.resetTokenExpiresIn = null;
    await user.save();
    passwordResetSuccessMail(user.email);
    res.status(200).json({
      success: true,
      message: "Password reset successfully",
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({
      success: false,
      message: "Couldn't reset password. Please try again later",
    });
  }
};
