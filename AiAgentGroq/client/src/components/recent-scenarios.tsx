
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Clock, MapPin, Globe, ChevronRight, Target, TrendingUp } from "lucide-react";
import { format } from "date-fns";
import { useQuery } from "@tanstack/react-query";
import { Scenario } from "@shared/schema";

interface RecentScenariosProps {
  onScenarioSelect: (scenario: string) => void;
}

export default function RecentScenarios({ onScenarioSelect }: RecentScenariosProps) {
  const { data: scenarios, isLoading } = useQuery<Scenario[]>({
    queryKey: ['/api/scenarios'],
    enabled: true,
  });

  if (isLoading) {
    return (
      <Card className="glass-effect border-white/20">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Clock className="text-purple-300 mr-3" />
            Recent Scenarios
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-gray-800/50 rounded-lg p-4 animate-pulse">
                <div className="h-4 bg-gray-700 rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-gray-700 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!scenarios || scenarios.length === 0) {
    return (
      <Card className="glass-effect border-white/20">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Clock className="text-purple-300 mr-3" />
            Recent Scenarios
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-gray-400">
            <Target className="mx-auto mb-4 w-12 h-12 opacity-50" />
            <p>No recent scenarios found</p>
            <p className="text-sm mt-2">Your analyzed scenarios will appear here</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="glass-effect border-white/20">
      <CardHeader>
        <CardTitle className="flex items-center">
          <Clock className="text-purple-300 mr-3" />
          Recent Scenarios
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {scenarios.slice(0, 5).map((scenario) => (
            <div
              key={scenario.id}
              onClick={() => onScenarioSelect(scenario.title)}
              className="bg-gray-800/50 rounded-lg p-4 cursor-pointer hover:bg-gray-700/50 transition-colors border border-white/10 hover:border-purple-400/30"
            >
              <div className="flex items-start justify-between mb-2">
                <h4 className="font-medium text-white text-sm line-clamp-2">
                  {scenario.title}
                </h4>
                <Badge variant="secondary" className="text-xs ml-2 flex-shrink-0">
                  {scenario.model}
                </Badge>
              </div>
              
              <p className="text-xs text-gray-400 mb-2 line-clamp-2">
                {scenario.description}
              </p>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  {scenario.subjects && scenario.subjects.length > 0 && (
                    <div className="flex items-center space-x-1">
                      <span className="text-xs text-gray-500">Subjects:</span>
                      <div className="flex flex-wrap gap-1">
                        {scenario.subjects.slice(0, 2).map((subject, i) => (
                          <Badge key={i} variant="outline" className="text-xs text-blue-300 border-blue-400/30">
                            {subject}
                          </Badge>
                        ))}
                        {scenario.subjects.length > 2 && (
                          <Badge variant="outline" className="text-xs text-gray-400">
                            +{scenario.subjects.length - 2}
                          </Badge>
                        )}
                      </div>
                    </div>
                  )}
                </div>
                
                <div className="flex items-center text-xs text-gray-500">
                  <TrendingUp className="w-3 h-3 mr-1" />
                  <span>View Analysis</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
