import { internalMemoryQuerySchema } from "~~/server/schemas/memory";
import { listMemoryForUser, getL2Memory, getL3Memory, getL4Memory } from "~~/server/utils/memory";
import { getOrCreateProfileForUser } from "~~/server/utils/profile";
import { requireInternalRequest } from "~~/server/utils/internal-api";

export default defineEventHandler(async (event) => {
  requireInternalRequest(event);

  const { userId } = await getValidatedQuery(event, internalMemoryQuerySchema.parse);
  const [profile, memory, l2, l3, l4] = await Promise.all([
    getOrCreateProfileForUser(userId),
    listMemoryForUser(userId),
    getL2Memory(userId),
    getL3Memory(userId),
    getL4Memory(userId)
  ]);

  return { profile, memory, l2, l3, l4 };
});
