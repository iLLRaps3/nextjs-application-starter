import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent } from "@/components/ui/card";
import { Wand2, X, Info, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { analyzeScenario } from "@/lib/groq-client";
import { GROQ_MODELS } from "@/lib/groq-client";

interface ScenarioAnalyzerProps {
  apiKey: string;
  minimaxApiKey?: string;
  selectedModel: string;
  currentScenario: string;
  onAnalysisComplete: (scenario: string, results: any) => void;
}

export default function ScenarioAnalyzer({
  apiKey,
  minimaxApiKey,
  selectedModel,
  currentScenario,
  onAnalysisComplete,
}: ScenarioAnalyzerProps) {
  const [scenario, setScenario] = useState(currentScenario);
  const [enableTimeline, setEnableTimeline] = useState(true);
  const [enableEntities, setEnableEntities] = useState(true);
  const [enableSearch, setEnableSearch] = useState(true);
  const [enableCode, setEnableCode] = useState(true);
  const [enableVideo, setEnableVideo] = useState(true);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [loadingSteps, setLoadingSteps] = useState<string[]>([]);
  const { toast } = useToast();

  const selectedModelInfo = GROQ_MODELS.find(m => m.id === selectedModel);

  const handleSubmit = async () => {
    if (!scenario.trim()) {
      toast({
        title: "Error",
        description: "Please enter a scenario to analyze.",
        variant: "destructive",
      });
      return;
    }

    if (!apiKey.trim()) {
      toast({
        title: "Error",
        description: "Please enter your Groq API key first.",
        variant: "destructive",
      });
      return;
    }

    setIsAnalyzing(true);
    setLoadingSteps([]);

    try {
      // Simulate loading steps
      const steps = [
        "Connected to Groq API",
        "Running web search...",
        "Executing analysis code...",
        "Generating predictions..."
      ];

      for (let i = 0; i < steps.length; i++) {
        await new Promise(resolve => setTimeout(resolve, 1000));
        setLoadingSteps(prev => [...prev, steps[i]]);
      }

      const results = await analyzeScenario({
        scenario,
        model: selectedModel,
        enableEntities,
        enableTimeline,
        enableSearch,
        enableCode,
        enableVideo: enableVideo && !!minimaxApiKey,
        apiKey,
        minimaxApiKey,
      });

      onAnalysisComplete(scenario, results);
    } catch (error) {
      console.error("Analysis error:", error);
      toast({
        title: "Analysis Failed",
        description: "There was an error analyzing your scenario. Please check your API key and try again.",
        variant: "destructive",
      });
    } finally {
      setIsAnalyzing(false);
      setLoadingSteps([]);
    }
  };

  const handleClear = () => {
    setScenario("");
  };

  return (
    <Card className="glass-effect border-white/20 mb-12">
      <CardContent className="p-8">
        <div className="flex items-center mb-4">
          <Wand2 className="text-3xl text-purple-300 mr-4" />
          <h2 className="text-2xl font-bold">Simulate Any Future Scenario</h2>
        </div>
        
        <p className="mb-6 text-gray-100">
          Enter a hypothetical scenario and CrystalMind will analyze potential outcomes using Groq's AI models with agentic tooling for real-time research and code execution.
        </p>

        {selectedModelInfo?.agentic && (
          <div className="mb-6 p-4 bg-blue-600 bg-opacity-20 rounded-lg border border-blue-400 border-opacity-30">
            <div className="flex items-center mb-2">
              <Info className="text-blue-300 mr-2" />
              <span className="text-sm font-semibold text-blue-200">Agentic Tooling Enhanced</span>
            </div>
            <p className="text-sm text-blue-100">
              {selectedModelInfo.description}. This model automatically researches current information and runs calculations to provide comprehensive scenario analysis.
            </p>
          </div>
        )}

        <div className="relative mb-6">
          <Textarea
            value={scenario}
            onChange={(e) => setScenario(e.target.value)}
            placeholder="Example: 'What if OpenAI releases GPT-5 with 10x the capability of GPT-4 in 2025? How would this impact the AI industry, job markets, and global economy?'"
            className="bg-gray-800 bg-opacity-50 text-white placeholder-gray-400 min-h-[100px] pr-20"
            disabled={isAnalyzing}
          />
          <div className="absolute right-4 bottom-4 flex items-center">
            <Button
              variant="ghost"
              size="icon"
              onClick={handleClear}
              className="text-gray-400 hover:text-white mr-3"
              disabled={isAnalyzing}
            >
              <X className="w-4 h-4" />
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={isAnalyzing}
              className="bg-purple-600 hover:bg-purple-700"
            >
              {isAnalyzing ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Analyzing...
                </>
              ) : (
                <>
                  <Wand2 className="w-4 h-4 mr-2" />
                  Analyze Scenario
                </>
              )}
            </Button>
          </div>
        </div>

        <div className="flex flex-wrap gap-6 mb-6">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="timeline"
              checked={enableTimeline}
              onCheckedChange={setEnableTimeline}
              disabled={isAnalyzing}
            />
            <label htmlFor="timeline" className="text-sm">Timeline Prediction</label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="entities"
              checked={enableEntities}
              onCheckedChange={setEnableEntities}
              disabled={isAnalyzing}
            />
            <label htmlFor="entities" className="text-sm">Entity Analysis</label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="search"
              checked={enableSearch}
              onCheckedChange={setEnableSearch}
              disabled={isAnalyzing}
            />
            <label htmlFor="search" className="text-sm">Real-time Web Research</label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="code"
              checked={enableCode}
              onCheckedChange={setEnableCode}
              disabled={isAnalyzing}
            />
            <label htmlFor="code" className="text-sm">Code Analysis</label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="video"
              checked={enableVideo}
              onCheckedChange={setEnableVideo}
              disabled={isAnalyzing || !minimaxApiKey}
            />
            <label htmlFor="video" className={`text-sm ${!minimaxApiKey ? 'text-gray-500' : ''}`}>
              Video Generation {!minimaxApiKey && '(MiniMax API key required)'}
            </label>
          </div>
        </div>

        {isAnalyzing && (
          <div className="text-center py-8">
            <div className="loading-spinner mx-auto mb-4"></div>
            <p className="text-gray-300 mb-4">
              Analyzing scenario with Groq AI...
            </p>
            <div className="text-sm text-gray-400">
              {loadingSteps.map((step, index) => (
                <div key={index} className="mb-2 flex items-center justify-center">
                  <div className="w-2 h-2 bg-green-400 rounded-full mr-2"></div>
                  <span>{step}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
