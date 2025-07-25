import { useState } from "react";
import ScenarioAnalyzer from "@/components/scenario-analyzer";
import LocalProblemAnalyzer from "@/components/local-problem-analyzer";
import ResultsDisplay from "@/components/results-display";
import ExampleScenarios from "@/components/example-scenarios";
import RecentScenarios from "@/components/recent-scenarios";
import { Brain, Save, Key, Check, Globe, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { GROQ_MODELS } from "@/lib/groq-client";

export default function Home() {
  const [apiKey, setApiKey] = useState(() => sessionStorage.getItem('groqApiKey') || '');
  const [selectedModel, setSelectedModel] = useState('compound-beta');
  const [currentScenario, setCurrentScenario] = useState('');
  const [analysisResults, setAnalysisResults] = useState<any>(null);
  const [showResults, setShowResults] = useState(false);
  const [apiKeyValid, setApiKeyValid] = useState(false);
  const { toast } = useToast();

  const handleSaveApiKey = () => {
    if (apiKey.trim()) {
      sessionStorage.setItem('groqApiKey', apiKey);
      setApiKeyValid(true);
      toast({
        title: "API Key Saved",
        description: "Your Groq API key has been saved for this session.",
      });
    } else {
      toast({
        title: "Error",
        description: "Please enter a valid API key.",
        variant: "destructive",
      });
    }
  };

  const handleAnalysisComplete = (scenario: string, results: any) => {
    setCurrentScenario(scenario);
    setAnalysisResults(results);
    setShowResults(true);
  };

  const handleNewScenario = () => {
    setShowResults(false);
    setCurrentScenario('');
    setAnalysisResults(null);
  };

  const handleExampleSelect = (scenario: string) => {
    setCurrentScenario(scenario);
    setShowResults(false);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <header className="flex flex-col lg:flex-row justify-between items-center mb-12">
        <div className="flex flex-col sm:flex-row items-center mb-4 lg:mb-0">
          <div className="flex items-center mb-4 sm:mb-0 sm:mr-6">
            <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center mr-4 pulse-ring">
              <Brain className="text-2xl text-purple-600" />
            </div>
            <h1 className="text-3xl font-bold">CrystalMind</h1>
          </div>
          <div className="relative flex items-center space-x-4">
            <div className="relative">
              <Input
                type="password"
                placeholder="Groq API Key"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                className="bg-gray-800 bg-opacity-50 text-white placeholder-gray-400 w-64 pr-12"
              />
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                {apiKeyValid ? (
                  <Check className="w-4 h-4 text-green-400" />
                ) : (
                  <Key className="w-4 h-4 text-gray-400" />
                )}
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleSaveApiKey}
              className="text-gray-400 hover:text-white"
            >
              <Save className="w-4 h-4" />
            </Button>
            <Select value={selectedModel} onValueChange={setSelectedModel}>
              <SelectTrigger className="bg-gray-800 bg-opacity-50 text-white w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {GROQ_MODELS.map((model) => (
                  <SelectItem key={model.id} value={model.id}>
                    {model.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <nav className="flex space-x-6">
          <a href="#" className="hover:text-purple-200 transition text-sm">Home</a>
          <a href="#" className="hover:text-purple-200 transition text-sm">Examples</a>
          <a href="#" className="hover:text-purple-200 transition text-sm">Docs</a>
          <a href="#" className="hover:text-purple-200 transition text-sm">API</a>
        </nav>
      </header>

      {/* Main Content */}
      <main>
        {!showResults ? (
          <Tabs defaultValue="global" className="w-full">
            <TabsList className="grid w-full grid-cols-2 bg-gray-800 bg-opacity-50 mb-8">
              <TabsTrigger value="global" className="flex items-center gap-2">
                <Globe className="w-4 h-4" />
                Global Scenarios
              </TabsTrigger>
              <TabsTrigger value="local" className="flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                Local Problems
              </TabsTrigger>
            </TabsList>

            <TabsContent value="global" className="space-y-8">
              <ScenarioAnalyzer
                apiKey={apiKey}
                selectedModel={selectedModel}
                currentScenario={currentScenario}
                onAnalysisComplete={handleAnalysisComplete}
              />
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <ExampleScenarios onExampleSelect={handleExampleSelect} />
                <RecentScenarios onScenarioSelect={handleExampleSelect} />
              </div>
            </TabsContent>

            <TabsContent value="local" className="space-y-8">
              <LocalProblemAnalyzer
                apiKey={apiKey}
                selectedModel={selectedModel}
                onAnalysisComplete={handleAnalysisComplete}
              />
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <ExampleScenarios onExampleSelect={handleExampleSelect} />
                <RecentScenarios onScenarioSelect={handleExampleSelect} />
              </div>
            </TabsContent>
          </Tabs>
        ) : (
          <ResultsDisplay
            scenario={currentScenario}
            results={analysisResults}
            model={selectedModel}
            onNewScenario={handleNewScenario}
          />
        )}
      </main>
    </div>
  );
}
