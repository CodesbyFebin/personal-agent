import { relations, sql } from "drizzle-orm";
import { index, integer, sqliteTable, text, real } from "drizzle-orm/sqlite-core";
import { user } from "./auth";

export const userMemory = sqliteTable("user_memory", {
  id: text("id").primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  category: text("category").notNull(),
  content: text("content").notNull(),
  source: text("source").notNull(),
  createdAt: integer("created_at", { mode: "timestamp_ms" })
    .default(sql`(cast(unixepoch('subsecond') * 1000 as integer))`)
    .notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp_ms" })
    .default(sql`(cast(unixepoch('subsecond') * 1000 as integer))`)
    .$onUpdate(() => new Date())
    .notNull(),
}, (table) => [
  index("user_memory_user_category_idx").on(table.userId, table.category),
]);

export const l2EpisodicMemory = sqliteTable("l2_episodic_memory", {
  id: text("id").primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  timestamp: text("timestamp").notNull(),
  surface: text("surface").notNull(),
  type: text("type").notNull(),
  summary: text("summary").notNull(),
  entities: text("entities", { mode: "json" }).notNull().$type<string[]>(),
  salience: real("salience").notNull(),
  provenance: text("provenance").notNull(),
  linkedEpisodes: text("linked_episodes", { mode: "json" }).notNull().$type<string[]>(),
  createdAt: integer("created_at", { mode: "timestamp_ms" })
    .default(sql`(cast(unixepoch('subsecond') * 1000 as integer))`)
    .notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp_ms" })
    .default(sql`(cast(unixepoch('subsecond') * 1000 as integer))`)
    .$onUpdate(() => new Date())
    .notNull(),
}, (table) => [
  index("l2_user_idx").on(table.userId),
]);

export const l3SemanticMemory = sqliteTable("l3_semantic_memory", {
  id: text("id").primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  nodeType: text("node_type").notNull(),
  nodeKey: text("node_key").notNull(),
  nodeValue: text("node_value").notNull(),
  confidence: real("confidence").notNull(),
  lastVerified: text("last_verified").notNull(),
  source: text("source").notNull(),
  supersedes: text("supersedes"),
  createdAt: integer("created_at", { mode: "timestamp_ms" })
    .default(sql`(cast(unixepoch('subsecond') * 1000 as integer))`)
    .notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp_ms" })
    .default(sql`(cast(unixepoch('subsecond') * 1000 as integer))`)
    .$onUpdate(() => new Date())
    .notNull(),
}, (table) => [
  index("l3_user_idx").on(table.userId),
]);

export const l4ProceduralMemory = sqliteTable("l4_procedural_memory", {
  id: text("id").primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  skillName: text("skill_name").notNull(),
  trigger: text("trigger").notNull(),
  steps: text("steps", { mode: "json" }).notNull().$type<string[]>(),
  learnedFrom: text("learned_from").notNull(),
  successRate: real("success_rate").notNull(),
  lastUsed: text("last_used").notNull(),
  createdAt: integer("created_at", { mode: "timestamp_ms" })
    .default(sql`(cast(unixepoch('subsecond') * 1000 as integer))`)
    .notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp_ms" })
    .default(sql`(cast(unixepoch('subsecond') * 1000 as integer))`)
    .$onUpdate(() => new Date())
    .notNull(),
}, (table) => [
  index("l4_user_idx").on(table.userId),
]);


export const userMemoryRelations = relations(userMemory, ({ one }) => ({
  user: one(user, {
    fields: [userMemory.userId],
    references: [user.id],
  }),
}));

export const l2EpisodicMemoryRelations = relations(l2EpisodicMemory, ({ one }) => ({
  user: one(user, {
    fields: [l2EpisodicMemory.userId],
    references: [user.id],
  }),
}));

export const l3SemanticMemoryRelations = relations(l3SemanticMemory, ({ one }) => ({
  user: one(user, {
    fields: [l3SemanticMemory.userId],
    references: [user.id],
  }),
}));

export const l4ProceduralMemoryRelations = relations(l4ProceduralMemory, ({ one }) => ({
  user: one(user, {
    fields: [l4ProceduralMemory.userId],
    references: [user.id],
  }),
}));
