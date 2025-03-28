import sendMail from "../utilities/nodemailer.js";

export const verificationMail = async (email, verificationToken) => {
  const Template = `Nexus Verification Token : ${verificationToken}`;

  sendMail(email, "Nexus 📦⚡", ``, Template);
};

export const verificationSuccessfullMail = (email) => {
  const Template = "Your verification is successful!";

  sendMail(email, "Nexus 📦⚡", ``, Template);
};

export const userLoggedInMail = async (email, ip) => {
  const Template = "You have logged in currently. ";
  sendMail(email, "Nexus 📦⚡", ``, Template);
};

export const passwordResetMail = async (email, resetToken) => {
  const Template = `Click the following link to reset your password: https://your-domain.com/reset-password/${resetToken}`;

  sendMail(email, "Nexus 📦⚡", ``, Template);
};
export const passwordResetSuccessMail = (email) => {
  const Template = "Your password reset is successful!";
  sendMail(email, "Nexus 📦⚡", ``, Template);
};

export const registrationMail = (name, studentEventId, email) => {
  const Template = `Dear ${name},\n\nYou have registered for the event with ID: ${studentEventId}.\n\nThank you for your interest.\n\nBest regards,\nNexus Team`;
  const newTemplate = `Dear Admin,\n\n Someone has registered on Nexus with event with ID: ${studentEventId}.\n\nLogin with admin account to see the full details.\n\nBest regards,\nNexus Team`;
  sendMail(email, "Nexus 📦⚡", ``, Template);
  sendMail("nexus25.asimo@gmail.com", "Nexus 📦⚡", ``, newTemplate);
};
