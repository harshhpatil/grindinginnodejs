import jwt from "jsonwebtoken";

export const authMiddleware = (req, res, next) => {
  try {
    const token = req.cookie.access_tk;
    if (!token)
      return res.status(401).json({ message: "authentication required" });

    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN);
    req.user = decoded;

    next();
  } catch (err) {
    console.error("error occured in the auth middleware");
    return res.status(403).json({ message: "invalid or expired session." });
  }
};
