import EventRegistration from "../models/event.model.js";
import cloudinary from "cloudinary";
import { registrationMail } from "../services/mail.services.js";

export const register = async (req, res) => {
  try {
    const {
      name,
      email,
      clgName,
      registrationNo,
      branch,
      mobile,
      batch,
      events, // This should be an array
      teamName,
      tshirtSize,
    } = req.body;

    const paymentProof = req.files?.paymentProof;

    if (
      !name ||
      !email ||
      !clgName ||
      !registrationNo ||
      !branch ||
      !mobile ||
      !batch ||
      !events ||
      events.length === 0 || // Ensure events is not empty
      !paymentProof ||
      !tshirtSize
    ) {
      return res
        .status(400)
        .json({ message: "Please fill all required fields" });
    }

    // Upload payment proof to Cloudinary
    const uploadedImage = await cloudinary.uploader.upload(
      paymentProof.tempFilePath
    );
    const paymentProofUrl = uploadedImage.secure_url;

    const randomDigits = Math.floor(1000 + Math.random() * 9000);
    const studentEventId = `NEX${randomDigits}`;

    // Save registration to the database
    const newRegistration = new EventRegistration({
      studentEventId,
      name,
      email,
      clgName,
      registrationNo,
      branch,
      mobile,
      batch,
      event: events, // Store array of selected events
      teamName,
      paymentProof: paymentProofUrl,
      tshirtSize,
    });

    await newRegistration.save();

    // Send confirmation email
    await registrationMail(name, studentEventId, email);

    res
      .status(201)
      .json({ message: "Registration successful", newRegistration });
  } catch (error) {
    console.error("Registration Error:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

// Get all Registrations
export const getAllRegistrations = async (req, res) => {
  const userRole = req.user.role;
  if (userRole !== "admin") {
    return res.status(403).json({ message: "Unauthorized Access" });
  }

  try {
    const registrations = await EventRegistration.find();
    res.status(200).json(registrations);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get Single Registration
export const getRegistration = async (req, res) => {
  try {
    const registration = await EventRegistration.findById(req.params.id);
    if (!registration) return res.status(404).json({ message: "Not found" });
    res.status(200).json(registration);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getRegistrationByEmail = async (req, res) => {
  try {
    const email = req.user.email;
    // console.log(email);

    const registrations = await EventRegistration.find({ email });

    if (!registrations.length) {
      return res
        .status(404)
        .json({ message: "No registration found for this user" });
    }

    res.status(200).json({
      message: "Registration found",
      registrations,
    });
  } catch (error) {
    console.error("Error fetching registration:", error);
    res.status(500).json({ message: "Server error" });
  }
};
