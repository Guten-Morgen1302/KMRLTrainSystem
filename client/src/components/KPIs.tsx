import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, TrendingDown, Zap, Shield, Clock } from 'lucide-react';
import { RevealItem } from '@/components/animations/SectionReveal';
import CountUpAnimation from '@/components/animations/CountUpAnimation';
import { useTranslation } from 'react-i18next';

const kpis = [
  {
    icon: TrendingUp,
    title: 'Readiness',
    value: '+23%',
    description: 'Train availability improvement',
    trend: 'up' as const,
    color: 'text-chart-4'
  },
  {
    icon: TrendingDown,
    title: 'Unplanned Downtime',
    value: '-18%',
    description: 'Reduction in service disruptions',
    trend: 'down' as const,
    color: 'text-chart-4'
  },
  {
    icon: Clock,
    title: 'Manual Effort',
    value: '-65%',
    description: 'Automation of planning tasks',
    trend: 'down' as const,
    color: 'text-chart-4'
  },
  {
    icon: Shield,
    title: 'Auditability',
    value: '+95%',
    description: 'Complete decision traceability',
    trend: 'up' as const,
    color: 'text-chart-4'
  },
  {
    icon: Zap,
    title: 'Energy/Time Savings',
    value: '+31%',
    description: 'Operational efficiency gains',
    trend: 'up' as const,
    color: 'text-chart-4'
  }
];

export default function KPIs() {
  const { t } = useTranslation();
  return (
    <section className="py-16 md:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            {t('kpis.title')}
          </h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            {t('kpis.subtitle')}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6 mb-8">
          {kpis.map((kpi, index) => {
            const Icon = kpi.icon;
            return (
              <RevealItem key={index}>
                <Card
                  className="text-center hover-elevate transition-all duration-300 hover:scale-105 hover:shadow-lg"
                  data-testid={`kpi-card-${index}`}
                >
                  <CardHeader className="pb-3">
                    <div className="mx-auto w-12 h-12 mb-3 flex items-center justify-center rounded-full bg-accent/10">
                      <Icon className={`w-6 h-6 ${kpi.color}`} />
                    </div>
                    <CardTitle className="text-sm font-medium text-muted-foreground">
                      {kpi.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="text-2xl mb-2">
                      <CountUpAnimation 
                        value={kpi.value}
                        duration={2 + index * 0.2}
                        showPulse={true}
                        trend={kpi.trend}
                        testId={`kpi-value-${index}`}
                      />
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {kpi.description}
                    </p>
                  </CardContent>
                </Card>
              </RevealItem>
            );
          })}
        </div>

        <div className="text-center">
          <div className="inline-flex items-center px-4 py-2 bg-muted/50 rounded-lg">
            <div className="w-2 h-2 bg-accent rounded-full mr-2"></div>
            <span className="text-sm text-muted-foreground">
              *Projected values are pilot-dependent and subject to operational validation
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}