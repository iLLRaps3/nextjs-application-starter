import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  TrendingUp, 
  Plus, 
  Quote, 
  Network, 
  Clock, 
  Search, 
  Code,
  Download,
  Share,
  Building,
  Factory,
  Briefcase,
  Globe,
  Gavel,
  GraduationCap,
  Calendar,
  Rocket,
  Users,
  Shield,
  BarChart3,
  Target,
  AlertTriangle,
  CheckCircle
} from "lucide-react";
import { Entity, TimelineEvent, ResearchSource } from "@shared/schema";
import { formatProbability, getProbabilityColor, getConfidenceColor, getImpactSeverityColor } from "@/lib/probability-utils";

interface ResultsDisplayProps {
  scenario: string;
  results: {
    entities?: Entity[];
    timeline?: TimelineEvent[];
    research_sources?: ResearchSource;
  };
  model: string;
  onNewScenario: () => void;
}

const getEntityIcon = (type: string) => {
  switch (type.toLowerCase()) {
    case 'technology':
    case 'tech':
      return Building;
    case 'industry':
    case 'market':
      return Factory;
    case 'economic':
    case 'economy':
      return Briefcase;
    case 'global':
      return Globe;
    case 'policy':
    case 'regulation':
      return Gavel;
    case 'education':
      return GraduationCap;
    default:
      return Building;
  }
};

const getImpactColor = (impact: string) => {
  switch (impact.toLowerCase()) {
    case 'high':
      return 'bg-red-600';
    case 'medium':
      return 'bg-yellow-600';
    case 'low':
      return 'bg-green-600';
    default:
      return 'bg-gray-600';
  }
};

export default function ResultsDisplay({ 
  scenario, 
  results, 
  model, 
  onNewScenario 
}: ResultsDisplayProps) {
  return (
    <Card className="glass-effect border-white/20 mb-12 fade-in">
      <CardContent className="p-8">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center">
            <TrendingUp className="text-2xl text-purple-300 mr-4" />
            <h2 className="text-2xl font-bold">Scenario Analysis Results</h2>
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex items-center text-sm text-gray-300">
              <div className="status-indicator w-2 h-2 bg-green-400 rounded-full mr-2"></div>
              <span>Analysis Complete</span>
            </div>
            <Button 
              variant="ghost" 
              onClick={onNewScenario}
              className="text-purple-300 hover:text-white"
            >
              <Plus className="w-4 h-4 mr-2" />
              New Scenario
            </Button>
          </div>
        </div>

        {/* Analysis Summary */}
        <div className="bg-gradient-to-r from-purple-900/20 to-blue-900/20 rounded-lg p-6 border border-purple-400/20 mb-8">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-white flex items-center">
              <BarChart3 className="text-purple-300 mr-3" />
              Analysis Summary
            </h3>
            <Badge variant="outline" className="text-purple-300 border-purple-400/30">
              {model} Model
            </Badge>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center p-3 bg-white/5 rounded-lg">
              <div className="text-2xl font-bold text-blue-300">
                {results.entities?.length || 0}
              </div>
              <div className="text-sm text-gray-400">Entities</div>
            </div>
            <div className="text-center p-3 bg-white/5 rounded-lg">
              <div className="text-2xl font-bold text-green-300">
                {results.timeline?.length || 0}
              </div>
              <div className="text-sm text-gray-400">Timeline Events</div>
            </div>
            <div className="text-center p-3 bg-white/5 rounded-lg">
              <div className="text-2xl font-bold text-purple-300">
                {((results.entities?.length || 0) + (results.timeline?.length || 0)) > 0 ? 
                  Math.round((
                    (results.entities?.reduce((sum, e) => sum + (e.confidence_score || 0.5), 0) || 0) +
                    (results.timeline?.reduce((sum, t) => sum + (t.confidence_score || 0.5), 0) || 0)
                  ) / ((results.entities?.length || 0) + (results.timeline?.length || 0)) * 100) : 0}%
              </div>
              <div className="text-sm text-gray-400">Avg Confidence</div>
            </div>
            <div className="text-center p-3 bg-white/5 rounded-lg">
              <div className="text-2xl font-bold text-yellow-300">
                {results.research_sources?.overall_confidence ? 
                  Math.round((results.research_sources.overall_confidence || 0.8) * 100) : 80}%
              </div>
              <div className="text-sm text-gray-400">Research Quality</div>
            </div>
          </div>
        </div>

        {/* Original Scenario */}
        <div className="mb-8">
          <h3 className="text-xl font-semibold mb-4 flex items-center">
            <Quote className="text-purple-300 mr-3" />
            Original Scenario
          </h3>
          <div className="bg-gray-800 bg-opacity-50 rounded-lg p-4">
            <p className="italic text-gray-100 mb-3">
              "{scenario}"
            </p>
            <div className="flex items-center text-sm text-gray-400">
              <div className="w-4 h-4 mr-2">🤖</div>
              <span>Analyzed using: {model}</span>
            </div>
          </div>
        </div>

        {/* Entities */}
        {results.entities && results.entities.length > 0 && (
          <div className="mb-8">
            <h3 className="text-xl font-semibold mb-4 flex items-center">
              <Network className="text-purple-300 mr-3" />
              Key Entities & Relationships
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {results.entities.map((entity, index) => {
                const IconComponent = getEntityIcon(entity.type);
                return (
                  <div key={index} className="entity-card bg-gray-800 bg-opacity-50 rounded-lg p-4 cursor-pointer border border-white/10 hover:border-purple-400/50 transition-colors">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center">
                        <div className={`w-8 h-8 ${getImpactColor(entity.impact)} rounded-full flex items-center justify-center mr-3`}>
                          <IconComponent className="w-4 h-4 text-white" />
                        </div>
                        <h4 className="font-semibold text-white">{entity.name}</h4>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Target className="w-3 h-3 text-blue-400" />
                        <span className={`text-xs ${getConfidenceColor(entity.confidence_score || 0.5)}`}>
                          {formatProbability(entity.confidence_score || 0.5)}
                        </span>
                      </div>
                    </div>
                    
                    <p className="text-sm text-gray-300 mb-3">{entity.description}</p>
                    
                    <div className="space-y-2 mb-3">
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-400">Impact Probability</span>
                        <span className={`text-xs ${getProbabilityColor(entity.impact_probability || 0.5)}`}>
                          {formatProbability(entity.impact_probability || 0.5)}
                        </span>
                      </div>
                      <div className="w-full bg-gray-700 rounded-full h-1.5">
                        <div
                          className={`h-1.5 rounded-full transition-all duration-300 ${getProbabilityColor(entity.impact_probability || 0.5).replace('text-', 'bg-')}`}
                          style={{ width: `${(entity.impact_probability || 0.5) * 100}%` }}
                        />
                      </div>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <Badge variant="secondary" className="text-xs">
                        {entity.type}
                      </Badge>
                      <Badge 
                        variant="outline" 
                        className={`text-xs ${getImpactColor(entity.impact)} border-0`}
                      >
                        {entity.impact} Impact
                      </Badge>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Timeline */}
        {results.timeline && results.timeline.length > 0 && (
          <div className="mb-8">
            <h3 className="text-xl font-semibold mb-4 flex items-center">
              <Clock className="text-purple-300 mr-3" />
              Predicted Timeline
            </h3>
            <div className="relative pl-8">
              {results.timeline.map((event, index) => (
                <div key={index} className="timeline-item relative mb-8 pb-8">
                  {index < results.timeline!.length - 1 && <div className="timeline-connector"></div>}
                  <div className="bg-gray-800 bg-opacity-50 rounded-lg p-4 border border-white/10 hover:border-purple-400/30 transition-colors">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-semibold text-white">{event.time} - {event.event}</h4>
                      <div className="flex items-center space-x-2">
                        <Badge className={`text-xs ${getImpactSeverityColor(event.impact_severity || 'Medium')}`}>
                          {event.impact_severity || 'Medium'}
                        </Badge>
                        <Badge className={`text-xs ${getProbabilityColor(event.probability || 0.5)} bg-transparent border`}>
                          {formatProbability(event.probability || 0.5)}
                        </Badge>
                      </div>
                    </div>
                    <p className="text-sm text-gray-300 mb-3">{event.description}</p>
                    
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-400">Confidence Level</span>
                        <span className={`text-xs ${getConfidenceColor(event.confidence_score || 0.5)}`}>
                          {formatProbability(event.confidence_score || 0.5)}
                        </span>
                      </div>
                      <div className="w-full bg-gray-700 rounded-full h-1">
                        <div
                          className={`h-1 rounded-full transition-all duration-300 ${getConfidenceColor(event.confidence_score || 0.5).replace('text-', 'bg-')}`}
                          style={{ width: `${(event.confidence_score || 0.5) * 100}%` }}
                        />
                      </div>
                    </div>
                    
                    {event.uncertainty_factors && event.uncertainty_factors.length > 0 && (
                      <div className="mt-3 p-2 bg-gray-700/30 rounded text-xs">
                        <div className="flex items-center mb-1">
                          <AlertTriangle className="w-3 h-3 text-yellow-400 mr-1" />
                          <span className="text-yellow-400">Uncertainty Factors:</span>
                        </div>
                        <div className="flex flex-wrap gap-1">
                          {event.uncertainty_factors.map((factor, i) => (
                            <Badge key={i} variant="outline" className="text-xs text-yellow-300 border-yellow-400/30">
                              {factor}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Research Sources */}
        {results.research_sources && (
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold flex items-center">
                <Search className="text-purple-300 mr-3" />
                Research Sources
              </h3>
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-400">Overall Confidence:</span>
                <Badge className={`${getConfidenceColor(results.research_sources.overall_confidence || 0.8)}`}>
                  {formatProbability(results.research_sources.overall_confidence || 0.8)}
                </Badge>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-gray-800 bg-opacity-50 rounded-lg p-4 border border-white/10">
                <div className="flex items-center mb-3">
                  <Search className="text-blue-400 mr-2 w-4 h-4" />
                  <span className="text-sm font-semibold">Web Search Results</span>
                </div>
                <div className="space-y-3">
                  {results.research_sources.web_search.map((source, index) => (
                    <div key={index} className="bg-gray-700/30 rounded p-2">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm text-white font-medium">{typeof source === 'string' ? source : source.source}</span>
                        {typeof source === 'object' && (
                          <div className="flex space-x-2">
                            <Badge variant="outline" className="text-xs text-blue-300">
                              R: {formatProbability(source.relevance_score)}
                            </Badge>
                            <Badge variant="outline" className="text-xs text-green-300">
                              C: {formatProbability(source.credibility_score)}
                            </Badge>
                          </div>
                        )}
                      </div>
                      {typeof source === 'object' && source.summary && (
                        <p className="text-xs text-gray-400">{source.summary}</p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="bg-gray-800 bg-opacity-50 rounded-lg p-4 border border-white/10">
                <div className="flex items-center mb-3">
                  <Code className="text-green-400 mr-2 w-4 h-4" />
                  <span className="text-sm font-semibold">Code Analysis</span>
                </div>
                <div className="space-y-3">
                  {results.research_sources.code_analysis.map((analysis, index) => (
                    <div key={index} className="bg-gray-700/30 rounded p-2">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm text-white font-medium">{typeof analysis === 'string' ? analysis : analysis.analysis_type}</span>
                        {typeof analysis === 'object' && (
                          <Badge variant="outline" className={`text-xs ${getProbabilityColor(analysis.accuracy_probability)}`}>
                            {formatProbability(analysis.accuracy_probability)}
                          </Badge>
                        )}
                      </div>
                      {typeof analysis === 'object' && (
                        <>
                          <p className="text-xs text-gray-300 mb-1">{analysis.result}</p>
                          {analysis.methodology && (
                            <p className="text-xs text-gray-400 italic">{analysis.methodology}</p>
                          )}
                        </>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Video Generation */}
        {results.video_generation && (
          <div className="mb-8">
            <h3 className="text-xl font-semibold mb-4 flex items-center">
              <Rocket className="text-purple-300 mr-3" />
              Scenario Visualization
            </h3>
            <div className="bg-gray-800 bg-opacity-50 rounded-lg p-6 border border-white/10">
              {results.video_generation.error ? (
                <div className="text-center py-8">
                  <AlertTriangle className="mx-auto mb-4 w-12 h-12 text-red-400" />
                  <p className="text-red-300 mb-2">Video generation failed</p>
                  <p className="text-sm text-gray-400">{results.video_generation.error}</p>
                </div>
              ) : results.video_generation.video_url ? (
                <div className="text-center">
                  <video 
                    controls 
                    className="w-full max-w-4xl mx-auto rounded-lg mb-4"
                    poster="/api/placeholder/800/450"
                  >
                    <source src={results.video_generation.video_url} type="video/mp4" />
                    Your browser does not support video playback.
                  </video>
                  <Badge className="bg-green-600 text-white">
                    <CheckCircle className="w-3 h-3 mr-1" />
                    Video Generated Successfully
                  </Badge>
                </div>
              ) : results.video_generation.task_id ? (
                <div className="text-center py-8">
                  <div className="loading-spinner mx-auto mb-4"></div>
                  <p className="text-purple-300 mb-2">Generating scenario visualization...</p>
                  <p className="text-sm text-gray-400">Task ID: {results.video_generation.task_id}</p>
                  <Badge className="mt-2 bg-blue-600">
                    Status: {results.video_generation.status || 'Processing'}
                  </Badge>
                </div>
              ) : null}
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex justify-center space-x-4">
          <Button className="bg-purple-600 hover:bg-purple-700">
            <Download className="w-4 h-4 mr-2" />
            Export Analysis
          </Button>
          <Button variant="outline" className="border-gray-600 hover:bg-gray-700">
            <Share className="w-4 h-4 mr-2" />
            Share Results
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
