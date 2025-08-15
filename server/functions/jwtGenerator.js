const jwt = require("jsonwebtoken");
require("dotenv").config();

function jwtGenerator(uid) {
  const payload = {
    user: {
      id: uid
    }
  };

  // Use environment variable or fallback to a default secret
  const secret = process.env.jwtSecret || "gshfghssdfhsdfhdfghdsfhsdheftsdfghdgfhdsfh";
  
  if (!process.env.jwtSecret) {
    console.warn("Warning: jwtSecret not found in environment variables. Using fallback secret.");
  }

  return jwt.sign(payload, secret, { expiresIn: "1h" });
}

module.exports = jwtGenerator;