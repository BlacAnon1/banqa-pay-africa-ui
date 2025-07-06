
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, TrendingDown, Lightbulb } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useSmartInsights } from '@/hooks/useSmartInsights';

export const SmartInsights: React.FC = () => {
  const { insights, forecasts, suggestions, loading } = useSmartInsights();

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

  if (insights.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Smart Insights</CardTitle>
          <CardDescription>AI-powered analysis of your utility spending</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <Lightbulb className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No data available yet</h3>
            <p className="text-muted-foreground">
              Start making utility payments to see your personalized insights and spending trends.
            </p>
          </div>
        </CardContent>
      </Card>
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
              <CardTitle>Usage Analysis</CardTitle>
              <CardDescription>Track your utility spending patterns</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={insights}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip formatter={(value) => [`₦${Number(value).toLocaleString()}`, '']} />
                  <Line type="monotone" dataKey="electricity" stroke="#ef4444" name="Electricity" strokeWidth={2} />
                  <Line type="monotone" dataKey="water" stroke="#3b82f6" name="Water" strokeWidth={2} />
                  <Line type="monotone" dataKey="internet" stroke="#10b981" name="Internet" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <div className="grid md:grid-cols-3 gap-4">
            {['electricity', 'water', 'internet'].map((service) => {
              const current = insights[insights.length - 1]?.[service as keyof typeof insights[0]] as number || 0;
              const previous = insights[insights.length - 2]?.[service as keyof typeof insights[0]] as number || 0;
              const change = previous > 0 ? ((current - previous) / previous * 100).toFixed(1) : '0';
              
              return (
                <Card key={service}>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium capitalize flex items-center justify-between">
                      {service}
                      {previous > 0 && getTrendIcon(current, previous)}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">₦{current.toLocaleString()}</div>
                    {previous > 0 && (
                      <p className="text-xs text-muted-foreground">
                        {parseFloat(change) > 0 ? '+' : ''}{change}% from last month
                      </p>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        <TabsContent value="forecasts" className="space-y-4">
          {forecasts.length === 0 ? (
            <Card>
              <CardContent className="pt-6">
                <div className="text-center py-8">
                  <p className="text-muted-foreground">
                    No forecasts available yet. More data is needed for accurate predictions.
                  </p>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4">
              {forecasts.map((forecast, index) => (
                <Card key={index}>
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
          )}
        </TabsContent>

        <TabsContent value="suggestions" className="space-y-4">
          {suggestions.length === 0 ? (
            <Card>
              <CardContent className="pt-6">
                <div className="text-center py-8">
                  <Lightbulb className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">
                    No suggestions available yet. Continue using Banqa to receive personalized money-saving tips.
                  </p>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4">
              {suggestions.map((suggestion, index) => (
                <Card key={index}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <CardTitle className="text-lg">{suggestion.title}</CardTitle>
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
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};
