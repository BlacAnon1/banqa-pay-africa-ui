
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, TrendingDown, Lightbulb, Calendar, DollarSign, Zap } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';

interface InsightData {
  month: string;
  electricity: number;
  water: number;
  internet: number;
  total: number;
}

interface Forecast {
  service: string;
  nextBill: number;
  dueDate: string;
  confidence: number;
}

interface Suggestion {
  type: 'savings' | 'usage' | 'timing';
  title: string;
  description: string;
  potentialSaving: number;
  icon: React.ReactNode;
}

export const SmartInsights: React.FC = () => {
  const [insights, setInsights] = useState<InsightData[]>([]);
  const [forecasts, setForecasts] = useState<Forecast[]>([]);
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadInsightsData();
  }, []);

  const loadInsightsData = async () => {
    // Simulate loading insights data
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const mockInsights: InsightData[] = [
      { month: 'Jan', electricity: 8500, water: 3200, internet: 5000, total: 16700 },
      { month: 'Feb', electricity: 9200, water: 3800, internet: 5000, total: 18000 },
      { month: 'Mar', electricity: 7800, water: 3500, internet: 5000, total: 16300 },
      { month: 'Apr', electricity: 8900, water: 4100, internet: 5000, total: 18000 },
      { month: 'May', electricity: 9500, water: 4500, internet: 5000, total: 19000 },
      { month: 'Jun', electricity: 10200, water: 3900, internet: 5000, total: 19100 },
    ];

    const mockForecasts: Forecast[] = [
      { service: 'Electricity', nextBill: 9800, dueDate: '2024-07-15', confidence: 85 },
      { service: 'Water', nextBill: 4200, dueDate: '2024-07-10', confidence: 78 },
      { service: 'Internet', nextBill: 5000, dueDate: '2024-07-05', confidence: 95 },
    ];

    const mockSuggestions: Suggestion[] = [
      {
        type: 'savings',
        title: 'Peak Hour Usage',
        description: 'You could save ₦2,500 monthly by shifting high-power activities to off-peak hours (11 PM - 6 AM)',
        potentialSaving: 2500,
        icon: <Zap className="h-4 w-4" />
      },
      {
        type: 'usage',
        title: 'Water Consumption Trend',
        description: 'Water usage increased by 18% this month. Check for leaks or consider water-saving fixtures',
        potentialSaving: 800,
        icon: <TrendingUp className="h-4 w-4" />
      },
      {
        type: 'timing',
        title: 'Bundle Payment Discount',
        description: 'Pay all utilities before the 5th to get 2% discount on total bills',
        potentialSaving: 380,
        icon: <Calendar className="h-4 w-4" />
      }
    ];

    setInsights(mockInsights);
    setForecasts(mockForecasts);
    setSuggestions(mockSuggestions);
    setLoading(false);
  };

  const getTrendIcon = (current: number, previous: number) => {
    return current > previous ? (
      <TrendingUp className="h-4 w-4 text-red-500" />
    ) : (
      <TrendingDown className="h-4 w-4 text-green-500" />
    );
  };

  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map(i => (
          <Card key={i} className="animate-pulse">
            <CardHeader>
              <div className="h-4 bg-muted rounded w-1/3"></div>
              <div className="h-3 bg-muted rounded w-1/2"></div>
            </CardHeader>
            <CardContent>
              <div className="h-32 bg-muted rounded"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Smart Insights</h2>
        <p className="text-muted-foreground">AI-powered analysis of your utility spending</p>
      </div>

      <Tabs defaultValue="trends" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="trends">Usage Trends</TabsTrigger>
          <TabsTrigger value="forecasts">Bill Forecasts</TabsTrigger>
          <TabsTrigger value="suggestions">Smart Tips</TabsTrigger>
        </TabsList>

        <TabsContent value="trends" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>6-Month Usage Analysis</CardTitle>
              <CardDescription>Track your utility spending patterns</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={insights}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip formatter={(value) => [`₦${value.toLocaleString()}`, '']} />
                  <Line type="monotone" dataKey="electricity" stroke="#ef4444" name="Electricity" strokeWidth={2} />
                  <Line type="monotone" dataKey="water" stroke="#3b82f6" name="Water" strokeWidth={2} />
                  <Line type="monotone" dataKey="internet" stroke="#10b981" name="Internet" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <div className="grid md:grid-cols-3 gap-4">
            {['electricity', 'water', 'internet'].map((service) => {
              const current = insights[insights.length - 1]?.[service as keyof InsightData] as number;
              const previous = insights[insights.length - 2]?.[service as keyof InsightData] as number;
              const change = ((current - previous) / previous * 100).toFixed(1);
              
              return (
                <Card key={service}>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium capitalize flex items-center justify-between">
                      {service}
                      {getTrendIcon(current, previous)}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">₦{current?.toLocaleString()}</div>
                    <p className="text-xs text-muted-foreground">
                      {parseFloat(change) > 0 ? '+' : ''}{change}% from last month
                    </p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        <TabsContent value="forecasts" className="space-y-4">
          <div className="grid gap-4">
            {forecasts.map((forecast) => (
              <Card key={forecast.service}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{forecast.service}</CardTitle>
                    <Badge variant="secondary">{forecast.confidence}% confidence</Badge>
                  </div>
                  <CardDescription>Next bill prediction</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Predicted Amount</span>
                      <span className="text-2xl font-bold">₦{forecast.nextBill.toLocaleString()}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Due Date</span>
                      <span className="font-medium">{new Date(forecast.dueDate).toLocaleDateString()}</span>
                    </div>
                    <Progress value={forecast.confidence} className="w-full" />
                    <p className="text-xs text-muted-foreground">
                      Based on your usage patterns and seasonal trends
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="suggestions" className="space-y-4">
          <div className="grid gap-4">
            {suggestions.map((suggestion, index) => (
              <Card key={index}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2">
                      {suggestion.icon}
                      <CardTitle className="text-lg">{suggestion.title}</CardTitle>
                    </div>
                    <Badge variant="outline" className="text-green-600">
                      Save ₦{suggestion.potentialSaving.toLocaleString()}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{suggestion.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};
