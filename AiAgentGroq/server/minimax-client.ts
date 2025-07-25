
export interface VideoGenerationRequest {
  prompt: string;
  scenario: string;
  entities?: any[];
  timeline?: any[];
}

export interface VideoGenerationResponse {
  video_url: string;
  task_id: string;
  status: string;
}

export async function generateScenarioVideo(
  apiKey: string,
  request: VideoGenerationRequest
): Promise<VideoGenerationResponse> {
  const videoPrompt = generateVideoPrompt(request);
  
  const response = await fetch("https://api.minimax.chat/v1/video_generation", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      prompt: videoPrompt,
      width: 1280,
      height: 720,
      frames_per_second: 24,
      prompt_optimizer: true,
    }),
  });

  if (!response.ok) {
    throw new Error(`MiniMax API error: ${response.status}`);
  }

  return response.json();
}

export async function checkVideoStatus(
  apiKey: string,
  taskId: string
): Promise<VideoGenerationResponse> {
  const response = await fetch(`https://api.minimax.chat/v1/query/video_generation?task_id=${taskId}`, {
    method: "GET",
    headers: {
      "Authorization": `Bearer ${apiKey}`,
    },
  });

  if (!response.ok) {
    throw new Error(`MiniMax API error: ${response.status}`);
  }

  return response.json();
}

function generateVideoPrompt(request: VideoGenerationRequest): string {
  const { scenario, entities, timeline } = request;
  
  let videoPrompt = `Create a cinematic visualization of this future scenario: ${scenario}`;
  
  if (entities && entities.length > 0) {
    const keyEntities = entities.slice(0, 3).map(e => e.name).join(", ");
    videoPrompt += ` Focus on showing the impact on: ${keyEntities}.`;
  }
  
  if (timeline && timeline.length > 0) {
    const nearTermEvent = timeline[0];
    videoPrompt += ` Show the progression starting with: ${nearTermEvent.event} in ${nearTermEvent.time}.`;
  }
  
  videoPrompt += ` Style: Professional documentary with smooth transitions, modern graphics, and clear visual metaphors. Duration: 30 seconds.`;
  
  return videoPrompt;
}
