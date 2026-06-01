import { Request, Response, NextFunction } from 'express';
import { ApiError } from '../utils/ApiError';
import { ApiResponse } from '../utils/ApiResponse';
import { logger } from '../utils/logger';
import { env } from '../config/env';

export const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let error = err;

  if (!(error instanceof ApiError)) {
    const statusCode = error.statusCode || 500;
    const message = error.message || 'Internal Server Error';
    error = new ApiError(statusCode, message, false, err.stack);
  }

  const { statusCode, message } = error;

  res.locals.errorMessage = error.message;

  const response = {
    ...ApiResponse.error(message),
    ...(env.nodeEnv === 'development' && { stack: err.stack }),
  };

  if (env.nodeEnv === 'development') {
    logger.error(error);
  }

  res.status(statusCode).json(response);
};
