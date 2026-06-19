import { beforeEach } from 'vitest';
import { mockDeep, mockReset } from 'vitest-mock-extended';
import { PrismaClient } from '@prisma/client';


// Buat instance mock SATU KALI di sini
export const prismaMock = mockDeep<PrismaClient>();

// Pakai instance yang sama di factory
vi.mock('../../config/prisma', () => ({
  prisma: prismaMock,
}));

beforeEach(() => {
  mockReset(prismaMock);
});