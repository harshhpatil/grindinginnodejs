import jwt from "jsonwebtoken";

export function generateRefreshToken(payload, secret, expiresIn = "7d") {
  if (!payload || !secret) {
    throw new Error(
      "payload and secret are required to generate a refresh token.",
    );
  }

  return jwt.sign(payload, secret, { expiresIn });
}
