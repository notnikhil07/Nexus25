import jwt from "jsonwebtoken";

const setCookieAndGenerateToken = (res, userId) => {
  const token = jwt.sign({ userId }, process.env.JWT_SECRET_KEY, {
    expiresIn: "7d",
  });
  res.cookie("Nexus", token, {
    httpOnly: true,
    maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
    secure: process.env.NODE_ENV === "production", // true for HTTPS
    sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",
  });
  return token;
};

export default setCookieAndGenerateToken;
