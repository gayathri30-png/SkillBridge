import jwt from "jsonwebtoken";

export const protect = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Not authorized, no token" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, "MY_SECRET_KEY");

    // FIX: Store entire decoded object, not just id
    req.user = decoded; // This contains { id, email, role }

    next();
  } catch (err) {
    console.error("Token verification error:", err);
    return res.status(401).json({ message: "Not authorized, token failed" });
  }
};
