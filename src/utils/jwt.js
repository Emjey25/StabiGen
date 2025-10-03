import jwt from "jsonwebtoken";
import logger from "../config/logger.js";

const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret_key";
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "1d";

export const jwttoken = {
  sign: (payload, secret = JWT_SECRET, options = { expiresIn: JWT_EXPIRES_IN }) => {
    try {
      return jwt.sign(payload, secret, options);
    } catch (error) {
      logger.error("Error signing JWT:", error);
      throw new Error("Failed to sign JWT token");
    }
  },
  verify: (token) => {
    try {
      return jwt.verify(token, JWT_SECRET);
    } catch (error) {
      logger.error("Error verifying JWT:", error);
      throw new Error("Invalid token");
    }
  },
};

export default jwttoken;
