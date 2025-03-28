import mongoose from "mongoose";

const eventRegistrationSchema = new mongoose.Schema(
  {
    studentEventId: {
      type: String,
      required: true,
    },
    name: { type: String, required: true },
    clgName: { type: String, required: true },
    registrationNo: { type: String, required: true },
    branch: { type: String, required: true },
    mobile: { type: String, required: true },
    email: { type: String, required: true },
    batch: { type: String, required: true },
    event: {
      type: [String], // Store multiple choices as an array of strings
      enum: [
        "Robo Kickoff",
        "Hurdle Hustle",
        "Path Follower",
        "Quizaholic",
        "Sand Surfer",
        "Victory Arena",
        "The Golden Quest",
        "Cadion",
        "Interface Insider",
        "Debug Dynamo",
        "Robo Rally",
        "Trush Arch",
        "Armstrong",
        "Startup Idea",
        "Thrust Arena",
        "Stall Showdown",
        "Amphibious Robot",
      ],

      required: true,
    },
    teamName: { type: String },
    paymentProof: { type: String, required: true },
  },
  { timestamps: true }
);

export default mongoose.model("EventRegistration", eventRegistrationSchema);
