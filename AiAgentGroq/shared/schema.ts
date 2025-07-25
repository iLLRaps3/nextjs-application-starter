import { pgTable, text, serial, integer, boolean, jsonb, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const scenarios = pgTable("scenarios", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  model: text("model").notNull(),
  type: text("type").notNull().default("general"), // "general" or "local"
  subjects: text("subjects").array(), // for local problems - multiple subjects
  background: text("background"), // context for local problems
  entities: jsonb("entities"),
  timeline: jsonb("timeline"),
  research_sources: jsonb("research_sources"),
  created_at: timestamp("created_at").defaultNow().notNull(),
});

export const insertScenarioSchema = createInsertSchema(scenarios).pick({
  title: true,
  description: true,
  model: true,
  type: true,
  subjects: true,
  background: true,
  entities: true,
  timeline: true,
  research_sources: true,
});

export type InsertScenario = z.infer<typeof insertScenarioSchema>;
export type Scenario = typeof scenarios.$inferSelect;

export const EntitySchema = z.object({
  name: z.string(),
  type: z.string(),
  impact: z.enum(["High", "Medium", "Low"]),
  impact_probability: z.number().min(0).max(1), // 0-1 probability score
  description: z.string(),
  confidence_score: z.number().min(0).max(1), // AI confidence in this entity
});

export const TimelineEventSchema = z.object({
  time: z.string(),
  event: z.string(),
  likelihood: z.string(),
  probability: z.number().min(0).max(1), // Numeric probability score
  description: z.string(),
  confidence_score: z.number().min(0).max(1), // AI confidence in this prediction
  impact_severity: z.enum(["Critical", "High", "Medium", "Low"]),
  uncertainty_factors: z.array(z.string()).optional(), // Factors that could change this prediction
});

export const ResearchSourceSchema = z.object({
  web_search: z.array(z.object({
    source: z.string(),
    relevance_score: z.number().min(0).max(1),
    credibility_score: z.number().min(0).max(1),
    summary: z.string().optional(),
  })),
  code_analysis: z.array(z.object({
    analysis_type: z.string(),
    result: z.string(),
    accuracy_probability: z.number().min(0).max(1),
    methodology: z.string().optional(),
  })),
  overall_confidence: z.number().min(0).max(1), // Overall confidence in research
});

export type Entity = z.infer<typeof EntitySchema>;
export type TimelineEvent = z.infer<typeof TimelineEventSchema>;
export type ResearchSource = z.infer<typeof ResearchSourceSchema>;
