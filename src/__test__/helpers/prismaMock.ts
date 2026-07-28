import { mockDeep, mockReset } from "vitest-mock-extended";
import { PrismaClient } from "@prisma/client";
import * as cache from "../../utils/cache";

// Buat instance mock SATU KALI di sini
export const prismaMock = mockDeep<PrismaClient>();

// Pakai instance yang sama di factory
vi.mock("../../config/prisma", () => ({
  prisma: prismaMock,
}));

beforeEach(() => {
  mockReset(prismaMock);
  vi.spyOn(cache, "getCached").mockResolvedValue(null);
  vi.spyOn(cache, "setCache").mockResolvedValue();
});
