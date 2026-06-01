import { Request, Response, NextFunction } from 'express';
import { prisma } from '../config/prisma';
import { verifyToken, JwtPayload } from '../utils/jwt';
import { ApiError } from '../utils/ApiError';

declare global {
  namespace Express {
    interface Request {
      user?: any;
    }
  }
}

export const requireAuth = async (req: Request, res: Response, next: NextFunction) => {
  try {
    let token;

    if (req.cookies && req.cookies.jwt) {
      token = req.cookies.jwt;
    } else if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return next(new ApiError(401, 'Not authenticated. Please log in.'));
    }

    const decoded = verifyToken(token);

    const currentUser = await prisma.user.findUnique({
      where: { id: decoded.userId },
    });

    if (!currentUser) {
      return next(new ApiError(401, 'The user belonging to this token no longer exists.'));
    }

    req.user = currentUser;
    next();
  } catch (error) {
    next(new ApiError(401, 'Invalid or expired token.'));
  }
};

export const requireRole = (...roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return next(new ApiError(403, 'You do not have permission to perform this action.'));
    }
    next();
  };
};
