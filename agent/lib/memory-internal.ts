import type {
  MemoryByCategory,
  L2EpisodicMemory,
  L3SemanticMemory,
  L4ProceduralMemory
} from "../../shared/types/memory.js";
import type { UserProfile } from "../../shared/types/profile.js";
import { appOrigin, internalHeaders } from "./internal-api.js";

export interface UserContextPayload {
  profile: UserProfile;
  memory: MemoryByCategory;
  l2?: L2EpisodicMemory[];
  l3?: L3SemanticMemory[];
  l4?: L4ProceduralMemory[];
}

export async function fetchUserContext(userId: string): Promise<UserContextPayload | undefined> {
  const response = await fetch(
    `${appOrigin()}/api/internal/memory?userId=${encodeURIComponent(userId)}`,
    { headers: internalHeaders() },
  );

  if (!response.ok) {
    return undefined;
  }

  return response.json() as Promise<UserContextPayload>;
}

export async function saveMemoryRemote(input: {
  userId: string;
  category: string;
  content: string;
}) {
  const response = await fetch(`${appOrigin()}/api/internal/memory`, {
    method: "POST",
    headers: internalHeaders(),
    body: JSON.stringify({
      userId: input.userId,
      category: input.category,
      content: input.content,
      source: "agent",
    }),
  });

  if (!response.ok) {
    throw new Error("Failed to save memory");
  }

  return response.json() as Promise<{ saved: boolean }>;
}

export function buildUserContextPrompt(context: UserContextPayload) {
  // L1 Context Composer - 32K budget implementation
  // It composes: System Prompt + active constraints (profile + L3) + top-K retrieved memories (L2/L4)
  const { profile, memory, l2, l3, l4 } = context;
  const parts: string[] = [];

  parts.push("# About this user");
  if (profile.bio) {
    parts.push(profile.bio);
  }
  parts.push(`Timezone: ${profile.timezone}. Preferred language: ${profile.locale}.`);

  const memorySections: string[] = [];

  // Legacy categories integration
  for (const [category, entries] of Object.entries(memory)) {
    const entry = entries?.[0];
    if (!entry) continue;
    const label = category.replace(/_/g, " ").replace(/\b\w/g, char => char.toUpperCase());
    memorySections.push(`## ${label}`);
    memorySections.push(entry.content);
  }

  // L3 - Semantic Graph Facts (Always included as they are constraints/preferences)
  if (l3 && l3.length > 0) {
    memorySections.push("## Semantic Preferences & Facts (L3)");
    for (const node of l3) {
      if (node.confidence > 0.5) {
         memorySections.push(`- [${node.nodeType}] ${node.nodeKey} = ${node.nodeValue} (Confidence: ${node.confidence})`);
      }
    }
  }

  // L2 - Episodic Memory (Top-K based on Salience, simulate 8K token limit by slicing)
  if (l2 && l2.length > 0) {
    memorySections.push("## Recent Relevant Episodes (L2)");
    // Sort by salience
    const sortedL2 = [...l2].sort((a, b) => b.salience - a.salience).slice(0, 10);
    for (const ep of sortedL2) {
      memorySections.push(`- [${new Date(ep.timestamp).toISOString()}] [${ep.surface}] ${ep.summary}`);
    }
  }

  // L4 - Procedural Skills (Top-K based on success rate)
  if (l4 && l4.length > 0) {
    memorySections.push("## Available Skills & Workflows (L4)");
    const sortedL4 = [...l4].sort((a, b) => b.successRate - a.successRate).slice(0, 5);
    for (const skill of sortedL4) {
      memorySections.push(`- Skill: ${skill.skillName} | Trigger: ${skill.trigger} | Steps: ${skill.steps.join(' -> ')}`);
    }
  }

  if (memorySections.length) {
    parts.push("# Memory");
    parts.push(memorySections.join("\n\n"));
  }

  // Force limit output to avoid exceeding 32K context artificially (rough proxy by length)
  const fullPrompt = parts.join("\n\n");

  // Clean context truncation rather than chopping in the middle of characters
  if (fullPrompt.length > 100000) {
      const truncated = fullPrompt.substring(0, 100000);
      const lastNewline = truncated.lastIndexOf("\n");
      return truncated.substring(0, lastNewline > 0 ? lastNewline : 100000) + "\n\n... [Context Truncated to fit L1 Working Memory limit]";
  }

  return fullPrompt;
}
