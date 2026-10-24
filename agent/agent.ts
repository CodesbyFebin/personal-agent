import { defineAgent } from "eve";

// In-memory KV store to mock session checkpointing across surfaces for the hackathon demo.
// In a real implementation, this would be a Redis or DB table.
const sessionCheckpoints = new Map<string, any>();

export function saveSessionCheckpoint(userId: string, context: any) {
    sessionCheckpoints.set(userId, context);
    console.log(`[Session Checkpoint] Saved for user ${userId}`);
}

export function loadSessionCheckpoint(userId: string) {
    const ctx = sessionCheckpoints.get(userId);
    if (ctx) {
        console.log(`[Session Checkpoint] Loaded for user ${userId}`);
    }
    return ctx;
}

export default defineAgent({
  model: "anthropic/claude-sonnet-4.6",
  modelOptions: {
    providerOptions: {
      anthropic: {
        thinking: {
          type: "enabled",
          budgetTokens: 2048,
        },
      },
    },
  },
});
