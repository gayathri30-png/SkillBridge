import jwt from "jsonwebtoken";

// Use the SAME JWT secret as in authController
const JWT_SECRET =
  process.env.JWT_SECRET ||
  "skillbridge_super_secret_key_2024_do_not_share_this";

export const protect = (req, res, next) => {
  console.log("🔐 Auth middleware checking token...");

  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    console.log("❌ No token or invalid format");
    return res.status(401).json({ message: "Not authorized, no token" });
  }

  const token = authHeader.split(" ")[1];
  console.log(
    "📋 Token received (first 30 chars):",
    token.substring(0, 30) + "..."
  );

  try {
    console.log("🔍 Verifying token with secret...");
    const decoded = jwt.verify(token, JWT_SECRET);

    console.log("✅ Token verified for user:", decoded.email);
    console.log("👤 User ID:", decoded.id, "Role:", decoded.role);

    // Store entire decoded user object
    req.user = decoded;

    next();
  } catch (err) {
    console.error("❌ Token verification error:", err.message);
    console.error("Error details:", err);

    // Specific error messages
    if (err.name === "JsonWebTokenError") {
      if (err.message === "invalid signature") {
        return res.status(401).json({
          message: "Token signature invalid - check JWT_SECRET matches",
          error: "JWT_SECRET mismatch between authController and middleware",
        });
      }
      if (err.message === "jwt malformed") {
        return res.status(401).json({
          message: "Token is malformed",
          error: "Token may be truncated or corrupted",
        });
      }
    }

    if (err.name === "TokenExpiredError") {
      return res.status(401).json({
        message: "Token has expired",
        error: "Login again to get new token",
      });
    }

    return res.status(401).json({
      message: "Not authorized, token failed",
      error: err.message,
    });
  }
};
