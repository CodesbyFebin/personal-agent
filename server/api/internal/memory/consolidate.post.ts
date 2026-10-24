import { requireInternalRequest } from "~~/server/utils/internal-api";
import { getL2Memory } from "~~/server/utils/memory";
import { db, schema } from "@nuxthub/db";

export default defineEventHandler(async (event) => {
  requireInternalRequest(event);

  const body = await readBody(event);
  const userId = body.userId;

  if (!userId) {
    throw createError({ statusCode: 400, statusMessage: "userId required" });
  }

  // Fetch L2 Memory
  const l2Episodes = await getL2Memory(userId);

  // Basic Consolidation Logic (Mock nightly process based on frequency)
  // Find frequent entities/patterns in L2 and promote to L3 (Semantic Memory)
  const entityFrequency: Record<string, number> = {};

  for (const ep of l2Episodes) {
    if (ep.salience > 0.5) { // Only consider salient episodes
        for (const entity of ep.entities || []) {
            entityFrequency[entity] = (entityFrequency[entity] || 0) + 1;
        }
    }
  }

  const consolidated = [];

  for (const [entity, count] of Object.entries(entityFrequency)) {
      if (count > 2) {
          // Promote to L3
          const id = crypto.randomUUID();
          await db.insert(schema.l3SemanticMemory).values({
              id,
              userId,
              nodeType: "preference",
              nodeKey: entity,
              nodeValue: `Inferred from ${count} episodes`,
              confidence: Math.min(count * 0.1 + 0.5, 0.99), // Example confidence calc
              lastVerified: new Date().toISOString(),
              source: "consolidated_from_l2",
              supersedes: null
          });
          consolidated.push(entity);
      }
  }

  // In a real scenario we might decay L2 salience over time here as well (Forget).

  return { consolidated, count: consolidated.length };
});
