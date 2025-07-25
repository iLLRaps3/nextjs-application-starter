// Mock database for development
export const db = {
  createScenario: async (scenario: any) => {
    console.log("Mock database: createScenario called", scenario);
    return scenario;
  },
  getRecentScenarios: async () => {
    console.log("Mock database: getRecentScenarios called");
    return [];
  }
};
