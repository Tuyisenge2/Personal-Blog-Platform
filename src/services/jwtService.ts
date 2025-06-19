// src/lib/actions/auth.ts
import jwt, { JwtPayload } from "jsonwebtoken";

// Ensure JWT_SECRET is defined
const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
  throw new Error("JWT_SECRET is not defined in environment variables");
}

// Create a type-safe secret
const jwtSecret: jwt.Secret = JWT_SECRET;

interface TokenPayload extends JwtPayload {
  userId: number;
  isAdmin: boolean;
}

export const generateToken = (userId: number, isAdmin: boolean = false): string => {
  return jwt.sign(
    { userId, isAdmin },
    jwtSecret,
    { 
      algorithm: 'HS256',
      expiresIn: "1d" 
    }
  );
};

export const verifyToken = (token: string): TokenPayload => {
  try {
    if (!token) {
      throw new Error("No token provided");
    }

    // Verify the token with explicit typing
    const decoded = jwt.verify(token, jwtSecret, { algorithms: ['HS256'] });
    
    // Type guard for the payload
    if (typeof decoded === 'string' || !('userId' in decoded)) {
      throw new Error("Invalid token payload");
    }

    return decoded as TokenPayload;
  } catch (error) {
    console.error("Token verification failed:", error);
    throw error;
  }
};