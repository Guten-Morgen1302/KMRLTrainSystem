import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Database, AlertTriangle, Shuffle } from 'lucide-react';
import { useTranslation } from 'react-i18next';


export default function ProblemStatement() {
  const { t } = useTranslation();
  
  const problems = [
    {
      icon: Database,
      title: t('problem.manual_process.title'),
      description: t('problem.manual_process.description'),
      impact: t('problem.manual_process.impact')
    },
    {
      icon: AlertTriangle,
      title: t('problem.complex_dependencies.title'),
      description: t('problem.complex_dependencies.description'),
      impact: t('problem.complex_dependencies.impact')
    },
    {
      icon: Shuffle,
      title: t('problem.no_optimization.title'),
      description: t('problem.no_optimization.description'),
      impact: t('problem.no_optimization.impact')
    }
  ];
  return (
    <section id="problem" className="py-16 md:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            {t('problem.title')}
          </h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            {t('problem.subtitle')}
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {problems.map((problem, index) => {
            const Icon = problem.icon;
            return (
              <Card
                key={index}
                className="hover-elevate transition-all duration-200"
                data-testid={`problem-card-${index}`}
              >
                <CardHeader className="text-center pb-4">
                  <div className="mx-auto w-16 h-16 mb-4 flex items-center justify-center rounded-full bg-destructive/10">
                    <Icon className="w-8 h-8 text-destructive" />
                  </div>
                  <CardTitle className="text-lg font-semibold">
                    {problem.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <p className="text-muted-foreground mb-4">
                    {problem.description}
                  </p>
                  <div className="bg-destructive/5 rounded-lg p-3">
                    <p className="text-sm font-medium text-destructive">
                      Impact: {problem.impact}
                    </p>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}