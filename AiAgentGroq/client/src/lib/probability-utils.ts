export function formatProbability(probability: number): string {
  return `${Math.round(probability * 100)}%`;
}

export function getProbabilityColor(probability: number): string {
  if (probability >= 0.8) return "text-green-400";
  if (probability >= 0.6) return "text-yellow-400";
  if (probability >= 0.4) return "text-orange-400";
  return "text-red-400";
}

export function getConfidenceColor(confidence: number): string {
  if (confidence >= 0.9) return "text-emerald-400";
  if (confidence >= 0.7) return "text-blue-400";
  if (confidence >= 0.5) return "text-purple-400";
  return "text-gray-400";
}

export function getImpactSeverityColor(severity: string): string {
  switch (severity) {
    case "Critical": return "text-red-500 bg-red-500/10";
    case "High": return "text-orange-500 bg-orange-500/10";
    case "Medium": return "text-yellow-500 bg-yellow-500/10";
    case "Low": return "text-green-500 bg-green-500/10";
    default: return "text-gray-500 bg-gray-500/10";
  }
}

export function getProbabilityBarWidth(probability: number): string {
  return `${Math.round(probability * 100)}%`;
}

export interface ProbabilityBarProps {
  probability: number;
  label?: string;
  showPercentage?: boolean;
}

// Note: This is a utility function - actual React component will be implemented separately