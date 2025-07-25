import { scenarios, type Scenario, type InsertScenario } from "@shared/schema";
import { db } from "./db";
import { eq, desc } from "drizzle-orm";

export interface IStorage {
  createScenario(scenario: InsertScenario): Promise<Scenario>;
  getRecentScenarios(): Promise<Scenario[]>;
}

export class DatabaseStorage implements IStorage {
  async createScenario(insertScenario: InsertScenario): Promise<Scenario> {
    const [scenario] = await db
      .insert(scenarios)
      .values({
        title: insertScenario.title || "Untitled Scenario",
        description: insertScenario.description || "",
        model: insertScenario.model || "llama-3.3-70b-versatile",
        entities: insertScenario.entities || null,
        timeline: insertScenario.timeline || null,
        research_sources: insertScenario.research_sources || null,
      })
      .returning();
    return scenario;
  }

  async getRecentScenarios(): Promise<Scenario[]> {
    const results = await db
      .select()
      .from(scenarios)
      .orderBy(desc(scenarios.created_at))
      .limit(10);
    return results;
  }
}

export const storage = new DatabaseStorage();