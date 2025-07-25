import { apiRequest } from "./queryClient";

export interface GroqAnalysisRequest {
  scenario: string;
  model: string;
  enableEntities: boolean;
  enableTimeline: boolean;
  enableSearch: boolean;
  enableCode: boolean;
  enableVideo?: boolean;
  apiKey: string;
  minimaxApiKey?: string;
  type?: string;
  subjects?: string[];
  background?: string;
}

export interface GroqAnalysisResponse {
  entities: Array<{
    name: string;
    type: string;
    impact: "High" | "Medium" | "Low";
    description: string;
  }>;
  timeline: Array<{
    time: string;
    event: string;
    likelihood: string;
    description: string;
  }>;
  research_sources: {
    web_search: string[];
    code_analysis: string[];
  };
  video_generation?: {
    video_url?: string;
    task_id?: string;
    status?: string;
    error?: string;
  };
}

export async function analyzeScenario(
  request: GroqAnalysisRequest
): Promise<GroqAnalysisResponse> {
  const response = await apiRequest("POST", "/api/analyze", request);
  return response.json();
}

export async function validateApiKey(apiKey: string): Promise<boolean> {
  try {
    const response = await apiRequest("POST", "/api/validate-key", { apiKey });
    const result = await response.json();
    return result.valid;
  } catch {
    return false;
  }
}

export async function checkVideoStatus(taskId: string, minimaxApiKey: string): Promise<any> {
  const response = await apiRequest("POST", "/api/video-status", { 
    taskId, 
    minimaxApiKey 
  });
  return response.json();
}

export const GROQ_MODELS = [
  {
    id: "llama-3.3-70b-versatile",
    name: "Standard Model (Llama 3.3 70B)",
    description: "Standard text generation model",
    agentic: false,
  },
  {
    id: "compound-beta",
    name: "Agentic Tooling (compound-beta)",
    description: "Multi-tool capability with web search and code execution",
    agentic: true,
  },
  {
    id: "compound-beta-mini",
    name: "Agentic Tooling Mini (compound-beta-mini)",
    description: "Single-tool capability with 3x lower latency",
    agentic: true,
  },
];
