import { Request, Response, NextFunction } from 'express';
import { verifyAccessToken, TokenPayload } from '../utils/jwt';
import { sendError } from '../utils/response';
import { User } from '../models/User';
import { ACCOUNT_STATUS } from '../config/constants';

export interface AuthRequest extends Request {
  user?: TokenPayload;
}

export const authenticate = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      sendError(res, 'Authentication token required', 401, 'UNAUTHORIZED');
      return;
    }

    const token = authHeader.split(' ')[1];
    const decoded = verifyAccessToken(token);

    // Verify user is still active in database & get fresh role
    const user = await User.findById(decoded.userId).select('status role email');
    if (!user) {
      sendError(res, 'User no longer exists', 401, 'USER_NOT_FOUND');
      return;
    }

    if (user.status === ACCOUNT_STATUS.BANNED || user.status === ACCOUNT_STATUS.SUSPENDED) {
      sendError(res, `Your account has been ${user.status.toLowerCase()}`, 403, 'ACCOUNT_LOCKED');
      return;
    }

    req.user = {
      userId: user._id.toString(),
      email: user.email,
      role: user.role, // Always use fresh database role
    };
    next();
  } catch (error: any) {
    sendError(res, 'Invalid or expired session token', 401, 'TOKEN_EXPIRED');
  }
};
