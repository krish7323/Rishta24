import { Request, Response, NextFunction } from 'express';
import { logger } from '../utils/logger';
import { sendError } from '../utils/response';
import { ENV } from '../config/env';

export const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  logger.error(`Unhandled Error: ${err.message}`, { stack: err.stack, path: req.path });

  // Mongoose CastError
  if (err.name === 'CastError') {
    sendError(res, `Resource not found: Invalid ${err.path}`, 400, 'INVALID_RESOURCE_ID');
    return;
  }

  // Mongoose duplicate key
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    sendError(res, `A record with this ${field} already exists.`, 409, 'DUPLICATE_KEY_ERROR');
    return;
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    sendError(res, 'Invalid authorization token', 401, 'INVALID_TOKEN');
    return;
  }

  if (err.name === 'TokenExpiredError') {
    sendError(res, 'Authorization token expired', 401, 'TOKEN_EXPIRED');
    return;
  }

  const message = ENV.NODE_ENV === 'production' ? 'Internal server error' : err.message;
  sendError(res, message, err.statusCode || 500, err.code || 'SERVER_ERROR');
};
