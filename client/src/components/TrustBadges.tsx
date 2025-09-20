import { Shield, Clock, FileCheck, DollarSign, CheckCircle } from 'lucide-react';
import { RevealItem } from '@/components/animations/SectionReveal';
import { useTranslation } from 'react-i18next';

export default function TrustBadges() {
  const { t } = useTranslation();
  
  const badges = [
    {
      icon: Shield,
      label: t('trust_badges.reliability.title'),
      description: t('trust_badges.reliability.description'),
      key: 'reliability'
    },
    {
      icon: CheckCircle,
      label: t('trust_badges.safety.title'),
      description: t('trust_badges.safety.description'),
      key: 'safety'
    },
    {
      icon: FileCheck,
      label: t('trust_badges.auditability.title'),
      description: t('trust_badges.auditability.description'),
      key: 'auditability'
    },
    {
      icon: DollarSign,
      label: t('trust_badges.cost_efficiency.title'),
      description: t('trust_badges.cost_efficiency.description'),
      key: 'cost-efficiency'
    },
    {
      icon: Clock,
      label: t('trust_badges.on_time_ops.title'),
      description: t('trust_badges.on_time_ops.description'),
      key: 'on-time-ops'
    }
  ];

  return (
    <section className="py-12 bg-muted/30">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-6 md:gap-8">
          {badges.map((badge, index) => {
            const Icon = badge.icon;
            return (
              <RevealItem key={index}>
                <div
                  className="text-center group"
                  data-testid={`badge-${badge.key}`}
                >
                  <div className="mx-auto w-12 h-12 mb-3 flex items-center justify-center rounded-full bg-accent/10 group-hover:bg-accent/20 transition-colors">
                    <Icon className="w-6 h-6 text-accent" />
                  </div>
                  <h3 className="text-sm font-semibold text-foreground mb-1">
                    {badge.label}
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    {badge.description}
                  </p>
                </div>
              </RevealItem>
            );
          })}
        </div>
      </div>
    </section>
  );
}