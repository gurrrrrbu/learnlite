import jwt from "jsonwebtoken";

const SECRET = process.env.JWT_SECRET!;

// 🔹 Create a JWT token
export function signJWT(payload: object) {
  return jwt.sign(payload, SECRET, { expiresIn: "7d" });
}

// 🔹 Verify a JWT token
export function verifyJWT(token: string) {
  try {
    return jwt.verify(token, SECRET);
  } catch (error) {
    return null;
  }
}
