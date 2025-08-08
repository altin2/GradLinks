const jwt = require("jsonwebtoken")
require("dotenv").config()
module.exports = async(req,res,next)=>{

  const token = req.header("jwt_token");

  if (!token) {
    return res.status(403).json({ msg: "authorization denied" });
  }

  try {
    // Use environment variable or fallback to a default secret
    const secret = process.env.jwtSecret || "fallback_jwt_secret_key_for_development_only";
    
    if (!process.env.jwtSecret) {
      console.warn("Warning: jwtSecret not found in environment variables. Using fallback secret.");
    }

    const verify = jwt.verify(token, secret);

    req.user = verify.user;
    next();
  } catch (err) {
    res.status(401).json({ msg: "Token is not valid" });
  }
}