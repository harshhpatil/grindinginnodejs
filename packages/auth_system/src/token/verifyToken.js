import jwt from "jsonwebtoken";

export function verifyToken(token, secret) {
  if (!token || !secret) {
    throw new Error("token and secret are required to verify a token.");
  }

  return jwt.verify(token, secret);
}
