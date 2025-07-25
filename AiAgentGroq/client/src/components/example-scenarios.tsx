import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Lightbulb, TrendingUp, Users, Globe, Zap } from "lucide-react";

interface ExampleScenariosProps {
  onExampleSelect: (scenario: string) => void;
}

const exampleScenarios = [
  {
    icon: <TrendingUp className="w-5 h-5 text-blue-400" />,
    title: "AI Market Disruption",
    description: "What if AI becomes 10x more capable overnight?",
    scenario: "What if a breakthrough in AI technology makes current AI systems 10 times more capable overnight? How would this affect the tech industry, job markets, and society at large?"
  },
  {
    icon: <Globe className="w-5 h-5 text-green-400" />,
    title: "Climate Technology",
    description: "Revolutionary carbon capture technology",
    scenario: "What if a new carbon capture technology is developed that can remove CO2 from the atmosphere at 1/100th the current cost? How would this change climate policy, energy markets, and global economics?"
  },
  {
    icon: <Users className="w-5 h-5 text-purple-400" />,
    title: "Remote Work Evolution",
    description: "The future of distributed work",
    scenario: "What if virtual reality technology becomes so advanced that remote work feels identical to in-person collaboration? How would this transform cities, real estate, and global talent distribution?"
  },
  {
    icon: <Zap className="w-5 h-5 text-yellow-400" />,
    title: "Energy Breakthrough",
    description: "Room-temperature superconductor discovery",
    scenario: "What if scientists discover a room-temperature superconductor that's cheap and easy to manufacture? How would this revolutionize power transmission, transportation, and computing?"
  }
];

export default function ExampleScenarios({ onExampleSelect }: ExampleScenariosProps) {
  return (
    <Card className="glass-effect border-white/20">
      <CardHeader>
        <CardTitle className="flex items-center text-xl">
          <Lightbulb className="text-purple-300 mr-3" />
          Example Scenarios
        </CardTitle>
        <p className="text-gray-300 text-sm mt-2">
          Get started with these thought-provoking scenarios
        </p>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {exampleScenarios.map((example, index) => (
            <div
              key={index}
              className="bg-gray-800 bg-opacity-30 p-4 rounded-lg border border-white/10 hover:border-purple-400/50 transition-colors"
            >
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 mt-1">
                  {example.icon}
                </div>
                <div className="flex-1">
                  <h3 className="font-medium text-white mb-1">
                    {example.title}
                  </h3>
                  <p className="text-sm text-gray-400 mb-3">
                    {example.description}
                  </p>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onExampleSelect(example.scenario)}
                    className="border-purple-400/30 hover:border-purple-400 hover:bg-purple-600/20 text-purple-300 hover:text-purple-200"
                  >
                    Analyze Scenario
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}