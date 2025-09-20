import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Database, 
  Shield, 
  Brain, 
  Target, 
  Monitor, 
  MessageSquare, 
  RefreshCw 
} from 'lucide-react';
import { RevealItem } from '@/components/animations/SectionReveal';
import { motion } from 'framer-motion';
import { MotionTokens } from '@/lib/motion';
import { useTranslation } from 'react-i18next';


export default function Features() {
  const { t } = useTranslation();
  
  const features = [
    {
      icon: Database,
      title: t('features.data_integration.title'),
      description: t('features.data_integration.description'),
      capabilities: t('features.data_integration.capabilities', { returnObjects: true }) as string[]
    },
    {
      icon: Brain,
      title: t('features.decision_engine.title'),
      description: t('features.decision_engine.description'),
      capabilities: t('features.decision_engine.capabilities', { returnObjects: true }) as string[]
    },
    {
      icon: Target,
      title: t('features.automated_scheduling.title'),
      description: t('features.automated_scheduling.description'),
      capabilities: t('features.automated_scheduling.capabilities', { returnObjects: true }) as string[]
    },
    {
      icon: MessageSquare,
      title: t('features.decision_explanations.title'),
      description: t('features.decision_explanations.description'),
      capabilities: t('features.decision_explanations.capabilities', { returnObjects: true }) as string[]
    }
  ];
  return (
    <section id="features" className="py-16 md:py-24 bg-muted/20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            {t('features.title')}
          </h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            {t('features.subtitle')}
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <RevealItem key={index}>
                <motion.div
                  initial="rest"
                  whileHover="hover"
                  animate="rest"
                  variants={{
                    rest: {
                      scale: 1,
                      y: 0,
                      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
                      transition: {
                        duration: MotionTokens.duration.fast,
                        ease: MotionTokens.easing.easeOut,
                      }
                    },
                    hover: {
                      scale: MotionTokens.scale.gentle,
                      y: -8,
                      boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
                      transition: {
                        duration: MotionTokens.duration.normal,
                        ease: MotionTokens.easing.bounce,
                      }
                    }
                  }}
                  className="h-full"
                >
                  <Card
                    className="h-full border-none shadow-none bg-card"
                    data-testid={`feature-card-${index}`}
                  >
                    <CardHeader>
                      <motion.div 
                        className="w-12 h-12 mb-4 flex items-center justify-center rounded-lg bg-accent/10"
                        variants={{
                          rest: { scale: 1, rotate: 0 },
                          hover: { 
                            scale: MotionTokens.scale.noticeable, 
                            rotate: 5,
                            transition: {
                              duration: MotionTokens.duration.normal,
                              ease: MotionTokens.easing.spring,
                              delay: 0.1,
                            }
                          }
                        }}
                      >
                        <Icon className="w-6 h-6 text-accent" />
                      </motion.div>
                      <CardTitle className="text-lg font-semibold">
                        {feature.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <motion.p 
                        className="text-muted-foreground mb-4"
                        variants={{
                          rest: { opacity: 0.7 },
                          hover: { 
                            opacity: 1,
                            transition: {
                              duration: MotionTokens.duration.normal,
                              ease: MotionTokens.easing.easeOut,
                            }
                          }
                        }}
                      >
                        {feature.description}
                      </motion.p>
                      <motion.ul 
                        className="space-y-1"
                        variants={{
                          rest: {},
                          hover: {
                            transition: {
                              staggerChildren: MotionTokens.stagger.tight,
                              delayChildren: 0.1,
                            }
                          }
                        }}
                      >
                        {feature.capabilities.map((capability, capIndex) => (
                          <motion.li 
                            key={capIndex} 
                            className="text-sm text-muted-foreground flex items-center"
                            variants={{
                              rest: { x: 0, opacity: 0.7 },
                              hover: { 
                                x: 4, 
                                opacity: 1,
                                transition: {
                                  duration: MotionTokens.duration.fast,
                                  ease: MotionTokens.easing.easeOut,
                                }
                              }
                            }}
                          >
                            <motion.div 
                              className="w-1.5 h-1.5 bg-accent rounded-full mr-2"
                              variants={{
                                rest: { scale: 1 },
                                hover: { 
                                  scale: MotionTokens.scale.gentle,
                                  transition: {
                                    duration: MotionTokens.duration.fast,
                                    ease: MotionTokens.easing.bounce,
                                  }
                                }
                              }}
                            ></motion.div>
                            {capability}
                          </motion.li>
                        ))}
                      </motion.ul>
                    </CardContent>
                  </Card>
                </motion.div>
              </RevealItem>
            );
          })}
        </div>
      </div>
    </section>
  );
}