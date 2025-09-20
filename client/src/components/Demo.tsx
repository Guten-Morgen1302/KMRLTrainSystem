import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, Clock, Play } from 'lucide-react';
import DecisionFlowVisualization from './animations/DecisionFlowVisualization';
import { useTranslation } from 'react-i18next';

const demoSteps = [
  {
    phase: 'Data Collection',
    status: 'completed',
    log: '✓ 25 trainsets analyzed • 6 data sources integrated',
    description: 'Collect fitness certificates, job-cards, branding, mileage, cleaning, and bay status for all trainsets'
  },
  {
    phase: 'Constraint Check',
    status: 'completed',
    log: '✓ 3 expired certificates found • 2 open job-cards flagged',
    description: 'Validate operational constraints and identify trainsets with issues'
  },
  {
    phase: 'Optimization',
    status: 'in-progress',
    log: '⏳ Optimizing allocation • 18 valid trainsets for service',
    description: 'AI engine determines optimal INDUCT/STANDBY/IBL allocation for each trainset'
  },
  {
    phase: 'Results',
    status: 'pending',
    log: '⏸ Generating final allocation plan',
    description: 'Produce nightly operation plan with clear reasoning for each decision'
  }
];

// Helper functions for live timing calculations
const getLastTwoAM = () => {
  const now = new Date();
  const today2AM = new Date(now);
  today2AM.setHours(2, 0, 0, 0);
  
  if (now >= today2AM) {
    return today2AM; // Last run was today at 2 AM
  } else {
    // Last run was yesterday at 2 AM
    const yesterday2AM = new Date(today2AM);
    yesterday2AM.setDate(yesterday2AM.getDate() - 1);
    return yesterday2AM;
  }
};

const getNextTwoAM = () => {
  const now = new Date();
  const today2AM = new Date(now);
  today2AM.setHours(2, 0, 0, 0);
  
  if (now < today2AM) {
    return today2AM; // Next run is today at 2 AM
  } else {
    // Next run is tomorrow at 2 AM
    const tomorrow2AM = new Date(today2AM);
    tomorrow2AM.setDate(tomorrow2AM.getDate() + 1);
    return tomorrow2AM;
  }
};

const formatTimeDifference = (diffMs: number) => {
  const diffMinutes = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMinutes / 60);
  const remainingMinutes = diffMinutes % 60;
  
  if (diffHours === 0) {
    return `${remainingMinutes} minutes`;
  } else if (diffHours === 1) {
    return remainingMinutes > 0 ? `1 hour ${remainingMinutes} minutes` : '1 hour';
  } else {
    return remainingMinutes > 0 ? `${diffHours} hours ${remainingMinutes} minutes` : `${diffHours} hours`;
  }
};

export default function Demo() {
  const { t } = useTranslation();
  const [timing, setTiming] = useState({ lastRun: '', nextRun: '' });

  useEffect(() => {
    const updateTiming = () => {
      const now = new Date();
      const lastTwoAM = getLastTwoAM();
      const nextTwoAM = getNextTwoAM();
      
      const timeSinceLastRun = now.getTime() - lastTwoAM.getTime();
      const timeUntilNextRun = nextTwoAM.getTime() - now.getTime();
      
      setTiming({
        lastRun: formatTimeDifference(timeSinceLastRun) + ' ago',
        nextRun: formatTimeDifference(timeUntilNextRun)
      });
    };

    // Update immediately
    updateTiming();
    
    // Update every minute
    const interval = setInterval(updateTiming, 60000);
    
    return () => clearInterval(interval);
  }, []);
  return (
    <section id="demo" className="py-16 md:py-24 bg-muted/20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            {t('demo.title')}
          </h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            {t('demo.subtitle')}
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="space-y-6">
            {demoSteps.map((step, index) => {
              const isCompleted = step.status === 'completed';
              const isInProgress = step.status === 'in-progress';
              const isPending = step.status === 'pending';

              return (
                <Card
                  key={index}
                  className={`transition-all duration-300 ${
                    isCompleted ? 'border-chart-4' : 
                    isInProgress ? 'border-accent' : 
                    'border-border'
                  }`}
                  data-testid={`demo-step-${step.phase.toLowerCase()}`}
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                          isCompleted ? 'bg-chart-4 text-white' :
                          isInProgress ? 'bg-accent text-white' :
                          'bg-muted text-muted-foreground'
                        }`}>
                          {isCompleted ? (
                            <CheckCircle className="w-5 h-5" />
                          ) : isInProgress ? (
                            <Play className="w-4 h-4" />
                          ) : (
                            <Clock className="w-4 h-4" />
                          )}
                        </div>
                        <div>
                          <CardTitle className="text-lg font-semibold">
                            {step.phase}
                          </CardTitle>
                          <p className="text-sm text-muted-foreground">
                            {step.description}
                          </p>
                        </div>
                      </div>
                      <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                        isCompleted ? 'bg-chart-4/10 text-chart-4' :
                        isInProgress ? 'bg-accent/10 text-accent animate-pulse' :
                        'bg-muted text-muted-foreground'
                      }`}>
                        {step.status.toUpperCase()}
                      </div>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="pt-0">
                    <div className={`font-mono text-sm p-3 rounded-lg ${
                      isCompleted ? 'bg-chart-4/5 text-chart-4' :
                      isInProgress ? 'bg-accent/5 text-accent' :
                      'bg-muted text-muted-foreground'
                    }`}>
                      {step.log}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Live Decision Flow Visualization */}
          <div id="live-allocation-engine" className="mt-12">
            <div className="text-center mb-6">
              <h3 className="text-2xl font-bold text-foreground mb-2">
                {t('demo.live_allocation_title')}
              </h3>
              <p className="text-muted-foreground">
                {t('demo.live_allocation_description')}
              </p>
            </div>
            <DecisionFlowVisualization 
              isActive={true}
              className="max-w-6xl mx-auto"
            />
          </div>

          <div className="mt-8 text-center">
            <p className="text-lg font-medium text-foreground bg-accent/10 px-6 py-3 rounded-lg inline-block">
              {t('demo.timing', { 
                lastRun: timing.lastRun, 
                nextRun: timing.nextRun
              })}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}