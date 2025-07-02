
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { TrendingUp, Shield, Clock } from 'lucide-react';
import { useCreditScore } from '@/hooks/useCreditScore';
import { useLanguage } from '@/contexts/LanguageContext';

export const CreditScoreCard = () => {
  const { creditScore, loading } = useCreditScore();
  const { t } = useLanguage();

  if (loading) {
    return (
      <Card className="cultural-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            {t('loans.creditScore')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-4">
            <div className="h-20 bg-muted rounded"></div>
            <div className="h-4 bg-muted rounded w-3/4"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!creditScore) {
    return (
      <Card className="cultural-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            {t('loans.creditScore')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">{t('loans.noCreditScore')}</p>
        </CardContent>
      </Card>
    );
  }

  const getScoreColor = (score: number) => {
    if (score >= 750) return 'text-green-600';
    if (score >= 650) return 'text-blue-600';
    if (score >= 550) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getGradeColor = (grade: string) => {
    if (grade.startsWith('A')) return 'bg-primary/10 text-primary';
    if (grade.startsWith('B')) return 'bg-secondary/10 text-secondary';
    if (grade.startsWith('C')) return 'bg-accent/10 text-accent';
    return 'bg-destructive/10 text-destructive';
  };

  return (
    <Card className="cultural-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5" />
          {t('loans.creditScore')}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <div className={`text-3xl font-bold ${getScoreColor(creditScore.score)}`}>
              {creditScore.score}
            </div>
            <p className="text-sm text-muted-foreground">out of 850</p>
          </div>
          <Badge className={getGradeColor(creditScore.grade)}>
            Grade {creditScore.grade}
          </Badge>
        </div>
        
        <Progress value={(creditScore.score / 850) * 100} className="h-2" />
        
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <Clock className="h-4 w-4" />
            Last updated: {new Date(creditScore.last_updated).toLocaleDateString()}
          </div>
          <div className="flex items-center gap-1">
            <Shield className="h-4 w-4" />
            Verified
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
