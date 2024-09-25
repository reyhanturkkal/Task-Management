import jwt from 'jsonwebtoken';
import User from "@/models/User";
import type { NextRequest } from 'next/server';

interface DecodedToken {
  userId: string;
}

export async function getUserFromToken(request: NextRequest, isMiddleware: boolean) {
  const prefix = `[${isMiddleware ? "Middleware" : "Outer"}]`;
  const token = request.headers.get('Authorization')?.replace('Bearer ', '');
  if (!token) {
    console.log(prefix + 'Token not found in headers');
    return null;
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as DecodedToken;

    if (!decoded) {
      return null;
    }
    const userID = decoded.userId as string;

    if (!userID) {
      console.log(prefix + 'User ID not found in token');
      return null;
    }

    console.log(prefix + "middleware user");

    const user = await User.findById(userID);
    console.log(prefix + user);

    if (!user) {
      console.log(prefix + 'User not found in database');
      return null;
    }

    return user;
  } catch (error) {
    console.error(prefix + 'JWT verification error:', error);
    return null;
  }
}
