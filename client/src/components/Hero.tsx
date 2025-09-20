import { Button } from '@/components/ui/button';
import MetroRouteAnimation from './animations/MetroRouteAnimation';
import RailwayMap from './RailwayMap';
import AnimatedText from './animations/AnimatedText';
import { useTranslation } from 'react-i18next';
import { Link } from 'wouter';
import { Zap, PlayCircle } from 'lucide-react';

export default function Hero() {
  const { t } = useTranslation();
  const scrollToSection = (href: string) => {
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="home" className="relative bg-gradient-to-br from-background via-background to-accent/5 py-16 md:py-24 overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 2px 2px, currentColor 1px, transparent 0)`,
          backgroundSize: '32px 32px',
        }}></div>
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative">
        
        {/* Centered Metro Yukthi Title */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center rounded-full bg-accent/10 px-4 py-2 text-sm font-medium text-accent mb-6">
            <span className="relative flex h-3 w-3 mr-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-accent"></span>
            </span>
            {t('hero.tagline')}
          </div>
          
          <AnimatedText animation="fadeInUp" delay={200}>
            <div className="mb-6">
              <div className="text-lg md:text-xl lg:text-2xl text-muted-foreground font-medium mb-2">
                {t('hero.title')}
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground leading-tight">
                {t('hero.subtitle')}
              </h1>
            </div>
          </AnimatedText>
          
          <AnimatedText animation="fadeInUp" delay={400}>
            <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-4xl mx-auto leading-relaxed">
              {t('hero.description')}
            </p>
          </AnimatedText>

          <div className="flex justify-center gap-4 mb-8">
            <Link href="/dashboard" data-testid="link-get-started">
              <Button
                size="lg"
                className="text-base px-8 py-3 hover-elevate cursor-target bg-gradient-to-r from-primary to-accent hover:from-primary/80 hover:to-accent/80 shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <Zap className="w-5 h-5 mr-2" />
                {t('hero.get_started')}
              </Button>
            </Link>
            <Button
              size="lg"
              variant="outline"
              className="text-base px-8 py-3 hover-elevate cursor-target"
              onClick={() => scrollToSection('#demo')}
              data-testid="button-demo"
            >
              <PlayCircle className="w-5 h-5 mr-2" />
              {t('hero.demo_button')}
            </Button>
          </div>
        </div>

        {/* Enlarged Metro System Map */}
        <div className="mb-16">
          <div className="text-center mb-8">
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
              {t('hero.network_title')}
            </h2>
            <p className="text-lg text-muted-foreground">
              {t('hero.network_description')}
            </p>
          </div>
          
          <div className="relative">
            <div className="absolute -inset-4 bg-gradient-to-r from-primary/20 to-accent/20 rounded-lg blur-xl opacity-30"></div>
            <div className="relative">
              <MetroRouteAnimation />
            </div>
          </div>
        </div>

        {/* Key Stats */}
        <div className="grid grid-cols-4 gap-6 text-center max-w-4xl mx-auto">
          <div>
            <div className="text-3xl md:text-4xl font-bold text-primary">16</div>
            <div className="text-sm text-muted-foreground">Stations</div>
          </div>
          <div>
            <div className="text-3xl md:text-4xl font-bold text-primary">25</div>
            <div className="text-sm text-muted-foreground">{t('hero.trainsets')}</div>
          </div>
          <div>
            <div className="text-3xl md:text-4xl font-bold text-primary">24/7</div>
            <div className="text-sm text-muted-foreground">{t('hero.monitoring')}</div>
          </div>
          <div>
            <div className="text-3xl md:text-4xl font-bold text-primary">100%</div>
            <div className="text-sm text-muted-foreground">{t('hero.automated')}</div>
          </div>
        </div>
      </div>
    </section>
  );
}