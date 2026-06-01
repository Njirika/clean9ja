import { Request, Response, NextFunction } from 'express';
import { AuthService } from '../services/auth.service';
import { ApiResponse } from '../utils/ApiResponse';
import { env } from '../config/env';

const authService = new AuthService();

const sendTokenResponse = (user: any, token: string, statusCode: number, res: Response) => {
  const options = {
    expires: new Date(Date.now() + 24 * 60 * 60 * 1000), // 1 day
    httpOnly: true,
    secure: env.nodeEnv === 'production',
    sameSite: env.nodeEnv === 'production' ? 'none' as const : 'lax' as const,
  };

  user.passwordHash = undefined;

  res
    .status(statusCode)
    .cookie('jwt', token, options)
    .json(ApiResponse.success('Authentication successful', { user, token }));
};

export const register = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { user, token } = await authService.register(req.body);
    sendTokenResponse(user, token, 201, res);
  } catch (error) {
    next(error);
  }
};

export const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { user, token } = await authService.login(req.body);
    sendTokenResponse(user, token, 200, res);
  } catch (error) {
    next(error);
  }
};

export const logout = (req: Request, res: Response) => {
  res.cookie('jwt', 'none', {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true,
  });

  res.status(200).json(ApiResponse.success('Logged out successfully.'));
};

export const getMe = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = await authService.getMe(req.user.id);
    res.status(200).json(ApiResponse.success('User profile retrieved', { user }));
  } catch (error) {
    next(error);
  }
};

export const updateMe = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = await authService.updateProfile(req.user.id, req.body);
    res.status(200).json(ApiResponse.success('Profile updated', { user }));
  } catch (error) {
    next(error);
  }
};
