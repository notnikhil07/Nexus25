import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465, // Use 587 if secure: false
  secure: true, // Use false for port 587
  auth: {
    user: "nexus25.asimo@gmail.com",
    pass: "huaq fqyx psvv bqow", // App Password
  },
});
async function sendMail(to, subject, text, html) {
  const info = await transporter.sendMail({
    from: '"Nexus 📦⚡" <nexus25.asimo@gmail.com>', // sender address
    to, // list of receivers
    subject, // Subject line
    text, // plain text body
    html, // html body
  });
}

export default sendMail;
