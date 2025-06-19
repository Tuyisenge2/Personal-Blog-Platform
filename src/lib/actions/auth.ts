// src/lib/actions/auth.ts
import jwt, { JwtPayload } from "jsonwebtoken";

// Ensure JWT_SECRET is defined and is a string
const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
  throw new Error("JWT_SECRET is not defined in environment variables");
}

// Convert to Buffer if needed (some JWT implementations require this)
const secretBuffer = Buffer.from(JWT_SECRET, 'utf-8');

interface TokenPayload extends JwtPayload {
  userId: number;
  isAdmin: boolean;
}

export const generateToken = (userId: number, isAdmin: boolean = false): string => {
  return jwt.sign({ userId, isAdmin }, secretBuffer, {
    algorithm: 'HS256',
    expiresIn: "1d",
  });
};

export const verifyToken = (token: string): TokenPayload => {
  try {
    if (!token) {
      throw new Error("No token provided");
    }
    
    // Verify using the same secret format used for signing
    const decoded = jwt.verify(token, secretBuffer, { algorithms: ['HS256'] });
    
    // Type check the decoded payload
    if (typeof decoded === 'string' || !decoded.userId) {
      throw new Error("Invalid token payload");
    }
    
    return decoded as TokenPayload;
  } catch (error) {
    console.error("Token verification failed:", error);
    throw error;
  }
};


// import jwt, { JwtPayload } from "jsonwebtoken";

// // Ensure JWT_SECRET is defined
// const JWT_SECRET = process.env.JWT_SECRET;
// if (!JWT_SECRET) {
//   throw new Error("JWT_SECRET is not defined in environment variables");
// }

// const JWT_SECRET_STR = JWT_SECRET as string;

// interface TokenPayload extends JwtPayload {
//   userId: number;
//   isAdmin: boolean;
// }

// export const generateToken = (
//   userId: number,
//   isAdmin: boolean = false
// ): string => {
//   return jwt.sign({ userId, isAdmin }, JWT_SECRET_STR, {
//     expiresIn: "1d",
//   });
// };

// export const verifyToken = (token: string): TokenPayload => {
//   try {
//     if (!token) {
//       throw new Error("No token provided");
//     }
//     console.log("tsunamiiiiiiiiiiiiiiiiiiiiiiiiiiiiii", token, JWT_SECRET_STR);
//     return jwt.verify(token, JWT_SECRET) as TokenPayload;
//   } catch (error) {
//     console.error("Token verification failed:", error);
//     throw error; // Re-throw the error to handle it in the calling function
//   }
// };
