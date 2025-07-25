import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { MapPin, Users, Lightbulb, X, Loader2, Plus, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { analyzeScenario } from "@/lib/groq-client";

interface LocalProblemAnalyzerProps {
  apiKey: string;
  selectedModel: string;
  onAnalysisComplete: (scenario: string, results: any) => void;
}

export default function LocalProblemAnalyzer({
  apiKey,
  selectedModel,
  onAnalysisComplete,
}: LocalProblemAnalyzerProps) {
  const [subjects, setSubjects] = useState<string[]>([""]);
  const [background, setBackground] = useState("");
  const [scenario, setScenario] = useState("");
  const [enableTimeline, setEnableTimeline] = useState(true);
  const [enableEntities, setEnableEntities] = useState(true);
  const [enableSearch, setEnableSearch] = useState(true);
  const [enableCode, setEnableCode] = useState(true);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [loadingSteps, setLoadingSteps] = useState<string[]>([]);
  const { toast } = useToast();

  const addSubject = () => {
    setSubjects([...subjects, ""]);
  };

  const removeSubject = (index: number) => {
    if (subjects.length > 1) {
      setSubjects(subjects.filter((_, i) => i !== index));
    }
  };

  const updateSubject = (index: number, value: string) => {
    const newSubjects = [...subjects];
    newSubjects[index] = value;
    setSubjects(newSubjects);
  };

  const handleSubmit = async () => {
    const validSubjects = subjects.filter(s => s.trim());
    if (validSubjects.length === 0 || !scenario.trim()) {
      toast({
        title: "Missing Information",
        description: "Please provide at least one subject and scenario description.",
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
      // Enhanced prompt for local problems
      const contextualizedScenario = `
Local Problem Analysis:
Subjects: ${validSubjects.join(", ")}
${background ? `Background Context: ${background}` : ''}
Scenario: ${scenario}

Please analyze this local problem considering the specific subjects and background provided. Consider the interplay between all subjects mentioned.
`;

      const steps = [
        "Analyzing local context...",
        "Researching similar cases...",
        "Evaluating local impact factors...",
        "Generating targeted solutions..."
      ];

      for (let i = 0; i < steps.length; i++) {
        await new Promise(resolve => setTimeout(resolve, 1000));
        setLoadingSteps(prev => [...prev, steps[i]]);
      }

      const results = await analyzeScenario({
        scenario: contextualizedScenario,
        model: selectedModel,
        enableEntities,
        enableTimeline,
        enableSearch,
        enableCode,
        apiKey,
        type: "local",
        subjects: validSubjects,
        background,
      });

      onAnalysisComplete(contextualizedScenario, results);
    } catch (error) {
      console.error("Analysis error:", error);
      toast({
        title: "Analysis Failed",
        description: "There was an error analyzing your local problem. Please check your API key and try again.",
        variant: "destructive",
      });
    } finally {
      setIsAnalyzing(false);
      setLoadingSteps([]);
    }
  };

  const handleClear = () => {
    setSubjects([""]);
    setBackground("");
    setScenario("");
  };

  return (
    <Card className="glass-effect border-white/20 mb-12">
      <CardHeader>
        <CardTitle className="flex items-center text-2xl">
          <MapPin className="text-purple-300 mr-4" />
          Local Problem Analysis
        </CardTitle>
        <p className="text-gray-100">
          Analyze local challenges with specific context and background information for more targeted insights.
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label className="text-white">Subjects/Locations *</Label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addSubject}
                disabled={isAnalyzing}
                className="border-purple-400/30 hover:border-purple-400 text-purple-300 hover:text-purple-200"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Subject
              </Button>
            </div>
            
            <div className="space-y-3">
              {subjects.map((subject, index) => (
                <div key={index} className="flex items-center gap-2">
                  <div className="flex-1">
                    <Input
                      value={subject}
                      onChange={(e) => updateSubject(index, e.target.value)}
                      placeholder={`Subject ${index + 1}: e.g., Downtown Traffic, Local Business District`}
                      className="bg-gray-800 bg-opacity-50 text-white placeholder-gray-400"
                      disabled={isAnalyzing}
                    />
                  </div>
                  {subjects.length > 1 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => removeSubject(index)}
                      disabled={isAnalyzing}
                      className="text-red-400 hover:text-red-300 hover:bg-red-600/20"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              ))}
            </div>
            
            <div className="flex flex-wrap gap-2">
              {subjects.filter(s => s.trim()).map((subject, index) => (
                <Badge key={index} variant="secondary" className="bg-purple-600/20 text-purple-300">
                  {subject}
                </Badge>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="background" className="text-white">Background Context</Label>
            <Input
              id="background"
              value={background}
              onChange={(e) => setBackground(e.target.value)}
              placeholder="e.g., Population 50k, Tourist area, Industrial zone"
              className="bg-gray-800 bg-opacity-50 text-white placeholder-gray-400"
              disabled={isAnalyzing}
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="scenario" className="text-white">Problem Scenario *</Label>
          <div className="relative">
            <Textarea
              id="scenario"
              value={scenario}
              onChange={(e) => setScenario(e.target.value)}
              placeholder="Example: 'What if we implement a new bike lane system that reduces parking spaces by 30%? How would local businesses and commuters be affected?'"
              className="bg-gray-800 bg-opacity-50 text-white placeholder-gray-400 min-h-[120px] pr-20"
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
                    <Lightbulb className="w-4 h-4 mr-2" />
                    Analyze Problem
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap gap-6 mb-6">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="timeline"
              checked={enableTimeline}
              onCheckedChange={(checked) => setEnableTimeline(checked === true)}
              disabled={isAnalyzing}
            />
            <label htmlFor="timeline" className="text-sm">Implementation Timeline</label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="entities"
              checked={enableEntities}
              onCheckedChange={(checked) => setEnableEntities(checked === true)}
              disabled={isAnalyzing}
            />
            <label htmlFor="entities" className="text-sm">Stakeholder Analysis</label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="search"
              checked={enableSearch}
              onCheckedChange={(checked) => setEnableSearch(checked === true)}
              disabled={isAnalyzing}
            />
            <label htmlFor="search" className="text-sm">Similar Case Research</label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="code"
              checked={enableCode}
              onCheckedChange={(checked) => setEnableCode(checked === true)}
              disabled={isAnalyzing}
            />
            <label htmlFor="code" className="text-sm">Impact Calculations</label>
          </div>
        </div>

        {isAnalyzing && (
          <div className="text-center py-8">
            <div className="loading-spinner mx-auto mb-4"></div>
            <p className="text-gray-300 mb-4">
              Analyzing local problem with contextual AI...
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