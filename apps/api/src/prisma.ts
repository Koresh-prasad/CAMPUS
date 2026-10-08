import { PrismaClient } from '@prisma/client';
import path from 'path';
import fs from 'fs';

function resolveDatabaseUrl(): string {
  const envUrl = process.env.DATABASE_URL;
  // If an external database (postgresql://, mysql://, etc.) or absolute file: is specified and valid, use it
  if (envUrl && !envUrl.startsWith('file:.') && !envUrl.startsWith('file://.')) {
    return envUrl;
  }

  // Look for dev.db in potential locations
  const candidates = [
    path.resolve(process.cwd(), 'prisma/dev.db'),
    path.resolve(process.cwd(), 'apps/api/prisma/dev.db'),
    path.resolve(__dirname, '../prisma/dev.db'),
    path.resolve(__dirname, '../../prisma/dev.db'),
    path.resolve(__dirname, '../../../prisma/dev.db'),
  ];

  for (const candidate of candidates) {
    if (fs.existsSync(candidate) && fs.statSync(candidate).size > 0) {
      return `file:${path.resolve(candidate)}`;
    }
  }

  // Fallback to dev.db next to schema
  const fallback = path.resolve(__dirname, '../prisma/dev.db');
  return `file:${fallback}`;
}

const activeDbUrl = resolveDatabaseUrl();
process.env.DATABASE_URL = activeDbUrl;

export const prisma = new PrismaClient({
  datasources: {
    db: {
      url: activeDbUrl,
    },
  },
});
