import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { UserRole } from '@shms/shared';
import { prisma } from '../prisma';

const JWT_SECRET = process.env.JWT_SECRET || 'shms_super_secret_jwt_key_9999';

export interface AuthenticatedUser {
  id: string;
  email: string;
  role: UserRole;
  tenantId: string;
  name: string;
}

declare global {
  namespace Express {
    interface Request {
      user?: AuthenticatedUser;
    }
  }
}

export function authMiddleware(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Authorization header missing or invalid' });
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as AuthenticatedUser;
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Token expired or invalid signature' });
  }
}

export function optionalAuthMiddleware(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.split(' ')[1];
    try {
      const decoded = jwt.verify(token, JWT_SECRET) as AuthenticatedUser;
      req.user = decoded;
    } catch (e) {
      // ignore
    }
  }
  next();
}

export function requireRole(...roles: UserRole[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Unauthenticated' });
    }
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ error: `Forbidden: requires role ${roles.join(' or ')}` });
    }
    next();
  };
}

export async function createAuditRecord(
  actorId: string | null,
  actorRole: string,
  action: string,
  entity: string,
  entityId: string,
  details: Record<string, any>
) {
  try {
    await prisma.auditLog.create({
      data: {
        actorId: actorId || undefined,
        actorRole,
        action,
        entity,
        entityId,
        detailsJson: JSON.stringify(details)
      }
    });
  } catch (err) {
    console.error('[AuditLog] Error recording audit trail:', err);
  }
}
