import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '../generated/client';
import "dotenv/config";

const connectionString = process.env.DATABASE_URL;

const pool = new Pool({
  connectionString,
  max: 10,                      // Max concurrent connections (match Supabase plan limits)
  idleTimeoutMillis: 30000,     // Close idle connections after 30s
  connectionTimeoutMillis: 5000, // Fail fast if connection takes > 5s
});

const adapter = new PrismaPg(pool as any);

export const prisma = new PrismaClient({ adapter, log: ['warn', 'error'] });

// Expose pool for graceful shutdown
export { pool };
