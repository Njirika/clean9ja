import jwt from 'jsonwebtoken';
import { env } from '../config/env';

export interface JwtPayload {
  userId: string;
  role: string;
}

export const generateToken = (userId: string, role: string): string => {
  return jwt.sign({ userId, role }, env.jwtSecret, {
    expiresIn: env.jwtExpiresIn as any,
  });
};

export const verifyToken = (token: string): JwtPayload => {
  return jwt.verify(token, env.jwtSecret) as JwtPayload;
};
