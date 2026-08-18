import { Response, NextFunction } from 'express';
import { AuthRequest } from './auth';
import { AuditLog } from '../models/AuditLog';
import { Types } from 'mongoose';

export const logAdminAction = (action: string, resourceType: string) => {
  return async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    // Wrap res.send or capture on finish
    res.on('finish', async () => {
      if (res.statusCode >= 200 && res.statusCode < 300 && req.user) {
        try {
          await AuditLog.create({
            admin: new Types.ObjectId(req.user.userId),
            action,
            resourceType,
            resourceId: req.params.id || req.body.id || req.body.userId,
            details: {
              body: req.body,
              params: req.params,
              query: req.query,
            },
            ipAddress: req.ip,
            userAgent: req.headers['user-agent'],
          });
        } catch (err) {
          // silently fail to avoid disrupting main flow
        }
      }
    });
    next();
  };
};
