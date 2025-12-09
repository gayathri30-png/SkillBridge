import jwt from "jsonwebtoken";

export const protect = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "Not authorized, no token" });
  }

  try {
    const decoded = jwt.verify(token, "MY_SECRET_KEY"); // change later
    req.user = decoded.id;
    next();
  } catch (err) {
    return res.status(401).json({ message: "Not authorized, token failed" });
  }
};
